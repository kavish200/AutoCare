import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

const VerifyEmail = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [email, setEmail] = useState(location.state?.email || "")
    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            const response = await api.post("/auth/verifyEmail", {
                email: email.trim().toLowerCase(),
                otp: otp.trim()
            })

            alert(response.data.message)
            navigate("/login")

        } catch (error) {
            console.error("OTP verification error:", error)
            alert(error.response?.data?.message || "Verification failed")
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
                        Verify Your Email
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Enter the OTP sent to your registered email.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    />

                    <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        pattern="[0-9]{6}"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>

                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already verified?
                    <Link to="/login" className="ml-1 font-semibold text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default VerifyEmail
