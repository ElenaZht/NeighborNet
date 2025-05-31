import React, {useState, useEffect, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logoutUser } from '../features/user/thunks/logoutThunk';
import AccountPage from '../pages/AccountPage';

function NavBar() {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const currentUser = useSelector(state => state.user.currentUser) || null
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accountDropdownRef = useRef(null);

  // Close account dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setShowAccount(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirmation(false);
    }
  };

  return (
    <div className="navbar bg-base-100 px-4 shadow-md">
      <div className="navbar-start">
        {/* Empty start section for spacing */}
      </div>
      
      <div className="navbar-center">
        <Link to='/' className="btn btn-ghost normal-case text-xl">NeighborNet</Link>
      </div>

      <div className="navbar-end">
        {!currentUser ? (
          <div className="flex-none relative">
            <button 
              onClick={() => setShowAuthDropdown(!showAuthDropdown)} 
              className="btn btn-primary"
            >
              Authenticate
            </button>
            
            {showAuthDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  <Link 
                    to="/signup" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowAuthDropdown(false)}
                  >
                    Sign Up
                  </Link>
                  <Link 
                    to="/login" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowAuthDropdown(false)}
                  >
                    Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex-none relative" ref={accountDropdownRef}>
              <button 
                onClick={() => setShowAccount(!showAccount)} 
                className="btn btn-outline btn-primary"
              >
                Account
              </button>
              
              {showAccount && (
                <div className="absolute right-0 top-full mt-2 w-96 max-w-screen-sm bg-white rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                  <AccountPage />
                </div>
              )}
            </div>
            <div className="flex-none">
              <button 
                onClick={() => setShowLogoutConfirmation(true)} 
                className="text-red-600 hover:text-red-700 hover:underline font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {showLogoutConfirmation && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Log Out?</h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to log out of your account?
            </p>
            
            <div className="flex flex-row gap-3 sm:flex-row sm:justify-between">
              <button 
                onClick={() => setShowLogoutConfirmation(false)}
                className="btn btn-outline flex-1 order-2 sm:order-1"
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmLogout}
                className={`btn bg-primary text-white hover:bg-primary-focus flex-1 order-1 sm:order-2 ${isLoggingOut ? 'loading' : ''}`}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Logging Out...' : 'Yes, Log Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default NavBar