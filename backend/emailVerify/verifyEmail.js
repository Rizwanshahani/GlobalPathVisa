import nodemailer from 'nodemailer'
import 'dotenv/config'

export const verifyEmail= (token, email)=>{
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});
const mailConfigurations ={
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Email Verification',
    text: `Hi! There, You have recently visited
    our website and entered your email.
    Please follow this link to verify your email
    http://localhost:5174/verify/${token}
    Thanks`

};

transporter.sendMail(mailConfigurations, function(error, info){
    if(error) {
        console.log('--- DEVELOPMENT NOTICE ---');
        console.log(`Failed to send email to ${email}.`);
        console.log(`Copy and paste this link in your browser to verify:`);
        console.log(`http://localhost:5174/verify/${token}`);
        console.log('---------------------------');
        return;
    }
    console.log('Email sent Successsfully');
    console.log(info);
});
}