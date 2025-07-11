import { MongoClient } from "mongodb";
import { mongodbUri } from "../variables";
require("dotenv").config();

export const dbClient = new MongoClient(mongodbUri);
export const database = dbClient.db("Todo-Database");

export const todoCollection = database.collection("todo");