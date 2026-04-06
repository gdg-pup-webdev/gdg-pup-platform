import { cz } from "@packages/typed-rest/shared";

export const ProductObject = cz.object({
  id: cz.string(),
  name: cz.string(),
  description: cz.string(),
  category: cz.string(),
  image: cz.string(),
  link: cz.string().url().optional(),
  createdAt: cz.string(),
  updatedAt: cz.string(),
});

export const ProductInsertDTO = cz.object({
  name: cz.string().min(1, "Product name is required"),
  description: cz.string().min(1, "Product description is required"),
  category: cz.string().min(1, "Product category is required"),
  image: cz.string().url("Image must be a valid URL"),
  link: cz.string().url("Link must be a valid URL").optional(),
});

export const ProductUpdateDTO = cz.object({
  name: cz.string().optional(),
  description: cz.string().optional(),
  category: cz.string().optional(),
  image: cz.string().url().optional(),
  link: cz.string().url().optional(),
});
