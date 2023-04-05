
const asyncHandler = require('express-async-handler');
var { activationEmail } = require('../config/email.js')
const authServices = require('../services/authServices.js');


//Service functions

// validate email using regex
const isValid = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

//Routes handling

// @desc    User register
// @route   POST /api/auth
// @access  Public
const register = asyncHandler(async (req, res) => {

  try {

    const { fname, lname, email, password } = req.body;
    //check if all fields are filled
    if (!fname || !lname || !email || !password) {
      res.status(400).json({ status: "Please fill all fields" });
    }

    //return if email is invalid
    if (!isValid(email)) {
      res.status(400).json({ status: "Invalid email" });
    }

    //check if email is already in use
    console.log(await authServices.userExistByEmail(email));
    if (await authServices.userExistByEmail(email)) {
      res.status(400).json({ status: "Email already in use" });
    }


    //create user
    const user = await authServices.register(fname, lname, email, password);

    // send activation email
    activationEmail(user.id, user.email, user.fname, user.lname);

    //return user
    res.status(201).json(user);

  } catch (error) {
    console.log(error);
  }
});

// @desc    User login
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if all fields are filled
    if (!email || !password) {
      res.status(400).json({ status: "Please fill all fields" });
    }

    const user = await authServices.login(email, password);

    if(!user) {
      res.status(400).json({ status: "Invalid credentials" });
    }


    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }

});

// @desc    User confirm email
// @route   GET /confirm/:id
// @access  Public
const confirm = asyncHandler(async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (id) {
      const userExist = await authServices.userExistByID(id);

      if (userExist) {
        const success = await authServices.confirm(id);

        if (success)
          res.status(200).redirect('http://social.karolradomski.pl/confirmed');
        else
          res.status(400).json({ status: "Problem with confirm email" });
      }
    } else {
      res.status(400).json({ status: "Invalid id" });
    }

  } catch (error) {
    console.log(error);
  }
});

// @desc    User resend activation email
// @route   POST /api/auth/resend
// @access  Public
const resend = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    //check if all fields are filled
    if (!email) {
      res.status(400).json({ status: "Please fill all fields" });
    }

    //check if user with this email exist
    const user = await authServices.userExistByEmail(email);

    if (!user) {
      res.status(400).json({ status: "User with this email doesn't exist" });
    }

    //check if email is already confirmed
    if (user.confirmed) {
      res.status(400).json({ status: "Email is already confirmed" });
    }

    console.log(user.id);
    // resend activation email
    activationEmail(user.id, user.email, user.fname, user.lname);

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }

});


// @desc    Change password
// @route   POST /api/auth/change
// @access  Private (authMiddleware)
const changePassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // //check if all fields are filled
    if (!oldPassword || !newPassword) {
      res.status(400).json({ status: "Please fill all fields" });
    }


    if( oldPassword === newPassword){
      res.status(400).json({ status: "New password can't be the same as old password" });
    }


    // //check if user with this email exist
    const user = await authServices.userExistByID(req.user.id);

    if (!user) {
      res.status(400).json({ status: "User with this email doesn't exist" });
    }



    // check if old password is correct
    const isMatch = await authServices.validatePassword(oldPassword, user.password);

    if (!isMatch) {
      res.status(400).json({ status: "Old password is incorrect" });
    }



    // change password
    const success = await authServices.changePassword(user.id, newPassword );

    if (!success) {
      res.status(400).json({ status: "Problem with changing password" });
    }




    res.status(200).json({ status: "Password changed" });

  } catch (error) {
    console.log(error);
  }

});




module.exports = {
  register,
  login,
  confirm,
  resend,
  changePassword
};
