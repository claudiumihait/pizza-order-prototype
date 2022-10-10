const express = require('express');
const router = express.Router();
const path = require('path')
const jsonPath = path.join(__dirname.split("\\routes")[0] + '/public/pizzas.json');
const tools = require ('../public/javascripts/tools')

/* GET home page. */
router
  .get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})
  .get('/api/pizzas', async (req, res) => {
    const pizzas = await tools.getData(jsonPath)
    console.log(pizzas)
  })

module.exports = router;
