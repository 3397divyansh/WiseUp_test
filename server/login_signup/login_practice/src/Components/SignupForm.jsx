import React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

 const SignupForm = (props)=>
  
  {
    const navigate = useNavigate();

    const setIsLoggedIn = props.setIsLoggedIn
    const [showCreatePass, setShowCreatePass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [accountType,setAccountType]= useState("student")

    const [formData , setFormData]= useState({
      firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    })

    function changeHandler(event) {
      setFormData((prev) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }));
    }
    
    function submitHandler (e) {
      e.preventDefault();
      console.log(formData);
      if (formData.password != formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
  
      setIsLoggedIn(true);
      toast.success("Account Create");
      const accountData = {
        ...formData,
      };
      console.log(accountData);
  
      navigate("/dashboard");
    }
    return (


  <div>
    <div className="flex bg-gray-700 gap-x-1 rounded-full  p-1 max-w-max">
      <button onClick={()=>(setAccountType("student"))}
         className={`${
          accountType==="student" ? "bg-black text-white"
          : "bg-slate-50  bg-gray-700"
         }  py-2 px-5 rounded-full    `}  

        >
      student
      </button>

      <button onClick={()=>(setAccountType("instructor"))}
         className={`${
          accountType==="instructor" ? "bg-black text-white"
          : "bg-slate-50 bg-gray-700"
         }  py-2 px-5 rounded-full transition-all    `}  

        >
      Instructor
      </button>
    </div>
    
    <form onSubmit={submitHandler}>
         <div className="flex gap-x-4">
        <label htmlFor="text-[0.875 rem] text-white mb-1 leading-[1.375rem ]">
         <p>First Name <sup className="text-pink-500">*</sup></p>

         <input type="text" name="firstName" id="" 
         placeholder="enter first name"

         onChange={changeHandler}
         value ={FormData.firstName}
         className="bg-gray-800 rounded-[0.75rem] w-full p-[12px] text-white"
         
         />


        </label>


        <label htmlFor="text-[0.875 rem] text-white mb-1 leading-[1.375rem ]">
         <p>Last Name <sup className="text-pink-500">*</sup></p>

         <input type="text" name="lastName" id="" 
         placeholder="enter last  name"

         onChange={changeHandler}
         value ={FormData.lastName}
         className="bg-gray-800 rounded-[0.75rem] w-full p-[12px] text-white"
         
         />


        </label>
   
         </div>




         <label htmlFor="" className="w-full">
          <p className="text-[0.875rem] text-white  mb-1 leading-[1.375rem]">
            Email Address
            <sup className="text-pink-200">*</sup>
          </p>

          <input
            type="email"
            required
            placeholder="Enter your email address"
            value={formData.email}
            onChange={changeHandler}
            className="bg-richblack-800 rounded-[0.75rem] w-full p-[12px] text-richblack-5"
            name="email"
          />
        </label>

   <div className="flex gap-x-4">

    <label htmlFor="" className="w-full relative">
         <p className="text-[0.875rem] text-white mb-1 leading-[1.375]">Create Password
         <sup className="text-pink-200">*</sup>
         </p>
         <input type="text" 
         required
         name="password" id="" 
         onChange={changeHandler}
         value={formData.password}
         className="bg-gray-800 w-full
         rounded-[0.75rem]  p-[12px]
         text-white "

         />
         <span  onClick={()=>{
          setShowCreatePass(!showCreatePass)
         }  } className="absolute ">
          {
            showCreatePass ? (<AiOutlineEyeInvisible fontSize={24}
            fill="AFB2BF"/>) : (<AiOutlineEye fontSize={24} fill="AFB2BF"/>)
          }
         </span>
    </label>

    <label htmlFor="" className="w-full relative">
         <p className="text-[0.875rem] text-white mb-1 leading-[1.375]">Confirm Password
         <sup className="text-pink-200">*</sup>
         </p>
         <input type="text" name="confirmPassword" id="" 
         onChange={changeHandler}
         value={formData.confirmPassword}
         className="bg-gray-800 w-full
         rounded-[0.75rem]  p-[12px]
         text-white "

         />
         <span onClick={()=>{
          setShowConfirmPass(!showConfirmPass)
         }}>
          {
            showCreatePass ? (<AiOutlineEyeInvisible fontSize={24}
            fill="AFB2BF"/>) : (<AiOutlineEye fontSize={24} fill="AFB2BF"/>)
          }
         </span>
    </label>
     
    
    
    </div>     

    <button className="bg-yellow-500 py-[8px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900 w-full">
          Create Account
        </button>
    </form>




  </div>
 )}

export default SignupForm;
