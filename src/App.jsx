import React, { useContext } from 'react'
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import Login from './pages/Login';
import NewAppoinment from './pages/Admin/NewAppoinment';
import AddDoctorsNew from './pages/Admin/AddDoctorsNew';
import DoctorsListNew from './pages/Admin/DoctorsListNew';
import DoctorManagement from './components/DoctorManagement';
import BookingsView from './components/BookingsView';
import CreateVisitMemo from "./pages/Admin/CreateVisitMemo";
import VisitMemo from './pages/Admin/VisitMemo';

const App = () => {
  const { aToken } = useContext(AdminContext)

  return aToken ? (
    <div className='min-h-screen bg-gray-50'>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className='flex flex-col h-screen'>
        <Navbar />
        <div className='flex flex-1 overflow-hidden'>
          <Sidebar />
          <main className='flex-1 overflow-y-auto p-6 bg-gray-50'>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/admin-dashboard' element={<Dashboard />} />
              <Route path='/new-appoinment' element={<NewAppoinment />} />
              <Route path='/new-doctors' element={<AddDoctorsNew />} />
              <Route path='/new-doctorslist' element={<DoctorsListNew />} />
              <Route path='/doctor-management' element={<DoctorManagement />} />
              <Route path='/bookings-view' element={<BookingsView />} />
              {/* Add this route in the Admin routes section */}
              <Route path="/create-visit-memo" element={<CreateVisitMemo />} />
              <Route path="/visit-memo" element={<VisitMemo />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  ) : (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Login />
    </div>
  )
}

export default App