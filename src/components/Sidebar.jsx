import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
// Import icons from react-icons for a consistent look (optional, but recommended)
import { FaTachometerAlt, FaCalendarPlus, FaUserMd, FaListAlt } from 'react-icons/fa';

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const navigate = useNavigate(); // Use navigate for the logo click

  // Define menu items in an array for easier management
  const menuItems = [
    {
      path: '/admin-dashboard',
      // icon: assets.home_icon, // Use your asset
      icon: <FaTachometerAlt className="w-5 h-5" />, // Or use react-icons
      label: 'Dashboard'
    },
    {
      path: '/new-appoinment',
      // icon: assets.appointment_icon,
      icon: <FaCalendarPlus className="w-5 h-5" />,
      label: 'New Appointments' // Adjusted label for clarity
    },
    {
      path: '/new-doctors',
      // icon: assets.add_icon,
      icon: <FaUserMd className="w-5 h-5" />, // Changed icon for relevance
      label: 'Add Doctor' // Adjusted label
    },
    {
      path: '/new-doctorslist',
      // icon: assets.people_icon,
      icon: <FaListAlt className="w-5 h-5" />, // Changed icon for relevance
      label: 'Doctors List' // Adjusted label
    }
    // Add more menu items here if needed
  ];

  const siteLogo = 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Hinduja_Group_Logo.svg/1200px-Hinduja_Group_Logo.svg.png'; // Logo URL

  return (
    // Sidebar container: fixed width, full height, background, border, shadow
    <div className='w-64 min-h-screen bg-white border-r border-gray-200 shadow-md flex flex-col fixed top-0 left-0 z-40'> 
      {/* Logo Area */}
      <div className='p-4 border-b border-gray-200 flex items-center justify-center h-16'> 
        <img 
          src={siteLogo} 
          alt="Logo" 
          className='h-8 w-auto cursor-pointer' 
          onClick={() => navigate('/')} // Navigate to home on logo click
        />
        {/* Optional: Add Text Title */}
        {/* <span className="ml-2 text-lg font-semibold text-gray-700">Admin</span> */}
      </div>

      {/* Navigation Menu */}
      {aToken && (
        <nav className='flex-grow mt-4 px-3'> {/* Use nav tag, add padding */}
          <ul className='space-y-2'> {/* Add vertical space between items */}
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink 
                  to={item.path}
                  // Define base styles and active/inactive styles using a function
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ease-in-out group
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700' // Active state styles
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' // Inactive and hover styles
                    }
                  `}
                >
                  {/* Icon */}
                  <span className="flex-shrink-0">
                    {item.icon} 
                  </span>
                  {/* Label */}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
      
      {/* Optional: Footer or User Info Section */}
      {/* <div className='mt-auto p-4 border-t border-gray-200'>
         User info or logout button can go here 
      </div> */}
    </div>
  )
}

export default Sidebar