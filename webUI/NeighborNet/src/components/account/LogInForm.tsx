import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../features/user/thunks/LogInThunk';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

interface ValidationErrors {
  email?: string;
  password?: string;
}

function LogInForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, loginError } = useAppSelector(state => state.user); 

  const clearError = () => {
    dispatch({ type: 'users/clearLoginError' });
  };

  const handleFormSwitch = () => {
    clearError();
    setValidationErrors({}); // Clear validation errors when switching forms
    setIsSubmitted(false); // Reset submission state
    setFormData({ email: '', password: '' }); // Reset form data to ensure no lingering input
  };

  useEffect(() => {
    return () => {
      clearError();
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear validation error for the specific field
    setValidationErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name as keyof ValidationErrors];
        return updatedErrors;
    });

    // Clear global error when user starts typing
    if (loginError !== null) {
      clearError();
    }

    // Clear submission state when user starts typing
    if (isSubmitted) {
      setIsSubmitted(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    clearError();
    
    if (validateForm()) {
      try {
        const result = await dispatch(loginUser({
          email: formData.email,
          password: formData.password
        }));
        
        // Check if the action was rejected
        if (loginUser.rejected.match(result)) {
          // The error payload contains the status and message
          const errorPayload = result.payload as { status?: number; message?: string };
          console.error('Login failed:', errorPayload?.status, errorPayload?.message || errorPayload);
        } else if (loginUser.fulfilled.match(result)) {
          navigate('/');
        }
      } catch (error) {
        console.error('Login failed:', error);
      }
    }
  };
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">Welcome Back</h2>
      <p className="text-gray-600 text-center mb-6">Sign in to your account</p>
      
      {isSubmitted && loginError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative">
          <p>{loginError}</p>
          <button
            onClick={clearError}
            className="absolute top-0 right-0 mt-2 mr-2 text-red-700 hover:text-red-900"
            aria-label="Close error message"
          >
            &times;
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              validationErrors.email ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="your@email.com"
            disabled={loading}
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              validationErrors.password ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="••••••••"
            disabled={loading}
          />
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 flex justify-center items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" onClick={handleFormSwitch} className="text-blue-600 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LogInForm;