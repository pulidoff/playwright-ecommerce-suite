const { test, expect } = require('@playwright/test');
const { POManager }    = require('../pageobjects/POManager');
const users            = require('../fixtures/users.json');

const PRODUCT = 'Sauce Labs Backpack';

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    const pm = new POManager(page);
    await pm.getLoginPage().goTo();
    await pm.getLoginPage().login(users.standardUser.username, users.standardUser.password);
  });

  test('agregar un producto al carrito y verificar que aparece', async ({ page }) => {
    const pm = new POManager(page);

    await pm.getInventoryPage().addProductToCart(PRODUCT);
    await pm.getInventoryPage().goToCart();

    await pm.getCartPage().verifyProductInCart(PRODUCT);
  });

  test('agregar un producto y removerlo deja el carrito vacío', async ({ page }) => {
    const pm = new POManager(page);

    await pm.getInventoryPage().addProductToCart(PRODUCT);
    await pm.getInventoryPage().goToCart();
    await pm.getCartPage().removeProduct(PRODUCT);

    await expect(pm.getCartPage().cartItem).toHaveCount(0);
  });

  test('el contador del carrito se actualiza al agregar un producto', async ({ page }) => {
    const pm = new POManager(page);

    await pm.getInventoryPage().addProductToCart(PRODUCT);

    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toHaveText('1');
  });
});
