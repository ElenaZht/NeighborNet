import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUpUser } from '../../features/user/thunks/signUpThunk';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    lat: '',
    lon: '',
  });
  
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated } = useSelector(state => state.user);

  useEffect(() => {
    // Redirect to home if user is authenticated
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

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
    // Validate latitude and longitude
    if (formData.lat && (isNaN(formData.lat) || formData.lat < -90 || formData.lat > 90)) {
      newErrors.lat = 'Latitude must be between -90 and 90';
    }
    
    if (formData.lon && (isNaN(formData.lon) || formData.lon < -180 || formData.lon > 180)) {
      newErrors.lon = 'Longitude must be between -180 and 180';
    }
    
    // If one coordinate is provided, both should be provided
    if ((formData.lat && !formData.lon) || (!formData.lat && formData.lon)) {
      if (!newErrors.lat) newErrors.lat = 'Both latitude and longitude must be provided';
      if (!newErrors.lon) newErrors.lon = 'Both latitude and longitude must be provided';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const { confirmPassword, ...userData } = formData;
      dispatch(signUpUser(userData));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      
      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input 
            type="text" 
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`input input-bordered w-full ${errors.username ? 'input-error' : ''}`}
            placeholder="Enter your username"
          />
          {errors.username && <span className="text-error text-xs mt-1">{errors.username}</span>}
        </div>
        
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
            placeholder="Enter your email"
          />
          {errors.email && <span className="text-error text-xs mt-1">{errors.email}</span>}
        </div>
        
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
            placeholder="Enter your password"
          />
          {errors.password && <span className="text-error text-xs mt-1">{errors.password}</span>}
        </div>
        
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Confirm Password</span>
          </label>
          <input 
            type="password" 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error' : ''}`}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <span className="text-error text-xs mt-1">{errors.confirmPassword}</span>}
        </div>
        
        <div className="form-control w-full mb-6">
          <label className="label">
            <span className="label-text">Address</span>
          </label>
          <input 
            type="text" 
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter your address (optional)"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Latitude</span>
            </label>
            <input 
              type="number" 
              name="lat"
              step="any"
              value={formData.lat}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="e.g. 40.7128"
            />
            {errors.lat && <span className="text-error text-xs mt-1">{errors.lat}</span>}
          </div>
          
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Longitude</span>
            </label>
            <input 
              type="number" 
              name="lon"
              step="any"
              value={formData.lon}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="e.g. -74.0060"
            />
            {errors.lon && <span className="text-error text-xs mt-1">{errors.lon}</span>}
          </div>
        </div>
        <button 
          type="submit" 
          className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="loading loading-spinner loading-md text-white"></span>
              <span>Signing Up...</span>
            </span>
          ) : 'Sign Up'}
        </button>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}