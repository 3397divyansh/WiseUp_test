const {instance} =require("../config/razorpay")
const Course = require("../models/Course");
const crypto = require("crypto")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const mongoose = require("mongoose")
const {
    courseEnrollmentEmail,
  } = require("../mail/templates/courseEnrollmentEmail")
  const {paymentSuccess} = require("../mail/templates/paymentSuccess");
  // const { default: mongoose } = require("mongoose");


  const CourseProgress = require("../models/CourseProgress")



  exports.capturePayment= async (req,res)=>{
     const { courses } = req.body
    const userId = req.user.id
    if (courses.length === 0) {
      return res.json({ success: false, message: "Please Provide Course ID" })
    }
  console.log("in catupture payment")
    let total_amount = 0


    

        for( const course_id of courses){
            let course ;
            try{
                course = await Course.findById(course_id);
                if (!course) {
                    return res
                      .status(200)
                      .json({ success: false, message: "Could not find the Course" })
                  }

                //   const uid=new mongoose.Mongoose.Types.ObjectId(userId);
                  const uid = new mongoose.Types.ObjectId(userId);


                  if(course.studentsEnroled.includes(uid)){
                    return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" })
                  }
                  total_amount+=course.price;




            }
            catch(error){
                
                console.log(error)
                return res.status(500).json({ success: false, message: error.message })
            }
        }
  console.log("options befoer ")

        const options = {
            amount : total_amount*100,
            currency:"INR",
            receipt:Math.random(Date.now()).toString()
        }

        try{
            console.log("  befoer  payment instance of order is created")

            const paymentResponse = await instance.orders.create(options)

            console.log(paymentResponse);
            res.json({
                success: true,
                data: paymentResponse,
              })



    }
    catch(error){
        console.log(error)
        res
          .status(500)
          .json({ success: false, message: "Could not initiate order." })

    }
  }


  exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses
  
    const userId = req.user.id
  
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courses ||
      !userId
    ) {
      return res.status(200).json({ success: false, message: "Payment Failed" })
    }
  
    let body = razorpay_order_id + "|" + razorpay_payment_id
  
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex")
  
    if (expectedSignature === razorpay_signature) {
      await enrollStudents(courses, userId, res)
      return res.status(200).json({ success: true, message: "Payment Verified" })
    }
  
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }
  
  const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide Course ID and User ID" })
    }
  
    for (const courseId of courses) {
      try {
        // Find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          { $push: { studentsEnroled: userId } },
          { new: true }
        )
  
        if (!enrolledCourse) {
          return res
            .status(500)
            .json({ success: false, error: "Course not found" })
        }
        console.log("Updated course: ", enrolledCourse)
  
        const courseProgress = await CourseProgress.create({
          courseID: courseId,
          userId: userId,
          completedVideos: [],
        })
        // Find the student and add the course to their list of enrolled courses
        const enrolledStudent = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              courses: courseId,
              courseProgress: courseProgress._id,
            },
          },
          { new: true }
        )
  
        console.log("Enrolled student: ", enrolledStudent)
        // Send an email notification to the enrolled student
        const emailResponse = await mailSender(
          enrolledStudent.email,
          `Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(
            enrolledCourse.courseName,
            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
          )
        )
  
        console.log("Email sent successfully: ", emailResponse.response)
      } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, error: error.message })
      }
    }
  }












  exports.sendPaymentSuccessEmail=async(req,res)=>{
    const {orderId,paymentId,amount}=req.body;
    const userId = req.user.id
    
  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try{
    const enrolledStudent = await User.findById(userId);

    await mailSender(enrolledStudent.email,`payment recieved`,paymentSuccess(

        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount/100,
        orderId,
        paymentId
    ))
  }
  catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
  }


//  exports. const enrollStudents = async (courses, userId, res) => {
//     if (!courses || !userId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please Provide Course ID and User ID" })
//     }
  
//     for (const courseId of courses) {
//       try {
//         // Find the course and enroll the student in it
//         const enrolledCourse = await Course.findOneAndUpdate(
//           { _id: courseId },
//           { $push: { studentsEnroled: userId } },
//           { new: true }
//         )
  
//         if (!enrolledCourse) {
//           return res
//             .status(500)
//             .json({ success: false, error: "Course not found" })
//         }
//         console.log("Updated course: ", enrolledCourse)
  
//         const courseProgress = await CourseProgress.create({
//           courseID: courseId,
//           userId: userId,
//           completedVideos: [],
//         })
//         // Find the student and add the course to their list of enrolled courses
//         const enrolledStudent = await User.findByIdAndUpdate(
//           userId,
//           {
//             $push: {
//               courses: courseId,
//               courseProgress: courseProgress._id,
//             },
//           },
//           { new: true }
//         )
  
//         console.log("Enrolled student: ", enrolledStudent)
//         // Send an email notification to the enrolled student
//         const emailResponse = await mailSender(
//           enrolledStudent.email,
//           `Successfully Enrolled into ${enrolledCourse.courseName}`,
//           courseEnrollmentEmail(
//             enrolledCourse.courseName,
//             `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
//           )
//         )
  
//         console.log("Email sent successfully: ", emailResponse.response)
//       } catch (error) {
//         console.log(error)
//         return res.status(400).json({ success: false, error: error.message })
//       }
//     }
//   }

  exports.verifySignature = async (req, res) => {
    //get the payment details
    const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body;
    const {courses} = req.body;
    const userId = req.user.id;


    if(!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({
            success:false,
            message:'Payment details are incomplete',
        });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;

    const enrolleStudent = async (courses, userId) => {
        if(!courses || !userId) {
            return res.status(400).json({
                success:false,
                message:'Please provide valid courses and user ID',
            });
        }
                try{
                    //update the course
                    for(const course_id of courses){
                    console.log("verify courses=",course_id);
                    const course = await Course.findByIdAndUpdate(
                        course_id,
                        {$push:{studentsEnrolled:userId}},
                        {new:true}
                    );
                    //update the user
                    const user = await User.updateOne(
                        {_id:userId},
                        {$push:{courses:course_id}},
                        {new:true}
                    );
                    //set course progress
                    const newCourseProgress = new CourseProgress({
                        userID: userId,
                        courseID: course_id,
                      })
                      await newCourseProgress.save()
                
                      //add new course progress to user
                      await User.findByIdAndUpdate(userId, {
                        $push: { courseProgress: newCourseProgress._id },
                      },{new:true});
                    //send email
                    const recipient = await User.findById(userId);
                    console.log("recipient=>",course);
                    const courseName = course.courseName;
                    const courseDescription = course.courseDescription;
                    const thumbnail = course.thumbnail;
                    const userEmail = recipient.email;
                    const userName = recipient.firstName + " " + recipient.lastName;
                    const emailTemplate = courseEnrollmentEmail(courseName,userName, courseDescription, thumbnail);
                    await mailSender(
                        userEmail,
                        `You have successfully enrolled for ${courseName}`,
                        emailTemplate,
                    );
                    }
                    return res.status(200).json({
                        success:true,
                        message:'Payment successful',
                    });
                }
                catch(error) {
                    console.error(error);
                    return res.status(500).json({
                        success:false,
                        message:error.message,
                    });
                }
            
        }

    try{
        //verify the signature
        const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");
        if(generatedSignature === razorpay_signature) {
            await enrolleStudent(courses, userId);
        }

    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }

 
}
