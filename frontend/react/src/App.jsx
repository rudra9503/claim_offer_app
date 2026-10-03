import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import OfferList from "./pages/OffersList";
import OfferDetails from "./pages/OfferDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyClaims from "./pages/MyClaims";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/my-claims" element={<MyClaims />} />
          <Route path="/offers" element={<OfferList />} />
          <Route path="/offers/:id" element={<OfferDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/offers" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;