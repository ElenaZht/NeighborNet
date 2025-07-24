import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { signUpUser } from '../../features/user/thunks/signUpThunk';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import AddressInputForm, { AddressInputFormRef } from '../AddressInputForm';

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  location: { lat: number; lng: number };
  city: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
  city?: string;
  location?: string;
}

interface AddressResult {
  address: string;
  city: string;
  location: { lat: number; lng: number };
}

export default function SignUpForm() {
  const [formData, setFormData] = useState<SignUpFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    location: {lat: 0, lng: 0},
    city: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const addressInputRef = useRef<AddressInputFormRef>(null);
  const { loading, error, isAuthenticated } = useAppSelector(state => state.user);

  useEffect(() => {
    // Redirect to home if user is authenticated
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for the field being edited
    if (errors[name as keyof FormErrors]) {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name as keyof FormErrors];
        return updatedErrors;
      });
    }

    // Clear global error when user starts typing
    if (error !== null) {
      clearError();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate address and city
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city || !formData.city.trim()) {
      newErrors.city = 'City is required - please select an address from the suggestions to automatically detect the city';
    }
    
    // Validate location coordinates
    if (!formData.location || !formData.location.lat || !formData.location.lng) {
      newErrors.location = 'Please select an address from the suggestions to get coordinates';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = () => {
    dispatch({ type: 'user/clearError' });
  };

  const handleClearError = () => {
    clearError();
  };

  const handleFormSwitch = () => {
    clearError();
  };

  useEffect(() => {
    return () => {
      clearError();
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    
    if (validateForm()) {
      const { confirmPassword, ...userData } = formData;
      try {
        await dispatch(signUpUser(userData)).unwrap();
        
        // Only clear the form if signup was successful
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          address: '',
          location: {lat: 0, lng: 0},
          city: ''
        });

        // Clear the address input
        if (addressInputRef.current) {
          addressInputRef.current.clearAddress();
        }
      } catch (error) {
        // Error handling is already done in the Redux slice
        // The error will be shown via the error state
        console.error('Signup failed:', error);
      }
    }
  };

  const handleAddressInputFormChange = (addressResult: AddressResult) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      address: addressResult.address,
      city: addressResult.city,
      location: addressResult.location
    }));
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">Create an Account</h2>
      <p className="text-gray-600 text-center mb-6">Sign up to get started</p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative">
          <p>{error}</p>
          <button
            onClick={handleClearError}
            className="absolute top-0 right-0 mt-2 mr-2 text-red-700 hover:text-red-900"
          >
            &times;
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="Your username"
            disabled={loading}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
        </div>
        
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
              errors.email ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="your@email.com"
            disabled={loading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
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
              errors.password ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="Your password"
            disabled={loading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        
        <div className="form-control w-full mb-6">
        <AddressInputForm 
          onAddressSelect={handleAddressInputFormChange}
          ref={addressInputRef}
        />
        {errors.address && <span className="text-error text-xs mt-1">{errors.address}</span>}
        {errors.city && <span className="text-error text-xs mt-1">{errors.city}</span>}
        {errors.location && <span className="text-error text-xs mt-1">{errors.location}</span>}
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
              Signing up...
            </>
          ) : (
            'Sign up'
          )}
        </button>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" onClick={handleFormSwitch} className="text-blue-600 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}