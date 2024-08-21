const accountSid = process.env.SMS_ID;
const authToken = process.env.SMS_AUTH_TOKEN;

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
