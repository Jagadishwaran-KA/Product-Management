require("dotenv").config();
import prisma from "./db";
import express, { query, Request, Response } from "express";
import {
  handleError,
  validateId,
  validateSchema,
  StatusCode,
  handleResponse,
} from "./utils";
import type { skip } from "@prisma/client/runtime/library";

export const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get("/products", async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const data = await prisma.product.findMany({
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  });
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
  validateSchema(false),
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
  validateSchema(true),
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
