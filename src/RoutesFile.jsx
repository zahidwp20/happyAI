import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import MainPage from './components/MainPage'
function RoutesFile() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>

          <Route path="/" element={<MainPage />} />
          {/* <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} /> */}
        </Routes>
      </Router>


    </>
  )
}

export default RoutesFile
