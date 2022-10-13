let basket = {};

const express = require("express");
const router = express.Router();
const path = require("path");
const pizzasJsonPath = path.join(
  __dirname.split("routes")[0] + "public/pizzas.json"
);
const tools = require("../public/javascripts/tools");

const ordersJsonPath = path.join(
  __dirname.split("routes")[0] + "public/order.json"
);
/* GET home page. */
router
  .get("/", async (req, res) => {
    res.redirect("/pizzas/list");
  })
  .get("/api/pizzas", async (req, res) => {
    const response = await tools.readFile(pizzasJsonPath);
    const pizzas = await JSON.parse(response);
    res.send(pizzas.pizzas);
  })
  .get("/api/allergens", async (req, res) => {
    const response = await tools.readFile(pizzasJsonPath);
    const pizzas = await JSON.parse(response);
    res.send(pizzas.allergens);
  })
  .get("/pizzas/list", (req, res) => {
    res.render("index", { basket: JSON.stringify(basket) });
  })
  .get("/basket", (req, res) => {
    // res.body = JSON.stringify(basket);
    res.render("basket", { basket: JSON.stringify(basket) });
  })
  .post("/basket", (req, res) => {
    req.body.forEach((object) => {
      if (basket[object.id]) {
        basket[object.id][1] += object.amount;
      } else {
        basket[object.id] = [object.name, object.amount, object.price];
      }
    });
    res.body = JSON.stringify(basket);
  })
  .get("/api/orders", async (req, res) => {
    const response = await tools.readFile(ordersJsonPath);
    const fileData = await JSON.parse(response);
    res.send(fileData.orders);
  })
  .post("/api/orders", async (req, res) => {
    const response = await tools.readFile(ordersJsonPath);
    let fileData = await JSON.parse(response);
    const ID = tools.assignID(fileData)
      ? tools.assignID(fileData)
      : fileData.orders.length + 1;
    fileData.orders.push({ id: ID, ...req.body });
    await tools.writeFile(ordersJsonPath, fileData);
  })
  .get("/empty-basket", (req, res) => {
    res.render("empty-basket");
  })
  .get("/order-submitted", (req, res) => {
    res.render("order-submitted");
  })
  .put("/basket", (req, res) => {
    basket = req.body;
  })
  ;

module.exports = router;
