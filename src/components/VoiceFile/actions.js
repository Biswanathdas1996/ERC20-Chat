export function callSupport() {
  return window.open("tel:8001691299");
}

export function chatOnWhatsApp() {
  return window.open("https://api.whatsapp.com/send?phone=8001691299&text=Hi");
}

export function actionItems(action) {
  switch (action) {
    case "callSupport":
      return callSupport;
    case "chatOnWhatsApp":
      return chatOnWhatsApp;

    default:
    // code block
  }
}
