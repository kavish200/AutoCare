import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../services/api'

const CustomerDashboard = () => {
    const [bookings, setBookings] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem("accessToken")

            const response = await api.get("/booking/myBookings", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setBookings(response.data.bookings)
        } catch (err) {
            console.error("Dashboard booking error:", err)
        } finally {
            setLoading(false)
        }
    }

    fetchBookings()
}, [])

const totalBookings = bookings.length

const pendingBookings = bookings.filter(
    booking => booking.status === "BOOKED"
).length

const completedBookings = bookings.filter(
    booking => booking.status === "COMPLETED"
).length

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Navbar */}
            <nav className="bg-slate-950 px-6 py-4 text-white flex items-center justify-between">
                <h1 className="text-2xl font-bold text-blue-400">
                    AutoCare
                </h1>

                <div className="flex items-center gap-6">
                    <span className="text-sm">Customer</span>

                    <Link
                        to="/login"
                        className="rounded-lg bg-red-500 px-4 py-2 text-sm hover:bg-red-600"
                    >
                        Logout
                    </Link>
                </div>
            </nav>

            <div className="flex">

                {/* Sidebar */}
                <aside className="hidden md:block w-64 min-h-screen bg-white shadow-md p-6">
                    <h2 className="mb-6 text-lg font-semibold text-gray-700">
                        Menu
                    </h2>

                    <div className="space-y-4">
                        <Link
                            to="/customer/dashboard"
                            className="block rounded-lg bg-blue-50 p-3 font-medium text-blue-600"
                        >
                            Dashboard
                        </Link>

                        <Link
    to="/customer/book-service"
    className="block w-full text-left"
>
    Book a Service
</Link>

                        <Link
    to="/customer/my-bookings"
    className="block w-full text-left"
>
    My Bookings
</Link>

                        <Link
    to="/customer/my-vehicles"
    className="..."
>
    My Vehicles
</Link>
                    </div>

<Link to="/customer/profile">My Profile</Link>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 md:p-10">

                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">
                                Welcome to AutoCare!
                            </h2>

                            <p className="mt-2 text-gray-500">
                                Manage your vehicle services from one place.
                            </p>
                        </div>

                        <Link
    to="/customer/book-service"
    className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
>
    + Book a Service
</Link>
                    </div>

                    {/* Statistics */}
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

    <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-gray-500">Total Bookings</p>
        <h3 className="mt-3 text-3xl font-bold text-gray-800">
            {loading ? "..." : totalBookings}
        </h3>
    </div>

    <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-gray-500">Pending Bookings</p>
        <h3 className="mt-3 text-3xl font-bold text-yellow-500">
            {loading ? "..." : pendingBookings}
        </h3>
    </div>

    <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-gray-500">Completed Services</p>
        <h3 className="mt-3 text-3xl font-bold text-green-600">
            {loading ? "..." : completedBookings}
        </h3>
    </div>

</div>

                    {/* Recent Bookings */}
<div className="mt-10 rounded-xl bg-white p-6 shadow-sm">

    <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">
            Recent Bookings
        </h3>

        <Link
            to="/customer/my-bookings"
            className="text-blue-600 hover:underline text-sm font-medium"
        >
            View All
        </Link>
    </div>

    {loading ? (
        <p className="py-8 text-center text-gray-500">
            Loading bookings...
        </p>
    ) : bookings.length === 0 ? (
        <div className="py-12 text-center">
            <p className="text-gray-500">
                You haven't booked any services yet.
            </p>

            <Link
                to="/customer/book-service"
                className="mt-4 inline-block font-semibold text-blue-600 hover:underline"
            >
                Book your first service
            </Link>
        </div>
    ) : (
        <div className="space-y-4">
            {bookings.slice(0, 3).map((booking) => (
                <div
                    key={booking._id}
                    className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4"
                >
                    <div>
                        <h4 className="font-semibold text-gray-800">
                            {booking.service?.name}
                        </h4>

                        <p className="text-sm text-gray-500">
                            {booking.garage?.name}
                        </p>

                        <p className="text-sm text-gray-500">
                            {booking.vehicle?.brand} {booking.vehicle?.model}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="font-semibold text-gray-800">
                            ₹{booking.service?.price}
                        </p>

                        <span className="text-sm text-gray-500">
                            {booking.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )}

</div>
                </main>
            </div>
        </div>
    )
}

export default CustomerDashboard
