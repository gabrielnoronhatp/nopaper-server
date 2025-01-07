import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";

const app = express();

require('./config/passport');
app.use(passport.initialize());
app.use(cors());
app.use(bodyParser.json());



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;
