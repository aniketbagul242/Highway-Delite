import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "vickybagul58@gmail.com",
    pass:"qsqp mjzb nlnb bjlg"
  },
});

