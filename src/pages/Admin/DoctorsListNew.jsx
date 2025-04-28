import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(10);

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

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Filter doctors based on search term and specialization
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = filterSpecialization === '' || doctor.specialization === filterSpecialization;
    return matchesSearch && matchesSpecialization;
  });
  
  // Get current doctors for pagination
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  return (
    // Add ml-64 here
    <div className='ml-64 m-5 max-h-[90vh] overflow-y-auto'> 
      <h1 className='text-2xl font-semibold mb-4 text-blue-700'>Doctors Directory</h1>
      
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
      
      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search doctors by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="md:w-64">
          <select
            value={filterSpecialization}
            onChange={(e) => {
              setFilterSpecialization(e.target.value);
              setCurrentPage(1); // Reset to first page on filter change
            }}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Specializations</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Dermatology">Dermatology</option>
          </select>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {currentDoctors.length > 0 ? (
          currentDoctors.map(doctor => (
            <div key={doctor._id} className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
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
                    <div className='mt-3 mb-2'>
                      <p className='text-xs text-gray-500 mb-1'>Available Slots:</p>
                      <div className='flex flex-wrap gap-1'>
                        {doctor.allSlots.length > 0 ? (
                          doctor.allSlots.map((slot, index) => (
                            <span key={index} className='text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded'>
                              {slot}
                            </span>
                          ))
                        ) : (
                          <span className='text-xs text-red-500'>No slots available</span>
                        )}
                      </div>
                    </div>
                    <div className='mt-2 flex items-center justify-between'>
                      <div className="flex items-center gap-1 text-sm">
                        <input 
                          type="checkbox" 
                          checked={doctor.allSlots.length > 0} 
                          readOnly 
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
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
          ))
        ) : (
          <div className="w-full text-center py-8 text-gray-500">
            {doctors.length > 0 ? 'No doctors match your search criteria.' : 'No doctors available.'}
          </div>
        )}
      </div>

      {/* Pagination - with improved styling */}
      {filteredDoctors.length > doctorsPerPage && (
        <div className="mt-8 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 bg-white rounded-lg shadow-sm">
          <div className="flex-1 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstDoctor + 1}</span> to{' '}
                <span className="font-medium">
                  {indexOfLastDoctor > filteredDoctors.length ? filteredDoctors.length : indexOfLastDoctor}
                </span>{' '}
                of <span className="font-medium">{filteredDoctors.length}</span> doctors
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  &laquo; Previous
                </button>
                
                {Array.from({ length: Math.ceil(filteredDoctors.length / doctorsPerPage) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                      currentPage === index + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => 
                    paginate(currentPage < Math.ceil(filteredDoctors.length / doctorsPerPage) ? currentPage + 1 : currentPage)
                  }
                  disabled={currentPage >= Math.ceil(filteredDoctors.length / doctorsPerPage)}
                  className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage >= Math.ceil(filteredDoctors.length / doctorsPerPage)
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  Next &raquo;
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsListNew;
