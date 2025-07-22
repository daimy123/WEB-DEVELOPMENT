import React from "react";
import { useNavigate } from "react-router-dom";
import { TMDB_IMAGE_BASE_URL } from "../api/config";

const FilmCard = ({ film }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    // Add booking-specific properties before navigation
    const enhancedFilm = {
      ...film,
      price: 12.99,
      availableSeats: 50
    };
    
    navigate(`/booking/${film.id}`, { state: { filmData: enhancedFilm } });
  };
  // Generate star rating based on vote average (0-10 scale to 0-5 stars)
  const renderStars = () => {
    const starCount = Math.round(film.vote_average / 2);
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <span
          key={index}
          className={`text-xl ${
            index < starCount ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ));
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 duration-300 cursor-pointer">
      <div className="relative pb-[150%] overflow-hidden">
        {" "}
        {/* 2:3 aspect ratio */}
        <img
          src={`${TMDB_IMAGE_BASE_URL}/w500${film.poster_path}`}
          alt={film.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">
          {film.title}
        </h3>
        <div className="flex mb-2">{renderStars()}</div>
        <p className="text-gray-600 text-sm uppercase">{film.genre}</p>
      </div>
    </div>
  );
};

export default FilmCard;
