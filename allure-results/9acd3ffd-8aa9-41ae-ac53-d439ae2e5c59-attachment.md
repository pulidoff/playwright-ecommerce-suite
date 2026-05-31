# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart.spec.js >> Cart >> agregar un producto al carrito y verificar que aparece
- Location: tests\cart.spec.js:14:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-test="cart-item"]').filter({ has: locator('[data-test$="title-link"]').filter({ hasText: 'Sauce Labs Backpack' }) })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[data-test="cart-item"]').filter({ has: locator('[data-test$="title-link"]').filter({ hasText: 'Sauce Labs Backpack' }) })

```

```yaml
- button "Open Menu"
- img "Open Menu"
- text: Swag Labs 1 Your Cart QTY Description 1
- link "Sauce Labs Backpack":
  - /url: "#"
- text: carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection. $29.99
- button "Remove"
- button "Go back Continue Shopping":
  - img "Go back"
  - text: Continue Shopping
- button "Checkout"
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
  1  | const { expect } = require('@playwright/test');
  2  | 
  3  | class CartPage {
  4  |   constructor(page) {
  5  |     this.page           = page;
  6  |     this.cartList       = page.locator('[data-test="cart-list"]');
  7  |     this.cartItem       = page.locator('[data-test="cart-item"]');
  8  |     this.checkoutButton = page.locator('[data-test="checkout"]');
  9  |   }
  10 | 
  11 |   async verifyProductInCart(productName) {
  12 |     const item = this.cartItem.filter({
  13 |       has: this.page.locator('[data-test$="title-link"]', { hasText: productName })
  14 |     });
> 15 |     await expect(item).toBeVisible();
     |                        ^ Error: expect(locator).toBeVisible() failed
  16 |   }
  17 | 
  18 |   async getCartItems() {
  19 |     return this.cartItem;
  20 |   }
  21 | 
  22 |   async checkout() {
  23 |     await this.checkoutButton.click();
  24 |   }
  25 | 
  26 |   async removeProduct(productName) {
  27 |     const item = this.cartItem.filter({ hasText: productName });
  28 |     await item.locator('[data-test^="remove"]').click();
  29 |   }
  30 | }
  31 | 
  32 | module.exports = { CartPage };
  33 | 
```