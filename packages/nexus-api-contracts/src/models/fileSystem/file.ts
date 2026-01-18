import z from "zod"


export const row = z.object({
  id: z.string(),
  title: z.string(), 
  creatorId: z.string(),
  createdAt: z.string(), 
  previewUrl: z.string(), // for display in browsers. usually the same with download url  
  downloadUrl: z.string(), // to download the image
  bucketRef: z.string(), // reference to the external bucket 
})

export const insert = row.pick({
  title: true,
})


export const update = insert.partial();

