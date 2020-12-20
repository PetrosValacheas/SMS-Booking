require("dotenv").config();

const from = process.env.PHONE_NUMBER;
const to = process.env.MY_NUMBER;


const twilio = require('twilio')(

	process.env.TOKEN_SID,
	process.env.TOKEN_SECRET,
	{

		accountSid: process.env.ACCOUNT_SID
	}
);

twilio.messages.create({

	from,
	to,
	body: "Hello from Twilio"

}).then((message) => console.log('Message sent with sid ${message}'))
.catch((error) => console.log(error));