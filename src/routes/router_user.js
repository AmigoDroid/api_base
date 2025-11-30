import { Router } from "express";
const user = Router();

user.get("/users", (req, res) => {
  res.json({ message: "List of users" });
});
export { user };