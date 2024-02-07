import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
             <Home/>
            }
          />
          <Route path="/search" element={<h1>Search page</h1>} />
          <Route path="*" element={<Navigate to="/"/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
