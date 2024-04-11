import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { database, storage } from '../firebase'; // Import Realtime Database and Storage from firebase.js

const MovieCRUD = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [newMovie, setNewMovie] = useState({
    name: '',
    director: '',
    genre: '',
    released_date: '',
    main_image: '',
    display_image: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    director: '',
    genre: '',
    released_date: '',
    main_image: '',
    display_image: '',
  });

  useEffect(() => {
    fetchMovies();
  }, []); // Fetch movies on component mount

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie({ ...newMovie, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error when input changes
  };

  const handleImageChange = (e, imageType) => {
    const files = e.target.files;
    const promises = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRef = storage.ref(`movie-images/${file.name}`);
  
      // Upload file to Firebase Storage and get download URL
      const uploadTask = storageRef.put(file);
      const promise = new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            reject(error);
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
      promises.push(promise);
    }
  
    // After all uploads are completed, update newMovie with image URLs
    Promise.all(promises)
      .then((downloadURLs) => {
        if (imageType === 'main') {
          setNewMovie({ ...newMovie, main_image: downloadURLs });
        } else if (imageType === 'display') {
          setNewMovie({ ...newMovie, display_image: downloadURLs });
        }
      })
      .catch((error) => {
        console.error('Error uploading images:', error);
      });
  };
  
  

  const addMovie = (e) => {
    e.preventDefault();
  
    // Validate form inputs
    const { name, director, genre, released_date, main_image, display_image } = newMovie;
    let formIsValid = true;
    const newErrors = { name: '', director: '', genre: '', released_date: '', main_image: '', display_image: '' };
  
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      formIsValid = false;
    }
  
    if (!director.trim()) {
      newErrors.director = 'Director is required';
      formIsValid = false;
    }
  
    if (!genre.trim()) {
      newErrors.genre = 'Genre is required';
      formIsValid = false;
    }
  
    if (!released_date) {
      newErrors.released_date = 'Released date is required';
      formIsValid = false;
    }
  
    if (!main_image) {
      newErrors.main_image = 'Main image is required';
      formIsValid = false;
    }
  
    if (!display_image) {
      newErrors.display_image = 'Display image is required';
      formIsValid = false;
    }
  
    if (!formIsValid) {
      setErrors(newErrors);
      return;
    }
  
    // Add movie to the Realtime Database if form is valid
    const moviesRef = database.ref('movies');
    const newMovieRef = moviesRef.push();
    newMovieRef
      .set(newMovie)
      .then(() => {
        alert('Movie added successfully!');
        setNewMovie({
          name: '',
          director: '',
          genre: '',
          released_date: '',
          main_image: '',
          display_image: '',
        });
        document.getElementById('mainImage').value = ''; // Reset main image input field
        document.getElementById('displayImage').value = ''; // Reset display image input field
      })
      .catch((error) => {
        console.error('Error adding movie:', error);
        alert('Error adding movie. Please try again.');
      });
  };
  

  // Function to update a movie
