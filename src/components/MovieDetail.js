import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../firebase'; // Import your Firebase Realtime Database instance
import Footer from './Footer';
import Navbar from './Navbar';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetchMovie();
    const interval = setInterval(changeImage, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, [id]);

  const fetchMovie = () => {
    const movieRef = database.ref(`movies/${id}`);
    movieRef.once('value', (snapshot) => {
      const movieData = snapshot.val();
      if (movieData) {
        setMovie(movieData);
      }
    });
  };

  const changeImage = () => {
    if (movie && movie.display_image && movie.display_image.length > 1) {
      const activeIndex = document.querySelector('.carousel-item.active').dataset.index;
      const nextIndex = (parseInt(activeIndex) + 1) % movie.display_image.length;
      document.querySelector(`.carousel-item[data-index='${activeIndex}']`).classList.remove('active');
      document.querySelector(`.carousel-item[data-index='${nextIndex}']`).classList.add('active');
    }
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
      <h2>{movie.name}</h2>
      <div className="row">
        <div className="col-md-6">
          {movie.display_image && movie.display_image.length > 0 ? (
            <div id="carouselExampleIndicators" className="carousel slide">
              <div className="carousel-inner">
                {movie.display_image.map((image, index) => (
                  <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index} data-index={index}>
                    <img src={image} className="d-block w-100" alt={`Slide ${index + 1}`} />
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          ) : (
            <p>No display images available</p>
          )}
        </div>
        <div className="col-md-6">
          <p><strong>Director:</strong> {movie.director}</p>
          <p><strong>Genre:</strong> {movie.genre}</p>
          <p><strong>Released Date:</strong> {movie.released_date}</p>
          {/* Add more details as needed */}
        </div>
      </div>
    </div>
      <Footer />
    </div>
  );
};

export default MovieDetail;
