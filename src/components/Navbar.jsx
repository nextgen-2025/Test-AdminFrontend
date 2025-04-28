import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'; // Import an icon for logout

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext)
  const siteLogo = 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Hinduja_Group_Logo.svg/1200px-Hinduja_Group_Logo.svg.png'
  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    if (aToken) {
      setAToken('')
      localStorage.removeItem('aToken')
    }
  }

  return (
    <nav className='flex justify-between items-center px-6 py-3 border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50'>
      {/* Logo Section */}
      <div className='flex items-center'>
        <img 
          onClick={() => navigate('/')} 
          className='h-12 w-auto cursor-pointer' // Adjusted height for better consistency
          src={siteLogo} 
          alt="Hinduja Group Logo" 
        />
        {/* Optional: Add site title or admin indicator */}
        {/* <span className='ml-3 text-lg font-semibold text-gray-700'>Admin Panel</span> */}
      </div>

      {/* Logout Button */}
      {aToken && ( // Only show logout if logged in
        <button 
          onClick={logout} 
          className='flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50'
          title="Logout" // Add tooltip for accessibility
        >
          <FaSignOutAlt /> {/* Logout Icon */}
          <span className='hidden sm:inline'>Logout</span> {/* Hide text on small screens */}
        </button>
      )}
    </nav>
  )
}

export default Navbar