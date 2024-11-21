import React from "react";
import frame from "../assets/frame.png";
import SignupForm from "./SignupForm.jsx";
import LoginForm from "./LoginForm.jsx";
import { FcGoogle } from "react-icons/fc";

 const Template=({title,desc1,desc2,image,formType,setIsLoggedIn})=>{
  return ( <div  className=" flex w-11/12 gap-x-12 py-12 mx-auto max-w-[1160px] justify-between ">


    <div className="w-11/12 max-w-[450px] mx-0 text-white" >
    
    <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">{title}</h1>
    
      <p  className="text-[1.125rem] mt-4 leading-[1.625rem]">
        <span>{desc1}</span>
        <span>{desc2}</span>
      </p>

      {
        formType==="signup" ? 
        <SignupForm setIsLoggedIn={setIsLoggedIn}/> :
        <LoginForm setIsLoggedIn={setIsLoggedIn}/>
      }


      <div className=" flex w-full items-center my-4 gap-x-2 ">
        <div className="h-[1px] w-full bg-black  " >

        </div>
        <p>Or</p>
        <div className="h-[1px] w-full bg-black">

        </div>
      </div>

      <button  className="w-full flex items-center justify-center rounded-[8px] font-medium text-richblack-100 border-richblack-700 border px-[12px] py-[18px]" >
        <FcGoogle/>
        <p>Sign Up with Google</p>
      </button>
    
    
    </div>






    <div className=" relative w-11/12 max-w-[450px] ">
      <img src={frame} alt="patter" />
      <img src={image} alt="patter" 
      
      className="absolute -top-4 right-4 " />


    </div>


  </div>)
 }

export default Template;
