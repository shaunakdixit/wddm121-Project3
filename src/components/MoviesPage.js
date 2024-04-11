import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { database } from '../firebase'; // Import your Firebase Realtime Database instance
import Navbar from './Navbar';
import Footer from './Footer';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    const moviesRef = database.ref('movies');
    moviesRef.on('value', (snapshot) => {
      const moviesData = snapshot.val();
      if (moviesData) {
        const moviesList = Object.keys(moviesData).map((key) => ({
          ...moviesData[key],
          movie_id: key,
        }));
        setMovies(moviesList);
      }
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-3">Movies</h2>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by movie name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {filteredMovies.map((movie) => (
            <div key={movie.movie_id} className="col">
              <div className="card h-100">
                <img src={movie.main_image} className="card-img-top" alt={movie.name} />
                <div className="card-body">
                  <h5 className="card-title">{movie.name}</h5>
                  <Link to={`/movies/${movie.movie_id}`} className="btn btn-primary">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MoviesPage;
