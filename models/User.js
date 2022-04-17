const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true,"Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a validate email"]
  },
  password: {
    type: String,
    required: [true,"Please enter password"],
    minlength: [6,"Please enter password greater than required"]
  }
});

//fire a function after doc saved to db
userSchema.post('save',(doc,next) => {
  console.log('New user created', doc);
  next();
})

//fire a function before doc saved to db
userSchema.pre('save', async function (next) {
  console.log('User about to be created',this)
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password,salt);
  next();
});

//static method to login
userSchema.statics.login = async function(email,password) {
  const user = await this.findOne({email});
  if(user) {
    const auth = await bcrypt.compare(password,user.password);
    if(auth) {
      return user
    }
    throw Error('Incorrect password')
  }
  throw Error('Invalid email');
}

const User = mongoose.model('user', userSchema);

module.exports = User;