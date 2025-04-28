import React, { useState } from 'react';
import axios from 'axios';
import { FaUserMd, FaStethoscope, FaClock } from 'react-icons/fa';

const ALL_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM"
];

const SPECIALIZATIONS = [
  "General Medicine",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Dermatology",
  "Orthopedics",
  "Gynecology",
  "ENT"
];

const AddDoctorsNew = () => {
  const [doctor, setDoctor] = useState({
    name: "",
    specialization: "",
    allSlots: ALL_SLOTS,
    bookedSlots: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post('https://hinduja-backend-production.up.railway.app/api/doctors', doctor);
      setSuccess("Doctor added successfully!");
      // Reset form
      setDoctor({
        name: "",
        specialization: "",
        allSlots: ALL_SLOTS,
        bookedSlots: []
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add doctor");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAllSlots = () => {
    setDoctor(prev => ({ ...prev, allSlots: [...ALL_SLOTS] }));
  };

  const handleClearAllSlots = () => {
    setDoctor(prev => ({ ...prev, allSlots: [] }));
  };

  return (
    <div className="ml-64 p-6 max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-4 flex items-center">
          <FaUserMd className="text-2xl mr-3" />
          <h2 className="text-2xl font-bold">Add New Doctor</h2>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col">
              <label className="mb-1 font-medium flex items-center text-gray-700">
                <FaUserMd className="mr-2 text-blue-600" />
                Doctor Name
              </label>
              <input
                type="text"
                name="name"
                value={doctor.name}
                onChange={handleChange}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter doctor's name"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium flex items-center text-gray-700">
                <FaStethoscope className="mr-2 text-blue-600" />
                Specialization
              </label>
              <select
                name="specialization"
                value={doctor.specialization}
                onChange={handleChange}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              >
                <option value="">Select Specialization</option>
                {SPECIALIZATIONS.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium flex items-center text-gray-700">
                  <FaClock className="mr-2 text-blue-600" />
                  Available Time Slots
                </label>
                <div className="flex space-x-2">
                  <button 
                    type="button" 
                    onClick={handleSelectAllSlots}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition"
                  >
                    Select All
                  </button>
                  <button 
                    type="button" 
                    onClick={handleClearAllSlots}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 border rounded-lg bg-gray-50">
                {ALL_SLOTS.map(slot => (
                  <div key={slot} className="flex items-center">
                    <input
                      type="checkbox"
                      id={slot}
                      checked={doctor.allSlots.includes(slot)}
                      onChange={() => {
                        const newSlots = doctor.allSlots.includes(slot)
                          ? doctor.allSlots.filter(s => s !== slot)
                          : [...doctor.allSlots, slot];
                        setDoctor(prev => ({ ...prev, allSlots: newSlots }));
                      }}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={slot} className="ml-2 text-sm text-gray-700">{slot}</label>
                  </div>
                ))}
              </div>
              {doctor.allSlots.length === 0 && (
                <p className="text-xs text-red-500 mt-1">Please select at least one time slot</p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || doctor.allSlots.length === 0}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all
                  ${loading || doctor.allSlots.length === 0
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : 'Add Doctor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorsNew;
