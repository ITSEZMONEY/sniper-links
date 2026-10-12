import { expect, test, type Page } from '@playwright/test';

async function expectContained(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
}

for (const width of [320, 390]) {
  test(`site tasks and long content remain reachable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ['/', '/demo', '/embed-generator', '/docs', '/privacy']) {
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
      await expectContained(page);
    }
    await page.goto('/embed-generator');
    await page.getByLabel('Button text', { exact: true }).fill('Find the confirmation email for your latest signup');
    await page.getByLabel('Sender email or domain', { exact: true }).fill('confirmation@notifications.example.com');
    await page.getByLabel('Recipient integration').selectOption('fixed');
    await expect(page.getByRole('textbox', { name: 'Embed code' })).toHaveValue(/data-email="user@gmail.com"/);
    for (const name of ['Copy code', 'Download HTML', 'Download widget JS']) {
      const action = page.getByRole(name === 'Download widget JS' ? 'link' : 'button', { name, exact: true });
      await action.focus();
      await expect(action).toBeFocused();
      await expect(action).toBeInViewport();
      const bounds = await action.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    }
    await expectContained(page);
    await page.goto('/docs');
    const attributes = page.getByRole('navigation', { name: 'Documentation sections' }).getByRole('link', { name: 'Data attributes' });
    await attributes.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#attributes$/);
    await expect(page.getByRole('heading', { name: 'Public data attributes' })).toBeInViewport();
    await expectContained(page);
  });
}

for (const { name, width, height } of [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  test(`homepage live-demo empty state remains usable on ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    const recipient = page.getByLabel('Recipient email');
    await recipient.fill('');
    await page.getByLabel('Sender email or domain').fill('example.com');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Try the product' })).toBeVisible();
    await expect(recipient).toBeVisible();
    await expect(recipient).toHaveValue('');
    await expect(page.getByRole('button', { name: 'Generate inbox link' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Generated inbox link' })).toHaveCount(0);
    await expectContained(page);
    await page.evaluate(() => document.fonts.ready);
    const screenshotPath = test.info().outputPath(`sniperlinks-${name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    await test.info().attach(`sniperlinks-${name}`, { path: screenshotPath, contentType: 'image/png' });
  });
}

test('skip link and unknown-provider help preserve keyboard flow', async ({ page }, testInfo) => {
  const nativeIOSTabbing = testInfo.project.name === 'ios-webkit';
  await page.goto('/demo');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  // Native iOS Tab eligibility depends on platform keyboard preferences.
  if (nativeIOSTabbing) await skip.focus();
  else await page.keyboard.press('Tab');
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  await page.getByLabel('Recipient email').fill('reader@custom.example.com');
  await page.getByLabel('Sender email or domain').focus();
  const generate = page.getByRole('button', { name: 'Generate inbox link' });
  if (nativeIOSTabbing) await generate.focus();
  else await page.keyboard.press('Tab');
  await expect(generate).toBeFocused();
  await page.keyboard.press('Enter');
  const help = page.getByRole('button', { name: 'How to find your email' });
  if (nativeIOSTabbing) await help.focus();
  else await page.keyboard.press('Tab');
  await expect(help).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Find your confirmation email' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(help).toBeFocused();
});
