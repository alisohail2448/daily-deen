const smsId = process.env.SMS_ID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;

const accountSid = "AC00a0e0f4c8e0f6e6bd7a872711bbe872";
const authToken = "31fb3f75a5406f0c7aed80aa0e5efcde";
const client = require("twilio")(accountSid, authToken);

const sendSms = async (phoneNumber, password) => {
//   const newPhone = "+91" + phoneNumber;
const newPhone = "+917249047105"
  try {
    const response = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: newPhone,
      body: `You Added to Communtiy of Your Aalim/Hafiz. your account details are ID: ${phoneNumber}  and Password: ${password}`,
    });
    console.log("Message sent successfully:", response.sid);
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};

module.exports = { sendSms };
