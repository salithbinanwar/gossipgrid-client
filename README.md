# 💬 Gossip Grid

A modern, real-time chat application that enables seamless communication through dynamic chat rooms.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- 🚀 Real-time messaging powered by Socket.IO
- 🎨 Modern UI with responsive design
- 🔐 Private chat rooms with unique IDs
- 👤 Customizable usernames
- 🌙 Elegant gradient interface
- 📱 Mobile-friendly design

## 🛠️ Tech Stack

- **Frontend:**

  - React
  - Tailwind CSS
  - Socket.IO Client
  - Vite

- **Backend:**
  - Node.js
  - Socket.IO
  - Express

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/gossipgrid.git
cd gossipgrid
# Install client dependencies
cd client
npm install
# Install server dependencies
cd ../server
npm install
# Start the backend server
cd server
npm start

# In a new terminal, start the frontend
cd client
npm run dev
```

## 🌐 Deployment

The frontend is configured for Netlify deployment with automatic redirects (see netlify.toml).

Frontend Deployment

- Build the client: npm run build
- The dist directory will contain the built files
- Deploy to Netlify or your preferred hosting service

Backend Deployment

- Configure your environment variables
- Deploy to your preferred hosting service (Heroku, DigitalOcean, etc.)

## 🔧 Configuration

- Frontend Socket.IO connection: Update the socket connection URL in App.jsx
- Backend port: Configure through environment variables

## 🤝 Contributing

- Fork the repository
- Create your feature branch (git checkout -b feature/AmazingFeature)
- Commit your changes (git commit -m 'Add some AmazingFeature')
- Push to the branch (git push origin feature/AmazingFeature)
- Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌟 Acknowledgments

- Built with modern web technologies
- Inspired by the need for simple, efficient real-time communication
- Thanks to all contributors and the open-source community

## Made with ❤️ by Salith
