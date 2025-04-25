import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingsView = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/bookings`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Booked Appointments</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((doctor) => (
                doctor.bookings.map((booking, index) => (
                  <tr key={`${doctor.doctorId}-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.doctorName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.specialization}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{booking.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{booking.slot}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingsView; 