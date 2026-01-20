import {  FiUsers } from 'react-icons/fi'
import { IoShareSocialOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'

const QuickActions = () => {
  return (
    <div className="container mx-auto px-4 md:px-8">
      {/* Quick Actions */}
      <div className="flex justify-center items-center gap-4 mb-8">
        <Link
          to="/communities"
          className="group flex-1 max-w-87.5 p-5 bg-linear-to-r from-violet-500 to-fuchsia-500 rounded-2xl text-white hover:shadow-xl hover:shadow-violet-200 transition-all duration-300 hover:-translate-y-1"
        >
          <IoShareSocialOutline className="w-10 h-10 mb-3 text-5xl group-hover:scale-110
           transition-transform" />
          <h3 className="text-xl font-bold mb-1">Communites</h3>
          <p className="text-xs opacity-90">
            Share your knowledge with others
          </p>
        </Link>

        <Link
          to="/community/create"
          className="group flex-1 max-w-87.5 p-5 bg-linear-to-r from-cyan-500 to-blue-500 rounded-2xl text-white hover:shadow-xl hover:shadow-violet-200 transition-all duration-300 hover:-translate-y-1"
        >
          <FiUsers className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold mb-1">Create Community</h3>
          <p className="text-xs opacity-90">Build a learning community</p>
        </Link>
      </div>
    </div>
  )
}

export default QuickActions