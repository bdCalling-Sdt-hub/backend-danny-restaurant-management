import { z } from "zod";
const createBranchSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required." }),
    location: z.string({ required_error: "Location is required" }),
  }),
});
const updateBranchSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    location: z.string().optional(),
  }),
});

export const branchValidation = {
  createBranchSchema,
  updateBranchSchema,
};
