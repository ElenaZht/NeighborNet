import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'


export default function NavBar() {
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
    </div>
  )
}
