const pizzaComponent = (name, amount, price,i) => `
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
<form id="input-wrapper" method="post" action="/action_page.php">
<label for="fname">Full name:</label>
<input type="text" id="fname" name="fname" placeholder="Full name..." required></input><br>

<label for="email">E-mail:</label>
<input type="text" id="email" name="email" placeholder="Email..." required></input><br>

<label for="city">Address:</label>
<input type="text" id="city" name="city" placeholder="City..." required></input><br>
<textarea type="text" id="address" name="address" placeholder="Street, street number..." required></textarea><br>
<input id="btn" type="submit" value="Place order">
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
  id: 1,
  pizzas: [{ id: 1, amount: 2 }],
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
  Object.values(sentBasket).forEach((pizza,i) =>
    contentElement.insertAdjacentHTML("afterbegin", pizzaComponent(...pizza,i+1))
  );

  contentElement.insertAdjacentHTML(
    "beforeend",
    totalComponent(getTotalPrice())
  );

  rootElement.insertAdjacentHTML("beforeend", formComponent);

  const clickEvent = (event) => {
    //handle add and remove on click
    const prev = event.target.previousSibling.previousSibling;
    const next = event.target.nextSibling.nextSibling;

    if (event.target.id.includes("add")) {
      //increase price
      debugger;
      const priceElt =
        prev.parentElement.parentElement.parentElement.children[1];
      let price = parseInt(priceElt.innerText.split(" ")[0]);
      const initialQty = parseInt(prev.innerText);
      let itemPrice = price / initialQty;
      const newPrice = price + itemPrice;
      priceElt.innerHTML = newPrice.toString() + " Ron";
      //increase count
      prev.innerText = parseInt(prev.innerText) + 1;
    } else if (event.target.id.includes("remove")) {
      //decrease price
      debugger;
      const priceElt =
        next.parentElement.parentElement.parentElement.children[1];
      let price = parseInt(priceElt.innerText.split(" ")[0]);
      const initialQty = parseInt(next.innerText);
      let itemPrice = price / initialQty;
      const newPrice = price - itemPrice;
      priceElt.innerHTML = newPrice.toString() + " Ron";
      //decrease count
      next.innerText -= 1;
      //remove listed item if count at 0
      next.innerText < 1
        ? event.target.parentElement.parentElement.parentElement.remove()
        : true;
    }
    console.log("targert id", event.target.id);
    console.log("event.target", event.target);
    console.log("nextsibling", event.target.nextSibling);
  };
  window.addEventListener("click", clickEvent);
};

window.addEventListener("DOMContentLoaded", loadEvent);

function getTotalPrice() {
  let prices = [];
  const pricesElements = Array.from(document.querySelectorAll(".item-value"));
  pricesElements.forEach((elt) =>
    prices.push(parseInt(elt.innerText.split(" ")[0]))
  );
  const total = prices.reduce((curr, prev) => (curr += prev), 0);
  return total;
}
