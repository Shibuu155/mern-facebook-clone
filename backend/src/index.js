const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const User = require("../modals/registerSchema");
const bcrypt = require("bcryptjs");

const port = process.env.PORT;

// middleware
app.use(express.json());
app.use(cors());

// database config
require("../db/conn");

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Hello buddy don't gave up until you succedd Best of wishes buddy",
  });
});

app.post("/signin", async (req, res) => {
  const { name, email, phone, age, occupation, password, cpassword } = req.body;
  if (
    !name ||
    !email ||
    !phone ||
    !age ||
    !occupation ||
    !password ||
    !cpassword
  ) {
    return res.status(422).send({
      error: "All fields are Required",
    });
  }
  try {
    const emailRegex =
      "/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/";
    const phoneLength = phone.toString().length;
    const emailExist = await User.findOne({ email });
    const phoneExist = await User.findOne({ phone });

    if (!email.match(emailRegex)) {
      return res.status(422).send({
        error: "Enter Valid Email",
      });
    } else if (emailExist) {
      return res.status(422).send({
        error: "Email already Exists",
      });
    } else if (phoneLength !== 10) {
      return res.status(422).send({
        error: "Enter Valid Phone",
      });
    } else if (phoneExist) {
      return res.status(422).send({
        error: "Phone already Exists",
      });
    } else if (password !== cpassword) {
      return res.status(422).send({
        error: "Passwords not matched",
      });
    }

    const user = new User({
      name,
      email,
      phone,
      age,
      occupation,
      password,
      cpassword,
    });

    await user.save();
    await res.status(201).send({
      message: "Registeration Sucessfully",
    });
  } catch (error) {
    console.log(`Error BS: ${error}`);
  }
});

// login auth
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({
      message: "Both fields are Required",
    });
  }
  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(422).send({
        message: "Invalid Credentials",
      });
    }
    const hashPassword = userExist.password;
    const ans = await bcrypt.compare(password, hashPassword);
    if (!ans) {
      return res.status(422).send({
        message: "Invalid Credentials",
      });
    } else {
      const token = await userExist.generateAuthToken();
      res.cookie("loginToken", token, {
        expires: new Date(Date.now() + 25800000),
        httpOnly: true,
      });
      console.log(token);
      return res.status(200).send({
        message: "Login Successfully",
      });
    }
  } catch (error) {
    console.log(`Error BL: ${error}`);
  }
  console.log("Hello I am Login Page");
});

// get all the data
app.get("/allData", (req, res) => {
  res.status(200).send({
    data: "You get all the Data",
  });
});

app.listen(port, () => {
  console.log(`Listening at port number ${port}`);
});
