// Central menu data — every feature (menu, cart, filters, quiz…) reads from here.
window.MENU = [
  { cat: "winter", items: [
    { id: "gingerbread", name: "Gingerbread Latte", desc: "Molasses, ginger and cinnamon with espresso and steamed milk.", price: 5.75, tags: ["seasonal"], hot: true, seasonal: true },
    { id: "pepmocha", name: "Peppermint Mocha", desc: "Dark chocolate, cool peppermint, espresso and whipped cream.", price: 5.95, tags: ["seasonal"], hot: true, seasonal: true },
    { id: "maplecortado", name: "Maple Oat Cortado", desc: "Double ristretto cut with oat milk and a whisper of maple.", price: 5.25, tags: ["seasonal", "vegan"], hot: true, seasonal: true },
  ]},
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
    { id: "tea", nocaf: true, name: "Loose-Leaf Tea", desc: "Earl Grey, green, chamomile or peppermint.", price: 3.25, tags: ["vegan", "decaf-option"], hot: true },
    { id: "cocoa", nocaf: true, name: "Hot Chocolate", desc: "Rich dark chocolate, topped with whipped cream.", price: 4.0, tags: ["nocaf"], hot: true },
  ]},
  { cat: "food", items: [
    { id: "croissant", nocaf: true, name: "Butter Croissant", desc: "Flaky, golden, baked this morning.", price: 3.5, tags: [], food: true },
    { id: "muffin", nocaf: true, name: "Blueberry Muffin", desc: "Bursting with berries and a crumb top.", price: 3.25, tags: [], food: true },
    { id: "avotoast", nocaf: true, name: "Avocado Toast", desc: "Sourdough, smashed avocado, chili flakes.", price: 8.5, tags: ["vegan"], food: true },
    { id: "sandwich", nocaf: true, name: "Breakfast Sandwich", desc: "Egg, cheddar and bacon or spinach on a brioche bun.", price: 7.75, tags: [], food: true },
  ]},
  { cat: "beans", items: [
    { id: "bean-ember", name: "Ember House Blend", desc: "Brazil & Colombia · milk chocolate, toasted hazelnut, caramel.", price: 17, tags: ["vegan"], food: true, retail: true, roast: 4, color: "#c8834a", origin: "Brazil · Colombia" },
    { id: "bean-sidamo", name: "Ethiopia Sidamo", desc: "Washed heirloom · jasmine, bergamot, ripe peach.", price: 21, tags: ["vegan"], food: true, retail: true, roast: 2, color: "#d9a441", origin: "Sidamo, Ethiopia" },
    { id: "bean-decaf", name: "Midnight Decaf", desc: "Swiss Water Process Peru · cocoa, brown sugar, plum.", price: 18, tags: ["vegan", "decaf"], food: true, retail: true, nocaf: true, roast: 3, color: "#5b6b8c", origin: "Cajamarca, Peru" },
  ]},
  { cat: "gifts", items: [
    { id: "latteart", name: "Latte Art 101 workshop", desc: "90-minute hands-on class, drinks included.", price: 25, tags: [], food: true, retail: true, hidden: true },
    { id: "forward", name: "Pay-it-forward coffee", desc: "A coffee for a neighbor, pinned to our community board.", price: 3, tags: [], food: true, retail: true, hidden: true },
    { id: "giftcard", name: "Gift card", desc: "A handwritten gift card, ready with your pickup.", price: 25, tags: [], food: true, retail: true, hidden: true },
  ]},
];
// Merchandising badges
const BADGES = { latte: "Bestseller", flatwhite: "Barista pick", coldbrew: "Bestseller", matcha: "New", croissant: "Bestseller", pourover: "Barista pick", avotoast: "New" };
window.MENU.forEach((c) => c.items.forEach((i) => { if (BADGES[i.id]) i.badge = BADGES[i.id]; if (i.seasonal) i.badge = "Seasonal"; }));
window.MENU_INDEX = Object.fromEntries(window.MENU.flatMap((c) => c.items.map((i) => [i.id, { ...i, cat: c.cat }])));
window.fmt = (n) => "$" + n.toFixed(2);
