import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const MyVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingVehicleId, setEditingVehicleId] = useState(null);

    const [formData, setFormData] = useState({
        registrationNumber: "",
        brand: "",
        model: "",
        year: "",
        fuelType: ""
    });

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const token = localStorage.getItem("accessToken");

                const response = await api.get("/vehicle/getVehicles", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setVehicles(response.data.vehicles);
            } catch (err) {
                console.error("Error fetching vehicles:", err);
                setError(
                    err.response?.data?.message ||
                    "Unable to fetch vehicles."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    const handleEditVehicle = (vehicle) => {
    setEditingVehicleId(vehicle._id);

    setFormData({
        registrationNumber: vehicle.registrationNumber,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year || "",
        fuelType: vehicle.fuelType
    });

    setShowForm(true);
};

    const handleAddVehicle = async (e) => {
    e.preventDefault();

    try {
        const token = localStorage.getItem("accessToken");

        const vehicleData = {
            ...formData,
            year: formData.year ? Number(formData.year) : undefined
        };

        let response;

        if (editingVehicleId) {
            // Update existing vehicle
            response = await api.put(
                `/vehicle/updateVehicle/${editingVehicleId}`,
                vehicleData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const updatedVehicle =
                response.data.updatedVehicle || response.data.vehicle;

            setVehicles((prevVehicles) =>
                prevVehicles.map((vehicle) =>
                    vehicle._id === editingVehicleId
                        ? updatedVehicle
                        : vehicle
                )
            );

            alert("Vehicle updated successfully!");

        } else {
            // Add new vehicle
            response = await api.post(
                "/vehicle/createVehicle",
                vehicleData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setVehicles((prevVehicles) => [
                ...prevVehicles,
                response.data.vehicle
            ]);

            alert("Vehicle added successfully!");
        }

        setFormData({
            registrationNumber: "",
            brand: "",
            model: "",
            year: "",
            fuelType: ""
        });

        setEditingVehicleId(null);
        setShowForm(false);
        setError("");

    } catch (err) {
        console.error("Error saving vehicle:", err);

        setError(
            err.response?.data?.message ||
            "Unable to save vehicle."
        );
    }
};

const handleDeleteVehicle = async (vehicleId) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this vehicle?"
    );

    if (!confirmDelete) return;

    try {
        const token = localStorage.getItem("accessToken");

        await api.delete(
            `/vehicle/deleteVehicle/${vehicleId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setVehicles((prevVehicles) =>
            prevVehicles.filter(
                (vehicle) => vehicle._id !== vehicleId
            )
        );

        alert("Vehicle deleted successfully!");

    } catch (err) {
        console.error("Error deleting vehicle:", err);

        setError(
            err.response?.data?.message ||
            "Unable to delete vehicle."
        );
    }
};

    return (
        <div className="min-h-screen bg-slate-100 p-6 md:p-10">

            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        My Vehicles
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage your registered vehicles.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                    >
                        {showForm ? "Close Form" : "+ Add Vehicle"}
                    </button>

                    <Link
                        to="/customer/dashboard"
                        className="text-blue-600 hover:underline"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            {/* Add Vehicle Form */}
            {showForm && (
                <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-xl font-bold text-gray-800">
    {editingVehicleId ? "Edit Vehicle" : "Register a New Vehicle"}
</h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <input
                            type="text"
                            placeholder="Registration Number"
                            value={formData.registrationNumber}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    registrationNumber: e.target.value
                                })
                            }
                            className="rounded-lg border p-3 outline-none focus:border-blue-500"
                        />

                        <input
                            type="text"
                            placeholder="Brand (e.g. Hyundai)"
                            value={formData.brand}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    brand: e.target.value
                                })
                            }
                            className="rounded-lg border p-3 outline-none focus:border-blue-500"
                        />

                        <input
                            type="text"
                            placeholder="Model (e.g. Creta)"
                            value={formData.model}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    model: e.target.value
                                })
                            }
                            className="rounded-lg border p-3 outline-none focus:border-blue-500"
                        />

                        <input
                            type="number"
                            placeholder="Manufacturing Year"
                            value={formData.year}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    year: e.target.value
                                })
                            }
                            className="rounded-lg border p-3 outline-none focus:border-blue-500"
                        />

                        <select
                            value={formData.fuelType}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    fuelType: e.target.value
                                })
                            }
                            className="rounded-lg border p-3 outline-none focus:border-blue-500"
                        >
                            <option value="">Select Fuel Type</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="CNG">CNG</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>

                    </div>

                    <button
                        type="button"
                        onClick={handleAddVehicle}
                        className="mt-5 rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700"
                    >
                        {editingVehicleId ? "Update Vehicle" : "Add Vehicle"}
                    </button>
                </div>
            )}

            {/* Vehicle List */}
            {loading ? (
                <p className="text-center text-gray-500">
                    Loading vehicles...
                </p>
            ) : error ? (
                <p className="text-center text-red-500">
                    {error}
                </p>
            ) : vehicles.length === 0 ? (
                <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800">
                        No vehicles registered yet
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Add your first vehicle to get started.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {vehicles.map((vehicle) => (
                        <div
                            key={vehicle._id}
                            className="rounded-xl bg-white p-6 shadow-sm"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {vehicle.brand} {vehicle.model}
                                </h2>

                                <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700">
                                    {vehicle.fuelType}
                                </span>
                            </div>

                            <div className="space-y-2 text-gray-600">
                                <p>
                                    <strong>Registration:</strong>{" "}
                                    {vehicle.registrationNumber}
                                </p>

                                <p>
                                    <strong>Year:</strong>{" "}
                                    {vehicle.year || "Not specified"}
                                </p>
                            </div>

                            <div className="mt-5 flex gap-3">
   <div className="mt-5 flex gap-3">
    <button
        onClick={() => handleEditVehicle(vehicle)}
        className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
    >
        Edit
    </button>

    <button
        onClick={() => handleDeleteVehicle(vehicle._id)}
        className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
    >
        Delete
    </button>
</div>
</div>
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
};

export default MyVehicles;
