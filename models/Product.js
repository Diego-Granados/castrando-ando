import { ref, get, set, update, remove } from "firebase/database";
import { db } from "@/lib/firebase/config";

class Product {
  static async getAll() {
    const productsRef = ref(db, "products");
    const snapshot = await get(productsRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.error("No products found");
      return {};
    }
  }

  static async getById(productId) {
    const productRef = ref(db, `products/${productId}`);
    const snapshot = await get(productRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.error("No product found with the given ID");
      return null;
    }
  }

  static async createProduct(productData) {
    const newProductRef = ref(db, `products/${productData.id}`);
    await set(newProductRef, productData);
  }

  static async updateProduct(productId, productData) {
    const productRef = ref(db, `products/${productId}`);
    await update(productRef, productData);
  }

  static async deleteProduct(productId) {
    const productRef = ref(db, `products/${productId}`);
    await remove(productRef);
  }
}

export default Product;
