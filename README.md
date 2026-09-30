# 🌾 Yashwant Farmhouse — Website & Admin Management System

A modern, high-performance website and secure Admin Portal built for **Yashwant Farm**, Nandwal, Kolhapur.

Designed with a nature-inspired luxury aesthetic, real farmhouse photography, dynamic backend management for prices, calendar availability, gallery photos, and business settings.

---

## 📋 Table of Contents
1. [Key Features](#-key-features)
2. [Technology Stack](#-technology-stack)
3. [Architecture Overview](#-architecture-overview)
4. [Installation & Setup](#-installation--setup)
5. [Environment Variables](#-environment-variables)
6. [Database Setup (MongoDB)](#-database-setup)
7. [Admin Setup & Default Credentials](#-admin-setup--default-credentials)
8. [Local Development](#-local-development)
9. [How to Access the Admin Portal](#-how-to-access-the-admin-portal)
10. [Production Deployment](#-production-deployment)
    - [Deploy Frontend to Netlify](#deploy-frontend-to-netlify)
    - [Deploy Backend to Render / Railway / Fly](#deploy-backend)

---

## 🌟 Key Features

### Public Website
- **Hero Showcase**: Actual high-resolution photography (`farmhouse-exterior-2.jpg`), location badge (`📍 Nandwal, Kolhapur`), instant availability checker & WhatsApp link.
- **Quick Highlights**: Red-brick cottage villa, private swimming pool, family-friendly gathering areas, peaceful countryside environment.
- **Authentic About Story**: Accurate descriptive narrative preserving original business identity and host information (Pandurang Yashwant Patil).
- **Verified Amenities**: Private pool, comfortable accommodation, self-cooking kitchen facility, spacious parking, open lawns.
- **Dynamic Photo Gallery**: Featured hero layout (`large featured + 2 stacked right` as specified), full gallery expansion, and responsive lightbox viewer.
- **Dynamic Pricing**: Weekday, weekend, day outing, and extra guest rates rendered directly from MongoDB database.
- **Live Interactive Calendar**: Status dates (🟢 Available, 🔴 Booked, 🟡 Unavailable) with month navigation and 1-click enquiry selection.
- **Enquiry System**: Name, Phone, Email, Preferred Date, Guest Count, Message — with simultaneous backend database storage and 1-click prefilled WhatsApp enquiry.
- **Google Maps Integration**: Actual GPS embed from live property and 1-click Google Maps driving directions link.
- **Floating WhatsApp Button**: High-conversion floating action trigger prefilled with greeting.

### Secure Admin Management Portal (`/admin/login`)
- **Luxury Admin UI**: Dark green sidebar (`#132E20`) + light cream workspace (`#F9F8F3`) with white cards and gold accents.
- **Secure Authentication**: Server-side JWT with bcrypt password hashing; protected API middleware.
- **Executive Dashboard**: 4 key metric cards (Farmhouse Status, Current Price Range, Upcoming Booked Dates, Gallery Photos) + Farmhouse Hero Welcome Card + Quick Actions.
- **Calendar Availability Management**:
  - Click any date to mark as Available, Booked, or Unavailable.
  - Batch date range updater (e.g. mark entire weekend as booked in seconds).
  - Upcoming reservations list with 1-click reset.
- **Tariff & Price Management**:
  - Live CRUD for Weekday, Weekend, Day Pass, and custom seasonal categories.
  - 1-click Active/Inactive toggle.
  - Changes instantly update the public website.
- **Gallery Manager**:
  - Modern drag-and-drop file upload zone (JPEG, PNG, WEBP, AVIF up to 10MB).
  - Thumbnail previews, filenames, featured star toggle, delete with file cleanup.
- **Settings Manager**:
  - Update farmhouse name, Marathi branding, host name, phone numbers, WhatsApp, and Google Maps embed links.
- **Customer Enquiry Management**:
  - View incoming booking enquiries, update status (New, Contacted, Confirmed, Cancelled), direct phone dial & WhatsApp link.

---

## 💻 Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19 / 18, Vite 6, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js (v18+ / v20+), Express.js |
| **Database** | MongoDB (Local / MongoDB Atlas) with Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **Media Handling** | Multer disk storage / Static asset pipeline |
| **Hosting** | Netlify (Frontend), Render / Railway / Fly (Backend) |

---

## 🏛 Architecture Overview

```
CUSTOMER
   ↓
Yashwant Farm Public Website (React + Vite)
   ↓ (REST API / JSON)
Node.js Express Backend
   ↓ (Mongoose ODM)
MongoDB Database (Atlas / Local)

ADMIN
   ↓
Admin Login (/admin/login)
   ↓ (JWT Auth Header)
Admin Dashboard (/admin/*)
   ↓ (Protected CRUD Endpoints)
MongoDB Database
   ↓
Public Website automatically reflects changes in real-time!
```

---

## 🚀 Installation & Setup

### 1. Clone or Open Project
```bash
cd yashwant-farm
```

### 2. Install Dependencies
```bash
npm install
```

---

## ⚙ Environment Variables

Create a `.env` file in the root directory (based on `.env.example`):

```env
# Server Port
PORT=5000
NODE_ENV=development

# MongoDB Connection String
MONGODB_URI=mongodb://127.0.0.1:27017/yashwant_farm

# Authorized Admin Account (Used for auto-seeding on first run)
ADMIN_EMAIL=admin@yashwantfarm.com
ADMIN_PASSWORD=Admin@Yashwant2026

# JWT Secret Key
JWT_SECRET=yashwant_farm_secret_super_key_2026_kolhapur_secure

# Frontend API URL (leave as http://localhost:5000 for local development)
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🗄 Database Setup

### Local MongoDB
If running locally, ensure MongoDB service is active:
```powershell
Get-Service -Name MongoDB
```
Or start via mongod command:
```bash
mongod --dbpath <your-data-directory>
```

### MongoDB Atlas (Production)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and allow your IP / 0.0.0.0/0 (for cloud hosting).
3. Copy the connection string:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/yashwant_farm?retryWrites=true&w=majority`
4. Set `MONGODB_URI` in `.env` or your cloud provider environment settings.

---

## 🔐 Admin Setup & Default Credentials

On first server start, the system automatically checks and seeds the single authorized admin account if none exists.

| Field | Default Value |
|---|---|
| **Login URL** | `http://localhost:5173/admin/login` (or `/admin/login` on production) |
| **Email** | `admin@yashwantfarm.com` |
| **Password** | `Admin@Yashwant2026` |

> 🔒 **Security Notice**: There is **no public registration**. In production, define `ADMIN_PASSWORD` in your production environment variables to override the default.

---

## 🛠 Local Development

You can run both frontend and backend concurrently with a single command:

```bash
# Starts Express server on :5000 and Vite dev server on :5173
npm run dev
```

Or run them individually:
```bash
# Terminal 1: Backend API
npm run dev:server

# Terminal 2: Frontend Client
npm run dev:client
```

Open:
- **Public Website**: `http://localhost:5173`
- **Admin Portal**: `http://localhost:5173/admin/login`
- **API Health**: `http://localhost:5000/api/health`

---

## 🌐 Production Deployment

### Deploy Frontend to Netlify

1. Link your GitHub repository to [Netlify](https://app.netlify.com/).
2. Netlify will detect `netlify.toml` automatically:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. In Netlify Site Settings > **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://your-backend-api.onrender.com`
4. In `netlify.toml`, update the `/api/*` redirect rule with your backend URL.
5. Deploy site!

### Deploy Backend to Render / Railway / Fly

1. Push repository to GitHub.
2. In [Render](https://render.com/) or [Railway](https://railway.app/):
   - Choose **Web Service**.
   - Build command: `npm install`
   - Start command: `node server/index.js`
3. Configure Environment Variables:
   - `MONGODB_URI`: (Your MongoDB Atlas connection URI)
   - `ADMIN_EMAIL`: (Your admin email)
   - `ADMIN_PASSWORD`: (Your secure production password)
   - `JWT_SECRET`: (64-character random string)
   - `NODE_ENV`: `production`
4. Start service. Your backend is live!

---

## 🛡 Security Highlights
- ✅ Passwords hashed with bcrypt (salt rounds = 10).
- ✅ Protected `/api/*` routes verified via JWT bearer tokens.
- ✅ Strict image upload filters (JPEG, PNG, WEBP, AVIF) with 10MB limit.
- ✅ No sensitive secrets in client-side bundles.
- ✅ Single authorized manager account model prevents unauthorized registrations.

---

© Yashwant Farmhouse, Nandwal, Kolhapur. All rights reserved.
