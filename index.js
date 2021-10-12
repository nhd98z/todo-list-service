const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

mongoose.connect("mongodb://localhost:27017/todo-list");

const Todo = mongoose.model(
  "Todo",
  new Schema({
    title: String,
    isFinish: Boolean,
  })
);

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello.");
});

app.get("/todo-list", async (req, res) => {
  console.log("GET: /todo-list");
  const todos = await Todo.find();
  res.send(
    todos.map((todo) => {
      return {
        id: todo._id.toString(),
        title: todo.title,
        isFinish: todo.isFinish,
      };
    })
  );
});

app.post("/todo-list", async (req, res) => {
  console.log("POST: /todo-list");
  const { title } = req.body;
  const newTodo = new Todo({ title, isFinish: false });
  await newTodo.save();
  res.sendStatus(200);
});

app.put("/todo-list/:id", async (req, res) => {
  console.log("PUT: /todo-list/:id");
  const { id } = req.params;
  const todo = await Todo.findById(id);
  await todo.update({ isFinish: !todo.isFinish });
  res.sendStatus(200);
});

app.delete("/todo-list/:id", async (req, res) => {
  console.log("DELETE: /todo-list/:id");
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.sendStatus(200);
});

const port = 8000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
