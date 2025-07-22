import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserList from "./UserList";

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all bookings for admin
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser && currentUser.role === "admin") {
      fetchBookings();
    }
  }, [currentUser]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-4">
        Welcome, Admin! Here you can manage users and bookings.
      </p>

      {/* User Management Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">User Management</h2>
        <UserList />
      </div>

      {/* Booking Management Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">All Bookings</h2>
        {loading && <div>Loading bookings...</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {!loading && bookings.length === 0 && <div>No bookings found.</div>}
        {!loading && bookings.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border mb-6">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Movie</th>
                  <th className="border px-4 py-2">Customer</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Seats</th>
                  <th className="border px-4 py-2">Amount</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td className="border px-4 py-2">{b.movieTitle}</td>
                    <td className="border px-4 py-2">{b.customerName}</td>
                    <td className="border px-4 py-2">{b.userEmail}</td>
                    <td className="border px-4 py-2">{b.seats}</td>
                    <td className="border px-4 py-2">₹{b.totalAmount}</td>
                    <td className="border px-4 py-2">{b.status}</td>
                    <td className="border px-4 py-2">
                      {new Date(b.bookingDate).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
