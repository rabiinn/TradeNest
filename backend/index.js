import express from "express";

const app = express();

app.get("/ping", (req, res) => {
  res.json({ message: "Pong" });
});

app.listen(3000, () => {
  console.log("App running");
});
