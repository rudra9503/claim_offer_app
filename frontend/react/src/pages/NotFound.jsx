import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="mx-auto max-w-md p-8 text-center">
      <h2 className="mb-2 text-3xl font-bold">404</h2>
      <p className="mb-4 text-gray-600">This page doesn't exist.</p>
      <Link to="/offers" className="text-blue-600 hover:underline">
        Back to offers
      </Link>
    </div>
  );
}

export default NotFound;