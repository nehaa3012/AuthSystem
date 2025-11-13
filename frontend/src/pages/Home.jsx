import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiEdit2, FiX, FiUpload } from "react-icons/fi";

function Home({ setIsAuthenticated }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePic: null,
  });
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef(null);

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

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        profilePic: null,
      });
      setPreview(user.profilePic || "");
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePic: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      if (formData.name !== user.name) data.append("name", formData.name);
      if (formData.email !== user.email) data.append("email", formData.email);
      if (formData.profilePic) data.append("image", formData.profilePic);

      const response = await axios.put(
        "http://localhost:8000/api/auth/update",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setUser(response.data.user);
      toast.success("Profile updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

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
          {/* Profile Picture */}
          <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-6 shadow-md overflow-hidden">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}&background=6366f1&color=fff`;
                }}
              />
            ) : (
              <span className="text-4xl font-bold text-indigo-600">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Welcome Text */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, <span className="text-indigo-600">{user.name}</span> 👋
          </h1>
          <p className="text-gray-600 mb-6">
            You are successfully logged in to your account.
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FiEdit2 /> Edit Profile
          </button>

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

      {/* Update Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gray-100 mb-4 overflow-hidden relative group">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-100">
                      <span className="text-4xl font-bold text-indigo-600">
                        {formData.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiUpload className="text-white text-2xl" />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-indigo-600 hover:text-indigo-800 mb-4"
                >
                  Change Photo
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
