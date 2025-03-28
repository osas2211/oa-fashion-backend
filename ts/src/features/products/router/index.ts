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
  batchAddProducts,
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product"
import { addToCart, getUserCart, removeFromCart } from "../controllers/cart"
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/order"
import {
  createCollection,
  deleteCollection,
  getCollection,
  getCollections,
  updateCollection,
} from "../controllers/collection"
export const productRouter = Router()
export const cartRouter = Router()
export const orderRouter = Router()
export const categoryRouter = Router()
export const collectionRouter = Router()

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
productRouter.post("/batch-add-products", auth, forAdmin, batchAddProducts)
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

// CART ROUTES
cartRouter.get("/", auth, getUserCart)
cartRouter.put("/add", auth, addToCart)
cartRouter.delete("/remove", auth, removeFromCart)

// ORDER ROUTES
orderRouter.post("/", auth, createOrder)
orderRouter.patch("/:id", auth, updateOrderStatus)
orderRouter.get("/", auth, getUserOrders)
orderRouter.get("/all", auth, forAdmin, getAllOrders)

// CATEGORY ROUTES
categoryRouter.post("/", auth, forAdmin, upload.single("image"), createCategory)
categoryRouter.put("/:id", auth, forAdmin, updateCategory)
categoryRouter.delete("/:id", auth, forAdmin, deleteCategory)
categoryRouter.get("/:title", getCategory)
categoryRouter.get("/", getCategories)

// COLLECTION ROUTES
collectionRouter.post(
  "/",
  auth,
  forAdmin,
  upload.single("image"),
  createCollection
)
collectionRouter.put("/:id", auth, forAdmin, updateCollection)
collectionRouter.delete("/:id", auth, forAdmin, deleteCollection)
collectionRouter.get("/:title", getCollection)
collectionRouter.get("/", getCollections)
