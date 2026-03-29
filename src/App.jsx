import "./App.css";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import SmoothScroll from "./utils/SmoothScroll";
import Elevate from "./pages/Elevate";
import Zentra from "./pages/Zentra";
import Cursor from "./components/Cursor";
import { TransitionProvider } from "./components/PageTransition";

function App() {
  return (
    <SmoothScroll>
      <Cursor />
      <TransitionProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/elevate" element={<Elevate />} />
          <Route path="/zentra" element={<Zentra />} />
        </Routes>
      </TransitionProvider>
    </SmoothScroll>
  );
}

export default App;
