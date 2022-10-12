let basket = {};

const express = require("express");
const router = express.Router();
const path = require("path");
const pizzasJsonPath = path.join(
  __dirname.split("\\routes")[0] + "/public/pizzas.json"
);
const tools = require("../public/javascripts/tools");

const ordersJsonPath = path.join(
  __dirname.split("\\routes")[0] + "/public/order.json"
);
/* GET home page. */
router
  .get("/", async (req, res) => {
    res.redirect("/pizzas/list");
  })
  .get("/api/pizzas", async (req, res) => {
    const pizzas = await tools.readFile(pizzasJsonPath);
    res.send(pizzas.pizzas);
  })
  .get("/api/allergens", async (req, res) => {
    const pizzas = await tools.readFile(pizzasJsonPath);
    res.send(pizzas.allergens);
  })
  .get("/pizzas/list", (req, res) => {
    res.render("index");
  })
  .get("/basket", (req, res) => {
    // res.body = JSON.stringify(basket);
    res.render("basket", { basket: JSON.stringify(basket) });
  })
  .post("/basket", (req, res) => {
    if(basket[req.body.id]){
      basket[req.body.id][1] += req.body.amount;
    }else{
      basket[req.body.id] = [req.body.name, req.body.amount, req.body.price];
    }
    res.body = JSON.stringify(basket);
    console.log(basket);
  })
  .get("/api/orders", async (req, res) => {
    const response = await tools.readFile(ordersJsonPath);
    const fileData = await JSON.parse(response);
    res.send(fileData.orders);
  })
  .post("/api/orders", async (req, res) => {
    const response = await tools.readFile(ordersJsonPath);
    let fileData = await JSON.parse(response);
    fileData.orders.push(req.body);
    await tools.writeFile(ordersJsonPath, fileData);
  });

module.exports = router;
