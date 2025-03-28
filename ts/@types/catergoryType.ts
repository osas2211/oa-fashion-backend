import { ProductType } from "./productType"

export type CategoryType = {
  title: string // USE THE TITLE TO FETCH CATEGORIES
  id: string
  preview_image?: string
  products: ProductType[]
}

export type createCategoryPayloadType = {
  title: string // USE THE TITLE TO FETCH CATEGORIES
  preview_image?: File
}
