import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { app } from ".";

const ProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string().optional(),
  category: z.string(),
});
const Id = z.coerce.number();

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const id = Id.safeParse(req.body.id);
  if (!id.success) {
    res.status(400).json({ error: id.error.errors });
  } else {
    next();
  }
};

export const validateScehma = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = ProductSchema.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({ error: data.error.errors });
  } else {
    next();
  }
};
