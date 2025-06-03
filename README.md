# NeighborNet

A community-driven platform that connects neighbors to share resources, report issues, request help, and strengthen local communities.

## 🌟 Live Demo

**[Visit NeighborNet](https://neighbornet.onrender.com/)**

## 📖 About

NeighborNet is a neighborhood social platform that enables residents to:
- 🆘 **Help Requests** - Ask neighbors for assistance
- 🤝 **Offer Help** - Provide support to community members  
- 🎁 **Giveaways** - Share items you no longer need
- ⚠️ **Issue Reports** - Report neighborhood problems
- 💬 **Comments** - Engage in community discussions
- 🔔 **Follow Reports** - Stay updated on issues that matter to you

## 🛠️ Tech Stack

### Frontend
- **React** with Redux Toolkit for state management
- **Tailwind CSS** + **DaisyUI** for styling
- **React Router** for navigation
- **FontAwesome** icons

### Backend
- **Node.js** with **Express.js**
- **PostgreSQL** database
- **JWT** authentication
- **RESTful API** architecture

## 🚀 Features

- **User Authentication** - Secure signup/login system
- **Neighborhood-based Filtering** - View content by neighborhood, city, or country
- **Real-time Feed** - Dynamic community updates
- **Interactive Maps** - Location-based reporting with Google Maps integration
- **Status Management** - Track report progress (Active, In Progress, Resolved)
- **Follow System** - Subscribe to reports for updates
- **Responsive Design** - Works on desktop and mobile


## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ElenaZht/NeighborNet
   cd NeighborNet
   ```

2. **Frontend Setup**
   ```bash
   cd webUI/NeighborNet
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd server
   npm install
   npm run dev
   ```

4. **Environment Variables**
   Create `.env` files in both frontend and backend directories:
   
   **Frontend (.env)**
   ```
   VITE_DEV_BASE_URL=http://localhost:3001
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```
   
   **Backend (.env)**
   ```
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3001
   ```

## 🗂️ Project Structure

```
NeighborNet/
├── webUI/NeighborNet/          # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── features/          # Redux slices and thunks
│   │   ├── pages/             # Page components
│   │   └── utils/             # Utility functions
│   └── public/
├── server/                     # Express backend
│   ├── src/
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Custom middleware
│   │   └── database/          # Database configuration
└── README.md
```

## 🔧 API Endpoints

- `GET /reports` - Fetch community reports
- `POST /users/signup` - User registration
- `POST /users/login` - User authentication
- `POST /help-requests` - Create help request
- `POST /give-aways` - Create giveaway
- `POST /issue-reports` - Report neighborhood issues
- `POST /comments` - Add comments to reports
- `POST /followers` - Follow/unfollow reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] Real-time notifications
- [ ] Mobile app development
- [ ] Advanced filtering options
- [ ] User reputation system
- [ ] Event organization features
- [ ] Integration with local services


## 👥 Authors

- **Elena Zhytomirski** - *Initial work* - [YourGitHub](https://github.com/ElenaZht)

## 🙏 Acknowledgments

- Thanks to the open-source community
- Inspired by neighborhood community apps
- Built with modern web technologies

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact: elenazht@gmail.com
- Visit: [NeighborNet Live](https://neighbornet.onrender.com/)