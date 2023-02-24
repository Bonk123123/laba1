import db from "../db.js";

class orderController {
  async getOrders(req, res) {
    try {
      const orders = await db.query("SELECT * FROM public.rella");
      res.json(orders.rows);
    } catch (error) {
      res.json(error);
    }
  }
  async createOrder(req, res) {
    try {
      const { userId, productId, product, price, activePay, productId2 } =
        req.body;
      const quantity = await db.query(
        "SELECT (quantity_product) FROM public.mozzarella WHERE id = $1",
        [productId]
      );

      const sumbuy = await db.query(
        "SELECT (sumbuy) FROM public.pizza WHERE id = $1",
        [userId]
      );
      const current_money = await db.query(
        "SELECT (current_money) FROM public.pizza WHERE id = $1",
        [userId]
      );
      let sb = sumbuy.rows[0].sumbuy;
      let quan = quantity.rows[0].quantity_product;
      let cm = current_money.rows[0].current_money;
      switch (activePay) {
        case 0:
          if (cm >= price) {
            cm -= price;
          } else {
            throw "недостаточно средств";
          }

          if (quan <= 0) {
            throw "одного из товаров нет на складе";
          }
          const order = await db.query(
            "INSERT INTO public.rella (id, product, price) VALUES ($1, $2, $3)",
            [userId, product, price]
          );
          const newquantity = quan - 1;
          const products = await db.query(
            "UPDATE public.mozzarella SET quantity_product = $1 WHERE id = $2",
            [newquantity, productId]
          );

          const newsumbuy = sb + 1;
          const user = await db.query(
            "UPDATE public.pizza SET sumbuy = $1, current_money = $2, WHERE id = $3",
            [newsumbuy, cm, userId]
          );
          break;

        case 1:
          if (quan <= 0) {
            throw "одного из товаров нет на складе";
          }
          const order1 = await db.query(
            "INSERT INTO public.rella (id, product, price) VALUES ($1, $2, $3)",
            [userId, product, price]
          );
          const newquantity1 = quan - 1;
          const products1 = await db.query(
            "UPDATE public.mozzarella SET quantity_product = $1 WHERE id = $2",
            [newquantity1, productId]
          );
          const newsumbuy1 = sb + 1;
          const user1 = await db.query(
            "UPDATE public.pizza SET sumbuy = $1 WHERE id = $2",
            [newsumbuy1, userId]
          );
          break;

        case 2:
          let current_duty = 0;
          const max_duty = await db.query(
            "SELECT (max_duty) FROM public.pizza WHERE id = $1",
            [userId]
          );
          const loan_balance = await db.query(
            "SELECT (loan_balance) FROM public.pizza WHERE id = $1",
            [userId]
          );
          let md = max_duty.rows[0].max_duty;
          let lb = loan_balance.rows[0].loan_balance;

          if (quan <= 0) {
            throw "одного из товаров нет на складе";
          }

          const order2 = await db.query(
            "INSERT INTO public.rella (id, product, price) VALUES ($1, $2, $3)",
            [userId, product, price]
          );
          const newquantity2 = quan - 1;
          const products2 = await db.query(
            "UPDATE public.mozzarella SET quantity_product = $1 WHERE id = $2",
            [newquantity2, productId]
          );
          const oldCD = await db.query(
            "SELECT (current_duty) FROM public.pizza WHERE id = $1",
            [userId]
          );
          if (cm >= price) {
            cm -= price;
          } else if (cm < price && price <= lb) {
            let duty;
            duty = cm - price;
            lb += duty;
            cm = 0;
            current_duty = md - lb;
          }
          if (oldCD.rows[0].current_duty + price > md) {
            const user2 = await db.query(
              "UPDATE public.pizza SET current_duty = $1 WHERE id = $2",
              [oldCD.rows[0].current_duty, userId]
            );

            throw "превышен потолок кредита";
          }

          const newsumbuy2 = sb + 1;
          const user2 = await db.query(
            "UPDATE public.pizza SET sumbuy = $1, current_money = $2, loan_balance = $3, current_duty = $4 WHERE id = $5",
            [newsumbuy2, cm, lb, current_duty, userId]
          );
          break;

        case 3:
          if (quan <= 0) {
            throw "одного из товаров нет на складе";
          }
          const quantity2 = await db.query(
            "SELECT (quantity_product) FROM public.mozzarella WHERE id = $1",
            [productId2]
          );
          let quan2 = quantity2.rows[0].quantity_product;

          const product2 = await db.query(
            "SELECT (product) FROM public.mozzarella WHERE id = $1",
            [productId2]
          );

          const barter = product + " on " + product2.rows[0].product;
          const order3 = await db.query(
            "INSERT INTO public.rella (id, product, price) VALUES ($1, $2, $3)",
            [userId, product, price]
          );
          const newquantity3 = quan - 1;
          const products3 = await db.query(
            "UPDATE public.mozzarella SET quantity_product = $1 WHERE id = $2",
            [newquantity3, productId]
          );
          const newquantity31 = quan2 + 1;
          const products31 = await db.query(
            "UPDATE public.mozzarella SET quantity_product = $1 WHERE id = $2",
            [newquantity31, productId2]
          );
          const newsumbuy3 = sb + 1;
          const user3 = await db.query(
            "UPDATE public.pizza SET sumbuy = $1 WHERE id = $2",
            [newsumbuy3, userId]
          );
          break;
      }
      res.json("ok");
    } catch (error) {
      res.json(error);
    }
  }

  async deleteOrders(req, res) {
    try {
      const { id } = req.params;
      const order = await db.query("DELETE FROM public.rella WHERE id = $1", [
        id,
      ]);
      res.json(order.rows);
    } catch (error) {
      res.json(error);
    }
  }
}

export default new orderController();
