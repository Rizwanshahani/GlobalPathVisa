import nodemailer from 'nodemailer'
import 'dotenv/config'

export const sendOTPMail= async(otp, email)=>{
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
    subject: 'Password reset otp',
    html:`<p> Your otp for Password Reset is:<b>${otp}</b></p>?`

};

transporter.sendMail(mailConfigurations, function(error, info){
    if(error) {
        console.log('--- DEVELOPMENT NOTICE ---');
        console.log(`Failed to send OTP email to ${email}.`);
        console.log(`Your OTP for Password Reset is: ${otp}`);
        console.log('---------------------------');
        return;
    }
    console.log('otp sent Successsfully');
    console.log(info);
    
});



}