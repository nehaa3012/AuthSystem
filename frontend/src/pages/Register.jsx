import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FiUser, FiMail, FiLock, FiArrowRight, FiUpload, FiImage } from "react-icons/fi";

function Register({onRegister}) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Append all form data to FormData
      Object.keys(data).forEach(key => {
        if (key === 'image' && data[key][0]) {
          formData.append('image', data.image[0]);
        } else if (key !== 'image') {
          formData.append(key, data[key]);
        }
      });

      const res = await axios.post(
        "http://localhost:8000/api/auth/register",
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log("Register Success:", res.data);
      toast.success("Registration successful!");
      reset();
      onRegister();
      navigate("/");
    } catch (err) {
      console.error("Register Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Registration failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar isAuthenticated={false} setIsAuthenticated={() => {}} />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600">
              <div className="p-8 bg-white dark:bg-gray-800 rounded-xl">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    Create Account
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Join us today and get started
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 3,
                          message: "Name must be at least 3 characters"
                        }
                      })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-white placeholder-gray-500 transition duration-200"
                      placeholder="Full Name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Profile Image */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Profile Picture
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FiUpload className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG (max 2MB)</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          {...register("image", {
                            required: false,
                            validate: {
                              fileSize: (files) => {
                                if (files[0]) {
                                  return files[0].size <= 2 * 1024 * 1024 || 'File size should be less than 2MB';
                                }
                                return true;
                              },
                              fileType: (files) => {
                                if (files[0]) {
                                  return ['image/jpeg', 'image/png', 'image/jpg'].includes(files[0].type) || 'Only JPEG, JPG & PNG files are allowed';
                                }
                                return true;
                              }
                            }
                          })}
                        />
                      </label>
                    </div>
                    {errors.image && (
                      <p className="mt-1 text-sm text-red-500">{errors.image.message}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Optional. Max file size: 2MB. Allowed formats: .jpg, .jpeg, .png
                    </p>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-white placeholder-gray-500 transition duration-200"
                      placeholder="Email Address"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters"
                          },
                          validate: {
                            hasNumber: value => /[0-9]/.test(value) || "Must contain at least one number",
                            hasLetter: value => /[a-zA-Z]/.test(value) || "Must contain at least one letter"
                          }
                        })}
                        className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-white placeholder-gray-500 transition duration-200"
                        placeholder="Create Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                    )}
                    {password && !errors.password && (
                      <div className="mt-2 text-xs text-green-500">
                        Password strength: Good
                      </div>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        type="checkbox"
                        {...register("terms", {
                          required: "You must accept the terms and conditions"
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300">
                        I agree to the <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Privacy Policy</a>
                      </label>
                      {errors.terms && (
                        <p className="mt-1 text-sm text-red-500">{errors.terms.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <FiArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        OR
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                      Already have an account?{' '}
                      <Link 
                        to="/login" 
                        className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition duration-200"
                      >
                        Sign in
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            <p> {new Date().getFullYear()} AuthSystem. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
