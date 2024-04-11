import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MovieCRUD from './components/MovieCRUD';
import MoviesPage from './components/MoviesPage';
import MovieDetail from './components/MovieDetail';
import Homepage from './components/Homepage';
import SignUpPage from './components/SignUpPage';
import LoginPage from './components/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/crud" element={<MovieCRUD />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route exact path="/movies/:id" element={<MovieDetail/>} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
