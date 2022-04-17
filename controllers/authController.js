const User = require('../models/User');
const jwt = require('jsonwebtoken');
const handleError = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: ""}
  if(err.code === 11000){
    errors.email = "Email already taken";
    return errors;
  }
  //validation errors
  if(err.message.includes('user validation failed')){
    Object.values(err.errors).map(({properties}) => {
      console.log(properties)
      errors[properties.path] = properties.message
    })
  }
  //incorrect email
  if(err.message === 'Invalid email'){
    errors.email = err.message
  }
  //incorrect password
  if(err.message === 'Incorrect password'){
    errors.password = err.message
  }
  return errors
}

const createToken = (id) => {
  return jwt.sign({id}, 'vamshi gujjuboina', {expiresIn: 3600*60*60*24});
}
module.exports.signup_get = (req,res) => {
  res.render('signup')
}

module.exports.login_get = (req,res) => {
  res.render('login')
}

module.exports.signup_post = async (req,res) => {
  // console.log(req.body)
  const { email,password } = req.body
  console.log(email,password)
  try {
    const user  = new User({email,password});
    await user.save();
    // const user = await User.create({
    //   email,
    //   password
    // });
    const token = createToken(user._id);
    res.cookie('jwt',token, {httpOnly:true})
    res.status(200).send({user: user._id});
  }
  catch (err) {
    const error = handleError(err)
    res.status(404).json({error})
  }
  // try {
  //   // const user = await User.create({email,password});
  //   // res.status(201).json(user)
  //   const user = new User({email,password});
  //   await user.save();
  //   res.status(200).send(user)
  // }
  // catch (err) {
  //   console.log(err);
  //   res.status(400).send("Error user not created");
  // }
  // res.send('new signup')
}

module.exports.login_post = async (req,res) => {
  const {email,password} = req.body;
  try {
    const user = await User.login(email,password);
    const token = createToken(user._id);
    res.cookie('jwt',token, {httpOnly:true})
    res.status(200).json({user:user._id})
  }
  catch (err) {
    const error = handleError(err);
    res.status(400).json({error});
  }
}

module.exports.logout_get = (req,res) => {
  res.cookie('jwt','',{maxAge: 1});
  res.redirect('/');
}