# 🧩 BudgetBuddy

## 📘 Project Description

BudgetBuddy is a personal expense tracking application designed to help students and young professionals manage their finances effectively. Users can log transactions, categorize expenses, set monthly budgets, and visualize their spending patterns through interactive charts. Built with React, Node.js/Express, and MongoDB, this app provides a simple yet powerful solution for staying on top of your money.

## 🚀 Features

### 🧠 Feature 1: _Transaction Management_

**Description:**
Users can add, edit, and delete transactions with details like amount, category (food, transport, entertainment, etc.), date, and optional notes. All transactions are stored in a MongoDB database and displayed in a sortable, filterable list. This core CRUD functionality forms the foundation of the app's data management.

**Code Link:**
[View Implementation\](./path/to/feature1/code)

### ⚙️ Feature 2: _Budget Tracking and Alerts_

**Description:**
Users can set monthly budget limits for different spending categories. The app calculates total spending per category and displays progress bars showing how much of the budget has been used. When users approach or exceed their budget (e.g., 90% threshold), visual alerts appear to encourage better spending habits.

**Code Link:**
[View Implementation\](./path/to/feature2/code)

### 🖥️ Feature 3: _Expense Visualization Dashboard_

**Description:**
An interactive dashboard presents spending data through charts and graphs (pie charts for category breakdown, line graphs for spending over time). Built using Chart.js or Recharts, this feature helps users quickly identify spending trends and make informed financial decisions at a glance.

**Code Link:**
[View Implementation\](./path/to/feature3/code)

## �️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Chart.js
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcryptjs for password hashing

## 📦 Project Structure

```
BudgetBuddy/
├── src/                          # Frontend React app
│   ├── components/              # Reusable React components
│   ├── pages/                   # Page components
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Utility functions and API client
│   └── styles/                  # CSS styling
├── Backend/                      # Node.js/Express API server
│   ├── models/                  # MongoDB schemas
│   ├── controllers/             # Business logic
│   ├── routes/                  # API endpoints
│   ├── middleware/              # Authentication & error handling
│   ├── server.js                # Main server file
│   └── .env                     # Environment variables
├── public/                       # Static assets and data
└── package.json                 # Frontend dependencies
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account

### Setup Instructions

#### 1. Frontend Setup

```bash
npm install
npm run dev
```

#### 2. Backend Setup

```bash
cd Backend
npm install
npm run dev
```

See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed MongoDB Atlas configuration.

## 📚 Documentation

- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Complete backend and MongoDB Atlas setup guide
- **[ADMIN_INTERFACE.md](./ADMIN_INTERFACE.md)** - Admin dashboard and user management
- **[API_REFERENCE.md](./API_REFERENCE.md)** - Complete API endpoint reference

## 🔐 Key Features

### User Management

- User registration and authentication
- Secure password hashing with bcryptjs
- JWT token-based authentication
- User profile management
- Admin role management

### Financial Management

- **Transaction Tracking:** Record income and expenses with categories
- **Budget Planning:** Set monthly budgets by category
- **Savings Goals:** Create and track savings milestones
- **Expense Visualization:** Interactive charts and dashboards

### Admin Features

- View all users with detailed profiles
- Manage user roles and permissions
- Monitor all transactions and budgets
- Delete or modify user data

## 📝 API Authentication

All protected endpoints require JWT authentication:

```
Authorization: Bearer <token>
```

## 💾 Database Models

- **User:** User profiles and authentication
- **Budget:** Monthly budget allocations by category
- **Transaction:** Income and expense records
- **SavingsGoal:** Long-term savings targets
- **Settings:** User preferences and payment methods

## 🔄 Workflow

1. User registers/logs in → Receives JWT token
2. Frontend stores token in localStorage
3. All API requests include token in Authorization header
4. Backend validates token and authorizes requests
5. Admin users can access admin endpoints

## 📄 Additional Information

- **Technology:** React, Node.js, Express, MongoDB, JWT
- **Styling:** CSS with responsive design
- **Visualization:** Chart.js for data representation
- **Development Tools:** Vite, Nodemon, TypeScript
