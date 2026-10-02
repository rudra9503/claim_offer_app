import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import OfferList from "./pages/OffersList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/offers" element={<OfferList />} />
        <Route path="/" element={<Navigate to="/offers" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;