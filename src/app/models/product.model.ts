// modelo para la lista de productos del catalogo (GET /api/product)
export interface Product {
  id: string;
  brand: string;
  model: string;
  price: string;
  imgUrl: string;
}

// opciones de color y almacenamiento para los selectores
export interface ColorOption {
  code: number;
  name: string;
}

export interface StorageOption {
  code: number;
  name: string;
}

export interface ProductOptions {
  colors: ColorOption[];
  storages: StorageOption[];
}

// detalle del producto para la vista de ficha (GET /api/product/:id)
export interface ProductDetail {
  id: string;
  brand: string;
  model: string;
  price: string;
  imgUrl: string;
  cpu?: string;
  ram?: string;
  os?: string;
  displayResolution?: string;
  battery?: string;
  primaryCamera?: string | string[];
  secondaryCmera?: string | string[];
  dimentions?: string;
  weight?: string;
  options: ProductOptions;
}

// para enviar al carrito y lo que devuelve (POST /api/cart)
export interface AddToCartPayload {
  id: string;
  colorCode: number;
  storageCode: number;
}

export interface AddToCartResponse {
  count: number;
}
