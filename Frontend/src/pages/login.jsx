
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../services/api'

const Login = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const response = await api.post("/auth/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      })

      const { accessToken, user } = response.data

      // Store access token
      localStorage.setItem("accessToken", accessToken)

      // Clear login form
      setFormData({
        email: "",
        password: ""
      })

      alert("Login successful!")

      // Redirect according to user role
      if (user.role === "customer") {
        navigate("/customer/dashboard")
      } 
      else if (user.role === "garageManager") {
        navigate("/garage/dashboard")
      } 
      else if (user.role === "admin") {
        navigate("/admin/dashboard")
      }

    } catch (error) {
      console.error("Login error:", error)

      alert(
        error.response?.data?.message ||
        "Login failed. Please try again."
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-10">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">
            AutoCare
          </h1>

          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            Welcome Back!
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Login to manage your vehicle services.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <Link
            to="/signup"
            className="ml-1 font-semibold text-blue-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login
