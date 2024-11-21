const Course = require("../models/Course")
const Category = require("../models/Category")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const CourseProgress = require("../models/CourseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration.js")


exports.createCourse = async (req, res) => {
    try {

 const userId = req.user.id
 let {
    courseName,
    courseDescription,
    whatYouWillLearn,
    price,
    tag: _tag,
    category,
    status,
    instructions: _instructions,
  } = req.body
  const thumbnail = req.files.thumbnailImage

  const tag= JSON.parse(_tag);
  const instructions = JSON (_instructions) ;

  if (
    !courseName ||
    !courseDescription ||
    !whatYouWillLearn ||
    !price ||
    !tag.length ||
    !thumbnail ||
    !category ||
    !instructions.length
  ) {
    return res.status(400).json({
      success: false,
      message: "All Fields are Mandatory",
    })
  }


  if (!status || status === undefined) {
    status = "Draft"
  }

  const instructorDetails= await User.findById(userId,{
    accountType:"Instructor",
  })

  if (!instructorDetails) {
    return res.status(404).json({
      success: false,
      message: "Instructor Details Not Found",
    })
  }

  const categoryDetails = await Category.findById(category)
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      })
    }

    const thumbnailImage=await uploadImageToCloudinary(thumbnail,
      process.env.FOLDER_NAME
    )
    console.log(thumbnailImage);

    const newCourse= await Course.create({
      courseName,
      courseDescription,
      instructor:instructorDetails._id,
      price,
      tag,
      category:categoryDetails._id,
      thumbnail:thumbnailImage.secure_url,
    
      status :status,
    instructions ,


    })


    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )
    // Add the new course to the Categories
    const categoryDetails2 = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    })



  







    }
catch(error){
  console.error(error)
  res.status(500).json({
    success: false,
    message: "Failed to create course",
    error: error.message,
  })


}
}



exports.editCourse= async (req,res)=>{

  try{

    const {courseId}=req.body ;
    const updates=req.body;
    
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    if(req.files){
      const thumbnail= rew.files.thumbnailImage;
      const thumbnailImage=await uploadImageToCloudinary(thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    for(const key in updates){
      if(updates.hasOwnProperty(key)){
        if(key=="tag" || key=="instructions")
        course[key]=JSON.parse(updates[key]);
      else 
      course[key]=updates[key];

      }
    }
    await course.save();

    const updatedCourse =await Course.findOne({_id:courseId,}).populate({
      path:"instructor",
      populate:{
        path :"additionalDetails"
      }
    }).populate({
      path:"courseContent",
        populate: {
          path: "subSection",
        },
    })  .populate("category")
    .populate("ratingAndReviews").exec();


    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
 

  }

  catch(error){

    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })

  }
}






exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }


    let totalDurationInSeconds=0;

    courseDetails.courseContent.forEach((content)=>{
      content.SubSection.forEach((SubSection)=>{
        const timeDurationInSecond = parseInt(SubSection.timeDuration)
        totalDurationInSeconds+=timeDurationInSecond;
      })
    })
    talDuration = convertSecondsToDuration(totalDurationInSeconds)
    
    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    })
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }

}

exports.deleteCourse = async (req,res)=>{


  try{

    const { courseId}= req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    const studentsEnrolled = course.studentsEnroled;
    for (const studentId of studentsEnrolled){
      await User.findByIdAndUpdate(studentId,{
        $pull:{
          course:courseId
        }
      })
    }

    const courseSections = course.courseContent

    for( const sectionId of courseSections ){

      const section = section.findById(sectionId)

      const subSections= section.subSection
      for(const SubSectionId of subSections){
        await SubSection.findByIdAndDelete(subSectionId)

      }
      await Course.findByIdAndDelete(sectionId)

    }
    await Course.findByIdAndDelete(courseId)


 return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })



    

  }catch(error){
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}


//new controllers 
  //search course by title,description and tags array
  exports.searchCourse = async (req, res) => {
    try {
      const  { searchQuery }  = req.body
    //   console.log("searchQuery : ", searchQuery)
      const courses = await Course.find({
      $or: [
        { courseName: { $regex: searchQuery, $options: "i" } },
        { courseDescription: { $regex: searchQuery, $options: "i" } },
        { tag: { $regex: searchQuery, $options: "i" } },
      ],
    })
    .populate({
    path: "instructor",  })
    .populate("category")
    .populate("ratingAndReviews")
    .exec();
  
    return res.status(200).json({
    success: true,
    data: courses,
      })
    } catch (error) {
      return res.status(500).json({
      success: false,
      message: error.message,
      })
    }		
  }					
  
  //mark lecture as completed
  exports.markLectureAsComplete = async (req, res) => {
    const { courseId, subSectionId, userId } = req.body
    if (!courseId || !subSectionId || !userId) {
      return res.status(400).json({
      success: false,
      message: "Missing required fields",
      })
    }
    try {
    progressAlreadyExists = await CourseProgress.findOne({
            userID: userId,
            courseID: courseId,
          })
      const completedVideos = progressAlreadyExists.completedVideos
      if (!completedVideos.includes(subSectionId)) {
      await CourseProgress.findOneAndUpdate(
        {
        userID: userId,
        courseID: courseId,
        },
        {
        $push: { completedVideos: subSectionId },
        }
      )
      }else{
      return res.status(400).json({
        success: false,
        message: "Lecture already marked as complete",
        })
      }
      await CourseProgress.findOneAndUpdate(
      {
        userId: userId,
        courseID: courseId,
      },
      {
        completedVideos: completedVideos,
      }
      )
    return res.status(200).json({
      success: true,
      message: "Lecture marked as complete",
    })
    } catch (error) {
      return res.status(500).json({
      success: false,
      message: error.message,
      })
    }
  
  }



  exports.getAllCourses = async (req, res) => {
    try {
      const allCourses = await Course.find(
        {},
        {
          courseName: true,
          price: true,
          thumbnail: true,
          instructor: true,
          ratingAndReviews: true,
          studentsEnroled: true,
        }
      )
        .populate("instructor")
        .exec();
      return res.status(200).json({
        success: true,
        data: allCourses,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        success: false,
        message: `Can't Fetch Course Data`,
        error: error.message,
      });
    }
  };



  exports.getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const userId = req.user.id
      const courseDetails = await Course.findOne({
      _id: courseId,
      })
      .populate({
        path: "instructor",
        populate: {
        path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
        path: "subSection",
        },
      })
      .exec()
  
      
      let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userID: userId,
      })
    
      console.log("courseProgressCount : ", courseProgressCount)
    
      if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
      }
    
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }
    
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds;
      })
      })
    
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
    
      return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
        ? courseProgressCount?.completedVideos
        : ["none"],
      },
      })
    } catch (error) {
      return res.status(500).json({
      success: false,
      message: error.message,
      })
    }
    }
  





 