export function callSupport() {
  return window.open("tel:8001691299");
}

export function actionItems(action) {
  switch (action) {
    case "callSupport":
      return callSupport;

    default:
    // code block
  }
}
