const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();
exports.auth=async(req,res,next)=>{
	// console.log(req);
    const token = req.token || req.cookies.token || req.header("Authorization").replace("Bearer","").trim()
	console.log("auth middleware ");
    if (!token) {
        return res.status(401).json({ success: false, message: "`Token Missing`" });
    }

    try{
		console.log('a'+''+token);
        const decode = jwt.verify(token,process.env.JWT_SECRET);
		 
		req.user = decode;
    }
    catch (error){
		console.log(error);
        return res
				.status(401)
				.json({ success: false, message: "token is invalid" });
    }
    next();





}


exports.isStudent=async(req,res,next)=>{
    try{
        
    const userDetails = User.findOne({email:req.user.email});

    if(userDetails.accountType!=="Student");
    {
        return res.status(401).json({
            success: false,
            message: "This is a Protected Route for Students",
        });
    }
    next();
    }
    
    
    catch{
        return req.status(500).json({
            success:false,message:"user role ccant be verified"
        })

    }
    

}




exports.isAdmin = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.accountType !== "Admin") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Admin",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
exports.isInstructor = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });
		// console.log(userDetails);

		console.log(userDetails.accountType);

		if (userDetails.accountType !== "Instructor") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Instructor",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
