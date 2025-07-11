import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import {todoRouter} from "../src/routes/todo.routes"

const app = express();
const port = process.env.PORT || 3000;
app.use(cors({ origin: "*" })); 

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


app.use("/todo", todoRouter);
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.listen(port,  () => {
  console.log(`Server is running at http://localhost:${port}`);
});
