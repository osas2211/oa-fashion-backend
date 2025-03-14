import { ProductType } from "./productType"

export type CollectionType = {
  title: string // USE THE TITLE TO FETCH COLLECTIONS
  id: string
  preview_image: string
  products: ProductType[]
}
