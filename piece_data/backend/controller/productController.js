import db from "../db.js";

class productController {
  async getProducts(req, res) {
    try {
      const products = await db.query("SELECT * FROM public.mozzarella");
      res.json(products.rows);
    } catch (error) {
      res.json(error);
    }
  }
  async createProduct(req, res) {
    try {
      const { product, quantity_product, price } = req.body;
      const productDb = await db.query(
        "INSERT INTO public.mozzarella (product, quantity_product, price) VALUES ($1, $2, $3)",
        [product, quantity_product, price]
      );
      res.json(productDb.rows);
    } catch (error) {
      res.json(error);
    }
  }
  async changeProduct(req, res) {
    try {
      const { product, quantity_product, price, id } = req.body;
      const productDb = await db.query(
        "UPDATE public.mozzarella SET product = $1, quantity_product = $2, price = $3 WHERE id = $4",
        [product, quantity_product, price, id]
      );
      res.json(productDb.rows);
    } catch (error) {
      res.json(error);
    }
  }
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const productDb = await db.query(
        "DELETE public.mozzarella WHERE id = $1",
        [id]
      );
      res.json(productDb.rows);
    } catch (error) {
      res.json(error);
    }
  }
}

export default new productController();
