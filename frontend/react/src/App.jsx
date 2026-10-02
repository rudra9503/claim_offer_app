import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import OffersPage from './pages/OffersPage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function App() {
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/offers`)
      .then((res) => res.json())
      .then((data) => setOffers(data))
      .catch(() => setError('Could not reach the server'));
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/offers"
          element={
            <OffersPage
              offers={offers}
            />
          }
        />

        <Route
          path="/"
          element={<Navigate to="/offers" />}
        />

      </Routes>

      {error && <p>{error}</p>}
    </BrowserRouter>
  );
}

export default App;