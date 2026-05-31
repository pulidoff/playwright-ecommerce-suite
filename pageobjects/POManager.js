const { LoginPage }     = require('./LoginPage');
const { InventoryPage } = require('./InventoryPage');
const { CartPage }      = require('./CartPage');
const { CheckoutPage }  = require('./CheckoutPage');

class POManager {
  constructor(page) {
    this.loginPage     = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
    this.cartPage      = new CartPage(page);
    this.checkoutPage  = new CheckoutPage(page);
  }

  getLoginPage()     { return this.loginPage; }
  getInventoryPage() { return this.inventoryPage; }
  getCartPage()      { return this.cartPage; }
  getCheckoutPage()  { return this.checkoutPage; }
}

module.exports = { POManager };
