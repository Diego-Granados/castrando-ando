import Product from "@/models/Product";
import { ref, get, set, update, remove } from "firebase/database";

jest.mock("firebase/database");
jest.mock("@/lib/firebase/config", () => ({
  db: {},
}));

describe("Product Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getAll should fetch all products", async () => {
    const mockProducts = {
      product1: { name: "Product 1", price: 100 },
      product2: { name: "Product 2", price: 200 },
    };
    get.mockImplementationOnce(() => ({
      exists: () => true,
      val: () => mockProducts,
    }));

    const result = await Product.getAll();
    expect(ref).toHaveBeenCalledWith({}, "products");
    expect(result).toEqual(mockProducts);
  });

  test("getById should return null when product not found", async () => {
    get.mockImplementationOnce(() => ({
      exists: () => false,
      val: () => null,
    }));

    const result = await Product.getById("nonexistent");
    expect(result).toBeNull();
  });

  test("createProduct should create a new product", async () => {
    const productData = { id: "prod1", name: "New Product", price: 100 };
    await Product.createProduct(productData);
    expect(set).toHaveBeenCalled();
  });
});
