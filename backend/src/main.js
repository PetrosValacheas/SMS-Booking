require("dotenv").config();
const bodyParser = require('body-parser');
const session = require('express-session');
const server = require('express')();
const messagingResponse = require('twilio').twiml.messagingResponse;
server.use(bodyParser.urlencoded({extended: true}));
server.use(session({secret: process.env.SESSION_SECRET}));
const port = process.env.EXPRESS_PORT || 3001;

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

					reuest.session.type = 'personal trainer';

				} else if(messageContent.includes('massage')) {

					reuest.session.type = 'masseur';
				} 

				if(!request.session.type) {

					messgae = 'Sorry i did not understand your request!';
				} else {

					request.session.step = 2;
					message = `What date do you want to see the ${request.session.type} `
				}
				conosle.log('step 1');
				break;
			case 2:
				messgae = "step 2";
				request.session.step = 3;
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