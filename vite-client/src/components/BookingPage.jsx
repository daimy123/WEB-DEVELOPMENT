import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TMDB_IMAGE_BASE_URL, TMDB_API_KEY } from "../api/config";

const BookingPage = () => {
  const { filmId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Initialize state with film data from navigation
  const [film, setFilm] = useState(location.state?.filmData || null);
  const [loading, setLoading] = useState(!location.state?.filmData);
  const [error, setError] = useState(null);
  const [seats, setSeats] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [customerName, setCustomerName] = useState(currentUser?.username || "");

  // Fallback: fetch only if direct URL navigation (no state)
  useEffect(() => {
    if (!location.state?.filmData) {
      fetch(`https://api.themoviedb.org/3/movie/${filmId}?api_key=${TMDB_API_KEY}&language=en-US`)
        .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch film"))
        .then(data => setFilm({ ...data, price: 12.99, availableSeats: 50 }))
        .catch(err => setError(err))
        .finally(() => setLoading(false));
    }
  }, [filmId, location.state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    
    // Get user data and create booking in background
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        externalMovieId: filmId,
        movieTitle: film.title,
        moviePoster: film.poster_path,
        customerName,
        userId: userData?._id || userData?.id,
        userEmail: userData?.email,
        seats: parseInt(seats),
        totalAmount: parseFloat((film.price * seats).toFixed(2)),
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
      })
    }).catch(() => {});
  };

  // Loading and error states
  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><div className="text-xl">Loading film details...</div></div>;
  
  if (error || !film) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error || "Film not found"}</div>
        <button onClick={() => navigate("/home")} className="px-4 py-2 bg-gray-800 text-white rounded-md">Back to Films</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {bookingSuccess ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
          <p className="text-xl font-bold mb-2">Booking Successful!</p>
          <p>You have booked {seats} ticket(s) for {film.title}.</p>
          <div className="mt-6">
            <button 
              onClick={() => navigate('/home')} 
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
            >
              OK
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Film Image */}
          <div className="w-full md:w-1/3">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={`${TMDB_IMAGE_BASE_URL}/w500${film.poster_path}` || "https://via.placeholder.com/500x750"}
                alt={film.title}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Film Details */}
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-4">{film.title}</h1>
            <p className="text-gray-700 mb-6">{film.overview}</p>

            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Price per ticket:</span>
                <span className="font-bold">${film.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Available seats:</span>
                <span className="font-bold">{film.availableSeats}</span>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold mb-4">Book Tickets</h2>

              <div className="mb-4">
                <label
                  htmlFor="customerName"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="seats"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Number of Seats
                </label>
                <select
                  id="seats"
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {[...Array(Math.min(10, film.availableSeats)).keys()].map(
                    (num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1} {num === 0 ? "seat" : "seats"} ($
                        {(num + 1) * film.price})
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => navigate("/home")}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Book Now - ${seats * film.price}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
