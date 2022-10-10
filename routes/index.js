const express = require('express');
const router = express.Router();
const path = require('path')
const jsonPath = path.join(__dirname.split("\\routes")[0] + '/public/pizzas.json');
const tools = require ('../public/javascripts/tools')

/* GET home page. */
router
  .get("/", async (req,res) => {
    res.redirect("/pizzas/list")
  }) 
  .get('/api/pizzas', async (req, res) => {
    const pizzas = await tools.getData(jsonPath)
    res.send(pizzas.pizzas)
  })
  .get('/api/allergens', async (req, res) => {
    const pizzas = await tools.getData(jsonPath)
    res.send(pizzas.allergens)
  })
  .get('/pizzas/list', (req, res)=>{
    res.send("HELLO")
  })

module.exports = router;
