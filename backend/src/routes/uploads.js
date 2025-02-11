import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'uploads');
    },
    filename: function(req, file, callback) {
        const accepted = ['image/jpeg', 'image/png', 'application/pdf'];
        if(!accepted.includes(file.mimetype)) callback(new Error(`${file.mimetype} is not allowed`));
        callback(null, file.originalname);
    }
});

const upload = multer({storage});

router.post('/', upload.array('images'), (req, res) => {
    res.json({success: true, payload: req.files});
});

export default router;