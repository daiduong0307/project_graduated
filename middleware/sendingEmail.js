const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID = process.env.CLIENT_ID_KEY;
const CLIENT_SECRET = process.env.CLIENT_SECRET_KEY;
const REDIRECT_URL = process.env.REDIRECT_URL_KEY;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN_KEY;

const oAuth2client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);
oAuth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(email, name) {
  try {
    const accessToken = await oAuth2client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "bjergocean@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOption = {
      from: "TIME MANAGEMENT SYSTEM 🎡 <bjergocean@gmail.com>",
      to: `${email}`,
      subject: "Hello from Time Management System: You have receive a new submission",
      text: "You have receive a new submission",
      html: `<h3>You have receive a new submission from a ${name}</h3>`,
    };

    const result = await transport.sendMail(mailOption);
    return result;
  } catch (error) {
    return error;
  }
}

async function resetPass(email, subject, text) {
  try {
    const accessToken = await oAuth2client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "bjergocean@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOption = {
      from: "TIME MANAGEMENT SYSTEM 🎡 <bjergocean@gmail.com>",
      to: `${email}`,
      subject: `Hello from Time Management System`,
      text: text,
      html: `<h3>Hello from Time Management System: You have receive a new request for ${subject}, Please follow the link below to reset your password</h3>
               ${text}`
    };

    const result = await transport.sendMail(mailOption);
    return result;
  } catch (error) {
    return error;
  }
};

async function alertLogRequest(email, name) {
  try {
    const accessToken = await oAuth2client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "bjergocean@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOption = {
      from: "TIME MANAGEMENT SYSTEM 🎡 <bjergocean@gmail.com>",
      to: `${email}`,
      subject: "[REMIND] Create Request and get approval in this month",
      text: "",
      html: `Dear ${name},
      TMS would like to inform that the deadline to declare the Leave Application and Applications related to working time on TMS in is last 
      Day of this month. If without approved application on time will be counted as unexcused leave
      In case of force majeure and employees cannot create applications on TMS by the deadline, please send the Leave Request Form including Leave Time and 
      Manager's approval directly to bjergocean@gmail.com before next day.`
    };

    const result = await transport.sendMail(mailOption);
    return result;
  } catch (error) {
    return error;
  }
};

async function alertApproval(email, name) {
  try {
    const accessToken = await oAuth2client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "bjergocean@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOption = {
      from: "TIME MANAGEMENT SYSTEM 🎡 <bjergocean@gmail.com>",
      to: `${email}`,
      subject: "[REMIND] Get Appvoal Ticket Request TMS this month",
      text: "",
      html: `Dear ${name},
      TMS would like to inform that the deadline to declare the Leave Application and Applications related to working time on TMS in is last 
      Day of this month. You need to consider all request in your Business Unit to approve or reject.`
    };

    const result = await transport.sendMail(mailOption);
    return result;
  } catch (error) {
    return error;
  }
};

async function adminAproved(email, staff_name, admin_name) {
  try {
    const accessToken = await oAuth2client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "bjergocean@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOption = {
      from: "TIME MANAGEMENT SYSTEM 🎡 <bjergocean@gmail.com>",
      to: `${email}`,
      subject: "Hello from Time Management System: You have receive a new submission",
      text: "You have receive a new submission",
      html: `You have receive a new submission  from a ${staff_name} and get approvel from a ${admin_name}`,
    };

    const result = await transport.sendMail(mailOption);
    return result;
  } catch (error) {
    return error;
  }
}

module.exports = { sendMail, resetPass , alertLogRequest, alertApproval, adminAproved};
