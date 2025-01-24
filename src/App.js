import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ACCOUNT_TYPE } from "./utils/constants";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import OpenRoute from "./Components/core/Auth/OpenRoute";
import Home from "./pages/Home.jsx";
import NavBar from "./Components/common/NavBar";
import Dashboard from "./pages/Dashboard.jsx";
import { setProgress } from "./slices/loadingBarSlice";
import PrivateRoute from "./Components/core/Auth/PrivateRoute.jsx";
import MyProfile from "./Components/core/Dashboard/MyProfile.jsx";
import { isPending } from "@reduxjs/toolkit";
import Setting from "./Components/core/Dashboard/Settings.jsx";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import EnrollledCourses from "./Components/core/Dashboard/EnrolledCourses";
import Cart from "./Components/core/Dashboard/Cart/index.jsx";
import AddCourse from "./Components/core/Dashboard/AddCourse/index.jsx";
import EditCourse from "./Components/core/Dashboard/EditCourse/index.jsx";
import Catalog from "./pages/Catalog.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import MyCourses from "./Components/core/Dashboard/MyCourses.jsx";
import ViewCourse from "./pages/ViewCourse.jsx";
import VideoDetails from "./Components/core/ViewCourse/VideoDetails.jsx";
function App() {

  const user = useSelector((state) => state.profile.user);
  const progress = useSelector((state) => state.loadingBar);
  const dispatch = useDispatch();


  return (
    <div className=" w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <NavBar setProgress={setProgress}></NavBar>
      <Routes>
      

        <Route path="/" element={<Home />} />


        <Route path="courses/:courseId" element={<CourseDetails />} />
        <Route path="catalog/:catalogName" element={<Catalog />} />
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/updated-password/:id" element={<ResetPassword />} />

        <Route path="/verify-email" element={<VerifyOtp />} />
        <Route   
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
            
          }
        >
            <Route path="dashboard/my-profile" element ={<MyProfile/>}/>

<Route path="dashboard/settings" element={<Setting />} />


       
       
        {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="dashboard/cart" element={<Cart />} />
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrollledCourses />}
              />
              {/* <Route
                path="dashboard/purchase-history"
                element={<PurchaseHistory />}
              /> */}
            </>
          )}
 
        
      
       
        
          {
            user?.accountType===ACCOUNT_TYPE.INSTRUCTOR && (
              <>
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />

              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />

             {/* <Route
                path="dashboard/instructor"
                element={<InstructorDashboard />}
              />    */}

              </>

            )
          }

          {/*
            {user?.accountType === ACCOUNT_TYPE.ADMIN && (
            <>
              <Route path="dashboard/admin-panel" element={<AdminPannel />} />
            </>
          )}
        
         */}
        </Route>

        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>

      </Routes>

          


    </div>
  );
}

export default App;
