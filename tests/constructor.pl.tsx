import { test, expect } from '@playwright/test';

const bunId = '643d69a5c3f7b9001cfa093c';
const mainId = '643d69a5c3f7b9001cfa0941';
const sauceId = '643d69a5c3f7b9001cfa0942';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('tests/hars/burger-api.har', {
    url: 'https://norma.education-services.ru/api/**',
    update: false
  });

  await page.goto('/');
});

test('adds ingredients to burger constructor', async ({ page }) => {
  await expect(page.getByText('Соберите бургер')).toBeVisible();

  await expect(page.getByTestId('constructor-empty-bun-top')).toBeVisible();
  await expect(page.getByTestId('constructor-empty-filling')).toBeVisible();
  await expect(page.getByTestId('constructor-empty-bun-bottom')).toBeVisible();

  await page.getByTestId(`add-ingredient-${bunId}`).locator('button').click();
  await page.getByTestId(`add-ingredient-${mainId}`).locator('button').click();
  await page.getByTestId(`add-ingredient-${sauceId}`).locator('button').click();

  const constructor = page.getByTestId('burger-constructor');

  await expect(constructor).toContainText('Краторная булка N-200i (верх)');
  await expect(constructor).toContainText('Краторная булка N-200i (низ)');
  await expect(constructor).toContainText('Биокотлета из марсианской Магнолии');
  await expect(constructor).toContainText('Соус Spicy-X');

  await expect(page.getByTestId('constructor-empty-bun-top')).not.toBeVisible();
  await expect(page.getByTestId('constructor-empty-filling')).not.toBeVisible();
  await expect(page.getByTestId('constructor-empty-bun-bottom')).not.toBeVisible();
});

test('opens ingredient modal with selected ingredient details', async ({
  page
}) => {
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
  await page.getByTestId(`ingredient-${mainId}`).locator('a').click();

  await expect(page.getByTestId('modal')).toBeVisible();

  await page.getByTestId('modal-close-button').click();

  await expect(page.getByTestId('modal')).not.toBeVisible();
});

test('closes ingredient modal by overlay click', async ({ page }) => {
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
