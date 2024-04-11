import React from 'react';
import p1 from "./image1.png"
import Footer from './Footer';
import Navbar from './Navbar';

const Homepage = () => {
  return (
    <>
    <Navbar />
    <div className="container">
      <img src={p1} alt="Homepage Image" className="img-fluid" />
    </div>
    <Footer />
    </>
  );
};

export default Homepage;
