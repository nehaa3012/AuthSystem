import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home({ setIsAuthenticated }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/user", {
          withCredentials: true,
        });
        console.log(response.data);
        setUser(response.data.userDetail);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/logout", {}, {
        withCredentials: true,
      });
      setIsAuthenticated(false);
      navigate("/register");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border border-gray-100 transition-transform hover:scale-[1.02] duration-300">
        <div className="flex flex-col items-center text-center">
          {/* Profile Icon */}
          <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-6 shadow-md">
            <span className="text-4xl font-bold text-indigo-600">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Welcome Text */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, <span className="text-indigo-600">{user.name}</span> 👋
          </h1>
          <p className="text-gray-600 mb-6">
            You are successfully logged in to your account.
          </p>

          {/* User Info Card */}
          <div className="w-full bg-gray-50 p-5 rounded-2xl border border-gray-200 text-left">
            <p className="text-sm text-gray-500 mb-2">Your Details</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Name:</span>
                <span className="text-gray-800">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Email:</span>
                <span className="text-gray-800">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Joined:</span>
                <span className="text-gray-800">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Logout Button (optional) */}
          <button
            onClick={() => handleLogout()}
            className="mt-6 w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
