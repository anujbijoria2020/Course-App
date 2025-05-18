require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user");
const { adminRouter } = require("./routes/admin");
const { courseRouter } = require("./routes/course");
const cors = require("cors");
const path  = require("path");
// const home = require("../frontend")


const app = express();
app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));
app.get("/",(req,res)=>{
    res.render("home")
})

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cors({
     origin: 'http://127.0.0.1:5500'
}));

//routes
app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);

async function main(){
    await mongoose.connect(process.env.MONGO_URL);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
}
main();
