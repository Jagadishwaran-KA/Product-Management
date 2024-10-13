import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export enum StatusCode {
  OK = 200,
  CREATED = 201,
  NOTFOUND = 404,
  SERVERERROR = 500,
  PRISMA = "P2025",
}

const ProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string().optional(),
  category: z.string(),
});
const Id = z.coerce.number();

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const id = Id.safeParse(req.params.id);
  if (!id.success) {
    res.status(StatusCode.NOTFOUND).json({ error: id.error.errors });
  } else {
    next();
  }
};

export const validateScehma = (partial: boolean) => {
  return (req: Request, res: Response, next: NextFunction) => {
    var data;
    if (partial) data = ProductSchema.partial().safeParse(req.body);
    else data = ProductSchema.safeParse(req.body);
    if (!data.success) {
      res.status(StatusCode.NOTFOUND).json({ error: data.error.errors });
    } else {
      next();
    }
  };
};

export const handleError = (error: any, req: Request, res: Response) => {
  if (error.code === StatusCode.PRISMA) {
    res
      .status(StatusCode.NOTFOUND)
      .json({ error: "No product found with id " + req.params.id });
  } else {
    res.status(StatusCode.SERVERERROR).send("Internal Server error " + error);
  }
};

export const handleResponse = (
  res: Response,
  statuscode: number,
  data: any
) => {
  res.status(statuscode).json(data);
};
