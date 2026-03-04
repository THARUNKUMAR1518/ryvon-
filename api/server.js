const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ryvon';

let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }

    try {
        const connection = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        cachedDb = connection;
        console.log('MongoDB connected successfully');
        return connection;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
}

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    business: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    username: { type: String, required: true },
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['invoice', 'payment', 'refund'], required: true },
    status: { type: String, enum: ['completed', 'pending', 'failed'], required: true },
    description: { type: String }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Seed demo user
async function seedDemoUser() {
    try {
        await connectToDatabase();
        
        const existingAdmin = await User.findOne({ username: 'admin' });
        
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin', 10);
            const demoUser = new User({
                username: 'admin',
                email: 'admin@ryvoninfotech.com',
                password: hashedPassword,
                phone: '7639300330',
                business: 'Ryvon Demo Store'
            });
            
            await demoUser.save();
            console.log('✅ Demo user created: username=admin, password=admin');
            
            // Add sample transactions
            const sampleTransactions = [
                {
                    username: 'admin',
                    amount: 5000,
                    type: 'invoice',
                    status: 'completed',
                    description: 'Sample Invoice #001'
                },
                {
                    username: 'admin',
                    amount: 3500,
                    type: 'payment',
                    status: 'completed',
                    description: 'Payment Received'
                },
                {
                    username: 'admin',
                    amount: 1200,
                    type: 'refund',
                    status: 'completed',
                    description: 'Refund Processed'
                },
                {
                    username: 'admin',
                    amount: 2800,
                    type: 'invoice',
                    status: 'pending',
                    description: 'Pending Invoice #002'
                }
            ];
            
            await Transaction.insertMany(sampleTransactions);
            console.log('✅ Sample transactions added to demo account');
        } else {
            console.log('✅ Demo user already exists');
        }
    } catch (error) {
        console.error('Error seeding demo user:', error.message);
    }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

// Initialize demo user (for Vercel cold starts)
app.get('/api/seed', async (req, res) => {
    try {
        await seedDemoUser();
        res.json({ message: 'Database seeded successfully', demo: { username: 'admin', password: 'admin' } });
    } catch (error) {
        res.status(500).json({ message: 'Error seeding database', error: error.message });
    }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        await connectToDatabase();
        
        const { username, email, password, phone, business } = req.body;

        if (!username || !email || !password || !phone || !business) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }] 
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phone,
            business
        });

        await newUser.save();

        // Create welcome transaction
        const welcomeTransaction = new Transaction({
            username,
            amount: 0,
            type: 'invoice',
            status: 'completed',
            description: 'Welcome to Ryvon'
        });

        await welcomeTransaction.save();

        res.status(201).json({ 
            message: 'User registered successfully',
            user: {
                username,
                email,
                phone,
                business
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        await connectToDatabase();
        
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Find user
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                username: user.username,
                email: user.email,
                phone: user.phone,
                business: user.business
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get transaction history
app.get('/api/history/:username', authenticateToken, async (req, res) => {
    try {
        await connectToDatabase();
        
        const { username } = req.params;

        // Verify user is requesting their own history
        if (req.user.username !== username) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const history = await Transaction.find({ username }).sort({ date: -1 }).limit(20);

        res.json({
            history,
            count: history.length
        });
    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add transaction endpoint
app.post('/api/transactions', authenticateToken, async (req, res) => {
    try {
        await connectToDatabase();
        
        const { amount, type, status, description } = req.body;
        const { username } = req.user;

        const transaction = new Transaction({
            username,
            amount,
            type,
            status,
            description
        });

        await transaction.save();

        res.status(201).json({
            message: 'Transaction recorded',
            transaction
        });
    } catch (error) {
        console.error('Transaction error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Export for Vercel serverless
module.exports = app;

// Local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, async () => {
        console.log(`Server running on http://localhost:${PORT}`);
        await connectToDatabase();
        await seedDemoUser();
    });
}
