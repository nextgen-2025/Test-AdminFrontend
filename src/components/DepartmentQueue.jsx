import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaHospital, FaUserClock, FaSpinner, FaSync } from "react-icons/fa";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";

const DepartmentQueue = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [queueData, setQueueData] = useState({});
  const { aToken } = useContext(AdminContext);

  useEffect(() => {
    fetchDepartments();
    // Set up real-time updates
    const interval = setInterval(fetchDepartments, 20000); // Refresh every 20 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDepartments = async (departmentId) => {
    try {
      setLoading(true);
      const [departmentsResponse, memosResponse, queueData] = await Promise.all([
        axios.get("http://localhost:8080/api/departments/list", {
          headers: { aToken },
        }),
        axios.get("http://localhost:8080/api/departments/visit-memos/all", {
          headers: { aToken },
        }),
        axios.get(`http://localhost:8080/api/departments/${departmentId}/queue`, {
        }),
      ]);

      console.log("Queue Data: ", queueData);
      console.log("Queue Data Data: ", queueData.data);
      console.log("Queue Data Data.queue: ", queueData.data.queue);

      console.log("Departments Res:", departmentsResponse);
      console.log("Departments Data:", departmentsResponse.data);
      console.log("Departments Data.Departments:", departmentsResponse.data.departments);


      console.log("Memos Res:", memosResponse);
      console.log("Memos Data:", memosResponse.data);
      console.log("Memos Data.Memos:", memosResponse.data.memos);

      if (departmentsResponse.data.success) {
        const depts = departmentsResponse.data.departments;
        setDepartments(depts);
      }
      if (memosResponse.data.success) {
        // Process memos into department-specific queues
        const processedQueueData = {};
        memosResponse.data.memos.forEach(memo => {
          memo.departments.forEach(dept => {
            if (!processedQueueData[dept.departmentId]) {
              processedQueueData[dept.departmentId] = [];
            }
            processedQueueData[dept.departmentId].push({
              tokenNumber: dept.tokenNumber || "N/A",
              position: processedQueueData[dept.departmentId].length + 1,
              status: dept.isVisited ? 'completed' : 'waiting',
              // patientName: memo.patientName
              patientId: memo.patientId
            });
          });
        });
        setQueueData(processedQueueData);
        console.log("Processed Queue Data: ", processedQueueData);
      }
      console.log("Queue Data: ", queueData);

      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
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

  return (
    <div className="ml-64 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaHospital className="text-blue-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-800">
              Department Queues
            </h2>
          </div>
          <button
            onClick={fetchDepartments}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaSync className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Department Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => {
            // Static mapping for department IDs
            const deptMapping = {
              'Orthopedics': 'ortho123',
              'Pathology': 'patho321',
              'Cardiology': 'cardio789',
              'Neurology': 'neuro456'
            };
            const deptQueue = queueData[deptMapping[dept.name]] || [];
            console.log("Department Name:", dept.name);
            console.log("Mapped ID:", deptMapping[dept.name]);
            console.log("Dept Queue:", deptQueue);
            
            return ( 
              <div
                key={dept._id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {dept.name}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      Queue: {Array.isArray(deptQueue) ? deptQueue.length : 0}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {Array.isArray(deptQueue) && deptQueue.length > 0 ? (
                      deptQueue.map((patient, index) => (
                        <div
                          key={`${dept._id}-${index}`}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
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
