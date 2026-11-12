import { Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/signup'
import Login from './pages/login'
import VerifyEmail from './pages/verifyEmail'
import CustomerDashboard from './pages/customerDashboard'
import BookService from './pages/bookService'
import MyBookings from './pages/myBookings'
import MyVehicles from './pages/myVehicles'
import Profile from "./pages/profile";

const DashboardPlaceholder = ({ title }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  )
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" />} />

      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route
    path="/customer/dashboard"
    element={<CustomerDashboard />}
/>

      <Route
        path="/garage/dashboard"
        element={<DashboardPlaceholder title="Garage Manager Dashboard" />}
      />

      <Route
        path="/admin/dashboard"
        element={<DashboardPlaceholder title="Admin Dashboard" />}
      />

      <Route 
        path="/verify-email" 
        element={<VerifyEmail />} 
      />

      <Route 
        path="/customer/book-service" 
        element={<BookService />} 
      />

      <Route
        path="/customer/my-bookings"
        element={<MyBookings />}
      />

      <Route
        path="/customer/my-vehicles"
        element={<MyVehicles />}  
      />


      <Route 
        path="/customer/profile" 
        element={<Profile />} 
      />

    </Routes>
  )
}

export default App
