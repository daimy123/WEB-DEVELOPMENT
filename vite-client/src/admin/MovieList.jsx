import React from "react";

const MovieList = () => {
  // Dummy data for demonstration
  const movies = [
    { id: 1, title: "Avengers: Endgame", price: 250 },
    { id: 2, title: "The Batman", price: 280 },
  ];

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Movie List</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td className="border px-4 py-2">{movie.title}</td>
              <td className="border px-4 py-2">₹{movie.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovieList;
