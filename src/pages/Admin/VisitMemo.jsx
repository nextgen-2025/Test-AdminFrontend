import React from 'react';

const VisitMemo = () => {
  // Dummy data for demonstration
  const memoData = [
    {
      _id: '1',
      patientName: 'John Doe',
      createdAt: new Date('2024-01-20'),
      status: 'completed',
      departments: [
        {
          departmentName: 'Cardiology',
          tokenNumber: 'A001',
          isVisited: true
        },
        {
          departmentName: 'Radiology',
          tokenNumber: 'B002',
          isVisited: false
        }
      ],
      message: 'Patient needs follow-up in 2 weeks'
    },
    {
      _id: '2',
      patientName: 'Jane Smith',
      createdAt: new Date('2024-01-19'),
      status: 'pending',
      departments: [
        {
          departmentName: 'Orthopedics',
          tokenNumber: 'C003',
          isVisited: true
        }
      ],
      message: 'Scheduled for physical therapy'
    },
    {
      _id: '3',
      patientName: 'Robert Johnson',
      createdAt: new Date('2024-01-18'),
      status: 'completed',
      departments: [
        {
          departmentName: 'Neurology',
          tokenNumber: 'D004',
          isVisited: true
        },
        {
          departmentName: 'Physiotherapy',
          tokenNumber: 'E005',
          isVisited: true
        }
      ],
      message: 'Treatment completed successfully'
    }
  ];

  return (
    <div className="ml-64 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Visit Memos</h2>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search memos..." 
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6">
          {memoData.map((memo) => (
            <div key={memo._id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{memo.patientName}</h3>
                  <p className="text-gray-500 text-sm">
                    Created on {memo.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  memo.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {memo.status.charAt(0).toUpperCase() + memo.status.slice(1)}
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Departments Visited</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {memo.departments.map((dept, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{dept.departmentName}</p>
                          <p className="text-sm text-gray-500">Token: {dept.tokenNumber}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          dept.isVisited 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {dept.isVisited ? 'Visited' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {memo.message && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-1">Notes</h4>
                    <p className="text-gray-600">{memo.message}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisitMemo;
