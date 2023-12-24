import express, { Request, Response } from "express";
const PORT = 8000;
const app = express();

app.get("/", (req: Request, res: Response) => res.send("Hello rld"));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
