import React from 'react'
import { FaUsers } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const NotCommunites = () => {
  return (
     <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-2">
            <FaUsers className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            No communities found
          </h3>
          <p className="text-gray-500">
            It looks like there aren't any communities yet. Why not create one?
          </p>
          <Link
            to={"/community/create"}
            className="mt-4 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Start a Community
          </Link>
        </div>
      </div>
  )
}

export default NotCommunites