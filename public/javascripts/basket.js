const pizzaTypeComponent = (list) =>
  list.map((tag) => `<li>${tag}</li>`).join("");

const pizzaComponent = ({ name, amount, price }) => `
    <div class="item">
        <div class="item-name">
            ${name}
            <div class="qty-container">                            
                <i id="remove" class="bi bi-patch-minus"></i>
                <div class = "qty">
                    ${amount}
                </div>
                <i id="add" class="bi bi-patch-plus"></i>
            </div>
        </div>
        <div class="item-value">
            ${price} Ron
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
  const rootElement = document.getElementById("root");

  console.log("loaded basket: ")
  console.log(sentBasket)

  const clickEvent = (event) => {
    //handle add and remove on click
    if (event.target.id === "add") {
      event.target.previousSibling.previousSibling.innerText =
        Number(event.target.previousSibling.previousSibling.innerText) + 1;
    } else if (event.target.id === "remove") {
      event.target.nextSibling.nextSibling.innerText -= 1;
      //remove listed item if count at 0
      event.target.nextSibling.nextSibling.innerText < 1
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
