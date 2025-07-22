const config = {
  projectConfig: {
    apiKey: "b92bf73a0639add04a404ee8d14fa1e4" // Updated TMDB API key
  }
};

// Backend API Configuration
const API_BASE_URL = "http://localhost:5000";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const YOUTUBE_BASE_URL = "https://www.youtube.com/watch";

const TMDB_API_KEY = config.projectConfig.apiKey;

const ENDPOINTS = {
  NOW_PLAYING_MOVIES: "/movie/now_playing",
  UPCOMING_MOVIES: "/movie/upcoming",
  GENRES: "/genre/movie/list",
  MOVIE: "/movie",
};

const APPEND_TO_RESPONSE = {
  VIDEOS: "videos",
  CREDITS: "credits",
  RECOMMENDATIONS: "recommendations",
  SIMILAR: "similar",
};

export {
  API_BASE_URL,
  TMDB_BASE_URL,
  TMDB_API_KEY,
  TMDB_IMAGE_BASE_URL,
  ENDPOINTS,
  APPEND_TO_RESPONSE,
  YOUTUBE_BASE_URL,
};
