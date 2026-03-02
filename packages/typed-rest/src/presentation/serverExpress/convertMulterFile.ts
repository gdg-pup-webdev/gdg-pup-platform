export const convertMulterFile = (f: Express.Multer.File) => {
  return new File([new Uint8Array(f.buffer)], f.originalname, {
    type: f.mimetype,
    lastModified: Date.now(),
  });
};
