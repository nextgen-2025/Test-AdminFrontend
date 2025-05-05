import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
// Import icons from react-icons for a consistent look
import { FaTachometerAlt, FaCalendarPlus, FaUserMd, FaListAlt, FaClipboardList, FaFileMedical } from 'react-icons/fa';

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const navigate = useNavigate(); 

  // Define menu items in an array for easier management
  const menuItems = [
    {
      path: '/admin-dashboard',
      icon: <FaTachometerAlt className="w-5 h-5" />,
      label: 'Dashboard'
    },
    {
      path: '/new-appoinment',
      icon: <FaCalendarPlus className="w-5 h-5" />,
      label: 'New Appointments'
    },
    {
      path: '/new-doctors',
      icon: <FaUserMd className="w-5 h-5" />,
      label: 'Add Doctor'
    },
    {
      path: '/new-doctorslist',
      icon: <FaListAlt className="w-5 h-5" />,
      label: 'Doctors List'
    },
    // Added Visit Memo navigation items
    {
      path: '/create-visit-memo',
      icon: <FaFileMedical className="w-5 h-5" />,
      label: 'Create Visit Memo'
    },
    {
      path: '/visit-memo',
      icon: <FaClipboardList className="w-5 h-5" />,
      label: 'View Visit Memos'
    }
  ];

  const siteLogo = 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Hinduja_Group_Logo.svg/1200px-Hinduja_Group_Logo.svg.png';

  return (
    <div className='w-64 min-h-screen bg-white border-r border-gray-200 shadow-md flex flex-col fixed top-0 left-0 z-40'> 
      <div className='p-4 border-b border-gray-200 flex items-center justify-center h-16'> 
        <img 
          src={siteLogo} 
          alt="Logo" 
          className='h-8 w-auto cursor-pointer' 
          onClick={() => navigate('/')} 
        />
      </div>

      {aToken && (
        <nav className='flex-grow mt-4 px-3'>
          <ul className='space-y-2'>
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ease-in-out group
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <span className="flex-shrink-0">
                    {item.icon} 
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}

export default Sidebar