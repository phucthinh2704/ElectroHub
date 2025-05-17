import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  User, 
  CheckCircle, 
  Loader2, 
  Github, 
  Facebook, 
  Eye, 
  EyeOff,
  ArrowRight,
  Phone
} from "lucide-react";
import Swal from "sweetalert2";
import path from "../../utils/path";
import { apiLogin, apiRegister } from "../../apis/user";
import { register } from "../../store/user/userSlice"
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    login: {
      email: "",
      password: "",
      rememberMe: false
    },
    register: {
      name: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    login: {},
    register: {}
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const message = queryParams.get("message");
    const email = queryParams.get("email");
    
    if (message) {
      Swal.fire({
        title: "Success",
        text: message,
        icon: "success",
      });
      
      setFormData((prevData) => ({
        ...prevData,
        login: {
          ...prevData.login,
          email: email || prevData.login.email
        }
      }));

      navigate("/login", { replace: true });
    }
  }, [location, navigate]);

  const validateLogin = () => {
    const newErrors = {};

    if (!formData.login.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.login.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.login.password) {
      newErrors.password = "Password is required";
    } else if (formData.login.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const validateRegister = () => {
    const newErrors = {};

    if (!formData.register.name) {
      newErrors.name = "Full name is required";
    }

    if (!formData.register.mobile) {
      newErrors.mobile = "Mobile number is required";
    }
    else if (!formData.register.mobile.match(/^\d{10}$/)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    if (!formData.register.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.register.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.register.password) {
      newErrors.password = "Password is required";
    } else if (formData.register.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.register.password !== formData.register.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.register.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions";
    }

    return newErrors;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateLogin();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors({ ...errors, login: formErrors });
      return;
    }

    setErrors({ ...errors, login: {} });
    setIsSubmitting(true);

    setTimeout(async () => {
      const response = await apiLogin(formData.login);
      if(!response.success) {
         Swal.fire("Error", response.message, "error");
         setIsSubmitting(false);
         return;
      }
      setIsSubmitting(false);
      Swal.fire("Success", response.message, "success");
      dispatch(register({ isLoggedIn: true, user: response.user, token: response.access_token }));
      navigate(`/${path.HOME}`);
    }, 500);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateRegister();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors({ ...errors, register: formErrors });
      return;
    }

    setErrors({ ...errors, register: {} });
    setIsSubmitting(true);

    setTimeout(async () => {
      const response = await apiRegister(formData.register);
      if(!response.success) {
        Swal.fire("Error", response.message, "error");
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
      setActiveTab("login");
      Swal.fire({
        title: "Success",
        text: response.message,
        icon: "success",
        confirmButtonColor: "#6366f1"
      });
      setFormData({
        ...formData,
        login: {
          email: formData.register.email,
          password: "",
          rememberMe: false
        },
        register: {
          name: "",
          mobile: "",
          email: "",
          password: "",
          confirmPassword: "",
          agreeTerms: false
        }
      });
    }, 300);
  };

  const handleInputChange = (tab, field, value) => {
    setFormData({
      ...formData,
      [tab]: {
        ...formData[tab],
        [field]: value
      }
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8 text-center">
          <h2 className="text-3xl font-bold text-white">
            {activeTab === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="mt-2 text-sm text-indigo-100">
            {activeTab === "login" 
              ? "Sign in to your account to continue" 
              : "Join us today and get access to all features"}
          </p>
          
          {/* Tab Navigation */}
          <div className="absolute bottom-0 left-0 right-0 flex translate-y-1/2 justify-center">
            <div className="flex rounded-lg bg-white p-1 shadow-md">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex items-center rounded-md px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "login"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:text-indigo-700"
                }`}
              >
                <Lock className="mr-2 h-4 w-4" />
                Login
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`flex items-center rounded-md px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "register"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:text-indigo-700"
                }`}
              >
                <User className="mr-2 h-4 w-4" />
                Register
              </button>
            </div>
          </div>
        </div>

        {/* Form Container with Animation */}
        <div className="mt-8 p-8">
          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    className={`w-full rounded-lg border ${
                      errors.login.email ? "border-red-500" : "border-gray-300"
                    } pl-10 pr-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20`}
                    placeholder="you@example.com"
                    value={formData.login.email}
                    onChange={(e) => handleInputChange("login", "email", e.target.value)}
                  />
                </div>
                {errors.login.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.login.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    className={`w-full rounded-lg border ${
                      errors.login.password ? "border-red-500" : "border-gray-300"
                    } pl-10 pr-10 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20`}
                    placeholder="••••••••"
                    value={formData.login.password}
                    onChange={(e) => handleInputChange("login", "password", e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.login.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.login.password}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={formData.login.rememberMe}
                  onChange={(e) => handleInputChange("login", "rememberMe", e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-medium text-white transition-all hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-70 cursor-pointer"
                disabled={isSubmitting}
              >
                <span className="relative flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>

              {/* Divider */}
              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="mx-4 flex-shrink text-xs text-gray-400">OR CONTINUE WITH</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Social Login Options */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Github className="mr-2 h-5 w-5" />
                  Github
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Facebook className="mr-2 h-5 w-5" color="#1877F2" />
                  Facebook
                </button>
              </div>
            </form>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div>
                <label
                  htmlFor="register-name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="register-name"
                    type="text"
                    className={`w-full rounded-lg border ${
                      errors.register.name ? "border-red-500" : "border-gray-300"
                    } pl-10 pr-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20`}
                    placeholder="Chris Evans"
                    value={formData.register.name}
                    onChange={(e) => handleInputChange("register", "name", e.target.value)}
                  />
                </div>
                {errors.register.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.register.name}</p>
                )}
              </div>

              {/* Mobile Field */}
              <div>
                <label
                  htmlFor="register-mobile"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="register-mobile"
                    type="text"
                    className={`w-full rounded-lg border ${
                      errors.register.mobile ? "border-red-500" : "border-gray-300"
                    } pl-10 pr-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20`}
                    placeholder="1234567890"
                    value={formData.register.mobile}
                    onChange={(e) => handleInputChange("register", "mobile", e.target.value)}
                  />
                </div>
                {errors.register.mobile && (
                  <p className="mt-1 text-xs text-red-500">{errors.register.mobile}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="register-email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="register-email"
                    type="email"
                    className={`w-full rounded-lg border ${
                      errors.register.email ? "border-red-500" : "border-gray-300"
                    } pl-10 pr-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20`}
                    placeholder="you@example.com"
                    value={formData.register.email}
                    onChange={(e) => handleInputChange("register", "email", e.target.value)}
                  />
                </div>
                {errors.register.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.register.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="register-password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    className={`w-full rounded-lg border ${
                      errors.register.password ? "border-red-500" : "border-gray-300"
                    } pl-10 pr-10 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20`}
                    placeholder="••••••••"
                    value={formData.register.password}
                    onChange={(e) => handleInputChange("register", "password", e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.register.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.register.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="register-confirm-password"
                    type={showPassword ? "text" : "password"}
                    className={`w-full rounded-lg border ${
                      errors.register.confirmPassword ? "border-red-500" : "border-gray-300"
                    } pl-10 pr-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20`}
                    placeholder="••••••••"
                    value={formData.register.confirmPassword}
                    onChange={(e) => handleInputChange("register", "confirmPassword", e.target.value)}
                  />
                </div>
                {errors.register.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.register.confirmPassword}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={formData.register.agreeTerms}
                    onChange={(e) => handleInputChange("register", "agreeTerms", e.target.checked)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-700">
                    I agree to the{" "}
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Privacy Policy
                    </a>
                  </label>
                  {errors.register.agreeTerms && (
                    <p className="mt-1 text-xs text-red-500">{errors.register.agreeTerms}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-medium text-white transition-all hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-70 cursor-pointer"
                disabled={isSubmitting}
              >
                <span className="relative flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </>
                  )}
                </span>
              </button>

              {/* Divider */}
              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="mx-4 flex-shrink text-xs text-gray-400">OR CONTINUE WITH</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Social Registration Options */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Github className="mr-2 h-5 w-5" />
                  Github
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Facebook className="mr-2 h-5 w-5" color="#1877F2" />
                  Facebook
                </button>
              </div>
            </form>
          )}
          
          {/* Sign Up/Login Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            {activeTab === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
              className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
            >
              {activeTab === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;