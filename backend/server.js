import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors())

// Ensure MongoDB is connected before any /api route runs. On a cold
// serverless container the first query would otherwise fire before the
// connection is ready and hit Mongoose's 10s buffering timeout.
app.use("/api", async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (err) {
    console.error("DB connect error:", err)
    res.status(503).json({ success: false, message: "Database unavailable" })
  }
})

app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

app.get("/", (req, res) => {
  res.send("api working")
})

const isLambda = !!(process.env.LAMBDA_TASK_ROOT || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY)
if (!isLambda) {
  app.listen(port, () => {
    console.log(`server started on http://localhost:${port}`)
  })
}

export default app
