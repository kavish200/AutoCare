
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("accessToken");

                const response = await api.get("/auth/getMe", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(response.data.user);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-600">
            Loading profile...
        </div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-600">
            {error}
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-3xl mx-auto">

                <Link
                    to="/customer/dashboard"
                    className="text-blue-600 hover:underline"
                >
                    ← Back to Dashboard
                </Link>

                <div className="bg-white rounded-xl shadow-md mt-6 p-8">

                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold">
                            {user.username.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                My Profile
                            </h1>
                            <p className="text-gray-500">
                                Manage your personal information
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">

                        <div>
                            <p className="text-sm text-gray-500">Username</p>
                            <p className="font-semibold text-gray-800 mt-1">
                                {user.username}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <p className="font-semibold text-gray-800 mt-1">
                                {user.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="font-semibold text-gray-800 mt-1">
                                {user.phone}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Account Role</p>
                            <p className="font-semibold text-gray-800 mt-1 capitalize">
                                {user.role}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Email Verification</p>
                            <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                                {user.verified ? "Verified" : "Not Verified"}
                            </span>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
