import React from "react";
import UserList from "../admin/UserList";

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6">
        <p className="font-bold">Welcome, Admin!</p>
        <p>You are logged in as an administrator.</p>
      </div>
      <UserList />
    </div>
  );
};

export default AdminDashboard;
