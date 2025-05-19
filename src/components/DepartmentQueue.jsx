import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaHospital, FaUserClock, FaSpinner, FaSync, FaArrowLeft } from "react-icons/fa";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";

const DepartmentQueue = () => {
  const [departments, setDepartments] = useState([
    { _id: "cardio789", name: "Cardiology" },
    { _id: "ortho123", name: "Orthopedics" },
    { _id: "patho321", name: "Pathology" },
    { _id: "neuro456", name: "Neurology" }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [queueData, setQueueData] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const { aToken } = useContext(AdminContext);

  useEffect(() => {
    fetchDepartmentQueues();
    const interval = setInterval(fetchDepartmentQueues, 20000);
    return () => clearInterval(interval);
  }, []);

  const fetchDepartmentQueues = async () => {
    try {
      setLoading(true);
      const queuesPromises = departments.map(dept =>
        axios.get(`http://localhost:8080/api/departments/${dept._id}/queue`, {
          headers: { aToken }
        })
      );
      console.log("Queues Promises: ",queuesPromises);

      const responses = await Promise.all(queuesPromises);
      console.log("Responses: ",responses); 
      const processedQueueData = {};

      responses.forEach((response, index) => {
        const dept = departments[index];
        if (response.data.success && response.data.queueData) {
          processedQueueData[dept._id] = response.data.queueData.queue.map((item, idx) => ({
            tokenNumber: item.tokenNumber || String(idx + 1),
            position: item.position || idx + 1,
            status: item.status || 'waiting',
            patientId: item.patientId,
            tests: item.tests || []
          }));
        } else {
          processedQueueData[dept._id] = [];
        }
      });

      setQueueData(processedQueueData);
      setError(null);
    } catch (err) {
      console.error("Error fetching queues:", err);
      setError("Failed to fetch department queues");
      toast.error("Failed to fetch department queues");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      waiting: "bg-yellow-100 text-yellow-800",
      "in-progress": "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${
      statusClasses[status] || statusClasses.waiting
    }`;
  };

  if (loading) {
    return (
      <div className="ml-64 flex justify-center items-center h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-blue-600 text-3xl mx-auto mb-4" />
          <p className="text-gray-600">Loading department queues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-64 p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  const handleDepartmentClick = (dept) => {
    setSelectedDepartment(dept);
  };

  const handleBackClick = () => {
    setSelectedDepartment(null);
  };

  return (
    <div className="ml-64 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {selectedDepartment && (
              <button
                onClick={handleBackClick}
                className="mr-2 text-blue-600 hover:text-blue-700"
              >
                <FaArrowLeft className="text-xl" />
              </button>
            )}
            <FaHospital className="text-blue-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedDepartment ? selectedDepartment.name : 'Department Queues'}
            </h2>
          </div>
          <button
            onClick={fetchDepartmentQueues}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaSync className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className={`grid ${selectedDepartment ? '' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
          {departments
            .filter(dept => !selectedDepartment || dept._id === selectedDepartment._id)
            .map((dept) => {
              const deptQueue = queueData[dept._id] || [];
              
              return (
                <div
                  key={dept._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
                  onClick={() => !selectedDepartment && handleDepartmentClick(dept)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {dept.name}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                        Queue: {deptQueue.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {deptQueue.length > 0 ? (
                        deptQueue.map((patient, index) => (
                          <div
                            key={`${dept._id}-${index}`}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 p-2 rounded-full">
                                <FaUserClock className="text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">
                                  Patient ID: {patient.patientId}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Token #{patient.tokenNumber}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Position: {patient.position}
                                </p>
                                {patient.tests && patient.tests.length > 0 && (
                                  <p className="text-sm text-gray-500">
                                    Tests: {patient.tests.map(test => test.testName).join(', ')}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className={getStatusBadge(patient.status)}>
                              {patient.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          No patients in queue
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default DepartmentQueue;
