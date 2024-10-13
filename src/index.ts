require("dotenv").config();
import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
const app = express();
app.use(express.json());
const PORT = 3000;

const prisma = new PrismaClient();

app.get("/products", async (req: Request, res: Response) => {
  const data = await prisma.product.findMany();
  res.json(data);
});

app.get("/products/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (id) {
      const data = await prisma.product.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (data) res.send(data);
      else res.send({ message: "No data Found with the given id" });
    } else res.send({ message: "Provide a valid Id" });
  } catch (error) {
    console.error(error);
  }
});

app.post("/products", async (req: Request, res: Response) => {
  const product = await prisma.product.create({
    data: req.body,
  });
  res.json({ message: "Product addedd successfully", product });
});

app.post("/products/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (data) res.json(data);
    else res.json({ message: "Product Not Found" });
  } catch (error) {
    throw new Error("Error occurred whiled finding product" + error);
  }
});

app.put("/products/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: req.body,
    });
    if (data)
      res.status(200).json({ message: "Product has been updated", data });
    else res.send({ message: "Product with the given id doesnt exist" });
  } catch (error) {
    console.error(error);
  }
});

app.delete("/products/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });
    if (data) res.send({ message: "Product has been deleted" });
    else throw new Error("Invalid Id");
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server Started on Port ${PORT}`);
});

// TODO
// *Input Validation using Zod
// *Error Handling
// *Express Routing
// *Singleton Class for Prisma
// *Database Connect,Disconnect
// *Dot Env Port Issue
// *Api Testing
// *Pagination for Get Endpoint /Products
// *Database Seeding
