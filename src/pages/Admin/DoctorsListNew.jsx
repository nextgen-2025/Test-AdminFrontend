import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const DoctorsListNew = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    specialization: '',
    allSlots: []
  });

  const ALL_SLOTS = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM"
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://hinduja-backend-production.up.railway.app/api/doctors');
      setDoctors(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch doctors. Please try again.');
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor._id);
    setEditForm({
      name: doctor.name,
      specialization: doctor.specialization,
      allSlots: doctor.allSlots
    });
  };

  const handleUpdate = async (doctorId) => {
    try {
      setError('');
      setSuccess('');
      const response = await axios.put(`https://hinduja-backend-production.up.railway.app/api/doctors/${doctorId}`, editForm);
      setSuccess('Doctor updated successfully');
      setEditingDoctor(null);
      fetchDoctors(); // Refresh the list
    } catch (err) {
      console.error('Error updating doctor:', err);
      setError(err.response?.data?.message || 'Failed to update doctor. Please try again.');
    }
  };

  const handleDelete = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor? This will also delete all their appointments.')) {
      try {
        setError('');
        setSuccess('');
        await axios.delete(`https://hinduja-backend-production.up.railway.app/api/doctors/${doctorId}`);
        setSuccess('Doctor deleted successfully');
        fetchDoctors(); // Refresh the list
      } catch (err) {
        console.error('Error deleting doctor:', err);
        setError(err.response?.data?.message || 'Failed to delete doctor. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium mb-4'>All Doctors</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map(doctor => (
          <div key={doctor._id} className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden'>
            <div className='bg-[#EAEFFF] p-4 flex justify-center items-center h-32'>
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-2xl text-blue-600">
                  {doctor.name.charAt(0)}
                </span>
              </div>
            </div>
            
            <div className='p-4'>
              {editingDoctor === doctor._id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Doctor Name"
                  />
                  <select
                    value={editForm.specialization}
                    onChange={(e) => setEditForm(prev => ({ ...prev, specialization: e.target.value }))}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Specialization</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    {ALL_SLOTS.map(slot => (
                      <div key={slot} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.allSlots.includes(slot)}
                          onChange={() => {
                            const newSlots = editForm.allSlots.includes(slot)
                              ? editForm.allSlots.filter(s => s !== slot)
                              : [...editForm.allSlots, slot];
                            setEditForm(prev => ({ ...prev, allSlots: newSlots }));
                          }}
                          className="mr-2"
                        />
                        <label>{slot}</label>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(doctor._id)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingDoctor(null)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className='text-[#262626] text-lg font-medium'>Dr. {doctor.name}</p>
                  <p className='text-[#5C5C5C] text-sm'>{doctor.specialization}</p>
                  <div className='mt-2 flex items-center justify-between'>
                    <div className="flex items-center gap-1 text-sm">
                      <input type="checkbox" checked={doctor.allSlots.length > 0} readOnly />
                      <p>Available</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(doctor)}
                        className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                        title="Edit Doctor"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(doctor._id)}
                        className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                        title="Delete Doctor"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsListNew;
