import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/login", // <-- your backend login route
        data,
        { withCredentials: true }
      );
      console.log("Login Success:", res.data);
      toast.success("Login successful!");
      reset();
      navigate("/");
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
