const { expect } = require('@playwright/test');

class CartPage {
  constructor(page) {
    this.page           = page;
    this.cartItem       = page.locator('[data-test="cart-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async verifyProductInCart(productName) {
    await expect(
      this.page.locator('[data-test$="title-link"]').filter({ hasText: productName })
    ).toBeVisible();
  }

  async removeProduct(productName) {
    const slug = productName.toLowerCase().replace(/\s+/g, '-');
    await this.page.locator(`[data-test="remove-${slug}"]`).click();
  }

  async getCartItems() {
    return this.cartItem;
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };
