import axios from 'axios'
import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'
// Import necessary icons including eye icons
import { FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa'; 

const Login = () => {
  const [state, setState] = useState('Admin') 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true); 

    if (state === 'Admin') {
      try {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
        if (data.success) {
          setAToken(data.token)
          localStorage.setItem('aToken', data.token)
          toast.success("Login Successful!"); 
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        console.error("Login error:", error); 
        toast.error(error.response?.data?.message || "An error occurred during login.");
      } finally {
        setLoading(false); 
      }
    } else {
      setLoading(false);
    }
  }

  const siteLogo = 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Hinduja_Group_Logo.svg/1200px-Hinduja_Group_Logo.svg.png'; 

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4'>
       <img src={siteLogo} alt="Hinduja Logo" className="h-12 mb-8" /> 
      <form 
        onSubmit={onSubmitHandler} 
        className='w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-6 border border-gray-200'
      >
        <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>
          <span className='text-blue-600'>{state}</span> Login
        </h2>
        
        {/* Email Input */}
        <div className='relative'>
          <label 
            htmlFor="email" 
            className="absolute left-3 -top-2.5 text-xs text-gray-500 bg-white px-1 z-10" // Added z-10
          >
            Email Address
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              id="email"
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              className='w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200' 
              type="email" 
              placeholder="you@example.com"
              required 
              disabled={loading} 
            />
          </div>
        </div>

        {/* Password Input */}
        <div className='relative'>
           <label 
            htmlFor="password" 
            className="absolute left-3 -top-2.5 text-xs text-gray-500 bg-white px-1 z-10" // Added z-10
          >
            Password
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              id="password"
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
              // Toggle input type based on showPassword state
              className='w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200' 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              required 
              disabled={loading} 
            />
            {/* Show/Hide Password Toggle Button */}
            <button
              type="button" // Important: Prevent form submission
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={loading} 
          className={`w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </>
          ) : (
            <>
              <FaSignInAlt />
              Login
            </>
          )}
        </button>
        
      </form>
    </div>
  )
}

export default Login