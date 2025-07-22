import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const UserList = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    role: "user",
  });

  // Helper to fetch users
  const fetchUsers = () => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => setError("Failed to fetch users"));
  };

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      setError("Access denied: Admins only");
      return;
    }
    // Log for admin access
    console.log("Admin logged in:", currentUser.username);
    fetchUsers();
  }, [currentUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create user");
      setSuccess("User created successfully");
      fetchUsers();
      setForm({ username: "", email: "", password: "", role: "user" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Start editing a user
  const handleEdit = (user) => {
    setEditId(user._id);
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role,
    });
    setError("");
    setSuccess("");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditId(null);
    setEditForm({ username: "", email: "", role: "user" });
  };

  // Submit edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      if (res.status === 404) {
        setError(
          "User not found. It may have already been deleted. Please refresh the list."
        );
      } else if (!res.ok) {
        setError(data.message || "Failed to update user");
      } else {
        setSuccess("User updated successfully");
        fetchUsers();
        setEditId(null);
        setEditForm({ username: "", email: "", role: "user" });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });
      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      if (res.status === 404) {
        setError(
          "User not found. It may have already been deleted. Please refresh the list."
        );
      } else if (!res.ok) {
        setError(data.message || "Failed to delete user");
      } else {
        setSuccess("User deleted successfully");
        fetchUsers();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="text-red-600 font-bold mt-6">
        {error || "Access denied: Admins only"}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">User List</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <table className="min-w-full border mb-6">
        <thead>
          <tr>
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={user._id || idx}>
              {editId === user._id ? (
                <>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      name="username"
                      value={editForm.username}
                      onChange={handleEditChange}
                      className="border px-2 py-1"
                      required
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                      className="border px-2 py-1"
                      required
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <select
                      name="role"
                      value={editForm.role}
                      onChange={handleEditChange}
                      className="border px-2 py-1"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={handleEditSubmit}
                      className="bg-green-600 text-white px-2 py-1 rounded mr-2"
                      disabled={loading}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-400 text-white px-2 py-1 rounded"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border px-4 py-2">{user.username}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-lg font-semibold mb-2">Add New User</h3>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="border px-2 py-1 mr-2 mb-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border px-2 py-1 mr-2 mb-2"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border px-2 py-1 mr-2 mb-2"
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="border px-2 py-1 mr-2 mb-2"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-1 rounded disabled:bg-blue-300"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default UserList;
