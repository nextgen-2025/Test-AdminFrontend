import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const Dashboard = () => {
  const { aToken, getDashData, dashData } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  if (!dashData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    // Add ml-64 here
    <div className='ml-64 m-5 space-y-6'> 
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-all'>
          <div className='flex items-center justify-between'>
            <div>
              <p className="text-gray-500 text-sm">Total Appointments</p>
              <p className="text-2xl font-bold">
                62
              </p>
            </div>
          </div>
        </div>
        
        <div className='bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-all'>
          {/* Add more stats here if needed */}
          <div className='flex items-center justify-between'>
            <div>
              <p className="text-gray-500 text-sm">Login</p>
              <p className="text-2xl font-bold">
                40
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Bookings */}
      <div className='bg-white rounded-xl shadow-md overflow-hidden'>
        <div className='bg-gray-50 border-b px-6 py-4 flex items-center justify-between'>
          Login
        </div>

        <div className='divide-y'>
          
        </div>
      </div>
    </div>
  )
}

export default Dashboard