import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import OpenRoute from "./Components/core/Auth/OpenRoute";
import Home from "./pages/Home.jsx";
import NavBar from "./Components/common/NavBar";

import { setProgress } from "./slices/loadingBarSlice";

function App() {
  return (
    <div className=" w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      {/* <NavBar setProgress={setProgress}></NavBar> */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        /> */}

        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        
        {/* <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/update-password/:id" element={<ResetPassword />} />

        <Route path="/verify-email" element={<VerifyOtp />} /> */}
      </Routes>
    </div>
  );
}

export default App;
