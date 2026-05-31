const { test, expect } = require('@playwright/test');
const { POManager }    = require('../pageobjects/POManager');
const users            = require('../fixtures/users.json');

test.describe('Login', () => {
  test('login exitoso con standard_user navega al inventario', async ({ page }) => {
    const loginPage = new POManager(page).getLoginPage();

    await loginPage.goTo();
    await loginPage.login(users.standardUser.username, users.standardUser.password);

    await expect(page).toHaveURL(/inventory/);
  });

  test('login con usuario bloqueado muestra mensaje de error', async ({ page }) => {
    const loginPage = new POManager(page).getLoginPage();

    await loginPage.goTo();
    await loginPage.login(users.lockedUser.username, users.lockedUser.password);

    await loginPage.verifyErrorIsVisible();
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Sorry, this user has been locked out.');
  });

  test('login con credenciales inválidas muestra mensaje de error', async ({ page }) => {
    const loginPage = new POManager(page).getLoginPage();

    await loginPage.goTo();
    await loginPage.login(users.invalidUser.username, users.invalidUser.password);

    await loginPage.verifyErrorIsVisible();
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Username and password do not match any user in this service');
  });
});
