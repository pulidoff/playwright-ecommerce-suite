class InventoryPage {
  constructor(page) {
    this.page          = page;
    this.pageTitle     = page.locator('[data-test="title"]');
    this.inventoryList = page.locator('[data-test="inventory-list"]');
    this.inventoryItem = page.locator('[data-test="inventory-item"]');
    this.cartIcon      = page.locator('[data-test="shopping-cart-link"]');
  }

  async getTitle() {
    return this.pageTitle.textContent();
  }

  async getProducts() {
    return this.inventoryItem;
  }

  async addProductToCart(productName) {
    const item = this.inventoryItem.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: productName }),
    });
    await item.locator('[data-test^="add-to-cart"]').click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }
}

module.exports = { InventoryPage };
