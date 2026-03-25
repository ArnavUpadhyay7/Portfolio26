import './App.css'
import { Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
import RingCursor from './components/RingCursor';

function App() {

  return (
    <>
      <RingCursor />
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </>
  )
}

export default App
