//express http server
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();

app.use(
  cors({
    origin: '*',
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/API/auth', require('./routes/authRoutes'));

// to jest do zmiany, w przyszłości będzie to /API/auth/confirm a frontend będzie ustawiony na /confirm
app.use('/confirm', require('./routes/confirmRoutes'));

// app.listen(5003, '0.0.0.0', () => {
//   console.log('Server is running on port 5003');
// });
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
