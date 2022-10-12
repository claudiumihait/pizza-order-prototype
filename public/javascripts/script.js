//import all data
//import {data} from '../pizzas.js';
Promise.all([fetch(`../api/pizzas`),fetch(`../api/allergens`)]).then(responses=>Promise.all(responses.map(response=>response.json()))).then(objects=>{
  //variable to check if addButton was pressed
  var pressed = false;

  //list of all pizzas from pizzas.json
  const allPizzasList = objects[0];

  //list of all allergens from pizzas.json
  const allAllergensList = objects[1];

  //function to add pizzas to order
  async function addToBasket(pizzaId,amount,price,name){
    fetch(`http://127.0.0.1:3000/basket`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id:pizzaId,
          amount:amount,
          price:price,
          name:name
        })
    })
  }

  // function addToSessionStorage(pizzaID,amount) {
  //   if (!sessionStorage.orderedPizzas) {
  //     sessionStorage.orderedPizzas = '[]';
  //   }
  //   let data = JSON.parse(sessionStorage.orderedPizzas);
  //   if(sessionStorage.orderedPizzas.length > 0){
  //     var listOfPizzasIds = data.map(elem=>elem.id);
  //     if (listOfPizzasIds.includes(pizzaID)){
  //       data[listOfPizzasIds.indexOf(pizzaID)].amount += amount;
  //     }else{
  //       data.push({id:pizzaID,amount:amount});
  //     }
  //   }else{
  //     data.push({id:pizzaID,amount:amount});
  //   }
  //   const pizzaSet = new Set(data);
  //   sessionStorage.orderedPizzas = JSON.stringify(Array.from(pizzaSet));
  // }

  //function for single pizza component in HTML
    function pizzaHTMLcomponent(pizzaObj){
        return `<div class="pizzaContainer">
        <img class="pizzaImg" src="${pizzaObj.img.medium}" alt="">
        <p class="pizzaName">${pizzaObj.name}</p>
        <hr size="5">
        <p class="pizzaIngredients">${pizzaObj.ingredients.join(", ")}.</p>
        <div class="buttonsContainer">
        <button class="addButton">
        <div class="svg-wrapper-1">
          <div class="svg-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path fill="currentColor" d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
          </div>
        </div>
        <span>Add to basket</span>
      </button>
          <div class="counterContainer">
            <button class="increment">+</button>  
            <h2 class="countDisplay">1</h2>
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
        if(parseInt(numberNode.textContent) > 1){
          numberNode.textContent = String(parseInt(numberNode.textContent)-1);
        }
      });
    });
    //adding functionality to add buttons
    document.querySelectorAll(".addButton").forEach((node,index)=>{
      node.addEventListener('click',(event)=>{
        let numberNode = document.querySelectorAll(".countDisplay")[index];
        let pizzaName = document.querySelectorAll(".pizzaName")[index].textContent;
        let pizzaId = allPizzasList.filter(elem => elem.name === pizzaName)[0].id;
        let amount = parseInt(numberNode.textContent);
        let price = allPizzasList.filter(elem => elem.name === pizzaName)[0].price;
        addToBasket(pizzaId,amount,price,pizzaName);
        numberNode.textContent = "1";
        pressed = true;
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

  //<video class="bgVideo" autoplay muted loop><source src="https://youtu.be/2ss1BHH-leI" type="video/mp4" /></video>
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
        let filteredPizzas = allPizzasList.filter(pizza => idOfAllergensChecked.every(elem => !pizza.allergens.includes(elem)));
        clearPizzasDivs();
        createPizzasHTML(filteredPizzas);
      });
    });
  }

  //function to create nav element
  function navBarComponent(){
    return `<div class="navBarContainer"><nav><h1>Cold <i class="fa-solid fa-pizza-slice"></i> Pizzas</h1><div class="orderContainer"><a href="../basket"><i class="fa-sharp fa-solid fa-basket-shopping"></i></a></div></nav></div>`
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

  loadEvent();
});



