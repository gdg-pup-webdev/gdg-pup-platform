 

import { cz as z } from "@packages/typed-rest/shared";

import { AnyZodObject } from "zod/v3";

export const standardMetadata = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
});

export const metadataKeys = {
  id: true as true,
  createdAt: true as true,
  updatedAt: true as true,
  createdBy: true as true,
};

export function safeOmit<T extends AnyZodObject, K extends string>(
  schema: T,
  keysToOmit: K[],
) {
  const currentShape = schema.shape;
  const filteredShape: z.ZodRawShape = { ...currentShape };

  let newShape: z.ZodRawShape = {};

  Object.keys(filteredShape).forEach((key) => {
    if (key in keysToOmit) {
    } else {
      newShape = {
        ...newShape,
        [key]: filteredShape[key],
      } as z.ZodRawShape;
    }
  });

  return z.object(filteredShape);
}

export function omitSchema<
  T extends z.ZodObject<any, any>,
  K extends z.ZodObject<any, any>,
>(original: T, toRemove: K) {
  // 1. Get the keys from the metadata schema
  const metadataKeys = Object.keys(toRemove.shape);

  // 2. Convert the array ['id', 'createdAt'] into { id: true, createdAt: true }
  const omitConfig = metadataKeys.reduce(
    (acc, key) => {
      acc[key] = true;
      return acc;
    },
    {} as Record<string, true>,
  );

  // 3. Apply it
  const insert = original.omit(omitConfig);
  return insert;
}
