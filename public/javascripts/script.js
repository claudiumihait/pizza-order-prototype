//import all data
// import {data} from '../pizzas.js';
fetch("../pizzas.json").then(response =>response.json()).then((data) => {
  //list of all pizzas from pizzas.js
  const allPizzasList = data.pizzas;

  //list of all allergens from pizzas.js
  var allAllergensList = data.allergens;

  //function to add pizzas to order
  function addToSessionStorage(pizza,amount) {
    if (!sessionStorage.orderedPizzas) {
      sessionStorage.orderedPizzas = '[]';
    }
    if (pizza !== '' || city.split(" ").join("").length !== 0) {
        const data = JSON.parse(sessionStorage.orderedPizzas);
        data.push(city);
        const citiesSet = new Set(data);
        sessionStorage.orderedPizzas = JSON.stringify(Array.from(citiesSet));
    }
  }

  //function for single pizza component in HTML
    function pizzaHTMLcomponent(pizzaObj){
        return `<div class="pizzaContainer">
        <img class="pizzaImg" src="${pizzaObj.img.medium}" alt="">
        <p class="pizzaName">${pizzaObj.name}</p>
        <hr>
        <p class="pizzaIngredients">${pizzaObj.ingredients.join(",")}.</p>
        <div class="buttonsContainer">
          <button class="addButton">Add to basket</button>
          <div class="counterContainer">
            <button class="increment">+</button>  
            <h2 class="countDisplay">0</h2>
            <button class="decrement">-</button>
          </div>
        </div>
      </div>`
    };

  //function for putting togheter pizza components
  function allPizzasComponent(pizzaList){
    return `<div class="allPizzasContainer">${pizzaList.map(pizza => pizzaHTMLcomponent(pizza)).join("")}</div>`;
  }

  //function create HTML for pizzas
  function createPizzasHTML(pizzaList){
    const rootElement = document.getElementById("root");
    //inserting divs for pizzas
    rootElement.insertAdjacentHTML("beforeend", allPizzasComponent(pizzaList));
    //adding functionality to increment buttons
    document.querySelectorAll(".increment").forEach((node,index)=>{
      node.addEventListener('click',(event)=>{
        let numberNode = document.querySelectorAll(".countDisplay")[index];
        numberNode.textContent = String(parseInt(numberNode.textContent)+1);
      });
    });
    //adding functionality to decrement buttons
    document.querySelectorAll(".decrement").forEach((node,index)=>{
      node.addEventListener('click',(event)=>{
        let numberNode = document.querySelectorAll(".countDisplay")[index];
        if(parseInt(numberNode.textContent) !== 0){
          numberNode.textContent = String(parseInt(numberNode.textContent)-1);
        }
      });
    });
    //adding functionality to add buttons
    document.querySelectorAll(".addButton").forEach((node,index)=>{
      node.addEventListener('click',(event)=>{
        let numberNode = document.querySelectorAll(".countDisplay")[index];
        numberNode.textContent = 0;
      });
    });
  }

  //function to clear the pizzas display UI
  function clearPizzasDivs(){
    document.querySelector(".allPizzasContainer").remove();
  }

  //function for single allergen component
  function allergenHTMLcomponent(alergenObj){
    return `<input type="checkbox" class="allergenCheck" name="allergen${alergenObj.id}" value=${alergenObj.name}>
            <label for="allergen${alergenObj.id}">${alergenObj.name}</label>`
  }

  //function for putting togheter allergen components
  function allAllergenComponent(allergenList){
    return `<div class="allAllergensContainer">${allergenList.map(allergen => allergenHTMLcomponent(allergen)).join("")}</div>`;
  }

  //function create HTML for pizzas
  function createAllergensHTML(allergenList){
    const rootElement = document.getElementById("root");
    //inserting checkboxes for allergens
    rootElement.insertAdjacentHTML("afterbegin", allAllergenComponent(allergenList));
    //adding functionality to checkbox inputs
    document.querySelectorAll(".allergenCheck").forEach((node)=>{
      node.addEventListener("click",(event)=>{
        let idOfAllergensChecked = Array.from(document.querySelectorAll(".allergenCheck")).filter(node => node.checked === true).map(node => parseInt(node.name.split("allergen")[1]));
        let filteredPizzas = allPizzasList.filter(pizza => idOfAllergensChecked.every(elem => pizza.allergens.includes(elem)));
        clearPizzasDivs();
        createPizzasHTML(filteredPizzas);
      });
    });
  }

  //function to create nav element
  function navBarComponent(){
    return `<div class="navBarContainer"><nav><h1>Title</h1><div class="orderContainer"><button class="requestOrder">Order Now</button><img src="" alt=""></div></nav></div>`
  }


  function loadEvent(){
    // the HTML elements with ID are available as global variables with the ID (eg. root) but it is better if you 
    const rootElement = document.getElementById("root");
    //inserting HTML for allergen check
    createAllergensHTML(allAllergensList);
    //inserting nav bar component
    rootElement.insertAdjacentHTML("afterbegin", navBarComponent());
    //inserting HTML for pizzas
    createPizzasHTML(allPizzasList);

     
  }

  window.addEventListener("load", loadEvent);
});


