const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const app = express();
const cookieParser = require('cookie-parser');
const { requieAuth, checkUser } = require('./middleware/authMiddleware');
// const bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://vamshi:vamshi@cluster0.q5u15.mongodb.net/test';
const port = process.env.PORT || 3000
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(port))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requieAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes)

//cookies
app.get('/set-cookies', (req,res) => {
  // res.setHeader('Set-Cookie','newUser=true')
  res.cookie('newUser',false)
  res.cookie('isEmployee',true, { httpOnly: true})
  res.cookie('emp',{name: 'vamshi', age: 21})
  res.send('You got the cookies');
});

app.get('/read-cookies', (req,res) => {

  const cookies = req.cookies;
  console.log(cookies.emp.name)
  res.send(cookies)

})