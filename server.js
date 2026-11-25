
// // ============================================
// // SOHAIL CHANNA PORTFOLIO - BACKEND SERVER
// // Node.js + Express + Nodemailer
// // ============================================

// require("dotenv").config();

// const express = require("express");
// const nodemailer = require("nodemailer");
// const rateLimit = require("express-rate-limit");
// const path = require("path");

// const app = express();
// const PORT = process.env.PORT || 3000;

// // ============================================
// // MIDDLEWARE
// // ============================================

// app.use(express.json({ limit: "20kb" }));
// app.use(express.urlencoded({ extended: true }));

// // Contact form rate limiter
// const contactLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     limit: 5,
//     standardHeaders: "draft-8",
//     legacyHeaders: false,
//     message: {
//         success: false,
//         message: "Too many messages. Please try again after 15 minutes."
//     }
// });

// // ============================================
// // EMAIL CONFIGURATION
// // ============================================

// const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST || "smtp.gmail.com",
//     port: Number(process.env.SMTP_PORT || 465),
//     secure: process.env.SMTP_SECURE !== "false",

//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS
//     }
// });

// // ============================================
// // HELPER FUNCTIONS
// // ============================================

// function cleanText(value) {
//     return typeof value === "string" ? value.trim() : "";
// }

// function isValidEmail(email) {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// }
// // ============================================
// // SERVER TEST ROUTE
// // ============================================

// app.get("/api/test", (req, res) => {
//     return res.status(200).json({
//         success: true,
//         message: "Node.js server is working!"
//     });
// });

// // ============================================
// // CONTACT FORM API
// // ============================================

// app.post("/api/contact", contactLimiter, async (req, res) => {

//     console.log("CONTACT API HIT!");
//     console.log("Request Body:", req.body);

//     try {

//         const name = cleanText(req.body.name);
//         const email = cleanText(req.body.email);
//         const phone = cleanText(req.body.phone);
//         const service = cleanText(req.body.service);
//         const subject = cleanText(req.body.subject);
//         const message = cleanText(req.body.message);

//         // Required fields validation
//         if (!name || !email || !subject || !message) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please fill in all required fields."
//             });
//         }

//         // Email validation
//         if (!isValidEmail(email)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please enter a valid email address."
//             });
//         }

//         // Length validation
//         if (
//             name.length > 100 ||
//             email.length > 150 ||
//             phone.length > 30 ||
//             service.length > 100 ||
//             subject.length > 150 ||
//             message.length > 5000
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message: "One or more fields exceed the allowed length."
//             });
//         }

//         // SMTP configuration check
//         if (
//             !process.env.SMTP_USER ||
//             !process.env.SMTP_PASS ||
//             !process.env.RECEIVER_EMAIL
//         ) {
//             console.error("Email configuration is incomplete.");

//             return res.status(500).json({
//                 success: false,
//                 message: "Email service is not configured. Please contact the website owner."
//             });
//         }

//         // Email content
//         const mailOptions = {
//             from: `"Sohail Portfolio Contact" <${process.env.SMTP_USER}>`,

//             to: process.env.RECEIVER_EMAIL,

//             replyTo: email,

//             subject: `Portfolio Contact: ${subject}`,

//             text: `
// NEW PORTFOLIO CONTACT MESSAGE
// ================================

// Name: ${name}

// Email: ${email}

// Phone: ${phone || "Not provided"}

// Service: ${service || "Not selected"}

// Subject: ${subject}

// Message:
// ${message}

// ================================
// Sent from Sohail Channa Portfolio
//             `
//         };

//         // Send email
//         await transporter.sendMail(mailOptions);

//         console.log("Contact message email sent successfully.");

//         return res.status(200).json({
//             success: true,
//             message: "Your message has been sent successfully."
//         });

//     } catch (error) {

//         console.error("CONTACT FORM ERROR:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Message could not be sent. Please try again later."
//         });

//     }

// });

// // ============================================
// // STATIC WEBSITE FILES
// // ============================================

// app.use(express.static(path.join(__dirname)));

// // ============================================
// // HOME PAGE
// // ============================================

// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "index.html"));
// });

// // ============================================
// // UNKNOWN API ROUTES
// // ============================================

// app.use("/api", (req, res) => {
//     return res.status(404).json({
//         success: false,
//         message: "API endpoint not found."
//     });
// });

// // ============================================
// // PAGE NOT FOUND
// // ============================================

// app.use((req, res) => {
//     return res.status(404).send("404 - Page Not Found");
// });

// // ============================================
// // INVALID JSON HANDLER
// // ============================================

// app.use((error, req, res, next) => {

//     console.error("SERVER ERROR:", error);

//     if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
//         return res.status(400).json({
//             success: false,
//             message: "Invalid JSON request."
//         });
//     }

