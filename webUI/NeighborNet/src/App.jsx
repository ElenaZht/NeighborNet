import './App.css'
import {Routes, Route, Navigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
import NavBar from './components/NavBar.jsx'
import SignUpForm from './components/account/SignUpForm.jsx'
import HomePage from './pages/HomePage.jsx'
import LogInForm from './components/account/LogInForm.jsx'

// Protected Route Component
function ProtectedRoute({ children }) {
  const currentUser = useSelector(state => state.user.currentUser);
  
  return currentUser ? children : <Navigate to="/login" replace />;
}

// Public Route Component (redirects to home if already authenticated)
function PublicRoute({ children }) {
  const currentUser = useSelector(state => state.user.currentUser);
  
  return !currentUser ? children : <Navigate to="/" replace />;
}

function App() {

  return (
    <>
      <NavBar/>
      <Routes>
        <Route 
          path='/' 
          element={
            <ProtectedRoute>
              <HomePage/>
            </ProtectedRoute>
          }
        />
        <Route 
          path='/signup' 
          element={
            <PublicRoute>
              <SignUpForm/>
            </PublicRoute>
          }
        />
        <Route 
          path='/login' 
          element={
            <PublicRoute>
              <LogInForm/>
            </PublicRoute>
          }
        />
        <Route path='*' element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default App
