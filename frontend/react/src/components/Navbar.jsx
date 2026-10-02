import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/offers");
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 p-4">
        <Link to="/offers" className="text-xl font-bold text-blue-600">
          GOLO Offers
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {isLoggedIn ? (
            <>
              <Link to="/my-claims" className="hover:underline">My Claims</Link>
              <span className="text-gray-500">Hi, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link
                to="/register"
                className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;