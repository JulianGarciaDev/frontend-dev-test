import { test, expect } from '@playwright/test';

async function expectHeaderVisible(page) {
  await expect(page.getByTestId('header')).toBeVisible();
  await expect(page.getByTestId('home-link')).toBeVisible();
  await expect(page.getByTestId('breadcrumb')).toBeVisible();
  await expect(page.getByTestId('cart-badge')).toBeVisible();
}

async function expectHomePageVisible(page) {
  await expect(page).toHaveURL('/');
  await expectHeaderVisible(page);
  await expect(page.getByTestId('breadcrumb-item')).toHaveCount(1);
  await expect(page.getByTestId('search-container')).toBeVisible();
  await expect(page.getByTestId('product-grid')).toBeVisible();
}

async function expectProductDetailsVisible(page) {
  await expect(page).toHaveURL(/\/product\/[\w-]+/);
  await expectHeaderVisible(page);
  await expect(page.getByTestId('breadcrumb-item')).toHaveCount(2);
  await expect(page.getByTestId('search-container')).not.toBeVisible();
  await expect(page.getByTestId('product-image')).toBeVisible();
  await expect(page.getByTestId('product-details')).toBeVisible();
  await expect(page.getByTestId('product-actions')).toBeVisible();
}

test.describe('E2E: Complete purchase flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Home -> Search -> Detail -> Add to Cart -> Home', async ({ page }) => {
    // Home
    await expectHomePageVisible(page);
    await expect(page.getByTestId('breadcrumb-item')).toHaveCount(1);
    await expect(page.getByTestId('cart-badge-count')).not.toBeVisible();
    await expect(page.getByTestId('product-card').first()).toBeVisible();

    // Search
    const firstCardModel = await page.getByTestId('product-card-model').first().textContent();
    const searchInput = page.getByTestId('search-bar-input');
    await searchInput.fill(firstCardModel.slice(0, 3).toUpperCase());
    
    const productCards = page.getByTestId('product-card');
    await expect(productCards.first()).toContainText(firstCardModel);

    // Detail
    await productCards.first().click();
    
    await expectProductDetailsVisible(page);
    await expect(page.getByTestId('cart-badge-count')).not.toBeVisible();

    // Add to Cart
    const addButton = page.getByTestId('add-to-cart-button');
    await expect(addButton).toBeVisible();
    await addButton.click();

    // Verify item in cart
    const cartBadge = page.getByTestId('cart-badge-count');
    await expect(cartBadge).toContainText('1');

    // Add to Cart again
    await addButton.click();

    // Verify incremented item in cart
    await expect(cartBadge).toContainText('2');

    // Navigate back to home by back-link
    const backLink = page.getByTestId('back-to-list-link');
    await backLink.click();
    await expectHomePageVisible(page);

    // Final cart verification
    await expect(page.getByTestId('cart-badge-count')).toContainText('2');
  });
});