//     return res.status(500).json({
//         success: false,
//         message: "An internal server error occurred."
//     });

// });

// // ============================================
// // START SERVER
// // ============================================

// app.listen(PORT, () => {

//     console.log("------------------------------------");
//     console.log("SOHAIL CHANNA PORTFOLIO SERVER");
//     console.log("------------------------------------");
//     console.log(`Server running: http://localhost:${PORT}`);
//     console.log("Contact API: POST /api/contact");
//     console.log("------------------------------------");

// });

"use strict";

// ============================================
// SOHAIL CHANNA PORTFOLIO - BACKEND SERVER
// Node.js + Express + Nodemailer
// ============================================

require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;
const open = require("open");
// ============================================
// MIDDLEWARE
// ============================================

// CORS configuration
app.use(cors({
    origin: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Accept"]
}));

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));

// ============================================
// CONTACT FORM RATE LIMITER
// ============================================

const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many messages. Please try again after 15 minutes."
    }
});

// ============================================
// EMAIL CONFIGURATION
// ============================================

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== "false",

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function cleanText(value) {
    return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================
// SERVER TEST ROUTE
// ============================================

app.get("/api/test", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Node.js server is working!"
    });
});

// ============================================
// CONTACT FORM API
// ============================================

app.post("/api/contact", contactLimiter, async (req, res) => {

    console.log("CONTACT API HIT!");
    console.log("Request received.");

    try {

        const name = cleanText(req.body.name);
        const email = cleanText(req.body.email);
        const phone = cleanText(req.body.phone);
        const service = cleanText(req.body.service);
        const subject = cleanText(req.body.subject);
        const message = cleanText(req.body.message);

        // Required fields validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }

        // Email validation
        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        // Length validation
        if (
            name.length > 100 ||
            email.length > 150 ||
            phone.length > 30 ||
            service.length > 100 ||
            subject.length > 150 ||
            message.length > 5000
        ) {
            return res.status(400).json({
                success: false,
                message: "One or more fields exceed the allowed length."
            });
        }

        // SMTP configuration check
        if (
            !process.env.SMTP_USER ||
            !process.env.SMTP_PASS ||
            !process.env.RECEIVER_EMAIL
        ) {
            console.error("Email configuration is incomplete.");

            return res.status(500).json({
                success: false,
                message: "Email service is not configured. Please contact the website owner."
            });
        }

        // Email content
        const mailOptions = {

            from: `"Sohail Portfolio Contact" <${process.env.SMTP_USER}>`,

            to: process.env.RECEIVER_EMAIL,

            replyTo: email,

            subject: `Portfolio Contact: ${subject}`,

            text: `
NEW PORTFOLIO CONTACT MESSAGE
================================

Name: ${name}

Email: ${email}

Phone: ${phone || "Not provided"}

Service: ${service || "Not selected"}

Subject: ${subject}

Message:
${message}

================================
Sent from Sohail Channa Portfolio
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        console.log("Contact message email sent successfully.");

        return res.status(200).json({
            success: true,
            message: "Your message has been sent successfully."
        });

    } catch (error) {

        console.error("CONTACT FORM ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Message could not be sent. Please try again later."
        });

    }

});

// ============================================
// STATIC WEBSITE FILES
// ============================================

app.use(express.static(__dirname));

// ============================================
// HOME PAGE
// ============================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ============================================
// UNKNOWN API ROUTES
// ============================================

app.use("/api", (req, res) => {
    return res.status(404).json({
        success: false,
        message: "API endpoint not found."
    });
});

// ============================================
// PAGE NOT FOUND
// ============================================

app.use((req, res) => {
    return res.status(404).send("404 - Page Not Found");
});

// ============================================
// INVALID JSON & SERVER ERROR HANDLER
// ============================================

app.use((error, req, res, next) => {

    console.error("SERVER ERROR:", error);

    if (
        error instanceof SyntaxError &&
        error.status === 400 &&
        "body" in error
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON request."
        });
    }

    return res.status(500).json({
        success: false,
        message: "An internal server error occurred."
    });

});

// ============================================
// START SERVER
// ============================================


app.listen(PORT, async () => {

    const url = `http://localhost:${PORT}`;

    console.log("------------------------------------");
    console.log("SOHAIL CHANNA PORTFOLIO SERVER");
    console.log("------------------------------------");
    console.log(`Server running: ${url}`);
    console.log(`Contact API: ${url}/api/contact`);
    console.log(`Test API: ${url}/api/test`);
    console.log("------------------------------------");

    try {
        const open = require("open");
        await open(url);
        console.log("Browser opened successfully!");
    } catch (error) {
        console.log("Please open browser manually:", url);
    }

});

 
