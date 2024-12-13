import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // From environment variable
    pass: process.env.EMAIL_PASS, // From environment variable
  },
});

let generatedCode = null;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Generate a 6-digit 2FA code
    generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Use environment variable
      to: email,
      subject: "Your 2FA Code",
      text: `Your 2FA code is: ${generatedCode}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      res
        .status(200)
        .json({ message: "2FA code sent successfully.", generatedCode });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to send email." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}

// import nodemailer from "nodemailer";

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required." });
//     }

//     try {
//       // Create transporter inside the handler
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS,
//         },
//       });

//       // Generate a 6-digit 2FA code
//       const generatedCode = Math.floor(
//         100000 + Math.random() * 900000
//       ).toString();

//       // Email options
//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: "Your 2FA Code",
//         text: `Your 2FA code is: ${generatedCode}`,
//       };

//       // Verify transporter configuration
//       await transporter.verify();

//       // Send email
//       await transporter.sendMail(mailOptions);

//       res
//         .status(200)
//         .json({ message: "2FA code sent successfully.", generatedCode });
//     } catch (error) {
//       console.error("Detailed error:", error);
//       res.status(500).json({
//         message: "Failed to send email.",
//         error: error.message,
//       });
//     }
//   } else {
//     res.status(405).json({ message: "Method not allowed." });
//   }
// }
