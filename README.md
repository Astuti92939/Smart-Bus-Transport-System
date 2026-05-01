# Smart Bus Transport System

A modern, full-stack web application for managing and tracking smart bus transport systems. This project provides real-time bus tracking, route management, and passenger information services.

## 🚀 Features

- **Real-time Bus Tracking**: Live GPS tracking of buses on interactive maps
- **Route Management**: View and manage bus routes efficiently
- **Passenger Information**: Display schedule, routes, and transit information
- **Analytics Dashboard**: Monitor bus fleet performance and statistics
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 📁 Project Structure

```
Smart-Bus-Transport-System/
├── src/                      # React frontend source code
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Application entry point
├── server/                  # Backend server (Node.js/Express)
│   ├── index.js           # Server entry point
│   ├── routes/            # API routes
│   ├── models/            # MongoDB data models
│   ├── middleware/        # Express middleware
│   └── controllers/       # Route controllers
├── public/                  # Static assets
├── package.json            # Frontend dependencies
├── vite.config.js         # Vite configuration
├── eslint.config.js       # ESLint configuration
└── index.html             # HTML entry point
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Leaflet & React-Leaflet** - Interactive maps for bus tracking
- **Chart.js & React-Chart.js 2** - Data visualization
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code quality
- **Concurrently** - Run multiple processes
- **Nodemon** - Auto-restart development server

## 📊 Language Composition

- JavaScript: 97.9%
- CSS: 1.9%
- HTML: 0.2%

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Astuti92939/Smart-Bus-Transport-System.git
cd Smart-Bus-Transport-System
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd server
npm install
cd ..
```

4. Create environment configuration
Create a `.env` file in the `server` directory with necessary configuration:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Running the Application

#### Development Mode
Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run them separately:
```bash
# Terminal 1 - Frontend (Vite)
npm run vite

# Terminal 2 - Backend (Express)
npm run server
```

#### Build for Production
```bash
npm run build
```

#### Preview Production Build
```bash
npm run preview
```

#### Linting
```bash
npm run lint
```

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run frontend and backend concurrently |
| `npm run vite` | Start Vite development server |
| `npm run server` | Start Express backend server |
| `npm run build` | Build React app for production |
| `npm run lint` | Run ESLint checks |
| `npm run preview` | Preview production build |

## 🔧 API Endpoints

Backend API endpoints are organized under the `server/routes` directory. Common endpoints include:
- Authentication
- Bus management
- Route management
- Passenger information
- Real-time tracking data

## 🗺️ Features in Detail

### Map Integration
- Interactive Leaflet maps display bus locations
- Real-time position updates
- Route visualization
- Stop markers and information popups

### Analytics
- Bus fleet statistics
- Route performance metrics
- Passenger volume tracking
- Historical data analysis with Chart.js

### Authentication
- JWT-based user authentication
- Secure password storage with bcryptjs
- Role-based access control

## 📦 Dependencies

See `package.json` and `server/package.json` for complete dependency lists.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the ISC License.

## 👨‍💻 Author

Created by [Astuti92939](https://github.com/Astuti92939)

## 📞 Support

For support, please open an issue in the repository.

---

**Last Updated**: 2026-05-01 08:55:23