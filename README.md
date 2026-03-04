# Ryvon - GST Billing & POS Software

Complete registration and login system with personal dashboard for transaction history.

## 🚀 Features

✅ User Registration with email, phone, and business info
✅ Secure Login with JWT authentication
✅ Personal Dashboard with account information
✅ Transaction History tracking
✅ MongoDB database integration
✅ Password encryption with bcryptjs
✅ CORS enabled for frontend integration

## 📋 Prerequisites

Before running this project, make sure you have:

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
3. **Git** (optional)

## ⚙️ Setup Instructions

### Step 1: Install MongoDB

1. Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Install it on your computer
3. Start MongoDB service:
   - **Windows**: Open Command Prompt and run:
     ```bash
     mongod
     ```
   - **Mac/Linux**: Run:
     ```bash
     brew services start mongodb-community
     ```

### Step 2: Install Node.js Dependencies

Open Command Prompt/Terminal in your `e:\P1` folder and run:

```bash
npm install
```

This will install all required packages from `package.json`

### Step 3: Configure Environment Variables

The `.env` file is already created with default settings. You can modify it if needed:

```
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
MONGODB_URI=mongodb://localhost:27017/ryvon
NODE_ENV=development
```

### Step 4: Start the Backend Server

In the same terminal, run:

```bash
npm start
```

Or for development mode with auto-reload:

```bash
npm run dev
```

You should see:
```
MongoDB connected successfully
Server running on http://localhost:5000
```

### Step 5: Test the API

Open your browser and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{"message":"Server is running"}
```

### Step 6: Open the Frontend

Open `index.html` in your browser (double-click it or right-click → Open with → Browser)

## 📝 How to Use

### Registration Flow

1. Click **"Start Free Trial"** button on the website
2. Fill in the registration form:
   - Username
   - Email
   - Password
   - Phone Number
   - Business Name
3. Click **"Create Account"**
4. You'll get a success message and be prompted to login

### Login Flow

1. Click the **"Login"** link in the registration form or use the login button
2. Enter your username and password
3. Click **"Login"**
4. Your personal dashboard will open with:
   - Your account information
   - Transaction history
   - Logout option

## 🗄️ Database Schema

### Users Collection
```
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  phone: String,
  business: String,
  createdAt: Date
}
```

### Transactions Collection
```
{
  username: String,
  date: Date,
  amount: Number,
  type: String (invoice, payment, refund),
  status: String (completed, pending, failed),
  description: String
}
```

## 🔐 Security Features

- ✅ Password hashing using bcryptjs
- ✅ JWT token authentication
- ✅ CORS protection
- ✅ Token expiration (24 hours)
- ✅ Request validation

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Transactions
- `GET /api/history/:username` - Get transaction history (requires auth)
- `POST /api/transactions` - Add new transaction (requires auth)

### Health
- `GET /api/health` - Check server status

## 🐛 Troubleshooting

**Problem:** "MongoDB connection error"
- **Solution:** Make sure MongoDB is running. Run `mongod` in Command Prompt.

**Problem:** "Cannot connect to localhost:5000"
- **Solution:** Make sure the server is running. Check if port 5000 is not blocked.

**Problem:** "Connection error. Make sure backend server is running"
- **Solution:** Make sure both:
  1. MongoDB is running (`mongod` command)
  2. Node server is running (`npm start` command)

**Problem:** "CORS error"
- **Solution:** CORS is already enabled. Make sure you're accessing the site from the correct origin.

## 🚀 Deployment

To deploy this app:

1. **Deploy Backend**: Use services like Heroku, Railway, or AWS
2. **Deploy Frontend**: Use GitHub Pages or Netlify
3. **Update API_URL** in index.html to your deployed server URL

## 📧 Support

For issues or questions, check the console (F12 → Console tab) for error messages.

## 📄 License

MIT License - Feel free to use and modify this project.

---

**Happy Billing! 🎉**
