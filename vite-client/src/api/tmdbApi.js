import axios from 'axios';
import { 
  TMDB_BASE_URL, 
  TMDB_API_KEY, 
  ENDPOINTS, 
  APPEND_TO_RESPONSE 
} from './config';

const tmdbApi = {
  // Get now playing movies
  getNowPlayingMovies: async (page = 1) => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}${ENDPOINTS.NOW_PLAYING_MOVIES}?api_key=${TMDB_API_KEY}&page=${page}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting now playing movies:', error);
      throw error;
    }
  },

  // Get upcoming movies
  getUpcomingMovies: async (page = 1) => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}${ENDPOINTS.UPCOMING_MOVIES}?api_key=${TMDB_API_KEY}&page=${page}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting upcoming movies:', error);
      throw error;
    }
  },

  // Get movie details
  getMovieDetails: async (movieId) => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}${ENDPOINTS.MOVIE}/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=${APPEND_TO_RESPONSE.VIDEOS},${APPEND_TO_RESPONSE.CREDITS}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting movie details:', error);
      throw error;
    }
  },

  // Get movie genres
  getGenres: async () => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}${ENDPOINTS.GENRES}?api_key=${TMDB_API_KEY}`
      );
      return response.data.genres;
    } catch (error) {
      console.error('Error getting genres:', error);
      throw error;
    }
  }
};

export default tmdbApi;
