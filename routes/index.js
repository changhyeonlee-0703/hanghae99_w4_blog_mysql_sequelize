import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.send("Hello, This is my homework page main.");
});

export default router;
