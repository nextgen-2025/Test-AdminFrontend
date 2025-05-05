import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'

const Dashboard = () => {
  const { aToken, getDashData, dashData } = useContext(AdminContext)
  const [bookingsCount, setBookingsCount] = useState(0)

  useEffect(() => {
    if (aToken) {
      getDashData()
      // Fetch bookings data
      axios.get('http://localhost:8080/api/bookings')
        .then(res => {
          if (res.data && Array.isArray(res.data)) {
            setBookingsCount(res.data.length)
          } else if (res.data && typeof res.data === 'number') {
            setBookingsCount(res.data)
          }
        })
        .catch(err => {
          console.error('Error fetching bookings:', err)
          setBookingsCount(0)
        })
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
    <div className='ml-64 m-5 space-y-6'> 
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-all'>
          <div className='flex items-center justify-between'>
            <div>
              <p className="text-gray-500 text-sm">Total Appointments</p>
              <p className="text-2xl font-bold">
                {bookingsCount}
              </p>
            </div>
          </div>
        </div>
        
        <div className='bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-all'>
          <div className='flex items-center justify-between'>
            <div>
              <p className="text-gray-500 text-sm">Total Patients</p>
              <p className="text-2xl font-bold">
                {dashData.patients || 0}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-all'>
          <div className='flex items-center justify-between'>
            <div>
              <p className="text-gray-500 text-sm">Total Doctors</p>
              <p className="text-2xl font-bold">
                {dashData.doctors || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Bookings */}
      <div className='bg-white rounded-xl shadow-md overflow-hidden'>
        <div className='bg-gray-50 border-b px-6 py-4 flex items-center justify-between'>
          <h2 className="text-lg font-semibold text-gray-800">Recent Bookings</h2>
        </div>

        <div className='divide-y'>
          {dashData.recentBookings?.map((booking, index) => (
            <div key={index} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{booking.patientName}</p>
                  <p className="text-sm text-gray-500">{booking.doctorName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{booking.date}</p>
                  <p className="text-sm text-gray-500">{booking.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard