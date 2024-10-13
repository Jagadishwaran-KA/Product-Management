require("dotenv").config();
import prisma from "./db";
import express, { Request, Response } from "express";
import {
  handleError,
  validateId,
  validateScehma,
  StatusCode,
  handleResponse,
} from "./utils";

export const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get("/products", async (req: Request, res: Response) => {
  const data = await prisma.product.findMany();
  handleResponse(res, StatusCode.OK, data);
});

app.get("/products/:id", validateId, async (req: Request, res: Response) => {
  try {
    const data = await prisma.product.findUniqueOrThrow({
      where: {
        id: Number(req.params.id),
      },
    });
    handleResponse(res, StatusCode.OK, data);
  } catch (error: any) {
    handleError(error, req, res);
  }
});

app.post(
  "/products",
  validateScehma(false),
  async (req: Request, res: Response) => {
    await prisma.product.create({
      data: req.body,
    });
    handleResponse(res, StatusCode.CREATED, {
      message: "Data has been Added successfully",
    });
  }
);

app.put(
  "/products/:id",
  validateId,
  validateScehma(true),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      const data = await prisma.product.update({
        where: {
          id: id,
        },
        data: req.body,
      });

      handleResponse(res, StatusCode.OK, {
        message: "Product has been updated",
        data,
      });
    } catch (error: any) {
      handleError(error, req, res);
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

    handleResponse(res, StatusCode.OK, {
      message: `Product with the id ${id} has been deleted`,
    });
  } catch (error: any) {
    handleError(error, req, res);
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
