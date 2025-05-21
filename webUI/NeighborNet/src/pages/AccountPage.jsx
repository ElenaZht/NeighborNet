import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteAccount } from '../features/user/thunks/deleteAccountThunk'
import { editUser } from '../features/user/thunks/editUserThunk'


export default function AccountPage() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, error } = useSelector(state => state.user);
  
  const handleDeleteRequest = () => {
    setShowConfirmation(true);
  }
  
  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        photo_url: currentUser.photo_url || '',
        password: '',
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    // Reset form data to current user values
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        photo_url: currentUser.photo_url || '',
        password: '',
      });
    }
    setEditMode(false);
  };

  const handleSubmitEdit = async () => {
    const dataToSubmit = {};
    if (formData.username.trim()) dataToSubmit.username = formData.username.trim();
    if (formData.email.trim()) dataToSubmit.email = formData.email.trim();
    if (formData.address?.trim()) dataToSubmit.address = formData.address.trim();
    if (formData.photo_url?.trim()) dataToSubmit.photo_url = formData.photo_url.trim();
    if (formData.password?.trim()) dataToSubmit.password = formData.password.trim();
    setIsSubmitting(true);

    try {
      await dispatch(editUser({ userId: currentUser.id, userData: dataToSubmit })).unwrap();
      setEditMode(false);

    } catch (error) {
      console.error('Failed to update profile:', error);

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    
    setIsDeleting(true);
    try {
      if (currentUser && currentUser.id) {
        await dispatch(deleteAccount(currentUser.id)).unwrap();
        // On successful deletion, navigate to home page
        navigate('/');
      } else {
        throw new Error('User not found');
      }

    } catch (error) {
      console.error('Failed to delete account:', error);

    } finally {
      setIsDeleting(false);
    }
  }
  
  const handleCancel = () => {
    setShowConfirmation(false);
  }
    
  return (
    <>
      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    <div className="grid grid-cols-10 gap-6 mb-6">
      {/* Left Card - User Info */}
      <div className="card shadow-xl p-6 col-span-3">
        {currentUser && (
          <div className="flex flex-col items-center">
            <div className="avatar mb-4">
              <div className="w-full h-full overflow-hidden relative">
              {!editMode ? (
                  currentUser.photo_url ? (
                    <img 
                    src={currentUser.photo_url} 
                    alt={`${currentUser.username}'s profile`} 
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )
                ) : (
                  <div className="w-full h-full relative">
                    <input
                      type="text"
                      name="photo_url"
                      value={formData.photo_url}
                      onChange={handleInputChange}
                      placeholder="Enter photo URL"
                      className="input input-bordered w-full h-full text-center"
                    />
                    {formData.photo_url && (
                      <img 
                        src={formData.photo_url} 
                        alt="Preview" 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
            {!editMode ? (
                <>
                  <h2 className="text-xl font-bold">{currentUser.username}</h2>
                  <div className="flex flex-col gap-1 text-gray-700">
                    <div className="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{currentUser.email}</span>
                    </div>
                    {currentUser.address && (
                      <div className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{currentUser.address}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full space-y-3">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Username</span>
                    </label>
                    <input 
                      type="text" 
                      name="username" 
                      value={formData.username} 
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange}
                      className="input input-bordered w-full" 
                      required
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Address</span>
                    </label>
                    <input 
                      type="text" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleInputChange}
                      className="input input-bordered w-full" 
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        name="password" 
                        value={formData.password} 
                        onChange={handleInputChange}
                        className="input input-bordered w-full pr-10" 
                        required
                        placeholder="Enter your password"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            <div className="mt-6 pt-4 border-t border-gray-200 w-full text-center">
            {!editMode ? (
                <div className="flex justify-between">
                  <button 
                    onClick={handleEditToggle} 
                    className="btn btn-sm btn-primary"
                  >
                    Edit Profile
                  </button>
                  
                  <button 
                    onClick={handleDeleteRequest} 
                    className="btn btn-sm bg-white border border-gray-300 hover:bg-gray-100 text-red-600 font-medium"
                  >
                    Delete Account
                  </button>
                </div>
              ) : (
                <div className="flex justify-between">
                  <button 
                    onClick={handleCancelEdit} 
                    className="btn btn-sm btn-outline"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  
                  <button 
                    onClick={handleSubmitEdit} 
                    className={`btn btn-sm btn-primary ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Card - for activity*/}
      <div className="card shadow-xl p-6 col-span-7">
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-bold mb-4">Account Activity</h2>
          <div className="text-center text-gray-500">
            <p>No recent activity to display</p>
          </div>
        </div>
      </div>
    </div>
      
      {showConfirmation && (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-bold mb-4">Delete Your Account?</h3>
          <p className="mb-6 text-gray-700">
            This action cannot be undone. All your data, posts, and profile information will be permanently deleted.
          </p>
          
          <div className="flex flex-row gap-3 sm:flex-row sm:justify-between">
            <button 
              onClick={handleCancel}
              className="btn btn-outline flex-1 order-2 sm:order-1"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirmDelete}
              className={`btn bg-red-600 text-white hover:bg-red-700 flex-1 order-1 sm:order-2 ${isDeleting ? 'loading' : ''}`}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
            </button>
          </div>
        </div>
      </div>
      )}
    </>
  )
}