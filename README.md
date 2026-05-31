# 🛒 Playwright E-Commerce Test Suite

[![Playwright Tests](https://github.com/pulidoff/playwright-ecommerce-suite/actions/workflows/playwright.yml/badge.svg)](https://github.com/pulidoff/playwright-ecommerce-suite/actions/workflows/playwright.yml)

End-to-end test suite for [SauceDemo](https://www.saucedemo.com), a reference e-commerce application. Covers the full purchase funnel — authentication, cart management, and checkout — using Playwright with a Page Object Model architecture and Allure reporting.

---

## 🧰 Stack

| Tool | Role |
|---|---|
| [Playwright](https://playwright.dev) | Browser automation & test runner |
| JavaScript (CommonJS) | Language |
| Page Object Model (POM) | Test architecture pattern |
| [Allure](https://allurereport.org) | Test reporting |
| GitHub Actions | CI/CD pipeline |

---

## 📁 Project Structure

```
playwright-ecommerce-suite/
├── .github/
│   └── workflows/
│       └── playwright.yml       # CI pipeline definition
├── fixtures/
│   └── users.json               # Test user credentials
├── pageobjects/
│   ├── POManager.js             # Central page object factory
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── tests/
│   ├── login.spec.js
│   ├── cart.spec.js
│   └── checkout.spec.js
├── playwright.config.js
└── package.json
```

---

## 🚀 How to Run

**Install dependencies and browsers:**

```bash
npm ci
npx playwright install --with-deps
```

**Run all tests:**

```bash
npm test
```

**Run a specific suite:**

```bash
npx playwright test tests/login.spec.js
npx playwright test tests/cart.spec.js
npx playwright test tests/checkout.spec.js
```

**Open the built-in HTML report after a run:**

```bash
npx playwright show-report
```

**Generate and open the Allure report:**

```bash
npm run allure:generate
npm run allure:open
```

**Serve the Allure report directly from raw results (no generate step needed):**

```bash
npm run allure:serve
```

---

## 🧪 Test Suites

### `login.spec.js` — Authentication (3 tests)

| Test | Description |
|---|---|
| Successful login | `standard_user` authenticates and lands on `/inventory` |
| Locked-out user | `locked_out_user` sees the appropriate error message |
| Invalid credentials | Wrong username/password pair shows a validation error |

### `cart.spec.js` — Cart Management (3 tests)

| Test | Description |
|---|---|
| Add product | Item added from inventory appears in the cart |
| Remove product | Removing the only item leaves the cart empty |
| Badge counter | Cart badge reflects the correct item count after adding a product |

### `checkout.spec.js` — Checkout Flow (3 tests)

| Test | Description |
|---|---|
| Full happy path | Add item → cart → fill shipping form → confirm order |
| Empty cart checkout | Documented as `test.fail` — known bug where SauceDemo allows checkout with an empty cart instead of blocking it |
| Missing form fields | Submitting the shipping form without filling required fields shows a validation error |

---

## 🏗️ Technical Decisions

### Why Page Object Model?

Each page is represented by a dedicated class (`LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`) that owns its locators and interaction methods. Tests only call high-level methods like `login()`, `addProductToCart()`, or `checkout()` — they never touch raw selectors.

This separation means a locator change in the application requires a fix in exactly one place (the page object), not in every test that touches that element.

`POManager` acts as a single factory so tests obtain page objects through a consistent entry point without importing individual classes:

```js
const pm = new POManager(page);
await pm.getLoginPage().login(username, password);
await pm.getInventoryPage().addProductToCart('Sauce Labs Backpack');
```

### Direct locators vs. nested/filtered locators

Two different strategies are used depending on whether the target element is unique or shared across repeating items.

**Direct locator** — used when the element is unique on the page or has a deterministic `data-test` attribute:

```js
// CartPage: SauceDemo generates a unique remove button per product slug
async removeProduct(productName) {
  const slug = productName.toLowerCase().replace(/\s+/g, '-');
  await this.page.locator(`[data-test="remove-${slug}"]`).click();
}
```

A single `locator()` call is sufficient because the selector itself identifies the right element without ambiguity.

**Nested/filtered locator** — used when multiple elements share the same selector pattern and the target must be scoped to a specific parent:

```js
// InventoryPage: every product card has an "Add to cart" button, so the
// click must be scoped to the card that contains the matching product name
async addProductToCart(productName) {
  const item = this.inventoryItem.filter({
    has: this.page.locator('[data-test="inventory-item-name"]', { hasText: productName }),
  });
  await item.locator('[data-test^="add-to-cart"]').click();
}
```

`filter({ has })` narrows the list of matching items to the one whose title matches, then `.locator()` descends into it. This avoids brittle index-based selection (`nth(0)`) and keeps the intent readable.

There is also one intentional inline locator in `cart.spec.js` — the shopping cart badge check:

```js
const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
await expect(cartBadge).toHaveText('1');
```

This element exists only once on the page across all views and is not tied to the cart page's own actions, so defining it directly in the test is simpler than adding it to a page object.
