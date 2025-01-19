import Product from "@/models/Product";

class SalesController {
  static async getAllProducts() {
    return await Product.getAll();
  }

  static async getProductById(productId) {
    return await Product.getById(productId);
  }

  static async createOrUpdateProduct(productData, file) {
    try {
      if (file) {
        const formData = new FormData();
        formData.append("files", file);
        formData.append("path", "products");

        const response = await fetch("/api/storage/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Error uploading file: ${response.statusText}`);
        }

        const downloadURLs = await response.json();
        productData.image = downloadURLs[0];
      }

      if (productData.id) {
        const existingProduct = await Product.getById(productData.id);
        if (existingProduct && existingProduct.image !== productData.image) {
          console.log("Deleting existing image:", existingProduct.image); // Debugging log
          await fetch("/api/storage/delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ urls: [existingProduct.image] }),
          });
        }
        await Product.updateProduct(productData.id, productData);
      } else {
        productData.id = Date.now().toString();
        await Product.createProduct(productData);
      }
    } catch (error) {
      throw new Error(`Error saving product: ${error.message}`);
    }
  }

  static async deleteProduct(productId) {
    try {
      const product = await Product.getById(productId);
      if (product && product.image) {
        console.log("Deleting product image:", product.image); // Debugging log
        await fetch("/api/storage/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ urls: [product.image] }),
        });
      }
      return await Product.deleteProduct(productId);
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }
}

export default SalesController;
