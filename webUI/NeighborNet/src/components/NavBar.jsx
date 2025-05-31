import React, {useState, useEffect, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logoutUser } from '../features/user/thunks/logoutThunk';
import AccountPage from '../pages/AccountPage';
import HelpRequestInputForm from './reports/helpRequestInputForm';
import OfferHelpInputForm from './reports/offerHelpInputForm';
import IssueReportInputForm from './reports/issueReportInputForm';
import GiveAwayInputForm from './reports/giveAwayInputForm';

function NavBar() {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const currentUser = useSelector(state => state.user.currentUser) || null
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accountDropdownRef = useRef(null);
  const createDropdownRef = useRef(null);
  const formDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setShowAccount(false);
      }
      if (createDropdownRef.current && !createDropdownRef.current.contains(event.target)) {
        setShowCreateDropdown(false);
      }
      if (formDropdownRef.current && !formDropdownRef.current.contains(event.target)) {
        setActiveForm(null);
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

  const handleFormSelect = (formType) => {
    setActiveForm(formType);
    setShowCreateDropdown(false);
  };

  const renderForm = () => {
    switch(activeForm) {
      case 'helpRequest':
        return <HelpRequestInputForm />;
      case 'offerHelp':
        return <OfferHelpInputForm />;
      case 'issueReport':
        return <IssueReportInputForm />;
      case 'giveAway':
        return <GiveAwayInputForm />;
      default:
        return null;
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
            {/* Create Post Dropdown */}
            <div className="flex-none relative" ref={createDropdownRef}>
              <button 
                onClick={() => setShowCreateDropdown(!showCreateDropdown)} 
                className="btn btn-secondary"
              >
                Create Report
              </button>
              
              {showCreateDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button 
                      onClick={() => handleFormSelect('helpRequest')}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Request Help
                    </button>
                    <button 
                      onClick={() => handleFormSelect('offerHelp')}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Offer Help
                    </button>
                    <button 
                      onClick={() => handleFormSelect('issueReport')}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Report Issue
                    </button>
                    <button 
                      onClick={() => handleFormSelect('giveAway')}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Give Away
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Account Dropdown */}
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

            {/* Logout Button */}
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

      {/* Form Modal */}
      {activeForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative" ref={formDropdownRef}>
            <button 
              onClick={() => setActiveForm(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
            >
              ×
            </button>
            {renderForm()}
          </div>
        </div>
      )}

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