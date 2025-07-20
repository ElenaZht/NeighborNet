import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { Link, useNavigate } from 'react-router-dom'
import { logoutUser } from '../features/user/thunks/logoutThunk';
import AccountPage from '../pages/AccountPage';
import HelpRequestInputForm from './reports/input-forms/helpRequestInputForm';
import OfferHelpInputForm from './reports/input-forms/offerHelpInputForm';
import IssueReportInputForm from './reports/input-forms/issueReportInputForm';
import GiveAwayInputForm from './reports/input-forms/giveAwayInputForm';
import { getNeighborhoodById } from '../features/neighborhoods/getNeighborhoodThunk';
import { useClickAway } from '../utils/useClickAway';

type FormType = 'helpRequest' | 'offerHelp' | 'issueReport' | 'giveAway' | null;


function NavBar() {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const currentUser = useAppSelector(state => state.user.currentUser) || null
  const neighborhood = useAppSelector(state => state.user.neighborhood) || null;
  const neighborhoodLoading = useAppSelector(state => state.user.neighborhoodLoading) || false;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const accountDropdownRef = useClickAway(() => {
    setShowAccount(false);
  });
  
  const createDropdownRef = useClickAway(() => {
    setShowCreateDropdown(false);
  });
  
  const formDropdownRef = useClickAway(() => {
    setActiveForm(null);
  });

  // Fetch neighborhood info if user has neighborhood id
  useEffect(() => {
    const fetchNeighborhood = async () => {
      if (currentUser && currentUser.neighborhood_id) {
        try {
          await dispatch(getNeighborhoodById(currentUser.neighborhood_id)).unwrap();
        } catch (error) {
          console.error('Failed to fetch neighborhood:', error);
        }
      }
    }
    fetchNeighborhood();
  }, [currentUser]);

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

  const handleFormSelect = (formType: FormType) => {
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
        <Link to='/' className="btn btn-ghost normal-case text-xl flex items-center gap-2">
          {/* Icon with gradient */}
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <svg 
              className="w-5 h-5 text-white" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
          </div>
          {/* Text with gradient */}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
            NeighborNet
          </span>
        </Link>

        {neighborhood && !neighborhoodLoading && 
          <div className="flex items-center gap-2 ml-4">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h1 className="text-lg font-semibold">{neighborhood.name}</h1>
          </div>
        }
      </div>
       
      <div className="navbar-center">
        {/* Empty center section */}
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