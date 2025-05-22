// src/uploads/multer.config.ts
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

const uploadDir: string = path.join(__dirname, '../../public/uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage: multer.StorageEngine = multer.diskStorage({
  destination: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ): void => {
    const typeDir: string = path.join(uploadDir, file.fieldname + 's');
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir);
    }
    cb(null, typeDir);
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ): void => {
    const randomName: string = Date.now() + '-' + Math.round(Math.random() * 1e9).toString();
    const ext: string = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${randomName}${ext}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const filetypes: RegExp = /jpeg|jpg|png|gif|mp4|mov|avi|mkv|webm/;
  const extname: boolean = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype: boolean = filetypes.test(file.mimetype);

  if (extname && mimetype) cb(null, true);
  else cb(new Error(`Only ${filetypes.toString()} files are allowed!`));
};

export const upload: multer.Multer = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 500, // 500MB
  },
});

export const uploadFields = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]);
