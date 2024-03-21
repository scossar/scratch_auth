import nodemailer from "nodemailer";

export let transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  secure: false,
  auth: {
    user: "test",
    pass: "test",
  },
});
