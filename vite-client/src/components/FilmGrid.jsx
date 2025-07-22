import React, { useState, useEffect } from "react";
import FilmCard from "./FilmCard";
import tmdbApi from "../api/tmdbApi";

const FilmGrid = ({ activeGenre, onGenreChange }) => {
  const [allFilms, setAllFilms] = useState([]);
  const [filteredFilms, setFilteredFilms] = useState([]);
  const [genres, setGenres] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch genres to map genre IDs to names
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await tmdbApi.getGenres();
        const genreMap = {};
        genreList.forEach((genre) => {
          genreMap[genre.id] = genre.name;
        });
        setGenres(genreMap);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  // Fetch films when genres are loaded or page changes
  useEffect(() => {
    // Only fetch if genres are loaded
    if (!Object.keys(genres).length) return;

    // Fetch and process films
    const fetchFilms = async () => {
      setLoading(true);
      try {
        const { results, total_pages } = await tmdbApi.getNowPlayingMovies(
          currentPage
        );

        // Add genre names to films using array destructuring and optional chaining
        const filmsWithGenres = results.map((film) => ({
          ...film,
          genre: genres[film.genre_ids?.[0]] || "Unknown",
          genreId: film.genre_ids?.[0],
        }));

        setAllFilms(filmsWithGenres);
        setFilteredFilms(filmsWithGenres);
        setTotalPages(Math.min(total_pages, 10)); // Limit to 10 pages max
      } catch (error) {
        console.error("Error fetching films:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, [currentPage, genres]);

  // Filter films when activeGenre changes
  useEffect(() => {
    if (activeGenre === "All") {
      setFilteredFilms(allFilms);
    } else {
      const filtered = allFilms.filter((film) => film.genre === activeGenre);
      setFilteredFilms(filtered);
    }
  }, [activeGenre, allFilms]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="mt-8">
      {loading ? (
        <div className="text-center py-12 text-gray-600">Loading...</div>
      ) : (
        <>
          {filteredFilms.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              No films found matching the selected filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
              {filteredFilms.map((film) => (
                <FilmCard key={film.id} film={film} />
              ))}
            </div>
          )}

          <div className="flex justify-center items-center gap-1 mt-8">
            <button
              className={`w-9 h-9 flex items-center justify-center rounded-full border ${
                currentPage === 1
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-200 hover:bg-gray-100"
              }`}
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              }
              disabled={currentPage === 1}
            >
              &lt;
            </button>

            {[...Array(totalPages).keys()].map((page) => (
              <button
                key={page + 1}
                className={`w-9 h-9 flex items-center justify-center rounded-full ${
                  currentPage === page + 1
                    ? "bg-gray-800 text-white"
                    : "border border-gray-200 hover:bg-gray-100"
                }`}
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </button>
            ))}

            <button
              className={`w-9 h-9 flex items-center justify-center rounded-full border ${
                currentPage === totalPages
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-200 hover:bg-gray-100"
              }`}
              onClick={() =>
                currentPage < totalPages && handlePageChange(currentPage + 1)
              }
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FilmGrid;
