import express from "express"
import bcrypt from "bcrypt"
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
    email: { type: String, required: true, unique: true },
    pass: { type: String, required: true }
});

const collection = new mongoose.model("credentials", logInSchema);


app.get("/", (req, res) => {
    res.render("login.ejs");
});

app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

app.post("/signup", async (req, res) => {

    const data = {
      fname: req.body["first_name"],
      lname: req.body["last_name"],
      contactnum: req.body["contact_number"],
      name: req.body["username"],
      email: req.body["email"],
      pass: req.body["password"]
    };

    const userData = await collection.insertMany(data);
    console.log(userData);
    

});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});








app.listen(port, () => {
    console.log(`Server Running On Port : ${port}`);    
});