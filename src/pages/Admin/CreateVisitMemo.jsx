import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext';
import { FaSearch, FaUserInjured, FaHospital, FaVial, FaInfoCircle } from 'react-icons/fa';

const CreateVisitMemo = () => {
  const { aToken } = useContext(AdminContext);
  const [patients, setPatients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [tests, setTests] = useState({});
  const [loading, setLoading] = useState(false);
  const [departmentLoading, setDepartmentLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState('');
  const [testSearchTerms, setTestSearchTerms] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [message, setMessage] = useState('');
  
  // API base URL - use environment variable or fallback to local/production URL
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  
  // Debounce function for search inputs
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  
  useEffect(() => {
    if (aToken) {
      fetchPatients();
      fetchDepartments();
    } else {
      toast.error('Authentication required. Please log in again.');
    }
  }, [aToken]);
  
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/bookings`, {
        headers: { aToken }
      });
      
      if (response.data) {
        // The response contains an array of patients directly, not in a patientId property
        // console.log('Fetched patients data:', response.data);
        setPatients(response.data || []);
      } else {
        toast.error('Failed to fetch patients');
        // console.log('Error fetching DATA:', response.data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      
      // More specific error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          toast.error('Authentication expired. Please log in again.');
        } else {
          toast.error(`Failed to fetch patients: ${error.response.data?.message || error.message}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('Network error. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const fetchDepartments = async () => {
    try {
      setDepartmentLoading(true);
      
      // For development/testing: use dummy data instead of API call
      if (process.env.NODE_ENV === 'development') {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setDepartments(dummyDepartments);
        return;
      }
      
      // Original API call for production
      const response = await axios.get(`${API_BASE_URL}/api/departments/list`);
      
      if (response.data.success) {
        setDepartments(response.data.departments || []);
      } else {
        toast.error(response.data.message || 'Failed to fetch departments');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      
      // More specific error handling
      if (error.response) {
        toast.error(`Failed to fetch departments: ${error.response.data?.message || error.message}`);
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setDepartmentLoading(false);
    }
  };
  
  const fetchTestsForDepartment = async (departmentId) => {
    try {
      // For development/testing: use dummy data instead of API call
      if (process.env.NODE_ENV === 'development') {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (dummyTests[departmentId]) {
          setTests(prev => ({
            ...prev,
            [departmentId]: dummyTests[departmentId]
          }));
        }
        return;
      }
      
      // Original API call for production
      const response = await axios.get(`${API_BASE_URL}/api/departments/tests/department/${departmentId}`);
      
      if (response.data.success) {
        setTests(prev => ({
          ...prev,
          [departmentId]: response.data.tests || []
        }));
      } else {
        toast.error(response.data.message || 'Failed to fetch tests');
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast.error(`Failed to fetch tests: ${error.response?.data?.message || error.message}`);
    }
  };
  
  const handleDepartmentSelect = (department) => {
    const isSelected = selectedDepartments.some(dept => dept.departmentId === department._id);
    
    if (isSelected) {
      setSelectedDepartments(selectedDepartments.filter(dept => dept.departmentId !== department._id));
    } else {
      // Fetch tests for this department if not already fetched
      if (!tests[department._id]) {
        fetchTestsForDepartment(department._id);
      }
      
      setSelectedDepartments([
        ...selectedDepartments,
        {
          departmentId: department._id,
          departmentName: department.name,
          tests: []
        }
      ]);
      
      // Initialize test search term for this department
      setTestSearchTerms(prev => ({
        ...prev,
        [department._id]: ''
      }));
    }
  };
  
  const handleTestSelect = (departmentId, test) => {
    setSelectedDepartments(selectedDepartments.map(dept => {
      if (dept.departmentId === departmentId) {
        const testExists = dept.tests.some(t => t.testId === test._id);
        
        if (testExists) {
          return {
            ...dept,
            tests: dept.tests.filter(t => t.testId !== test._id)
          };
        } else {
          return {
            ...dept,
            tests: [
              ...dept.tests,
              {
                testId: test._id,
                testName: test.name,
                isSelected: true
              }
            ]
          };
        }
      }
      return dept;
    }));
  };
  
  const handleSelectAllTests = (departmentId) => {
    if (!tests[departmentId]) return;
    
    setSelectedDepartments(selectedDepartments.map(dept => {
      if (dept.departmentId === departmentId) {
        return {
          ...dept,
          tests: tests[departmentId].map(test => ({
            testId: test._id,
            testName: test.name,
            isSelected: true
          }))
        };
      }
      return dept;
    }));
  };
  
  const handleClearAllTests = (departmentId) => {
    setSelectedDepartments(selectedDepartments.map(dept => {
      if (dept.departmentId === departmentId) {
        return {
          ...dept,
          tests: []
        };
      }
      return dept;
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      toast.warning('Please select a patient');
      return;
    }
    
    if (selectedDepartments.length === 0) {
      toast.warning('Please select at least one department');
      return;
    }
    
    // Validate that each department has at least one test selected
    const invalidDepartments = selectedDepartments.filter(dept => dept.tests.length === 0);
    if (invalidDepartments.length > 0) {
      toast.warning(`Please select at least one test for ${invalidDepartments[0].departmentName}`);
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Use patientId field if available, otherwise use _id
      const patientIdToSend = selectedPatient.patientId || selectedPatient._id;
      
      const response = await axios.post(
        `${API_BASE_URL}/api/departments/memo/create`,
        {
          patientId: patientIdToSend,
          patientName: selectedPatient.name || selectedPatient.patientName,
          departments: selectedDepartments,
          message
        },
        { headers: { aToken } }
      );
      
      if (response.data.success) {
        toast.success('Visit memo created successfully');
        // Reset form
        setSelectedPatient(null);
        setSelectedDepartments([]);
        setMessage('');
        setSearchTerm('');
        setDepartmentSearchTerm('');
        setTestSearchTerms({});
      } else {
        toast.error(response.data.message || 'Failed to create visit memo');
      }
    } catch (error) {
      console.error('Error creating visit memo:', error);
      toast.error(`Failed to create visit memo: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Debounced search handlers
  const debouncedPatientSearch = useCallback(
    debounce(value => setSearchTerm(value), 300),
    []
  );
  
  const debouncedDepartmentSearch = useCallback(
    debounce(value => setDepartmentSearchTerm(value), 300),
    []
  );
  
  const debouncedTestSearch = useCallback(
    debounce((departmentId, value) => {
      setTestSearchTerms(prev => ({
        ...prev,
        [departmentId]: value
      }));
    }, 300),
    []
  );
  
  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => 
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.patientId && patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Filter departments based on search term
  const filteredDepartments = departments.filter(department =>
    department.name?.toLowerCase().includes(departmentSearchTerm.toLowerCase())
  );
  
  // Filter tests based on search term for each department
  const getFilteredTests = (departmentId) => {
    if (!tests[departmentId]) return [];
    
    const searchTerm = testSearchTerms[departmentId] || '';
    return tests[departmentId].filter(test =>
      test.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  return (
    <div className="ml-64 p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Create Visit Memo</h2>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <form onSubmit={handleSubmit}>
          {/* Patient Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FaUserInjured className="mr-2 text-blue-600" />
              Select Patient
            </h3>
            <div className="mb-3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search patients by name or ID..."
                onChange={(e) => debouncedPatientSearch(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  <p className="mt-2">Loading patients...</p>
                </div>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map(patient => (
                  <div 
                    key={patient._id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedPatient && selectedPatient._id === patient._id ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        {patient.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="font-medium">{patient.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{patient.patientId || 'No ID'}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No patients found</div>
              )}
            </div>
            
            {selectedPatient && (
              <div className="mt-3 p-3 bg-blue-50 rounded-md">
                <div className="font-medium">Selected Patient: {selectedPatient.name}</div>
                <div className="text-sm">{selectedPatient.patientId || 'No ID'}</div>
              </div>
            )}
          </div>
          
          {/* Department and Test Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FaHospital className="mr-2 text-blue-600" />
              Select Departments & Tests
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Departments List */}
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Departments</h4>
                <div className="mb-3 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search departments..."
                    onChange={(e) => debouncedDepartmentSearch(e.target.value)}
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {departmentLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      <p className="mt-2">Loading departments...</p>
                    </div>
                  ) : filteredDepartments.length > 0 ? (
                    filteredDepartments.map(department => (
                      <div key={department._id} className="mb-2">
                        <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            checked={selectedDepartments.some(dept => dept.departmentId === department._id)}
                            onChange={() => handleDepartmentSelect(department)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span>{department.name}</span>
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No departments found</div>
                  )}
                </div>
              </div>
              
              {/* Tests List */}
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <FaVial className="mr-2 text-blue-600" />
                  Tests
                </h4>
                <div className="max-h-60 overflow-y-auto">
                  {selectedDepartments.length > 0 ? (
                    selectedDepartments.map(dept => (
                      <div key={dept.departmentId} className="mb-4 p-3 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                          <h5 className="font-medium text-blue-600 mb-2">{dept.departmentName}</h5>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => handleSelectAllTests(dept.departmentId)}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition"
                            >
                              Select All
                            </button>
                            <button
                              type="button"
                              onClick={() => handleClearAllTests(dept.departmentId)}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition"
                            >
                              Clear All
                            </button>
                          </div>
                        </div>
                        
                        <div className="mb-2 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            placeholder="Search tests..."
                            onChange={(e) => debouncedTestSearch(dept.departmentId, e.target.value)}
                            className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        {tests[dept.departmentId] ? (
                          getFilteredTests(dept.departmentId).length > 0 ? (
                            getFilteredTests(dept.departmentId).map(test => (
                              <div key={test._id} className="ml-4 mb-1">
                                <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                  <input
                                    type="checkbox"
                                    checked={dept.tests.some(t => t.testId === test._id)}
                                    onChange={() => handleTestSelect(dept.departmentId, test)}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                  />
                                  <span>{test.name}</span>
                                </label>
                              </div>
                            ))
                          ) : (
                            <div className="ml-4 text-gray-500">No tests match your search</div>
                          )
                        ) : (
                          <div className="ml-4 text-gray-500 flex items-center">
                            <div className="animate-spin w-4 h-4 mr-2 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                            Loading tests...
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 flex items-center justify-center p-4">
                      <FaInfoCircle className="mr-2" />
                      Select departments to view available tests
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Message */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FaInfoCircle className="mr-2 text-blue-600" />
              Additional Message (Optional)
            </h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter any additional instructions or information for the patient..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            ></textarea>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  Creating...
                </>
              ) : (
                'Create Visit Memo'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVisitMemo;

// Add this after your state declarations
const dummyTests = {
  // Orthopedics Department
  "ortho123": [
    { _id: "test001", name: "X-Ray Spine", price: 1200, description: "X-Ray examination of the spine" },
    { _id: "test002", name: "MRI Knee", price: 3500, description: "Magnetic resonance imaging of knee joint" },
    { _id: "test003", name: "Bone Density Test", price: 2000, description: "Measures bone mineral density" },
    { _id: "test004", name: "Joint Fluid Analysis", price: 1800, description: "Analysis of synovial fluid" },
    { _id: "test005", name: "Arthroscopy", price: 5000, description: "Minimally invasive joint examination" }
  ],
  
  // Neurology Department
  "neuro456": [
    { _id: "test101", name: "EEG", price: 2500, description: "Electroencephalogram to measure brain activity" },
    { _id: "test102", name: "EMG", price: 3000, description: "Electromyography to assess nerve and muscle function" },
    { _id: "test103", name: "Brain MRI", price: 5000, description: "Detailed imaging of brain structure" },
    { _id: "test104", name: "Nerve Conduction Study", price: 2800, description: "Measures how fast electrical signals move through nerves" },
    { _id: "test105", name: "Lumbar Puncture", price: 3200, description: "Collection and analysis of cerebrospinal fluid" }
  ],
  
  // Cardiology Department
  "cardio789": [
    { _id: "test201", name: "ECG", price: 800, description: "Electrocardiogram to check heart rhythm" },
    { _id: "test202", name: "Echocardiogram", price: 3500, description: "Ultrasound imaging of the heart" },
    { _id: "test203", name: "Stress Test", price: 2500, description: "Evaluates heart function during physical activity" },
    { _id: "test204", name: "Holter Monitor", price: 1800, description: "Continuous ECG monitoring for 24-48 hours" },
    { _id: "test205", name: "Cardiac CT Scan", price: 4500, description: "Detailed imaging of heart and blood vessels" }
  ],
  
  // Pathology Department
  "patho321": [
    { _id: "test301", name: "Complete Blood Count", price: 500, description: "Measures various components in blood" },
    { _id: "test302", name: "Liver Function Test", price: 800, description: "Assesses liver health and function" },
    { _id: "test303", name: "Kidney Function Test", price: 800, description: "Evaluates kidney health and function" },
    { _id: "test304", name: "Lipid Profile", price: 700, description: "Measures cholesterol and triglycerides" },
    { _id: "test305", name: "Thyroid Function Test", price: 900, description: "Assesses thyroid hormone levels" }
  ]
};

// Dummy departments data
const dummyDepartments = [
  { _id: "ortho123", name: "Orthopedics", description: "Bone and joint care" },
  { _id: "neuro456", name: "Neurology", description: "Brain and nervous system care" },
  { _id: "cardio789", name: "Cardiology", description: "Heart and cardiovascular care" },
  { _id: "patho321", name: "Pathology", description: "Laboratory diagnostic services" }
];