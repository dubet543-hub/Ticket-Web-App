# Ticket Generator - Setup Guide

## 📋 Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

## 🚀 Getting Started

### 1. Environment Setup

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ticket-generator
JWT_SECRET=your_jwt_secret_key_here
```

**Using MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ticket-generator
```

### 2. Install Dependencies

```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 3. Create Admin User

Run the admin creation script to set up default credentials:

```bash
cd server
npm run create-admin
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`
- Role: `Admin`
- Email: `admin@ticketgenerator.com`

⚠️ **Important**: Change the password after first login!

### 4. Start the Application

**Terminal 1 - Start Server:**
```bash
cd server
npm run dev
```

The server will run on `http://localhost:5000`

**Terminal 2 - Start Client:**
```bash
cd client
npm run dev
```

The client will run on `http://localhost:5173`

## 📝 Available Scripts

### Server
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run create-admin` - Create admin user in database

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔑 Default User Roles

1. **Admin** - Full system access, user management, master data configuration
2. **DataEntry** - Can add/edit attendees, create categories and facilities
3. **Scanner** - Check-in operations, can only scan QR codes

## 🗄️ Database Models

- **User** - System users and admin accounts
- **Category** - Ticket categories with pricing
- **Facility** - Event venues/facilities
- **Attendee** - Event attendees with ticket information

## 🐛 Troubleshooting

### Admin user script fails
- Ensure MongoDB is running
- Check `.env` file has correct `MONGO_URI`
- Verify database is accessible

### Build errors in client
- Clear `node_modules` and reinstall: `npm install`
- Clear Vite cache: `rm -rf .vite`

### Port already in use
- Change PORT in `.env` file
- Or kill process: `lsof -ti:5000 | xargs kill`

## 📞 Support
For issues or questions, refer to the application documentation or contact support.
