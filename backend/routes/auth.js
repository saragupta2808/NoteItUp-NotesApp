const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const { findOne } = require("../models/Note");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "thisismysecretkeyforsignature";
var fetchUser= require("../middleware/fetchUser");

//ROUTE 1: create a user using POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Name can not be less than 3 characters").isLength({ min: 3 }),
    body("password", "Password can not be less than 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //if there are errors return bad request and errors
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    //check if user with this email already exists
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success,error: "Sorry a user with this email already exists" });
      }
      //as we used async we need to wait for the promise to be resolved that's why we use await
      //if user not present create a new user
      const salt =  bcrypt.genSaltSync(10);
      const securepass = bcrypt.hashSync(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securepass,
      });
      //create an authentication tokrn for the user - json web token (jwt)
      const data = {
        user: {
          id: user.id,
        }
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success=true;
      //console.log(authtoken);
      res.json({success,authtoken });
      //res.json(user) //to see response in our api call
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some internal error occured");
    }

    // console.log(req.body);
    // const user=User(req.body);
    // user.save();
    // res.send(req.body);
  }
);




//ROUTE 2: create a user using POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be empty").exists()
  ],
  async (req, res) => {
    //if there are errors return bad request and errors
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }

    const {email,password}= req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success,error: "Incorrect credentials" });
      }

      const passwordcomp= await bcrypt.compare(password,user.password);
      if(!passwordcomp){
        return res.status(400).json({ success,error: "Incorrect credentials" });
      }
      const data = {
        user: {
          id: user.id,
        }
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.send({success,authtoken});

  }catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal error occured");
  }
}

)

//ROUTE 3 : get user details using POST "/api/auth/getuser". Login required
router.post(
  //fetchuser is a middleware function which is used to authenticate the user from the auth-token, so we can use it anywhere we want to verify the user id
  "/getuser", fetchUser,  async (req, res) => {
    try {
      const userId=req.user.id;
      const user= await User.findById(userId).select("-password");
      res.send(user)
      
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some internal error occured");
    }
    
    }
)





module.exports = router;
