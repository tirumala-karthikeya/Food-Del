import express from "express"
import { addFood, listFood, removeFood } from "../controllers/foodController.js"
import multer from "multer"

const foodRouter = express.Router();

//Image Storage Engine

const isLambda = !!(process.env.LAMBDA_TASK_ROOT || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY)
const uploadDir = isLambda ? "/tmp/uploads" : "uploads"

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req,file,cb) =>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage: storage})

foodRouter.post("/add", upload.single("image"), addFood)
foodRouter.get('/list',listFood)
foodRouter.post('/remove',removeFood)


export default foodRouter;
