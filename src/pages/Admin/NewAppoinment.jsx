import React, { useEffect, useState } from "react";
import axios from "axios";

const NewAppoinment = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(10);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://hinduja-backend-production.up.railway.app/api/bookings"
        );
        setBookings(response.data);
        console.log("Fetched bookings:", response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter appointments based on status and search term
  const filteredAppointments = bookings.filter(
    (booking) =>
      (activeFilter === "all" ||
        booking.status.toLowerCase() === activeFilter.toLowerCase()) &&
      (searchTerm === "" ||
        booking.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.doctorId?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get current appointments
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      console.log('Attempting to update status:', { bookingId, newStatus });
      
      const response = await axios.put(
        `http://localhost:8080/api/bookings/update/${bookingId}`,
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Status update response:', response.data);
      
      // Update the local state to reflect the change
      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // More descriptive error message
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Failed to update booking status: ${errorMessage}`);
    }
  };

  return (
    // Add ml-64 here
    <div className="ml-64 p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Upcoming Appointments
      </h2>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2">Loading appointments...</p>
        </div>
      ) : (
        <>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="max-w-md mx-auto">
              <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden border border-gray-300">
                <div className="grid place-items-center h-full w-12 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
                  type="text"
                  id="search"
                  placeholder="Search by patient name, patient ID, or doctor ID..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>

          {/* Status Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange("visited")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === "visited"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Visited
            </button>
            <button
              onClick={() => handleFilterChange("confirmed")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === "confirmed"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => handleFilterChange("pending")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === "pending"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleFilterChange("cancelled")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === "cancelled"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Cancelled
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
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
                  {currentAppointments.length > 0 ? (
                    currentAppointments.map((booking) => (
                      <tr
                        key={booking._id}
                        className="border-b hover:bg-gray-100 transition"
                      >
                        <td className="py-3 px-4">{booking.patientName}</td>
                        <td className="py-3 px-4">
                          {booking.patientId || "Not Available"}
                        </td>
                        <td className="py-3 px-4">{booking.doctorId}</td>
                        <td className="py-3 px-4">{booking.date}</td>
                        <td className="py-3 px-4">{booking.time}</td>
                        <td className="py-3 px-4">
                          <select
                            value={booking.status}
                            onChange={(e) =>
                              handleStatusChange(booking._id, e.target.value)
                            }
                            className={`px-2 py-1 rounded text-sm font-medium border ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : booking.status === "visited"
                                ? "bg-purple-100 text-purple-800 border-purple-200"
                                : booking.status === "cancelled"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-gray-100 text-gray-800 border-gray-200"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="visited">Visited</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-8 text-center text-gray-500"
                      >
                        {searchTerm
                          ? "No matching appointments found."
                          : "No appointments available."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredAppointments.length > 0 && (
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {indexOfFirstAppointment + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {indexOfLastAppointment > filteredAppointments.length
                          ? filteredAppointments.length
                          : indexOfLastAppointment}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {filteredAppointments.length}
                      </span>{" "}
                      appointments
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() =>
                          paginate(currentPage > 1 ? currentPage - 1 : 1)
                        }
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        &laquo; Previous
                      </button>

                      {Array.from({
                        length: Math.ceil(
                          filteredAppointments.length / appointmentsPerPage
                        ),
                      }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => paginate(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                            currentPage === index + 1
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          paginate(
                            currentPage <
                              Math.ceil(
                                filteredAppointments.length /
                                  appointmentsPerPage
                              )
                              ? currentPage + 1
                              : currentPage
                          )
                        }
                        disabled={
                          currentPage >=
                          Math.ceil(
                            filteredAppointments.length / appointmentsPerPage
                          )
                        }
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage >=
                          Math.ceil(
                            filteredAppointments.length / appointmentsPerPage
                          )
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-500 hover:bg-gray-50"
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
        </>
      )}
    </div>
  );
};

export default NewAppoinment;
