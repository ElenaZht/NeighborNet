import './App.css'
import {Routes, Route, Navigate} from 'react-router-dom'
import { ReactNode } from 'react'
import NavBar from './components/NavBar'
import SignUpForm from './components/account/SignUpForm'
import HomePage from './pages/HomePage'
import LogInForm from './components/account/LogInForm'
import { useAppSelector } from './store/hooks'

interface RouteWrapperProps {
  children: ReactNode;
}

// Protected Route Component
function ProtectedRoute({ children }: RouteWrapperProps) {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  
  return currentUser ? <>{children}</> : <Navigate to="/login" replace />;
}

// Public Route Component (redirects to home if already authenticated)
function PublicRoute({ children }: RouteWrapperProps) {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  
  return !currentUser ? <>{children}</> : <Navigate to="/" replace />;
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
