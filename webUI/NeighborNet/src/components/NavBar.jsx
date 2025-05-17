import React from 'react'
import { Link } from 'react-router-dom'


export default function NavBar() {
  return (
    <div className="navbar bg-base-100 px-4 shadow-md">
      <div className="flex-1">
       <a className="btn btn-ghost normal-case text-xl">NeighborNet</a>
     </div>
     <div className="flex-none">
        <Link to="/signup" className="btn btn-primary">Sign Up</Link>
      </div>
    </div>
  )
}
