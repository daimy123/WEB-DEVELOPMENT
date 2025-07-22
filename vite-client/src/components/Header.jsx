import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ activeGenre, onGenreChange, isLoggedIn, isAdmin, username }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Predefined genre filters
  const genreFilters = [
    { name: 'All', id: 'all' },
    { name: 'Action', id: 28 },
    { name: 'Adventure', id: 12 },
    { name: 'Animation', id: 16 },
    { name: 'Comedy', id: 35 },
    { name: 'Crime', id: 80 },
    { name: 'Drama', id: 18 },
    { name: 'Family', id: 10751 },
    { name: 'Fantasy', id: 14 },
    { name: 'Science Fiction', id: 878 }
  ];

  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold">Dymie</h1>
          <p className="text-gray-600">Your film discovery platform</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search films..."
              className="pl-10 pr-4 py-2 border rounded-full w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium hidden md:inline">Welcome, {username}</span>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="px-4 py-1.5 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
                  >
                    Admin
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="px-4 py-1.5 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="px-4 py-1.5 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Genre filters */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">All Films</h2>
        <div className="flex flex-wrap gap-2">
          {genreFilters.map((genre) => (
            <button
              key={genre.id}
              onClick={() => onGenreChange(genre.name)}
              className={`px-4 py-2 rounded-full text-sm ${
                activeGenre === genre.name
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
