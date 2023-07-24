import multer from "multer";
import path from "path";

const upload = async (destination: string) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${path.extname(file.originalname)}`);
    },
  });
};

export default upload;
