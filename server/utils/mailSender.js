const nodemailer= require ("nodemailer");

const mailSender= async (email,title,body)=>{
  try {
 let transpoter=  nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        port:465,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
        }

    })

    console.log(email);
    console.log("in the mailsender in utils ")
    console.log("MAIL_HOST:", process.env.MAIL_HOST);
    console.log("MAIL_USER:", process.env.MAIL_USER);
    console.log("MAIL_PASS:", process.env.MAIL_PASS);
    // console.log(transpoter);


    let info = await transpoter.sendMail({
        from:'study Notion ',
        to:`${email}`,
        subject:`${title}`,
        html:`${body}`
    })

//another way thats  it 


// let info = await nodemailer
// .createTransport({
//     host:process.env.MAIL_HOST,
//     auth:{
//         user:process.env.MAIL_USER,
//         pass:process.env.MAIL_PASS
//     }


// })
// .sendMail({
//             from:'study Notion ',
//             to:`${email}`,
//             subject:`${title}`,
//             html:`${body}`})
    // console.log(info);
    return info;
}
catch (error){
    console.log("error in mailsender function "+error.message);
}

 
}

module.exports=mailSender;

// const nodemailer = require("nodemailer");
// require('dotenv').config()


// const mailSender = async (email, title, body) => {
//     try{
//             let transporter = nodemailer.createTransport({
//                 host:process.env.MAIL_HOST,
//                 port: 587,
//                 auth:{
//                     user: process.env.MAIL_USER,
//                     pass: process.env.MAIL_PASS,
//                 }
//             })


//             let info = await transporter.sendMail({
//                 from: `"Study Notion" <${process.env.MAIL_USER}>`,
//                 to:`${email}`,
//                 subject: `${title}`,
//                 html: `${body}`,
//             })
//             console.log(info);
//             return info;
//     }
//     catch(error) {
//         console.log(error.message);
//         return error;
//     }
// }


// module.exports = mailSender;