import { customAlphabet } from "nanoid";

export const generateCouponCode = (length: number = 6): string =>
  customAlphabet("23456789abcdefghjkmnpqrstxyz", length)(); // 1,l,i, & 0, o & u, v, w are excluded to avoid confusion