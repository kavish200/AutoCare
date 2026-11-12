import { useState } from 'react'
import api from "../services/api";
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: ""
  })

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  // Handle form submission

const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
        alert("Password must contain at least 6 characters");
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        alert("Password and Confirm Password do not match");
        return;
    }

    try {
        const response = await api.post("/auth/register", {
            username: formData.username,
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            phone: Number(formData.phone),
            role: formData.role
        });

        alert(response.data.message);

        navigate("/verify-email", {
            state: {
                email: formData.email.trim().toLowerCase()
            }
        });

    } catch (error) {
        console.error("Signup error:", error);

        alert(
            error.response?.data?.message ||
            "Registration failed. Please try again."
        );
    }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-10">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">
            AutoCare
          </h1>

          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            Create Account
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Join AutoCare and take care of your vehicle.
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="username"
            placeholder="Full Name"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />

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
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
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

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-600 outline-none focus:border-blue-500"
          >
            <option value="" disabled>Select Your Role</option>
            <option value="customer">Customer</option>
            <option value="garageManager">Garage Manager</option>
          </select>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Create Account
          </button>

        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <Link
            to="/login"
            className="ml-1 font-semibold text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Signup
