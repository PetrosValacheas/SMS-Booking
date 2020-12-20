require("dotenv").config();
const bodyParser = require('body-parser');
const session = require('express-session');
const server = require('express')();
const messagingResponse = require('twilio').twiml.messagingResponse;
server.use(bodyParser.urlencoded({extended: true}));
server.use(session({secret: process.env.SESSION_SECRET}));
const port = process.env.EXPRESS_PORT || 3001;
const weekdays = process.env.WEEKDAYS.split(',');

server.get('/test', (request,response) => {

	response.send('Hello from nodemon');

});
server.post('/receive-sms', (request,response) => {

	const messageContent = request.body.Body;
	const state = request.session.step;
	console.log('body', body);
	console.log('state', state);
	let message;
	if(!state){

		request.session.step = 1;

		message = `Hi, do you want to book an appointment to:\
					see the gym \n
					book a personal trainer\n
					book a massage`;
	} else {

		switch(step){

			case 1:
				if(messageContent.includes(gym)){

					request.session.type = 'gym';

				} else if (messageContent.includes('personal')) {

					request.session.type = 'personal trainer';

				} else if(messageContent.includes('massage')) {

					reuest.session.type = 'masseur';
				} 
				if(!request.session.type) {

					message = 'Sorry i did not understand your request!';

				} else {

					request.session.step = 2;
					message = `What date do you want to see the ${request.session.type}`
				}
				console.log('step 1');
				break;
			case 2:

				const weekday = weekdays.filter(w => w.messageContent.includes(w));
				if(weekday.length === 0) {

					message = 'I am not sure what day of the week do u want to make a reservation!'

				} else if(weekday.length > 1) {

					request.session.step = 3;
					messgae = "Please select just one day for the booking!"

				} else {

					mesage = `Do you want to book it on ${weekday[0]}\n
								10am, 11am , 1pm , 4pm`

				}
				console.log('step 2');
				break;
			default: 
				console.log(`Could not find the step! for value ${step}`)

		}

		request.session.step = 2;
		message = ``
	}
	const twiml = new messagingResponse();
	twiml.message(message);
	console.log('response', twiml.toString());
	response.set('Content-Type', 'text/xml');
	response.send(twiml.toString());
});

server.listen(port, () => {

	console.log(`Listening on port ${port} `);

});

const from = process.env.PHONE_NUMBER;
const to = process.env.MY_NUMBER;

const twilio = require('twilio')(

	process.env.TOKEN_SID,
	process.env.TOKEN_SECRET,
	{

		accountSid: process.env.ACCOUNT_SID
	}
);

function sendSms(){

	twilio.messages.create({

		from,
		to,
		body: "Hello from Twilio"

	}).then((message) => console.log('Message sent with sid ${message.sid} '))
	.catch((error) => console.log(error));

}