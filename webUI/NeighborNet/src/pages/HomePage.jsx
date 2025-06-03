import React from 'react'
import Feed from '../components/Feed.jsx'
import FeedFilter from '../components/FeedFilter.jsx'


export default function HomePage() {

  return (
    <div className="flex min-h-screen p-4 gap-4">
      <div className="sticky top-4 w-80 h-fit max-h-[calc(100vh-2rem)] overflow-y-auto bg-base-100 rounded-lg p-4">
        <FeedFilter/>
      </div>
      <div className="flex-1">
        <Feed/>
      </div>
    </div>
  )
}
