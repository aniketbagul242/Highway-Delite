import { transporter } from "./emailconfig.js";

 export const sendVerficationCode = async(email, verficationCode)=>{
   try {
        const response = await transporter.sendMail({
        from: '"TaskApp" <vickybagul57@gmail.com>',
        to: email,
        subject: "verfiy email",
        text: "verify your email", // plain‑text body
        html: verficationCode, // HTML body
      });
      console.log("email send sucessfully",response);
      
    
   } catch (error) {
    console.log("email error");
    
   }
}