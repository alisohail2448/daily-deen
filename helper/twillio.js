const accountSid = process.env.SMS_ID;
const authToken = process.env.SMS_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

console.log("accountSid", accountSid)
console.log("authToken", authToken)
console.log("phoneNumber", phoneNumber)

const client = require("twilio")(accountSid, authToken);

const sendSms = async (phoneNumber, password) => {
//   const newPhone = "+91" + phoneNumber;
const newPhone = "+917249047105"
console.log("password", password)
  try {
    const response = await client.messages.create({
      from: phoneNumber,
      to: newPhone,
      body: `You Added to Communtiy of Your Aalim/Hafiz. your account details are ID: ${phoneNumber}  and Password: ${password}`,
    });
    console.log("Message sent successfully:", response.sid);
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};

module.exports = { sendSms };
