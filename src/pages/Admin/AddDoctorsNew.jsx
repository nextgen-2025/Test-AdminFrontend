import React, { useState } from 'react';
import axios from 'axios';

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

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Add New Doctor</h2>
      
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Doctor Name</label>
          <input
            type="text"
            name="name"
            value={doctor.name}
            onChange={handleChange}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter doctor's name"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Specialization</label>
          <select
            name="specialization"
            value={doctor.specialization}
            onChange={handleChange}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Specialization</option>
            {SPECIALIZATIONS.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Available Time Slots</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 border rounded">
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
                  className="mr-2"
                />
                <label htmlFor={slot}>{slot}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded text-white font-medium
              ${loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {loading ? 'Adding...' : 'Add Doctor'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctorsNew;
