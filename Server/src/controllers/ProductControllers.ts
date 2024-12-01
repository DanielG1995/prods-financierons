import "reflect-metadata";
import {
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  JsonController,
  NotFoundError,
  BadRequestError,
  QueryParams,
} from "routing-controllers";
import { ProductDTO } from "../dto/Product";
import { MESSAGE_ERROR } from "../const/message-error.const";
import { ProductInterface } from "../interfaces/product.interface";
import { PRODUCTS } from "../data/data";

@JsonController("/products")
export class ProductController {
  products: ProductInterface[] = PRODUCTS;

  @Get("")
  getAll(@QueryParams() params: any) {
    let allProducts = [...this.products]
    if (typeof params?.q === 'string' && params?.q !== '') {
      console.log(params?.q, typeof params?.q === 'string' && params?.q !== '')
      allProducts = allProducts.filter(p => {
        console.log(p.name.toLowerCase().includes(params?.q?.toLowerCase()))
        return p.name.toLowerCase().includes(params?.q?.toLowerCase())
      })
    }
    const returnedProducts = [...allProducts.slice((+params.page - 1) * params?.total, (+params.page - 1) * params?.total + +params?.total)]
    const totalPages = Math.ceil(allProducts.length / params?.total)
    return {
      data: [...returnedProducts],
      pagination: {
        total: params?.total || 5,
        page: params.page > totalPages ? totalPages : params?.page,
        totalPages: Math.ceil(allProducts.length / params?.total),
        items: allProducts.length,
        totaCurrentItems: returnedProducts.length,
        q: params?.q
      }
    };
  }

  @Get("/verification/:id")
  verifyIdentifier(@Param("id") id: number | string) {
    return this.products.some((product) => product.id === id);
  }

  @Get("/:id")
  getOne(@Param("id") id: number | string) {
    const index = this.findIndex(id);

    if (index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }
    return this.products.find((product) => product.id === id);
  }

  @Post("")
  createItem(@Body({ validate: true }) productItem: ProductDTO) {

    const index = this.findIndex(productItem.id);

    if (index !== -1) {
      throw new BadRequestError(MESSAGE_ERROR.DuplicateIdentifier);
    }

    this.products.push(productItem);
    return {
      message: "Product added successfully",
      data: productItem,
    };
  }

  @Put("/:id")
  put(@Param("id") id: number | string, @Body() productItem: ProductInterface) {
    const index = this.findIndex(id);

    if (index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }

    this.products[index] = {
      ...this.products[index],
      ...productItem,
    };
    return {
      message: "Product updated successfully",
      data: productItem,
    };
  }

  @Delete("/:id")
  remove(@Param("id") id: number | string) {
    const index = this.findIndex(id);

    if (index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }

    this.products = [...this.products.filter((product) => product.id !== id)];
    return {
      message: "Product removed successfully",
    };
  }

  private findIndex(id: number | string) {
    return this.products.findIndex((product) => product.id === id);
  }

}
