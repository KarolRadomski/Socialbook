const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: process.env.SMPT_HOST,
  port: 25,
  secure: false,
  auth: {
    user: process.env.SMPT_USER,
    pass: process.env.SMPT_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});


const activationEmail = (id, email, fname, lname) => {
  if (!id || !email || !fname || !lname) return console.log('Brak danych do wysłania wiadomości');

  const mailOptions = {
    from: 'SocialApp@karolradomski.pl',
    to: email,
    subject: 'Potwierdzenie rejestracji',
    html: `<h3>Witaj ${fname} ${lname}</h3>
    Aby aktywować swoje konto potwierdź rejestrację w serwisie SocialApp klikacją w link poniżej: <br>
    <a href="http://social.karolradomski.pl/confirm/${id}">Aktywuj konto</a>`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Wiadomość wysłana: ' + info.response);
    }
  });


}

module.exports = {
  activationEmail,
};



