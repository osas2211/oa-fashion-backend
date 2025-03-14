import { Router } from "express"
import { createCategory } from "../controllers/category"
import { auth } from "../../../middleware/auth"
import { forAdmin } from "../../../middleware/forAdmin"
export const productRouter = Router()
export const categoryRouter = Router()

// CATEGORY ROUTES
categoryRouter.post("/", auth, forAdmin, createCategory)
