import { cz } from "@packages/typed-rest/shared";

export const GdgMerchObject = cz.object({
  id: cz.string(),
  name: cz.string(),
  image: cz.string(),
  points: cz.number(),
  stock: cz.number(),
  createdAt: cz.string(),
  updatedAt: cz.string()
});

export const GdgMerchInsertDTO = cz.object({
  name: cz.string(),
  image: cz.string(),
  points: cz.number(),
  stock: cz.number()
});

export const GdgMerchUpdateDTO = cz.object({
  name: cz.string().optional(),
  image: cz.string().optional(),
  points: cz.number().optional()
});

export const GdgMerchRestockDTO = cz.object({
  amount: cz.number().positive()
});

export const GdgMerchRedeemDTO = cz.object({
  userId: cz.string()
});
