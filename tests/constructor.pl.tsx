import { test, expect } from '@playwright/test';

const bunId = '643d69a5c3f7b9001cfa093c';
const mainId = '643d69a5c3f7b9001cfa0941';
const sauceId = '643d69a5c3f7b9001cfa0942';

test.describe('Burger constructor page', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/burger-api.har', {
      url: 'https://norma.education-services.ru/api/**',
      update: false
    });
  });

  test.afterEach(async ({ page, context }) => {
    await page.evaluate(() => {
      window.localStorage.clear();
    });

    await context.clearCookies();
  });

  test('adds ingredients to burger constructor', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Соберите бургер')).toBeVisible();

    await expect(page.getByTestId('constructor-empty-bun-top')).toBeVisible();
    await expect(page.getByTestId('constructor-empty-filling')).toBeVisible();
    await expect(page.getByTestId('constructor-empty-bun-bottom')).toBeVisible();

    await page.getByTestId(`add-ingredient-${bunId}`).locator('button').click();
    await page
      .getByTestId(`add-ingredient-${mainId}`)
      .locator('button')
      .click();
    await page
      .getByTestId(`add-ingredient-${sauceId}`)
      .locator('button')
      .click();

    const constructor = page.getByTestId('burger-constructor');

    await expect(constructor).toContainText('Краторная булка N-200i (верх)');
    await expect(constructor).toContainText('Краторная булка N-200i (низ)');
    await expect(constructor).toContainText(
      'Биокотлета из марсианской Магнолии'
    );
    await expect(constructor).toContainText('Соус Spicy-X');

    await expect(
      page.getByTestId('constructor-empty-bun-top')
    ).not.toBeVisible();
    await expect(
      page.getByTestId('constructor-empty-filling')
    ).not.toBeVisible();
    await expect(
      page.getByTestId('constructor-empty-bun-bottom')
    ).not.toBeVisible();
  });

  test('opens ingredient modal with selected ingredient details', async ({
    page
  }) => {
    await page.goto('/');

    await expect(page.getByTestId('modal')).not.toBeVisible();

    await page.getByTestId(`ingredient-${mainId}`).locator('a').click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Биокотлета из марсианской Магнолии');
    await expect(modal).toContainText('4242');
    await expect(modal).toContainText('420');
    await expect(modal).toContainText('142');
    await expect(modal).toContainText('242');
  });

  test('closes ingredient modal by close button', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('modal')).not.toBeVisible();

    await page.getByTestId(`ingredient-${mainId}`).locator('a').click();

    await expect(page.getByTestId('modal')).toBeVisible();

    await page.getByTestId('modal-close-button').click();

    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('closes ingredient modal by overlay click', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('modal')).not.toBeVisible();

    await page.getByTestId(`ingredient-${mainId}`).locator('a').click();

    await expect(page.getByTestId('modal')).toBeVisible();

    await page.getByTestId('modal-overlay').click({
      position: {
        x: 10,
        y: 10
      }
    });

    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('creates order and clears constructor after closing order modal', async ({
    page,
    context
  }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        url: 'http://localhost:4000'
      }
    ]);

    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.goto('/');

    await expect(page.getByTestId('modal')).not.toBeVisible();

    await page.getByTestId(`add-ingredient-${bunId}`).locator('button').click();
    await page
      .getByTestId(`add-ingredient-${mainId}`)
      .locator('button')
      .click();
    await page
      .getByTestId(`add-ingredient-${sauceId}`)
      .locator('button')
      .click();

    const constructor = page.getByTestId('burger-constructor');

    await expect(constructor).toContainText('Краторная булка N-200i (верх)');
    await expect(constructor).toContainText(
      'Биокотлета из марсианской Магнолии'
    );
    await expect(constructor).toContainText('Соус Spicy-X');
    await expect(constructor).toContainText('Краторная булка N-200i (низ)');

    await page.getByTestId('order-button').locator('button').click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();
    await expect(modal).toContainText('12345');
    await expect(modal).toContainText('идентификатор заказа');
    await expect(modal).toContainText('Ваш заказ начали готовить');

    await page.getByTestId('modal-close-button').click();

    await expect(page.getByTestId('modal')).not.toBeVisible();

    await expect(page.getByTestId('constructor-empty-bun-top')).toBeVisible();
    await expect(page.getByTestId('constructor-empty-filling')).toBeVisible();
    await expect(page.getByTestId('constructor-empty-bun-bottom')).toBeVisible();
  });
});
