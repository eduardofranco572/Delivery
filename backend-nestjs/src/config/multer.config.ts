import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerUploadConfig = {
    storage: diskStorage({
        destination: './uploads/company/imgs',
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        }
    })
};

export const multerProductConfig = {
    storage: diskStorage({
        destination: './uploads/company/products/imgs',
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        }
    })
};