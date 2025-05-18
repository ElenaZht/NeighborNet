import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteAccount } from '../features/user/thunks/deleteAccountThunk'


export default function AccountPage() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, error } = useSelector(state => state.user);
  
  const handleDeleteRequest = () => {
    setShowConfirmation(true);
  }
  
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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
      
      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      <div className="card bg-base-100 shadow-xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h3>
        <p className="mb-4 text-gray-600">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button 
          onClick={handleDeleteRequest} 
          className="btn bg-white border border-gray-300 hover:bg-gray-100 text-red-600 font-medium"
        >
          Delete Account
        </button>
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
    </div>
  )
}