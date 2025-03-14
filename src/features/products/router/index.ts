import { Router } from "express"
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/category"
import { auth } from "../../../middleware/auth"
import { forAdmin } from "../../../middleware/forAdmin"
export const productRouter = Router()
export const categoryRouter = Router()

// CATEGORY ROUTES
categoryRouter.post("/", auth, forAdmin, createCategory)
categoryRouter.put("/:id", auth, forAdmin, updateCategory)
categoryRouter.delete("/:id", auth, forAdmin, deleteCategory)
categoryRouter.get("/:title", getCategory)
categoryRouter.get("/", getCategories)
