export type ProductType = {
  id: string
  title: string
  price: number
  image: string
  subImages: string[]
  sizes: string[]
  colors: string[]
  about: string
  categoryId: string
}

export type createProductPayload = {
  title: string
  price: number
  image: File
  subImages?: File[]
  sizes: string[]
  colors?: string[]
  about?: string
  categoryId: string
}
