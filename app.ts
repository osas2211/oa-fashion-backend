import express, { Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import { env_variables } from "./src/utils/env_variables"
import http from "http"
import { connectDB } from "./src/db/db"
import { userRouter } from "./src/features/users/routes"
import {
  cartRouter,
  categoryRouter,
  productRouter,
} from "./src/features/products/router"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api/v1", userRouter)
app.use("/api/v1/product", productRouter)
app.use("/api/v1/cart", cartRouter)
app.use("/api/v1/category", categoryRouter)

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ connected: true, message: "WELCOME TO THE O.A FASHION" })
  return
})

const server = http.createServer(app)

const port = env_variables.PORT || 10000

server.listen(port, async () => {
  try {
    await connectDB()
    console.log("db connected")
    console.log(`server is running at PORT ${port}`)
  } catch (error: any) {
    console.log(error.message)
  }
})
