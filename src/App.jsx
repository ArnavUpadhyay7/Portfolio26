import './App.css'
import { Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
import SmoothScroll from './utils/SmoothScroll';

function App() {

  return (
    <SmoothScroll>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </SmoothScroll>
  )
}

export default App
