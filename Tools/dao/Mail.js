
exports.send = function (email, subject, content, callback){
	var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'sawyerzhou2016@gmail.com',
        pass: '19940423'
    }
	});

	var mailOptions = {
		from: 'sawyerzhou2016@gmail.com', 
		to: email, 
		subject: subject, 		
		text: content, // 
		//html: '<b>Hello world ?</b>' // html 
	};
	  transporter.sendMail(mailOptions, callback);
   
}