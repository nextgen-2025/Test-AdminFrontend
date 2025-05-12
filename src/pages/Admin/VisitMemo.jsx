import React, { useState, useEffect } from "react";
import axios from "axios";

const VisitMemo = () => {
  const [memoData, setMemoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchMemoData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/departments/visit-memos/all"
        );
        // Group memos by patient ID
        const groupedMemos = response?.data?.memos.reduce((acc, memo) => {
          const key = memo.patientId; // Assuming there's a patientId field
          if (!acc[key]) {
            acc[key] = {
              patientId: memo.patientId,
              patientName: memo.patientName,
              visits: []
            };
          }
          acc[key].visits.push(memo);
          return acc;
        }, {});
        
        setMemoData(Object.values(groupedMemos));
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch visit memos");
        setLoading(false);
      }
    };

    fetchMemoData();
  }, []);

  const filteredMemos = memoData?.filter((patient) => {
    const matchesSearch = patient.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
      patient.visits.some(visit => visit.status === statusFilter);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="ml-64 p-6 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-600 flex items-center gap-3">
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading visit memos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-64 p-6 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl text-red-600 flex items-center gap-3">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="ml-64 p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 p-2 rounded-lg shadow-sm">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
              <h2 className="text-2xl font-bold text-gray-800">Visit Memos</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <input
                  type="text"
                  placeholder="Search memos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Memos List */}
        <div className="grid gap-6">
          {filteredMemos?.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No memos found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search criteria</p>
            </div>
          ) : (
            filteredMemos?.map((patient) => (
              <div
                key={patient.patientId}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Enhanced Patient Header */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 md:p-6 border-b border-blue-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-full shadow-sm">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{patient.patientName}</h3>
                      <p className="text-sm text-gray-500 mt-1">{patient.visits.length} visits recorded</p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Visits List */}
                <div className="divide-y divide-gray-100">
                  {patient.visits.map((visit, index) => (
                    <div key={visit._id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(visit.createdAt).toLocaleDateString()}
                        </p>
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 ${
                          visit.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                            visit.status === "completed" ? "bg-green-500" : "bg-yellow-500"
                          }`}></span>
                          {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Departments
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {visit.departments?.map((dept, deptIndex) => (
                              <div
                                key={deptIndex}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${dept.isVisited ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                                  <span className="font-medium text-gray-700">{dept.departmentName}</span>
                                  <span className="text-sm text-gray-500">(Token:#{dept.tokenNumber})</span>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  dept.isVisited
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}>
                                  {dept.isVisited ? "Visited" : "Pending"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {visit.message && (
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-sm text-gray-600 leading-relaxed">{visit.message}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitMemo;
