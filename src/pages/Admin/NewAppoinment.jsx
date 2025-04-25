import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NewAppoinment = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('https://hinduja-backend-production.up.railway.app/api/bookings');
        setBookings(response.data);
        console.log(bookings);
        
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Upcoming Appointments</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Patient Name</th>
              <th className="py-3 px-4 text-left">Patient ID</th>
              <th className="py-3 px-4 text-left">Doctor ID</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Time</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-100 transition">
                  <td className="py-3 px-4">{booking.patientName}</td>
                  <td className="py-3 px-4">{booking.patientId}</td>
                  <td className="py-3 px-4">{booking.doctorId}</td>
                  <td className="py-3 px-4">{booking.date}</td>
                  <td className="py-3 px-4">{booking.time}</td>
                  <td className="py-3 px-4 capitalize text-yellow-600 font-medium">
                    {booking.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No bookings available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewAppoinment;
