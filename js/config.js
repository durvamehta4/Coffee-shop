// Shop configuration. Set ORDER_ENDPOINT to any URL that accepts a JSON POST
// (Formspree, Zapier/Make webhook, Google Apps Script, your POS) to receive orders.
// Leave empty for demo mode: orders work end-to-end in the browser but are not sent anywhere.
window.SHOP_CONFIG = {
  ORDER_ENDPOINT: "",
  ORDER_EMAIL_FALLBACK: "orders@emberandbean.example",
};
