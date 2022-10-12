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
<textarea type="text" id="address" name="address" placeholder="Street, street number..." required></textarea><br>
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
  id: 2,
  pizzas: [],
  date: {
    year: 2022,
    month: 6,
    day: 7,
    hour: 18,
    minute: 47,
  },
  customer: {
    name: "John Doe",
    email: "jd@example.com",
    address: {
      city: "Palermo",
      street: "Via Appia 6",
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

  contentElement.insertAdjacentHTML(
    "beforeend",
    totalComponent(getTotalPrice())
  );
  const total = document.getElementById("total-value");

  rootElement.insertAdjacentHTML("beforeend", formComponent);

  const clickEvent = async (event) => {
    //handle add and remove on click
    const prev = event.target.previousSibling.previousSibling;
    const next = event.target.nextSibling.nextSibling;
    if (event.target.id.includes("add")) {
      changePricesOnAddOrRemove(prev, "add", total);
    } else if (event.target.id.includes("remove")) {
      changePricesOnAddOrRemove(next, "remove", total);
      next.innerText < 1
        ? event.target.parentElement.parentElement.parentElement.remove()
        : true;
    } else if (event.target.id == "btn") {
      await postOrder("/api/orders", orderSchema);
    }
    console.log("targert id", event.target.id);
    console.log("event.target", event.target);
    console.log("nextsibling", event.target.nextSibling);
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
