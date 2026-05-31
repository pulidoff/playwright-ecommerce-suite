# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.js >> Checkout >> checkout con carrito vacío no avanza
- Location: tests\checkout.spec.js:29:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/cart\.html/
Received string:  "https://www.saucedemo.com/checkout-step-one.html"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × unexpected value "https://www.saucedemo.com/checkout-step-one.html"

```

```yaml
- button "Open Menu"
- img "Open Menu"
- text: "Swag Labs Checkout: Your Information"
- textbox "First Name"
- textbox "Last Name"
- textbox "Zip/Postal Code"
- button "Go back Cancel":
  - img "Go back"
  - text: Cancel
- button "Continue"
- contentinfo:
  - list:
    - listitem:
      - link "Twitter":
        - /url: https://twitter.com/saucelabs
    - listitem:
      - link "Facebook":
        - /url: https://www.facebook.com/saucelabs
    - listitem:
      - link "LinkedIn":
        - /url: https://www.linkedin.com/company/sauce-labs/
  - text: © 2026 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | const { POManager }    = require('../pageobjects/POManager');
  3  | const users            = require('../fixtures/users.json');
  4  | 
  5  | const PRODUCT = 'Sauce Labs Backpack';
  6  | 
  7  | test.describe('Checkout', () => {
  8  |   test.beforeEach(async ({ page }) => {
  9  |     const pm = new POManager(page);
  10 |     await pm.getLoginPage().goTo();
  11 |     await pm.getLoginPage().login(users.standardUser.username, users.standardUser.password);
  12 |   });
  13 | 
  14 |   test('flujo completo de checkout exitoso desde login hasta confirmación', async ({ page }) => {
  15 |     const pm = new POManager(page);
  16 | 
  17 |     await pm.getInventoryPage().addProductToCart(PRODUCT);
  18 |     await pm.getInventoryPage().goToCart();
  19 |     await pm.getCartPage().checkout();
  20 | 
  21 |     await pm.getCheckoutPage().fillInfo('John', 'Doe', '12345');
  22 |     await pm.getCheckoutPage().continue();
  23 |     await pm.getCheckoutPage().finish();
  24 | 
  25 |     const message = await pm.getCheckoutPage().getConfirmationMessage();
  26 |     expect(message).toBe('Thank you for your order!');
  27 |   });
  28 | 
  29 |   test('checkout con carrito vacío no avanza', async ({ page }) => {
  30 |     const pm = new POManager(page);
  31 | 
  32 |     await pm.getInventoryPage().goToCart();
  33 |     await expect(pm.getCartPage().cartItem).toHaveCount(0);
  34 | 
  35 |     await pm.getCartPage().checkout();
  36 |     // Si el sitio carece de validación, este test falla y documenta el bug
> 37 |     await expect(page).toHaveURL(/\/cart\.html/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  38 |   });
  39 | 
  40 |   test('continuar sin completar campos del formulario muestra error', async ({ page }) => {
  41 |     const pm = new POManager(page);
  42 | 
  43 |     await pm.getInventoryPage().addProductToCart(PRODUCT);
  44 |     await pm.getInventoryPage().goToCart();
  45 |     await pm.getCartPage().checkout();
  46 | 
  47 |     await pm.getCheckoutPage().continue();
  48 | 
  49 |     await expect(page.locator('[data-test="error"]')).toBeVisible();
  50 |   });
  51 | });
  52 | 
```