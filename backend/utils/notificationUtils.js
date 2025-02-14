const nodemailer = require('nodemailer');

// Streak reminder email
const sendStreakReminderEmail = (email, userName) => {
    console.log(`Sending reminder to: ${email} (${userName})`);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'anupmanil10@gmail.com',
            pass: 'lghn bnoq hlze iynf',
        },
    });

    const mailOptions = {
        from: 'anupmanil10@gmail.com',
        to: email,
        subject: 'Streak Reminder!',
        text: `Hey ${userName}, you haven't logged your workout today. Don't break your streak! Keep going!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

// Leaderboard update email


module.exports =  {sendStreakReminderEmail};
