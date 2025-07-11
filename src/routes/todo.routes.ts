import express from "express";
import { z } from "zod";
import { todoCollection } from "../services/mongodb";
import { ObjectId } from "mongodb";

export const todoRouter = express.Router();

const todoSchema = z.object({
  text: z.string().min(1, "Text required"),
  completed: z.boolean(),
});
const updateSchema = z.object({
  text: z.string().min(1, "Text required").optional(),
  completed: z.boolean().optional(),
  _id: z.string(),
});
const deleteSchema = z.object({
  _id: z.string(),
});
todoRouter.post("/add-todo", async (req, res) => {
  try {
    const parsedData = todoSchema.parse(req.body);
    console.log(req.body);
    const todoText = {
      text: parsedData.text,
      completed: parsedData.completed,
    };
    const result = await todoCollection.insertOne({
      ...todoText,
    });

    console.log("Text inserted", result);

    return res.status(201).json({
      message: "Text added successfully",
      todoText,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error instanceof z.ZodError ? error.errors : "server error",
    });
  }
});
todoRouter.get("/todo-list", async (req, res) => {
  try {
    const todoList = await todoCollection.find().toArray();
    console.log(todoList);
    return res.status(200).json({
      message: "Todos fetched successfully",
      data: todoList,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error instanceof z.ZodError ? error.errors : "server error",
    });
  }
});
todoRouter.put("/edit-todo", async (req, res) => {
  try {
    const parsedData = updateSchema.parse(req.body);
    console.log(parsedData);

    const updatedText = {
      text: parsedData.text,
      completed: parsedData.completed,
    };
    console.log("updated Todo:", updatedText);

    const result = await todoCollection.updateOne(
      { _id: new ObjectId(parsedData._id) },
      { $set: updatedText }
    );
    if (result.matchedCount == 0) {
      return res.status(404).json({ message: "Todo not found" });
    }
    return res.status(200).json({ message: "Todo editted successfully" });
  } catch (error) {
    console.log("Update error", JSON.stringify(error));

    return res.status(500).json({ 
      message: "Server error",
      error: error instanceof z.ZodError ? error.errors : "server error",
    });
  }
});
todoRouter.delete("/delete-todo", async (req, res) => {
  try {
    const parsedData = deleteSchema.parse(req.body);
    console.log(parsedData);

    const result = await todoCollection.deleteOne({
      _id: new ObjectId(parsedData._id),
    });
    console.log("Delete result:", result);

    if (result.deletedCount == 0) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }
    return res.status(200).json({
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.log("Delete error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof z.ZodError ? error.errors : "server error",
    });
  }
});
