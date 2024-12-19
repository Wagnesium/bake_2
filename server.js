// server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());
app.use(express.static('public')); // to serve your HTML file

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.mrrunner170, // your Gmail
        pass: process.env.gbmtptyqupvfikkm // your app-specific password
    }
});

app.post('/send-order-email', async (req, res) => {
    const { pancakes, totalAmount, userLocation, totalXMR, distance, customerEmail } = req.body;
    
    try {
        // Email to owner
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER,
            subject: 'New Pancake Order!',
            html: `
                <h2>New Order Details:</h2>
                <p>Number of Pancakes: ${pancakes}</p>
                <p>Total Amount: $${totalAmount}</p>
                <p>XMR Amount: ${totalXMR}</p>
                <p>Customer Email: ${customerEmail}</p>
                <p>Customer Location:</p>
                <p>- Latitude: ${userLocation.lat}</p>
                <p>- Longitude: ${userLocation.lng}</p>
                <p>Distance from store: ${distance} miles</p>
            `
        });

        // Email to customer
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: customerEmail,
            subject: 'Your Pancake Order Confirmation',
            html: `
                <h2>Thank you for your order!</h2>
                <p>Order Details:</p>
                <p>Number of Pancakes: ${pancakes}</p>
                <p>Total Amount: $${totalAmount}</p>
                <p>XMR Amount: ${totalXMR}</p>
                <p>Your pancakes will be delivered to your location.</p>
                <p>Each order includes maple syrup and whipped cream!</p>
                <p>We'll begin preparing your order once payment is confirmed.</p>
            `
        });

        res.json({ success: true, message: 'Order confirmed and notifications sent!' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, message: 'Failed to process order' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});