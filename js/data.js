// Central menu data — every feature (menu, cart, filters, quiz…) reads from here.
window.MENU = [
  { cat: "coffee", items: [
    { id: "espresso", name: "Espresso", desc: "Double shot of our house blend.", price: 3.0, tags: ["vegan"], hot: true },
    { id: "americano", name: "Americano", desc: "Espresso lengthened with hot water.", price: 3.5, tags: ["vegan"], hot: true },
    { id: "cappuccino", name: "Cappuccino", desc: "Equal parts espresso, milk and foam.", price: 4.25, tags: [], hot: true },
    { id: "flatwhite", name: "Flat White", desc: "Velvety microfoam over a double ristretto.", price: 4.5, tags: [], hot: true },
    { id: "latte", name: "Latte", desc: "Espresso with steamed milk.", price: 4.75, tags: [], hot: true },
    { id: "pourover", name: "Pour Over", desc: "Single-origin, brewed by hand.", price: 5.0, tags: ["vegan"], hot: true },
    { id: "coldbrew", name: "Cold Brew", desc: "Steeped 18 hours, smooth and chocolatey.", price: 4.5, tags: ["vegan"], hot: false },
    { id: "mocha", name: "Mocha", desc: "Espresso, dark chocolate and steamed milk.", price: 5.25, tags: [], hot: true },
  ]},
  { cat: "tea", items: [
    { id: "chai", name: "Chai Latte", desc: "House-spiced chai with steamed milk.", price: 4.75, tags: [], hot: true },
    { id: "matcha", name: "Matcha Latte", desc: "Ceremonial-grade matcha, lightly sweetened.", price: 5.0, tags: [], hot: true },
    { id: "tea", name: "Loose-Leaf Tea", desc: "Earl Grey, green, chamomile or peppermint.", price: 3.25, tags: ["vegan"], hot: true },
    { id: "cocoa", name: "Hot Chocolate", desc: "Rich dark chocolate, topped with whipped cream.", price: 4.0, tags: [], hot: true },
  ]},
  { cat: "food", items: [
    { id: "croissant", name: "Butter Croissant", desc: "Flaky, golden, baked this morning.", price: 3.5, tags: [], food: true },
    { id: "muffin", name: "Blueberry Muffin", desc: "Bursting with berries and a crumb top.", price: 3.25, tags: [], food: true },
    { id: "avotoast", name: "Avocado Toast", desc: "Sourdough, smashed avocado, chili flakes.", price: 8.5, tags: ["vegan"], food: true },
    { id: "sandwich", name: "Breakfast Sandwich", desc: "Egg, cheddar and bacon or spinach on a brioche bun.", price: 7.75, tags: [], food: true },
  ]},
];
window.MENU_INDEX = Object.fromEntries(window.MENU.flatMap((c) => c.items.map((i) => [i.id, { ...i, cat: c.cat }])));
window.fmt = (n) => "$" + n.toFixed(2);
