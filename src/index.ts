require("dotenv").config();
import prisma from "./db";
import express, { Request, Response } from "express";
import { validateId, validateScehma } from "./utils";

export const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello :)");
});

app.get("/products", async (req: Request, res: Response) => {
  const data = await prisma.product.findMany();
  res.json(data);
});

app.get("/products/:id", validateId, async (req: Request, res: Response) => {
  try {
    const data = await prisma.product.findUniqueOrThrow({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(data);
  } catch (error: any) {
    if (error.code === "P2025") {
      res
        .status(400)
        .json({ error: "No product found with id " + req.params.id });
    } else {
      res.status(500).send("Internal Server error " + error);
    }
  }
});

app.post("/products", validateScehma, async (req: Request, res: Response) => {
  await prisma.product.create({
    data: req.body,
  });
  res.status(201).json({ message: "Data has been Added successfully" });
});

app.put(
  "/products/:id",
  validateId,
  validateScehma,
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      const data = await prisma.product.update({
        where: {
          id: id,
        },
        data: req.body,
      });

      res.status(200).json({ message: "Product has been updated", data });
    } catch (error: any) {
      if (error.code === "P2025") {
        res.status(404).json({ error: `No product with the given id ${id}` });
      } else {
        res.status(500).send("Internal Server error " + error);
      }
    }
  }
);

app.delete("/products/:id", validateId, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.product.delete({
      where: {
        id: id,
      },
    });
    res.status(200).send(`Product with the id ${id} has been deleted`);
  } catch (error: any) {
    if (error.code === "P2025") {
      res
        .status(400)
        .json({ error: "No product found with the given id " + id });
    } else {
      res.status(500).send("Internal Server error " + error);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
