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
import upload from "../../../middleware/multer"
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product"
import { addToCart, getUserCart, removeFromCart } from "../controllers/cart"
export const productRouter = Router()
export const cartRouter = Router()
export const categoryRouter = Router()

// PRODUCT ROUTES
productRouter.post(
  "/",
  auth,
  forAdmin,
  upload.fields([
    { name: "preview_image", maxCount: 1 },
    { name: "subImages", maxCount: 10 },
  ]),
  createProduct
)
productRouter.get("/:id", getProduct)
productRouter.get("/", getProducts)
productRouter.put(
  "/:id",
  auth,
  forAdmin,
  upload.fields([
    { name: "preview_image", maxCount: 1 },
    { name: "subImages", maxCount: 10 },
  ]),
  updateProduct
)
productRouter.delete("/:id", auth, forAdmin, deleteProduct)

// CART
cartRouter.get("/", auth, getUserCart)
cartRouter.put("/add", auth, addToCart)
cartRouter.delete("/remove", auth, removeFromCart)

// CATEGORY ROUTES
categoryRouter.post("/", auth, forAdmin, upload.single("image"), createCategory)
categoryRouter.put("/:id", auth, forAdmin, updateCategory)
categoryRouter.delete("/:id", auth, forAdmin, deleteCategory)
categoryRouter.get("/:title", getCategory)
categoryRouter.get("/", getCategories)
