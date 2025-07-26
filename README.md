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
- **React** with **TypeScript** and Redux Toolkit for state management
- **Vite** for build tooling and development server
- **Tailwind CSS** + **DaisyUI** for styling
- **React Router** for navigation
- **Redux** for state management
- **FontAwesome** icons

### Backend
- **Node.js** with **Express.js** and **TypeScript**
- **TSX** for TypeScript execution
- **PostgreSQL** database with **Knex.js** query builder
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
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- TypeScript knowledge recommended

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

4. **Production Build**
   
   **Frontend**
   ```bash
   cd webUI/NeighborNet
   npm run build
   npm run preview  # Preview production build locally
   ```
   
   **Backend** (TypeScript runs directly with tsx)
   ```bash
   cd server
   npm run start:prod
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
   NODE_ENV=development
   ```

5. **Database Setup**
   ```bash
   # Initialize PostgreSQL database with the provided schema
   cd server
   psql -d your_database_name -f sql_init.sql
   ```

## 🗂️ Project Structure

```
NeighborNet/
├── webUI/NeighborNet/          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── features/          # Redux slices and thunks
│   │   ├── pages/             # Page components
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions
│   ├── public/                # Static assets
│   └── package.json
├── server/                     # Express + TypeScript backend
│   ├── src/
│   │   ├── routes/            # API routes
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # Database models
│   │   ├── middleware/        # Custom middleware
│   │   ├── types/             # TypeScript type definitions
│   │   └── config/            # Database and app configuration
│   ├── sql_init.sql           # Database schema
│   ├── tsconfig.json          # TypeScript configuration
│   └── package.json
├── shared TypeScript files    # Shared type definitions
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

## 💻 Development

### TypeScript Development
The project is fully written in TypeScript for better type safety and developer experience:

**Frontend:**
- Uses Vite for fast development and building
- Hot module replacement for rapid development
- Lint with: `npm run lint`

**Backend:**
- Uses `tsx` for direct TypeScript execution (no compilation step needed in development)
- Watch mode available: `npm run build:watch`
- Type checking is handled by the IDE and `tsx`

### Available Scripts

**Frontend (`webUI/NeighborNet`):**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**Backend (`server`):**
```bash
npm run dev           # Start development server with tsx
npm run start         # Start server
npm run start:prod    # Start in production mode
npm run build:watch   # Start with file watching
```

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
