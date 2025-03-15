import { Request, Response } from "express"
import { collectionModel } from "../model/collection"
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary"

export const createCollection = async (req: Request, res: Response) => {
  try {
    const { title } = req.body as {
      title: string
    }
    if (!req.file) {
      const collection = await collectionModel.create({ title })
      res
        .status(201)
        .json({ success: true, message: "Collection created", collection })
    } else {
      const upload_result = await uploadToCloudinary(
        req.file.buffer,
        "product_collection_uploads"
      )
      const collection = await collectionModel.create({
        title,
        preview_image: upload_result.secure_url,
      })
      res
        .status(201)
        .json({ success: true, message: "Collection created", collection })
    }
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error?.message })
    return
  }
}

export const getCollection = async (req: Request, res: Response) => {
  try {
    const { title } = req.params
    const collection = await collectionModel
      .findOne({ title })
      .populate("products")
    if (!collection) {
      res.status(404).json({ success: false, message: "Collection not found" })
    } else {
      res.status(200).json({
        success: true,
        message: "Collection fetched successfully",
        collection,
      })
    }
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error?.message })
    return
  }
}

export const getCollections = async (req: Request, res: Response) => {
  try {
    const collections = await collectionModel.find()
    if (!collections) {
      res.status(404).json({ success: false, message: "Collections not found" })
    } else {
      res.status(200).json({
        success: true,
        message: "Collections fetched successfully",
        collections,
      })
    }
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error?.message })
    return
  }
}

export const updateCollection = async (req: Request, res: Response) => {
  try {
    const { title, preview_image } = req.body as {
      title: string
      preview_image?: File
    }
    const { id } = req.params
    const collection = await collectionModel.findById(id)
    if (!collection) {
      res.status(404).json({ success: false, message: "Collection not found" })
    } else {
      if (!preview_image) {
        await collection.updateOne({ title })
        const newCollection = await collection.save()
        res.status(201).json({
          success: true,
          message: "Collection updated",
          collection: newCollection,
        })
      } else {
        await collection.updateOne({ title })
        await collection.save()
        res
          .status(201)
          .json({ success: true, message: "Collection updated", collection })
      }
    }

    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error?.message })
    return
  }
}

export const deleteCollection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const collection = await collectionModel.findById(id)
    if (!collection) {
      res.status(404).json({ success: false, message: "Collection not found" })
    } else {
      await collection.deleteOne()
      res.status(200).json({
        success: true,
        message: "Collection deleted successfully",
      })
    }
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error?.message })
    return
  }
}
