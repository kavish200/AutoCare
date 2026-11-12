import { useEffect, useState } from "react";
import api from "../services/api";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem("accessToken");

                const response = await api.get("/booking/myBookings", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setBookings(response.data.bookings);
            } catch (err) {
                console.error("Error fetching bookings:", err);
                setError(
                    err.response?.data?.message ||
                    "Unable to fetch bookings."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);


const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
        "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
        const token = localStorage.getItem("accessToken");

        await api.put(
            `/booking/cancelBooking/${bookingId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        // Update the booking status without refreshing the page
        setBookings((prevBookings) =>
            prevBookings.map((booking) =>
                booking._id === bookingId
                    ? { ...booking, status: "CANCELLED" }
                    : booking
            )
        );

        alert("Booking cancelled successfully!");

    } catch (err) {
        alert(
            err.response?.data?.message ||
            "Unable to cancel booking."
        );
    }
};

    if (loading) {
        return <p className="text-center mt-10">Loading bookings...</p>;
    }

    if (error) {
        return <p className="text-center mt-10 text-red-500">{error}</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">
                My Bookings
            </h1>

            {bookings.length === 0 ? (
                <p className="text-gray-600">
                    You haven't made any bookings yet.
                </p>
            ) : (
                <div className="grid gap-6">
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className="bg-white p-6 rounded-xl shadow-md"
                        >
                            <h2 className="text-xl font-semibold mb-4">
                                {booking.service?.name}
                            </h2>

                            <p>
                                <strong>Garage:</strong>{" "}
                                {booking.garage?.name}
                            </p>

                            <p>
                                <strong>Address:</strong>{" "}
                                {booking.garage?.address}
                            </p>

                            <p>
                                <strong>Vehicle:</strong>{" "}
                                {booking.vehicle?.brand}{" "}
                                {booking.vehicle?.model}
                            </p>

                            <p>
                                <strong>Registration:</strong>{" "}
                                {booking.vehicle?.registrationNumber}
                            </p>

                            <p>
                                <strong>Service Price:</strong>{" "}
                                ₹{booking.service?.price}
                            </p>

                            <p>
                                <strong>Appointment:</strong>{" "}
                                {new Date(
                                    booking.appointmentDate
                                ).toLocaleString("en-IN")}
                            </p>

                            <p className="mt-4 flex items-center gap-2">
    <strong>Status:</strong>

    <span
        className={`px-3 py-1 rounded-full text-sm font-semibold
            ${
                booking.status === "BOOKED"
                    ? "bg-blue-100 text-blue-700"
                    : booking.status === "CONFIRMED"
                    ? "bg-green-100 text-green-700"
                    : booking.status === "CANCELLED"
                    ? "bg-red-100 text-red-700"
                    : booking.status === "COMPLETED"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700"
            }`}
    >
        {booking.status}
    </span>
    {["BOOKED", "CONFIRMED"].includes(booking.status) && (
    <button
        onClick={() => handleCancelBooking(booking._id)}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
    >
        Cancel Booking
    </button>
)}
</p>


                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