const updateMovie = (movieId) => {
    const movieToUpdate = movies.find((movie) => movie.movie_id === movieId);
    if (movieToUpdate) {
      setSelectedMovie(movieToUpdate);
      setNewMovie({ ...movieToUpdate });
    }
  };
  
  // Function to save updated movie data
  const saveUpdatedMovie = () => {
    // Validate form inputs
    const { name, director, genre, released_date, main_image, display_image } = newMovie;
    let formIsValid = true;
    const newErrors = { name: '', director: '', genre: '', released_date: '', main_image: '', display_image: '' };
  
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      formIsValid = false;
    }
  
    if (!director.trim()) {
      newErrors.director = 'Director is required';
      formIsValid = false;
    }
  
    if (!genre.trim()) {
      newErrors.genre = 'Genre is required';
      formIsValid = false;
    }
  
    if (!released_date) {
      newErrors.released_date = 'Released date is required';
      formIsValid = false;
    }
  
    if (!main_image) {
      newErrors.main_image = 'Main image is required';
      formIsValid = false;
    }
  
    if (!display_image.length) {
      newErrors.display_image = 'Display image(s) are required';
      formIsValid = false;
    }
  
    if (!formIsValid) {
      setErrors(newErrors);
      return;
    }
  
    if (selectedMovie) {
      const movieRef = database.ref(`movies/${selectedMovie.movie_id}`);
      movieRef
        .update(newMovie)
        .then(() => {
          alert('Movie updated successfully!');
          setSelectedMovie(null);
          setNewMovie({
            name: '',
            director: '',
            genre: '',
            released_date: '',
            main_image: '',
            display_image: [],
          });
          document.getElementById('mainImage').value = ''; // Reset main image input field
          document.getElementById('displayImage').value = ''; // Reset display image input field
          fetchMovies(); // Fetch updated movie list
        })
        .catch((error) => {
          console.error('Error updating movie:', error);
          alert('Error updating movie. Please try again.');
        });
    }
  };
  

  const deleteMovie = (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      const movieRef = database.ref(`movies/${movieId}`);
      movieRef
        .remove()
        .then(() => {
          alert('Movie deleted successfully!');
          fetchMovies(); // Fetch updated movie list
        })
        .catch((error) => {
          console.error('Error deleting movie:', error);
          alert('Error deleting movie. Please try again.');
        });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <h2>Add Movie</h2>
            {/* Add movie form */}
            <form onSubmit={addMovie}>
              {/* Name */}
              <div className="mb-3">
                <label htmlFor="movieName" className="form-label">Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="movieName"
                  name="name"
                  value={newMovie.name}
                  onChange={handleInputChange}
                  required
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              {/* Director */}
              <div className="mb-3">
                <label htmlFor="movieDirector" className="form-label">Director:</label>
                <input
                  type="text"
                  className="form-control"
                  id="movieDirector"
                  name="director"
                  value={newMovie.director}
                  onChange={handleInputChange}
                  required
                />
                {errors.director && <div className="invalid-feedback">{errors.director}</div>}
              </div>

              {/* Genre */}
              <div className="mb-3">
                <label htmlFor="movieGenre" className="form-label">Genre:</label>
                <input
                  type="text"
                  className="form-control"
                  id="movieGenre"
                  name="genre"
                  value={newMovie.genre}
                  onChange={handleInputChange}
                  required
                />
                {errors.genre && <div className="invalid-feedback">{errors.genre}</div>}
              </div>

              {/* Released Date */}
              <div className="mb-3">
                <label htmlFor="movieReleasedDate" className="form-label">Released Date:</label>
                <input
                  type="date"
                  className="form-control"
                  id="movieReleasedDate"
                  name="released_date"
                  value={newMovie.released_date}
                  onChange={handleInputChange}
                  required
                />
                {errors.released_date && <div className="invalid-feedback">{errors.released_date}</div>}
              </div>

              {/* Main Image */}
            <div className="mb-3">
            <label htmlFor="mainImage" className="form-label">Main Image:</label>
            <input
                type="file"
                className="form-control"
                id="mainImage"
                name="main_image"
                onChange={(e) => handleImageChange(e, 'main')}
                accept="image/*"
                required
            />
            {errors.main_image && <div className="invalid-feedback">{errors.main_image}</div>}
            </div>

            {/* Display Image */}
            <div className="mb-3">
            <label htmlFor="displayImage" className="form-label">Display Image:</label>
            <input
                type="file"
                className="form-control"
                id="displayImage"
                name="display_image"
                onChange={(e) => handleImageChange(e, 'display')}
                accept="image/*"
                multiple  // Allow multiple files to be selected
                required
            />
            {errors.display_image && <div className="invalid-feedback">{errors.display_image}</div>}
            </div>


              {/* Submit Button */}
              <button type="submit" className="btn btn-primary">Add Movie</button>
            </form>
            {selectedMovie && (
              <div>
                <button type="button" className="btn btn-success mt-3" onClick={saveUpdatedMovie}>Update Movie</button>
              </div>
            )}
          </div>
          <div className="col-md-6">
            <h2>Movies</h2>
            <table className="table">
              {/* Your table header */}
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie.movie_id}>
                    <td>{movie.name}</td>
                    <td>{movie.director}</td>
                    <td>{movie.genre}</td>
                    <td>{movie.released_date}</td>
                    <td>
                      <button className="btn btn-primary" onClick={() => updateMovie(movie.movie_id)}>Edit</button>
                      <button className="btn btn-danger ml-2" onClick={() => deleteMovie(movie.movie_id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MovieCRUD;
