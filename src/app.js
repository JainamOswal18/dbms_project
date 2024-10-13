import express from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
// import collection from "./config"

const app = express();
const port = 3000;

// convert data into json format
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const connect = mongoose.connect(
  "mongodb://localhost:27017/web_app_users_data"
);

// check database is connected or not
connect
  .then(() => {
    console.log("Database Is Connected");
  })
  .catch(() => { 
    console.log("Database Connection Failed");
  });

// create a schema
const logInSchema = new mongoose.Schema({
  fName: { type: String, required: true },
  lName: { type: String, required: true },
  contactNum: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  pass: { type: String, required: true },
});

const User = new mongoose.model("credentials", logInSchema);

app.get("/", (req, res) => {
  res.render("login.ejs");
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

// app.post("/signup", async (req, res) => {
//   const data = {
//     fname: req.body["first_name"],
//     lname: req.body["last_name"],
//     contactnum: req.body["contact_number"],
//     name: req.body["username"],
//     email: req.body["email"],
//     pass: req.body["password"],
//   };

  // // check if the user already exists in the db
  // const userNameExist = await User.findOne({ name: data.name});
  // const contactNumExist = await User.findOne({contactNum: data.contactnum});
  // const emailExist = await User.findOne({email: data.email});

  // if (userNameExist) {
  //   res.send("Username already exists. Please choose a different user name");
  // } else if (contactNumExist) {
  //   res.send("Contact number already exists. Please choose a different contact num");
  // } else if (emailExist) {
  //   res.send("Email already exists. Please choose a different email");
  // }

//   // await User.collection.insertMany([data]);
//   // res.render("login.ejs");
//   // const userData = await collection.insertMany(data);
//   // console.log(userData);
// });

app.post("/signup", async (req, res) => {

  const data = {
    fName: req.body["first_name"],
    lName: req.body["last_name"],
    contactNum: req.body["contact_number"],
    name: req.body["username"],
    email: req.body["email"],
    pass: req.body["password"],
  };

  // check if the user already exists in the db
  const userNameExist = await User.findOne({ name: data.name });
  const contactNumExist = await User.findOne({ contactNum: data.contactnum });
  const emailExist = await User.findOne({ email: data.email });

  if (userNameExist) {
    res.send("Username already exists. Please choose a different user name");
  } else if (contactNumExist) {
    res.send("Contact number already exists. Please choose a different contact num");
  } else if (emailExist) {
    res.send("Email already exists. Please choose a different email");
  }
  // hash the password 
  const saltedRounds = 10;
  const hashedPassword = await bcrypt.hash(data.pass, saltedRounds);
  data.pass = hashedPassword; // replace the password with hashed password`
  
  console.log("User data to save:", data);
  const userData = new User(data);

  try {
    await userData.save();
    console.log("User saved successfully", { userData });
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    res.json({ msg: "not ok" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const check = await User.findOne({ name: req.body["username"] });
    if (!check) {
      res.send("Username Not Found");
    }

    // compare the hash password from the database with the plain text
    const isPasswordMatch = await bcrypt.compare(req.body.password, check.pass);
    if (isPasswordMatch) {
      res.render("home.ejs");
    } else {
      res.send("Wrong Credentials");
    }

  } catch {
    res.send("Wrong Details");
  }
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.listen(port, () => {
  console.log(`Server Running On Port : ${port}`);
});
