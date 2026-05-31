const { test, expect } = require('@playwright/test');
const { POManager }    = require('../pageobjects/POManager');
const users            = require('../fixtures/users.json');

const PRODUCT = 'Sauce Labs Backpack';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    const pm = new POManager(page);
    await pm.getLoginPage().goTo();
    await pm.getLoginPage().login(users.standardUser.username, users.standardUser.password);
  });

  test('flujo completo de checkout exitoso desde login hasta confirmación', async ({ page }) => {
    const pm = new POManager(page);

    await pm.getInventoryPage().addProductToCart(PRODUCT);
    await pm.getInventoryPage().goToCart();
    await pm.getCartPage().checkout();

    await pm.getCheckoutPage().fillInfo('John', 'Doe', '12345');
    await pm.getCheckoutPage().continue();
    await pm.getCheckoutPage().finish();

    const message = await pm.getCheckoutPage().getConfirmationMessage();
    expect(message).toBe('Thank you for your order!');
  });

  // BUG CONOCIDO: saucedemo permite iniciar el checkout con el carrito vacío
  // sin mostrar ningún error ni bloquear el flujo. El comportamiento correcto
  // sería impedir el avance y mantener al usuario en /cart.html.
  test.fail('checkout con carrito vacío no avanza', async ({ page }) => {
    const pm = new POManager(page);

    await pm.getInventoryPage().goToCart();
    await expect(pm.getCartPage().cartItem).toHaveCount(0);

    await pm.getCartPage().checkout();
    await expect(page).toHaveURL(/\/cart\.html/);
  });

  test('continuar sin completar campos del formulario muestra error', async ({ page }) => {
    const pm = new POManager(page);

    await pm.getInventoryPage().addProductToCart(PRODUCT);
    await pm.getInventoryPage().goToCart();
    await pm.getCartPage().checkout();

    await pm.getCheckoutPage().continue();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });
});
