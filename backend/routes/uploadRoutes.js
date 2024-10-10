import path from "path";
import express from "express";
import multer from "multer";
import sharp from "sharp";
const router = express.Router();
// define the local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});
// which file should be accepted
const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Image Only"), false);
  }
};
// apply the image
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 },
});
// upload the single image middleware
const uploadSingleImage = upload.single("image");
// route for file uploads
router.post("/", (req, res) => {
  uploadSingleImage(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).send({ message: "Max file size is 1 MB" });
      }
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      // For image resolution
      try {
        const image = await sharp(req.file.path).metadata();

        if (image.width > 1000 || image.height > 1000) {
          return res
            .status(400)
            .send({ message: "Image dimensions must be 1000 x 1000 or less" });
        }
        res.status(200).send({
          message: "Image uploaded successfully",
          image: `/${req.file.path}`,
        });
      } catch (error) {
        res.status(500).send({ message: "Error processing image resolution" });
      }
    } else {
      res.status(400).send({ message: "No image file provided" });
    }
  });
});

export default router;
