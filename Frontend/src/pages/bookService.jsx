import { useEffect, useState } from "react";
import api from "../services/api";

const BookService = () => {
    const [vehicles, setVehicles] = useState([]);
    const [garages, setGarages] = useState([]);

    const [selectedVehicle, setSelectedVehicle] = useState("");
    const [selectedGarage, setSelectedGarage] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState("");

    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleBooking = async () => {
    if (!selectedVehicle || !selectedGarage || !selectedService) {
        alert("Please select vehicle, garage and service.");
        return;
    }

    if (!appointmentDate || !appointmentTime) {
        alert("Please select appointment date and time.");
        return;
    }

    const selectedDateTime = new Date(
        `${appointmentDate}T${appointmentTime}`
    );

    if (selectedDateTime <= new Date()) {
        alert("Please select a future date and time.");
        return;
    }

    try {
        setSubmitting(true);

        const token = localStorage.getItem("accessToken");

        const response = await api.post(
            "/booking/createBooking",
            {
                vehicle: selectedVehicle,
                garage: selectedGarage,
                service: selectedService,
                appointmentDate: selectedDateTime.toISOString()
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        alert(response.data.message);

        setAppointmentDate("");
        setAppointmentTime("");

    } catch (err) {
        console.error("Booking error:", err);

        alert(
            err.response?.data?.message ||
            "Unable to create booking."
        );
    } finally {
        setSubmitting(false);
    }
};

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("accessToken");

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const [vehicleResponse, garageResponse] =
                    await Promise.all([
                        api.get("/vehicle/getVehicles", config),
                        api.get("/garage/getAllGarages", config)
                    ]);

                setVehicles(vehicleResponse.data.vehicles);
                setGarages(garageResponse.data.garages);

            } catch (err) {
                console.error("Error fetching booking data:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load vehicles and garages."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
    const fetchServices = async () => {
        if (!selectedGarage) {
            setServices([]);
            setSelectedService("");
            return;
        }

        try {
            const token = localStorage.getItem("accessToken");

            const response = await api.get(
                `/service/getServicesByGarage/${selectedGarage}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setServices(response.data.services);
            setSelectedService("");

        } catch (err) {
            console.error("Error fetching services:", err);
            setServices([]);
            setSelectedService("");
        }
    };

    fetchServices();
}, [selectedGarage]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading booking details...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">

            <h1 className="text-3xl font-bold mb-2">
                Book a Service
            </h1>

            <p className="text-slate-400 mb-8">
                Select your vehicle and preferred garage.
            </p>

            {error && (
                <p className="text-red-400 mb-4">{error}</p>
            )}

            <div className="max-w-xl space-y-6">

                {/* Vehicle Selection */}
                <div>
                    <label className="block mb-2 font-medium">
                        Select Your Vehicle
                    </label>

                    <select
                        value={selectedVehicle}
                        onChange={(e) =>
                            setSelectedVehicle(e.target.value)
                        }
                        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
                    >
                        <option value="">Choose a vehicle</option>

                        {vehicles.map((vehicle) => (
                            <option
                                key={vehicle._id}
                                value={vehicle._id}
                            >
                                {vehicle.brand} {vehicle.model}
                                {" - "}
                                {vehicle.registrationNumber}
                            </option>
                        ))}
                    </select>

                    {vehicles.length === 0 && (
                        <p className="text-yellow-400 text-sm mt-2">
                            You haven't registered any vehicles yet.
                        </p>
                    )}
                </div>

                {/* Garage Selection */}
                <div>
                    <label className="block mb-2 font-medium">
                        Select Garage
                    </label>

                    <select
                        value={selectedGarage}
                        onChange={(e) =>
                            setSelectedGarage(e.target.value)
                        }
                        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
                    >
                        <option value="">Choose a garage</option>

                        {garages.map((garage) => (
                            <option
                                key={garage._id}
                                value={garage._id}
                            >
                                {garage.name}
                            </option>
                        ))}
                    </select>

                    {garages.length === 0 && (
                        <p className="text-yellow-400 text-sm mt-2">
                            No garages are currently available.
                        </p>
                    )}
                </div>

                {/* Service Selection */}
<div>
    <label className="block mb-2 font-medium">
        Select Service
    </label>

    <select
        value={selectedService}
        onChange={(e) => setSelectedService(e.target.value)}
        disabled={!selectedGarage}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 disabled:opacity-50"
    >
        <option value="">Choose a service</option>

        {services.map((service) => (
            <option key={service._id} value={service._id}>
                {service.name} - ₹{service.price}
            </option>
        ))}
    </select>

    {selectedGarage && services.length === 0 && (
        <p className="text-yellow-400 text-sm mt-2">
            No services available for this garage.
        </p>
    )}
</div>

{/* Appointment Date */}
<div>
    <label className="block mb-2 font-medium">
        Appointment Date
    </label>

    <input
        type="date"
        min={new Date().getFullYear() + "-" +
            String(new Date().getMonth() + 1).padStart(2, "0") + "-" +
            String(new Date().getDate()).padStart(2, "0")}
        value={appointmentDate}
        onChange={(e) => setAppointmentDate(e.target.value)}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
    />
</div>

{/* Appointment Time */}
<div>
    <label className="block mb-2 font-medium">
        Appointment Time
    </label>

    <input
        type="time"
        value={appointmentTime}
        onChange={(e) => setAppointmentTime(e.target.value)}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
    />
</div>

{/* Confirm Booking */}
<button
    onClick={handleBooking}
    disabled={submitting}
    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 p-3 rounded-lg font-semibold"
>
    {submitting ? "Booking..." : "Confirm Booking"}
</button>

            </div>
        </div>
    );
};

export default BookService;
