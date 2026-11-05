// English ⇄ Español: phrase dictionary applied to text nodes (static + dynamic) and placeholders.
(function () {
  const ES = {
    // Nav & chrome
    "Menu": "Menú", "Beans": "Café en grano", "Rewards": "Recompensas", "Gifts": "Regalos", "Visit": "Visítanos", "Order": "Pedir",
    "Home": "Inicio", "Search": "Buscar", "Me": "Yo", "Back to top ↑": "Volver arriba ↑",
    // Hero
    "Good morning · roasted in house": "Buenos días · tostado en casa", "Afternoon · iced & energizing": "Tarde · helado y energizante", "Evening · cozy & calm": "Noche · acogedor y tranquilo",
    "Freshly roasted beans, handmade pastries, and a warm corner to settle into. Order ahead and it'll be waiting for you.": "Café recién tostado, repostería hecha a mano y un rincón cálido para quedarte. Pide con anticipación y te estará esperando.",
    "Smooth cold brew, iced lattes and matcha to carry you through the afternoon. Ready when you are.": "Cold brew suave, lattes helados y matcha para acompañarte toda la tarde. Listo cuando tú lo estés.",
    "Spiced chai, rich hot chocolate and decaf pour-overs for slow evenings and good conversations.": "Chai especiado, chocolate caliente y descafeinado para noches tranquilas y buenas conversaciones.",
    "Order ahead": "Pide con anticipación", "Find us": "Encuéntranos", "Order by voice": "Pedir por voz", "Play café sounds": "Sonidos de café", "Café sounds on": "Sonidos activados",
    "Morning favorites": "Favoritos de la mañana", "Afternoon pick-me-ups": "Para la tarde", "Evening comforts": "Para la noche", "See the full menu →": "Ver el menú completo →",
    // Menu
    "Order ahead and skip the line — pay when you pick up.": "Pide con anticipación y evita la fila. Paga al recoger.",
    "🌱 Vegan": "🌱 Vegano", "Under $5": "Menos de $5", "🧊 Iced-friendly": "🧊 Helado", "🌙 Caffeine-free": "🌙 Sin cafeína",
    "Coffee": "Café", "Tea & More": "Té y más", "Food": "Comida", "Winter ❄": "Invierno ❄", "+ Add": "+ Añadir", "✓ Added": "✓ Añadido", "Clear all": "Borrar todo",
    "Most popular": "Más pedido", "Bestseller": "Más vendido", "Barista pick": "Favorito del barista", "New": "Nuevo", "Seasonal": "De temporada",
    // Builder
    "Size": "Tamaño", "Temperature": "Temperatura", "Milk": "Leche", "Sweetness": "Dulzor", "Small": "Chico", "Medium": "Mediano", "Large": "Grande",
    "Hot": "Caliente", "Iced": "Helado", "Whole milk": "Leche entera", "Oat": "Avena", "Almond": "Almendra", "Skim": "Descremada",
    "None": "Nada", "Light": "Poco", "Regular": "Normal", "Vanilla": "Vainilla", "⚡ Caffeine": "⚡ Cafeína", "🔥 Calories": "🔥 Calorías",
    // Cart & checkout
    "Your order": "Tu pedido", "Total": "Total", "Subtotal": "Subtotal", "Choose pickup time →": "Elegir hora de recogida →", "Your order is empty.": "Tu pedido está vacío.",
    "Browse the menu": "Ver el menú", "Name for the order": "Nombre para el pedido", "Pickup time": "Hora de recogida", "How are you picking up?": "¿Cómo vas a recoger?",
    "Counter": "Mostrador", "Curbside": "En la acera", "Walk-up": "Ventanilla", "Grab & go shelf": "Estante para llevar", "We bring it out": "Te lo llevamos", "Side window": "Ventana lateral",
    "No card needed — pay at the counter when you pick up.": "Sin tarjeta: paga en el mostrador al recoger.", "← Back to order": "← Volver al pedido", "Done": "Listo",
    "Pair it with a pastry": "Acompáñalo con un pan dulce", "$1 off with every drink": "$1 menos con cada bebida",
    // Sections
    "Not sure what to order?": "¿No sabes qué pedir?", "Don't take our word for it.": "No lo decimos solo nosotros.", "Take the roastery home": "Llévate el tostador a casa",
    "Every 10th drink is on us.": "La décima bebida es gratis.", "Join Ember Club": "Únete a Ember Club", "Give someone a better morning.": "Regala una mejor mañana.",
    "Visit us": "Visítanos", "Hours": "Horario", "Get directions ↗": "Cómo llegar ↗", "Call us": "Llámanos", "Today": "Hoy", "Tomorrow": "Mañana", "Closed": "Cerrado",
    "More than a coffee shop.": "Más que una cafetería.", "Got a question? Ask away.": "¿Tienes una pregunta? Pregunta.", "Coffee for the whole crew.": "Café para todo el equipo.",
    "Meet the people behind your cup": "Conoce a quienes preparan tu café", "The winter menu is here.": "Llegó el menú de invierno.", "Café-quality coffee in your kitchen": "Café de cafetería en tu cocina",
    "Wrapped, ready, and picked up with your latte": "Envuelto, listo y para recoger con tu latte", "Add": "Añadir", "Add bag": "Añadir bolsa", "Add box": "Añadir caja",
    "Add to order ·": "Añadir al pedido ·", "Make it a combo": "Hazlo combo", ": add a butter croissant for": ": añade un croissant por",
    "Place order": "Hacer pedido", "✓ No card needed": "✓ Sin tarjeta", "✓ Ready in ~15 min": "✓ Listo en ~15 min", "★ 4.9 from regulars": "★ 4.9 de nuestros clientes", "Popular right now": "Lo más pedido",
  };
  // Menu descriptions by id
  const DESC = {
    espresso: "Doble shot de nuestra mezcla de la casa.", americano: "Espresso alargado con agua caliente.", cappuccino: "Partes iguales de espresso, leche y espuma.",
    flatwhite: "Microespuma sedosa sobre un doble ristretto.", latte: "Espresso con leche vaporizada.", pourover: "De origen único, preparado a mano.",
    coldbrew: "Infusionado 18 horas, suave y achocolatado.", mocha: "Espresso, chocolate oscuro y leche vaporizada.", chai: "Chai especiado de la casa con leche vaporizada.",
    matcha: "Matcha de grado ceremonial, ligeramente endulzado.", tea: "Earl Grey, verde, manzanilla o menta.", cocoa: "Chocolate oscuro con crema batida.",
    croissant: "Hojaldrado y dorado, horneado esta mañana.", muffin: "Lleno de moras azules con streusel.", avotoast: "Pan de masa madre, aguacate y chile.",
    sandwich: "Huevo, cheddar y tocino o espinaca en pan brioche.",
  };
  const EN_DESC = Object.fromEntries(Object.keys(DESC).map((id) => [id, MENU_INDEX[id].desc]));
  const REV = Object.fromEntries(Object.entries(ES).map(([a, b]) => [b, a]));
  const K = "eb-lang";
  let lang = (() => { try { return localStorage.getItem(K) || "en"; } catch { return "en"; } })();
  const T = {
    "Extra espresso shots": "Shots extra de espresso", "+$0.90 each": "+$0.90 c/u", "Add to order": "Añadir al pedido",
    "Make it a combo": "Hazlo combo", "Large": "Grande", "add a butter croissant for": "añade un croissant por", "Make it": "Hazlo", "for": "por", "more coffee": "más café",
    "of the 400 mg daily guideline": "del límite diario de 400 mg", "that's a strong one!": "¡está fuerte!",
    morning: "Buen café,<br />mañanas tranquilas.", afternoon: "Vence el bajón<br />de las 3 pm.", evening: "Relájate<br />sin prisa.",
  };
  window.t = (str) => (lang === "es" && T[str]) || str;
  window.getLang = () => lang;

  function translateNode(root) {
    const dict = lang === "es" ? ES : REV;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement && /SCRIPT|STYLE/.test(n.parentElement.tagName) ? 2 : 1) });
    let n;
    while ((n = w.nextNode())) {
      const t = n.nodeValue.trim(); if (!t) continue;
      if (dict[t]) n.nodeValue = n.nodeValue.replace(t, dict[t]);
    }
    root.querySelectorAll?.("[placeholder]").forEach((el) => {
      const P = { "Search drinks & food…": "Busca bebidas y comida…", "e.g. Do you have oat milk?": "p. ej. ¿Tienen leche de avena?" };
      const R = Object.fromEntries(Object.entries(P).map(([a, b]) => [b, a]));
      const d = lang === "es" ? P : R; if (d[el.placeholder]) el.placeholder = d[el.placeholder];
    });
  }
  function applyData() {
    Object.keys(DESC).forEach((id) => { MENU_INDEX[id].desc = lang === "es" ? DESC[id] : EN_DESC[id]; const it = MENU.flatMap((c) => c.items).find((i) => i.id === id); if (it) it.desc = MENU_INDEX[id].desc; });
  }
  function apply() {
    document.documentElement.lang = lang;
    const h1 = document.querySelector(".hero h1");
    if (h1 && window.DAYPART) h1.innerHTML = lang === "es" ? T[DAYPART.key] : DAYPART.h1;
    applyData();
    if (window.renderMenu) renderMenu();
    translateNode(document.body);
    btn.textContent = lang === "es" ? "EN" : "ES";
    btn.setAttribute("aria-label", lang === "es" ? "Switch to English" : "Cambiar a español");
  }
  const btn = document.createElement("button");
  btn.className = "theme-toggle lang-btn";
  document.querySelector(".nav .theme-toggle").before(btn);
  btn.addEventListener("click", () => { lang = lang === "es" ? "en" : "es"; try { localStorage.setItem(K, lang); } catch {} apply(); });
  let pending = false;
  new MutationObserver(() => { if (pending) return; pending = true; requestAnimationFrame(() => { pending = false; if (lang === "es") translateNode(document.body); }); })
    .observe(document.body, { childList: true, subtree: true, characterData: true });
  if (lang === "es") apply(); else { btn.textContent = "ES"; btn.setAttribute("aria-label", "Cambiar a español"); }
})();
