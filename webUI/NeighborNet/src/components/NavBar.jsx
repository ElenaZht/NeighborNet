import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'


function NavBar() {
  const currentUser = useSelector(state => state.user.currentUser) || null

  return (
    <div className="navbar bg-base-100 px-4 shadow-md">
      <p>{currentUser?.username}</p>
      <div className="flex-1">
       <Link to='/' className="btn btn-ghost normal-case text-xl">NeighborNet</Link>
      </div>
      <div className="flex-none">
        <Link to="/signup" className="btn btn-primary">Sign Up</Link>
      </div>
      <div className="flex-none">
        <Link to="/account" className="btn btn-primary">Account</Link>
      </div>
      <div className="flex-none">
        <Link to="/login" className="btn btn-primary">LogInForm</Link>
      </div>
    </div>
  )
}
export default NavBar