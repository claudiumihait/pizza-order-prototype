const pizzaComponent = (name, amount, price, i) => `
<div class="item">
<div class="item-name">
${name.toUpperCase()}
<div class="qty-container">                            
<i id="remove-${i}" class="bi bi-patch-minus"></i>
<div class = "qty">
${amount}
</div>
<i id="add-${i}" class="bi bi-patch-plus"></i>
</div>
</div>
<div class="item-value">
${amount * price} Ron
</div>
</div>
`;

const totalComponent = (total) => `
<div id="total">
<div id="total-text">
TOTAL 
</div>
<div id="total-value" class="total-value">${total} Ron</div>
</div>
`;

const formComponent = ` 
<form id="input-wrapper">
<label for="fname">Full name:</label>
<input type="text" id="fname" name="fname" placeholder="Full name..." required></input><br>

<label for="email">E-mail:</label>
<input type="text" id="email" name="email" placeholder="Email..." required></input><br>

<label for="city">Address:</label>
<input type="text" id="city" name="city" placeholder="City..." required></input><br>
<textarea id="address" name="address" placeholder="Street, street number, ..." required></textarea><br>
<input type="text" id="postal-code" name="postal-code" placeholder="Postal Code..." required></input><br>
<button id="btn">Place Order</button>
</form>
`;

const basketCardComponent = `
<div class="basket-container">
<div class = "basket-header">
<i class="bi bi-cart"></i>
<p> Order summary:  </p>
</div>
<div class ="basket-content-container">
</div>
</div>
`;

let orderSchema = {
  pizzas: [],
  date: {
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    minute: 0,
  },
  customer: {
    name: "",
    email: "",
    address: {
      city: "",
      street: "",
      postalCode: 0,
    },
  },
};

const loadEvent = (_) => {
  console.log(sentBasket);
  const rootElement = document.getElementById("root");
  rootElement.insertAdjacentHTML("afterbegin", basketCardComponent);

  const contentElement = document.querySelector(".basket-content-container");
  Object.values(sentBasket).forEach((pizza, i) =>
    contentElement.insertAdjacentHTML(
      "afterbegin",
      pizzaComponent(...pizza, i + 1)
    )
  );
  //redirect if there are no pizzas in basket
  document.querySelectorAll(".item").length == 0
    ? window.location.replace("http://127.0.0.1:3000/empty-basket")
    : null;

  contentElement.insertAdjacentHTML(
    "beforeend",
    totalComponent(getTotalPrice())
  );
  const total = document.getElementById("total-value");

  rootElement.insertAdjacentHTML("beforeend", formComponent);

  const clickEvent = (event) => {
    //handle add and remove on click
    const prev = event.target.previousSibling.previousSibling;
    const next = event.target.nextSibling.nextSibling;
    if (event.target.id.includes("add-")) {
      changePricesOnAddOrRemove(prev, "add", total);
    } else if (event.target.id.includes("remove")) {
      changePricesOnAddOrRemove(next, "remove", total);
      next.innerText < 1
        ? event.target.parentElement.parentElement.parentElement.remove()
        : true;
    } else if (event.target.id == "btn") {
      event.preventDefault();
      const nameInput = document.getElementById("fname");
      const emailInput = document.getElementById("email");
      const cityInput = document.getElementById("city");
      const addrInput = document.getElementById("address");
      const postalCodeInput = document.getElementById("postal-code");

      //alert user of valid/not valid inputs
      isNameValid(nameInput.value)
        ? (nameInput.style.border = "3px solid #00ff00")
        : (nameInput.style.border = "3px solid red");

      isEmailValid(emailInput.value)
        ? (emailInput.style.border = "2px solid #00ff00")
        : (emailInput.style.border = "2px solid red");

      isEmailValid(emailInput.value)
        ? (emailInput.style.border = "2px solid #00ff00")
        : (emailInput.style.border = "2px solid red");

      isCityValid(cityInput.value)
        ? (cityInput.style.border = "2px solid #00ff00")
        : (cityInput.style.border = "2px solid red");

      isAddressValid(addrInput.value)
        ? (addrInput.style.border = "2px solid #00ff00")
        : (addrInput.style.border = "2px solid red");

      isPostalCodeValid(postalCodeInput.value)
        ? (postalCodeInput.style.border = "2px solid #00ff00")
        : (postalCodeInput.style.border = "2px solid red");

      //if all valid, send order
      if (
        isNameValid(nameInput.value) &&
        isEmailValid(emailInput.value) &&
        isCityValid(cityInput.value) &&
        isAddressValid(addrInput.value) &&
        isPostalCodeValid(postalCodeInput.value)
      ) {
        console.log("valid");
        updateSchema(
          nameInput,
          emailInput,
          cityInput,
          addrInput,
          postalCodeInput
        );
        postOrder("/api/orders", orderSchema);
      } else {
        console.log("not valid");
      }
    }
    console.log(event.target.id);
    console.log(event.target);
  };
  window.addEventListener("click", clickEvent);
};

window.addEventListener("DOMContentLoaded", loadEvent);

function changePricesOnAddOrRemove(htmlElt, method, total) {
  const priceElt =
    htmlElt.parentElement.parentElement.parentElement.children[1];
  const price = parseInt(priceElt.innerText.split(" ")[0]);
  const initialQty = parseInt(htmlElt.innerText);
  const itemPrice = price / initialQty;
  let newPrice;
  if (method == "add") {
    newPrice = price + itemPrice;
    priceElt.innerHTML = newPrice.toString() + " Ron";
    htmlElt.innerText = parseInt(htmlElt.innerText) + 1;
    total.innerHTML =
      parseInt(total.innerHTML.split(" ")[0]) + itemPrice + " Ron";
  } else if (method == "remove") {
    newPrice = price - itemPrice;
    priceElt.innerHTML = newPrice.toString() + " Ron";
    htmlElt.innerText -= 1;
    total.innerHTML =
      parseInt(total.innerHTML.split(" ")[0]) - itemPrice + " Ron";
  }
}

function getTotalPrice() {
  let prices = [];
  const pricesElements = Array.from(document.querySelectorAll(".item-value"));
  pricesElements.forEach((elt) =>
    prices.push(parseInt(elt.innerText.split(" ")[0]))
  );
  const total = prices.reduce((curr, prev) => (curr += prev), 0);
  return total;
}

async function postOrder(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

function updateSchema(name, email, city, address, postalCode) {
  let date = new Date();
  //base details
  orderSchema.date.year = date.getFullYear();
  orderSchema.date.month = date.getMonth();
  orderSchema.date.day = date.getMonth();
  orderSchema.date.hour = date.getHours();
  orderSchema.date.minute = date.getMinutes();
  orderSchema.customer.name = name;
  orderSchema.customer.email = email;
  orderSchema.customer.address.city = city;
  orderSchema.customer.address.street = address;
  orderSchema.customer.address.postalCode = postalCode;
  //pizza details
  Object.keys(sentBasket).forEach((key) => {
    orderSchema.pizzas.push({ id: key, amount: sentBasket[key][1] });
  });
}

//-- VALIDATIONS --
function isNameValid(input) {
  return /^[a-z -]+$/i.test(input);
}

function isEmailValid(input) {
  return /^((\w)+(\.)?(\w)+)(@){1}([a-z])+(\.){1}([a-zA-Z]){2,3}$/i.test(input);
}

function isCityValid(input) {
  return /^[a-z]+([ -][a-z]+)*$/i.test(input);
}

function isAddressValid(input) {
  return /[a-z0-9'\.\-\s\,]/i.test(input);
}

function isPostalCodeValid(input) {
  return /^\d{6}$/.test(input);
}
