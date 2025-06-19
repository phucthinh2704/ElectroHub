# ElectroHub Digital - Electronics Store Management System

A comprehensive management system for electronics retail stores, built with modern web technologies to streamline inventory, sales, and customer management.

## 🚀 Features

- **Inventory Management**: Track products, stock levels, and categories with Excel export
- **Sales Management**: Process orders, generate invoices with PDF export, and track revenue
- **Payment Integration**: PayPal payment processing for online transactions  
- **Customer Management**: Maintain customer database and purchase history
- **Dashboard Analytics**: Real-time insights with interactive charts and reporting
- **User Authentication**: Secure JWT-based login system with role-based access
- **Image Management**: Cloud-based image storage and optimization via Cloudinary
- **Email Notifications**: Automated email system for order confirmations and updates
- **Data Export**: Export reports to Excel and PDF formats
- **Responsive Design**: TailwindCSS-powered interface that works on all devices
- **Vietnamese Localization**: Support for Vietnamese provinces and regions

## 🛠️ Tech Stack

### Frontend (React.js)
- **React 19** - Latest version of UI library for building interactive interfaces
- **React Router DOM** - Client-side routing and navigation
- **Redux Toolkit** - Modern Redux for state management
- **Redux Persist** - Persist Redux state across sessions
- **Axios** - HTTP client for API requests
- **TailwindCSS** - Utility-first CSS framework for styling
- **Chart.js & React-ChartJS-2** - Interactive data visualization charts
- **Recharts** - Composable charting library built on React components
- **React Hook Form** - Performant forms with easy validation
- **PayPal React SDK** - Integrated PayPal payment processing
- **Lucide React** - Beautiful & consistent icon pack
- **React Icons** - Popular icon library collection
- **React Toastify** - Elegant toast notifications
- **SweetAlert2** - Beautiful, responsive popup boxes
- **React Slick** - Carousel/slider component
- **React Medium Image Zoom** - Image zoom functionality
- **Moment.js** - Date and time manipulation
- **ExcelJS & XLSX** - Excel file generation and processing
- **jsPDF & html2canvas-pro** - PDF generation from HTML
- **DOMPurify** - XSS sanitizer for HTML content
- **Vietnam Provinces** - Vietnamese administrative divisions data
- **Use React Router Breadcrumbs** - Automatic breadcrumb generation

### Backend (Node.js + Express.js)
- **Express.js 5** - Fast, unopinionated web framework
- **MongoDB & Mongoose** - NoSQL database with elegant object modeling
- **JWT (JsonWebToken)** - Secure token-based authentication
- **Bcrypt** - Password hashing and salting
- **Cloudinary** - Cloud-based image and video management
- **Multer & Multer-Storage-Cloudinary** - File upload handling with cloud storage
- **Nodemailer** - Email sending functionality
- **Cookie Parser** - Parse HTTP request cookies
- **CORS** - Cross-Origin Resource Sharing middleware
- **Express Async Handler** - Simple middleware for handling async express routes
- **Slugify** - Generate URL-friendly slugs
- **Uniqid** - Generate unique identifiers
- **Dotenv** - Environment variables management

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB**
- **Git**

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/phucthinh2704/ElectroHub.git
cd ElectroHub
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Environment Variables
Create a `.env` file in the backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/electrohub

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# PayPal Configuration
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
```

### Frontend Environment Variables
Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_TINYMCE_API_KEY=your-tinymce-api-key
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
```

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server:**
```bash
cd backend
npm run dev
```
Server will run on `http://localhost:5000`

2. **Start the Frontend Development Server:**
```bash
cd frontend
npm run dev
```
Application will run on `http://localhost:5173`

**ElectroHub Digital** - Streamlining electronics retail management with modern technology.