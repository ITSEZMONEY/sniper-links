import { test, expect, type Page } from '@playwright/test';
import { ESP_CONFIGS } from '../../src/lib/sniper-link';
import { generateEmbedCode } from '../../src/lib/embed';

const host = 'http://127.0.0.1:4174';
const site = 'http://127.0.0.1:4173';

async function install(page: Page, markup = '<div data-sniperlink data-email="user@gmail.com" data-sender="noreply@example.com"></div>') {
  // Serve real HTML from the independent host. Intercepting the main response
  // loses Chromium's loopback address-space metadata and triggers LNA blocking.
  const response = await page.request.post(`${host}/fixtures`, { data: `<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><body>${markup}<script defer src="${site}/widget/sniperlink.js"></script></body></html>` });
  await page.goto(host + await response.text());
  await expect(page.locator('.sniperlink-container')).toHaveCount(1);
}

test('actual emitted script installs across origins and exports the public API', async ({ page, request }) => {
  const response = await request.get('/widget/sniperlink.js');
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toMatch(/javascript/);
  await install(page);
  expect(await page.evaluate(() => window.SniperLink.version)).toBe('1.0.0');
  expect(await page.evaluate(() => typeof window.SniperLink.create)).toBe('function');
  await expect(page.getByRole('link', { name: 'Open Gmail', exact: true })).toHaveAttribute('href', /https:\/\/mail.google.com\/.*#search\/from%3Anoreply%40example.com%20newer_than%3A1d%20in%3Aanywhere/);
  await expect(page.getByRole('link', { name: 'Powered by SniperLink' })).toHaveAttribute('href', site);
});

test('all eight providers route to HTTPS inboxes and describe capability honestly', async ({ page }) => {
  await install(page);
  for (const provider of ESP_CONFIGS) {
    await page.locator('[data-sniperlink]').evaluate((element, email) => element.setAttribute('data-email', email), `test@${provider.domains[0]}`);
    const anchor = page.getByRole('link', { name: `Open ${provider.name}`, exact: true });
    await expect(anchor).toBeVisible();
    const href = await anchor.getAttribute('href');
    expect(href).toMatch(/^https:\/\//);
    expect(href).not.toMatch(/compose|mailto:|googlegmail:|\/co\?/);
    await expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
    if (provider.capability === 'inbox') {
      expect(href).toBe(provider.desktopUrl);
      await expect(page.getByText(/Search for the sender manually/)).toBeVisible();
    }
  }
});

test('form email is captured initially and on input/change/submit without blocking the host', async ({ page }) => {
  await page.goto(host);
  await page.getByLabel('Signup email').fill('reader@gmail.com');
  await expect(page.getByRole('link', { name: 'Open Gmail' })).toBeVisible();
  await page.getByLabel('Signup email').fill('reader@outlook.com');
  await expect(page.getByRole('link', { name: 'Open Outlook' })).toBeVisible();
  const prevented = await page.evaluate(() => {
    const form = document.querySelector('form#signup')!;
    const input = document.querySelector<HTMLInputElement>('#email')!;
    input.value = 'reader@yahoo.com';
    const event = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(event);
    return event.defaultPrevented;
  });
  expect(prevented).toBe(false);
  await expect(page.getByRole('link', { name: 'Open Yahoo' })).toBeVisible();
  await page.evaluate(() => {
    const input = document.querySelector<HTMLInputElement>('#email')!;
    input.value = 'reader@icloud.com';
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(page.getByRole('link', { name: 'Open iCloud' })).toBeVisible();
});

test('SPA additions, attribute changes, removal and idless multi-widget mounts work', async ({ page }) => {
  await install(page);
  await page.evaluate(() => {
    const late = document.createElement('div');
    late.setAttribute('data-sniperlink', '');
    late.dataset.email = 'reader@hey.com';
    late.dataset.sender = 'example.com';
    late.dataset.buttonColor = '#ffffff';
    late.dataset.shape = 'pill';
    document.body.append(late);
    window.SniperLink.autoInit();
    window.SniperLink.autoInit();
  });
  await expect(page.locator('.sniperlink-container')).toHaveCount(2);
  const late = page.locator('[data-sniperlink]').nth(1);
  await expect(late.getByRole('link', { name: 'Open HEY' })).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(late.getByRole('link', { name: 'Open HEY' })).toHaveCSS('color', 'rgb(0, 0, 0)');
  await expect(late.getByRole('link', { name: 'Open HEY' })).toHaveCSS('border-radius', '999px');
  await late.evaluate(element => { element.setAttribute('data-email', 'reader@aol.com'); element.setAttribute('data-text', 'Find AOL mail'); });
  await expect(late.getByRole('link', { name: 'Find AOL mail' })).toBeVisible();
  await late.evaluate(element => element.remove());
  await expect(page.locator('.sniperlink-container')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Open Gmail' })).toBeVisible();
});

test('existing id-only snippets mount and explicit email takes precedence over unrelated forms', async ({ page }) => {
  await install(page, '<label for="email">Host email</label><input id="email" type="email" value="other@yahoo.com"><div id="sniper-link" data-sender="example.com" data-email="reader@gmail.com"></div>');
  await expect(page.getByRole('link', { name: 'Open Gmail' })).toBeVisible();
  await page.getByLabel('Host email').fill('other@outlook.com');
  await expect(page.getByRole('link', { name: 'Open Gmail' })).toBeVisible();
});

test('malicious text, style and sender values cannot insert markup or issue telemetry', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => { if (!request.url().startsWith(host) && !request.url().startsWith(site)) external.push(request.url()); });
  await install(page);
  const payload = '<img src="https://evil.example.com/x" onerror="window.xss=1"><script>window.xss=1</script>';
  await page.locator('[data-sniperlink]').evaluate((element, text) => {
    element.setAttribute('data-button-text', text);
    element.setAttribute('data-button-style', '\" onclick=\"alert(1)');
    element.setAttribute('data-button-color', 'red; background:url(https://evil.example.com)');
  }, payload);
  await expect(page.locator('.sniperlink-button')).toHaveText(payload);
  await expect(page.locator('.sniperlink-button')).toHaveCSS('background-color', 'rgb(109, 40, 217)');
  expect(await page.locator('[data-sniperlink] img, [data-sniperlink] script').count()).toBe(0);
  await page.locator('[data-sniperlink]').evaluate((element, text) => element.setAttribute('data-sender', text), payload);
  await expect(page.getByRole('alert')).toHaveText('Enter a valid sender email address or domain.');
  expect(external).toEqual([]);
});

test('unknown fallback has labeled dialog, Escape and focus return; no fallback tracking', async ({ page }) => {
  await install(page, '<div data-sniperlink data-email="reader@example.com" data-sender="noreply@example.com"></div>');
  await page.evaluate(() => {
    const calls: unknown[] = [];
    Object.assign(window, { testCalls: calls });
    const target = document.createElement('div');
    document.body.append(target);
    const widget = window.SniperLink.create({ container: target, email: 'reader@custom.example.com', noTracking: false, analyticsConsent: true, analytics: event => calls.push(event) });
    widget.init();
  });
  const trigger = page.getByRole('button', { name: 'How to find your email' }).first();
  await trigger.focus();
  await trigger.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Find your confirmation email' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.getByRole('button', { name: 'How to find your email' }).nth(1).click();
  await page.getByRole('button', { name: 'Close', exact: true }).last().click();
  expect(await page.evaluate(() => Reflect.get(window, 'testCalls'))).toEqual([]);
});

test('analytics is opt-in and consented, payload contains no email, sender, URL or user agent', async ({ page }) => {
  await install(page);
  await page.evaluate(() => {
    const calls: unknown[] = [];
    Object.assign(window, { testCalls: calls });
    const target = document.createElement('div');
    target.id = 'programmatic';
    document.body.append(target);
    const widget = window.SniperLink.create({ container: target, email: 'private@gmail.com', sender: 'private@example.com', analytics: event => calls.push(event) });
    widget.init();
    const click = () => {
      const anchor = target.querySelector('a')!;
      anchor.addEventListener('click', event => event.preventDefault(), { once: true });
      anchor.click();
    };
    click();
    widget.updateConfig({ noTracking: false });
    click();
    widget.updateConfig({ analyticsConsent: true });
    click();
    widget.updateConfig({ noTracking: true });
    click();
  });
  expect(await page.evaluate(() => Reflect.get(window, 'testCalls'))).toEqual([{ event: 'inbox_click', provider: 'Gmail', linkType: 'web' }]);
});

test('no-email input validates and keyboard submit focuses the generated anchor', async ({ page }) => {
  await install(page, '<div data-sniperlink data-sender="noreply@example.com"></div>');
  await page.getByRole('textbox', { name: 'Email address' }).fill('reader@gmail.com');
  await page.getByRole('textbox', { name: 'Email address' }).press('Enter');
  await expect(page.getByRole('link', { name: 'Open Gmail' })).toBeFocused();
  await expect(page.getByRole('link', { name: 'Open Gmail' })).toHaveAttribute('aria-describedby', /capability/);
});

test('initial form values are read and widget Enter does not submit an enclosing host form', async ({ page }) => {
  await install(page, '<form><label for="email">Host signup email</label><input id="email" type="email" value="reader@proton.me"></form><div data-sniperlink data-email-input="#email"></div>');
  await expect(page.getByRole('link', { name: 'Open ProtonMail' })).toBeVisible();
  await page.reload();
  const response = await page.request.post(`${host}/fixtures`, { data: `<!doctype html><body><form id="host-form"><div data-sniperlink></div></form><script defer src="${site}/widget/sniperlink.js"></script></body>` });
  await page.goto(host + await response.text());
  await page.evaluate(() => {
    Object.assign(window, { hostSubmits: 0 });
    document.querySelector('#host-form')!.addEventListener('submit', event => {
      event.preventDefault();
      Reflect.set(window, 'hostSubmits', Number(Reflect.get(window, 'hostSubmits')) + 1);
    });
  });
  await expect(page.locator('form')).toHaveCount(1);
  await page.getByRole('textbox', { name: 'Email address', exact: true }).fill('reader@gmail.com');
  await page.getByRole('textbox', { name: 'Email address', exact: true }).press('Enter');
  await expect(page.getByRole('link', { name: 'Open Gmail' })).toBeVisible();
  expect(await page.evaluate(() => Reflect.get(window, 'hostSubmits'))).toBe(0);
});

for (const internalEmail of ['', 'not-an-email']) {
  test(`review regression: ${internalEmail ? 'malformed' : 'empty'} widget never blocks native host submission`, async ({ page }) => {
    await install(page, '<form id="host-form"><label for="email">Host email</label><input id="email" name="email" type="email" required><div data-sniperlink data-email-input="#email"></div><button type="submit">Sign up</button></form>');
    await page.getByRole('textbox', { name: 'Email address', exact: true }).fill(internalEmail);
    const submits = await page.evaluate(() => {
      const form = document.querySelector<HTMLFormElement>('#host-form')!;
      let count = 0;
      form.addEventListener('submit', event => { event.preventDefault(); count++; });
      // No input/change event: native validation happens before the widget can
      // read the new host value from the submit event.
      document.querySelector<HTMLInputElement>('#email')!.value = 'reader@gmail.com';
      const submittedFields = [...new FormData(form).keys()];
      form.requestSubmit();
      const withWidget = count;
      document.querySelector('[data-sniperlink]')!.remove();
      form.requestSubmit();
      return { withWidget, afterRemoval: count - withWidget, submittedFields };
    });
    expect(submits).toEqual({ withWidget: 1, afterRemoval: 1, submittedFields: ['email'] });
  });
}

test('review regression: widget validates only its own actions without submitting the host', async ({ page }) => {
  await install(page, '<form id="host-form"><div data-sniperlink></div><button type="submit">Sign up</button></form>');
  await page.evaluate(() => {
    Object.assign(window, { hostSubmits: 0 });
    document.querySelector('#host-form')!.addEventListener('submit', event => {
      event.preventDefault();
      Reflect.set(window, 'hostSubmits', Number(Reflect.get(window, 'hostSubmits')) + 1);
    });
  });
  await expect(page.locator('form')).toHaveCount(1);
  await page.getByRole('button', { name: 'Find my inbox', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Enter a valid email address.');
  const input = page.getByRole('textbox', { name: 'Email address', exact: true });
  await input.fill('not-an-email');
  await input.press('Enter');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByRole('alert')).toHaveText('Enter a valid email address.');
  await input.fill('reader@gmail.com');
  await input.press('Enter');
  await expect(page.getByRole('link', { name: 'Open Gmail', exact: true })).toBeFocused();
  expect(await page.evaluate(() => Reflect.get(window, 'hostSubmits'))).toBe(0);
});

test('review regression: independent widgets never consume another widget recipient', async ({ page }) => {
  await install(page, '<div id="first" data-sniperlink></div>');
  await page.evaluate(() => {
    const second = document.createElement('div');
    second.id = 'second';
    second.setAttribute('data-sniperlink', '');
    document.body.append(second);
  });
  await expect(page.locator('.sniperlink-container')).toHaveCount(2);
  const first = page.locator('#first');
  const second = page.locator('#second');
  await first.getByRole('textbox', { name: 'Email address' }).fill('reader@outlook.com');
  await expect(second.getByRole('textbox', { name: 'Email address' })).toHaveValue('');
  await expect(second.locator('.sniperlink-button')).toHaveText('Find my inbox');
  await first.getByRole('textbox', { name: 'Email address' }).press('Enter');
  await expect(first.getByRole('link', { name: 'Open Outlook', exact: true })).toBeVisible();
  await expect(second.getByRole('textbox', { name: 'Email address' })).toHaveValue('');
  await second.getByRole('textbox', { name: 'Email address' }).fill('reader@yahoo.com');
  await second.getByRole('textbox', { name: 'Email address' }).press('Enter');
  await expect(second.getByRole('link', { name: 'Open Yahoo', exact: true })).toBeVisible();
  await expect(first.getByRole('link', { name: 'Open Outlook', exact: true })).toBeVisible();
});

test('review regression: configured selectors skip every widget internal input', async ({ page }) => {
  await install(page, '<div id="manual" data-sniperlink></div>');
  await page.evaluate(() => {
    const label = document.createElement('label');
    label.htmlFor = 'contact';
    label.textContent = 'Host contact';
    const input = document.createElement('input');
    input.id = 'contact';
    input.value = 'reader@hey.com';
    const integrated = document.createElement('div');
    integrated.id = 'integrated';
    integrated.setAttribute('data-sniperlink', '');
    integrated.dataset.emailInput = 'input';
    document.body.append(label, input, integrated);
  });
  await expect(page.locator('#integrated').getByRole('link', { name: 'Open HEY', exact: true })).toBeVisible();
  await page.locator('#manual').getByRole('textbox', { name: 'Email address' }).fill('reader@gmail.com');
  await expect(page.locator('#integrated').getByRole('link', { name: 'Open HEY', exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Host contact' }).fill('reader@proton.me');
  await expect(page.locator('#integrated').getByRole('link', { name: 'Open ProtonMail', exact: true })).toBeVisible();
  await expect(page.locator('#manual').getByRole('textbox', { name: 'Email address' })).toHaveValue('reader@gmail.com');
});

test('review regression: appearance attributes retain the manually chosen recipient', async ({ page }) => {
  await install(page, '<div data-sniperlink data-sender="noreply@example.com"></div>');
  await page.getByRole('textbox', { name: 'Email address' }).fill('reader@gmail.com');
  await page.getByRole('textbox', { name: 'Email address' }).press('Enter');
  const widget = page.locator('[data-sniperlink]');
  const link = widget.locator('a.sniperlink-button');
  const href = await link.getAttribute('href');
  for (const [attribute, value] of [
    ['data-button-color', '#ffffff'], ['data-button-text', 'Find my mail'],
    ['data-shape', 'pill'], ['data-show-branding', 'false'],
    ['data-button-style', 'minimal'], ['data-no-tracking', 'true']
  ]) {
    await widget.evaluate((element, [name, value]) => element.setAttribute(name, value), [attribute, value]);
    await expect(link).toHaveAttribute('href', href!);
    await expect(widget.getByRole('textbox')).toHaveCount(0);
  }
  await expect(link).toHaveText('Find my mail');
  await expect(link).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(link).toHaveCSS('border-radius', '999px');
  await expect(widget.getByRole('link', { name: 'Powered by SniperLink' })).toHaveCount(0);
});

test('review regression: changed or removed explicit email sources replace stale recipients', async ({ page }) => {
  await install(page, '<label for="contact-a">Contact A</label><input id="contact-a" type="text" value="reader@proton.me"><label for="contact-b">Contact B</label><input id="contact-b" type="text" value="reader@hey.com"><div data-sniperlink></div>');
  const widget = page.locator('[data-sniperlink]');
  await widget.getByRole('textbox', { name: 'Email address' }).fill('reader@gmail.com');
  await widget.getByRole('textbox', { name: 'Email address' }).press('Enter');
  await widget.evaluate(element => element.setAttribute('data-email', 'reader@outlook.com'));
  await expect(widget.getByRole('link', { name: 'Open Outlook', exact: true })).toBeVisible();
  await widget.evaluate(element => element.setAttribute('data-email', 'reader@yahoo.com'));
  await expect(widget.getByRole('link', { name: 'Open Yahoo', exact: true })).toBeVisible();
  await widget.evaluate(element => element.removeAttribute('data-email'));
  await expect(widget.getByRole('textbox', { name: 'Email address' })).toHaveValue('');
  await widget.getByRole('textbox', { name: 'Email address' }).fill('reader@gmail.com');
  await widget.getByRole('textbox', { name: 'Email address' }).press('Enter');
  await widget.evaluate(element => element.setAttribute('data-email-input', '#contact-a'));
  await expect(widget.getByRole('link', { name: 'Open ProtonMail', exact: true })).toBeVisible();
  await widget.evaluate(element => element.setAttribute('data-email-input', '#contact-b'));
  await expect(widget.getByRole('link', { name: 'Open HEY', exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Contact A' }).fill('other@yahoo.com');
  await expect(widget.getByRole('link', { name: 'Open HEY', exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Contact B' }).fill('reader@aol.com');
  await expect(widget.getByRole('link', { name: 'Open AOL', exact: true })).toBeVisible();
  await widget.evaluate(element => element.removeAttribute('data-email-input'));
  await expect(widget.getByRole('textbox', { name: 'Email address' })).toHaveValue('');
  await widget.evaluate(element => element.setAttribute('data-email', ''));
  await widget.getByRole('textbox', { name: 'Email address' }).fill('reader@gmail.com');
  await widget.getByRole('textbox', { name: 'Email address' }).press('Enter');
  // SPA renders may write the same source value again; no source changed.
  await widget.evaluate(element => element.setAttribute('data-email', ''));
  await expect(widget.getByRole('link', { name: 'Open Gmail', exact: true })).toBeVisible();
});

test('review regression: SPA unmount and remount remove all host email listeners', async ({ page }) => {
  await install(page, '<form id="host-form"><label for="email">Host email</label><input id="email" type="email"><div data-sniperlink></div></form>');
  await page.evaluate(() => {
    Object.assign(window, { emailUpdates: 0 });
    const original = window.SniperLink.Widget.prototype.setEmail;
    window.SniperLink.Widget.prototype.setEmail = function (email) {
      Reflect.set(window, 'emailUpdates', Number(Reflect.get(window, 'emailUpdates')) + 1);
      original.call(this, email);
    };
    document.querySelector('#host-form')!.addEventListener('submit', event => event.preventDefault());
    const widget = document.querySelector<HTMLElement>('[data-sniperlink]')!;
    Object.assign(window, { removedWidget: widget });
    widget.remove();
  });
  await expect.poll(() => page.evaluate(() => (Reflect.get(window, 'removedWidget') as HTMLElement).childElementCount)).toBe(0);
  const emitHostEvents = () => page.evaluate(() => {
    const input = document.querySelector<HTMLInputElement>('#email')!;
    input.value = 'reader@outlook.com';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    document.querySelector<HTMLFormElement>('#host-form')!.requestSubmit();
    return Reflect.get(window, 'emailUpdates');
  });
  expect(await emitHostEvents()).toBe(0);
  await page.evaluate(() => document.querySelector('#host-form')!.append(Reflect.get(window, 'removedWidget') as HTMLElement));
  await expect(page.getByRole('link', { name: 'Open Outlook', exact: true })).toBeVisible();
  expect(await emitHostEvents()).toBe(3);
  await page.locator('[data-sniperlink]').evaluate(element => element.removeAttribute('data-sniperlink'));
  await expect(page.locator('.sniperlink-container')).toHaveCount(0);
  expect(await emitHostEvents()).toBe(3);
});

test('generated malicious-input snippet safely installs from another origin', async ({ page }) => {
  const payload = '"><img src=x onerror=alert(1)>';
  const code = generateEmbedCode({ containerId: 'generated', email: 'reader@gmail.com', sender: 'noreply@example.com', buttonText: payload }, site);
  const response = await page.request.post(`${host}/fixtures`, { data: `<!doctype html><body>${code}</body>` });
  await page.goto(host + await response.text());
  await expect(page.locator('#generated .sniperlink-button')).toHaveText(payload);
  await expect(page.locator('#generated img')).toHaveCount(0);
});

test('generator preview uses the selected provider and applies live color/shape changes', async ({ page }) => {
  await page.goto('/embed-generator');
  await page.getByLabel('Preview email').fill('reader@outlook.com');
  await page.getByLabel('Button text', { exact: true }).fill('Find my mail');
  await page.getByLabel('Button color', { exact: true }).fill('#ffffff');
  await page.getByLabel('Button shape').selectOption('pill');
  const preview = page.getByTestId('widget-preview');
  await expect(preview.getByRole('link', { name: 'Find my mail' })).toHaveAttribute('href', 'https://outlook.live.com/mail/0/inbox');
  await expect(preview.getByRole('link', { name: 'Find my mail' })).toHaveCSS('color', 'rgb(0, 0, 0)');
  await expect(preview.getByRole('link', { name: 'Find my mail' })).toHaveCSS('border-radius', '999px');
  const code = await page.getByRole('textbox', { name: 'Embed code' }).inputValue();
  expect(code).toContain(`${site}/widget/sniperlink.js`);
  expect(code).not.toContain('reader@outlook.com');
  await page.getByLabel('Recipient integration').selectOption('fixed');
  await expect(page.getByRole('textbox', { name: 'Embed code' })).toHaveValue(/data-email="reader@outlook.com"/);
  await page.getByLabel('Preview email').fill('reader@custom.example.com');
  await expect(preview.getByRole('button', { name: 'How to find your email' })).toBeVisible();
  await expect(preview.getByRole('link', { name: 'Find my mail' })).toHaveCount(0);
  await page.getByLabel('Sender email or domain', { exact: true }).fill('<script>');
  await expect(page.getByRole('button', { name: 'Copy code' })).toBeDisabled();
});

test('copy failure is honest and downloaded HTML contains the working external asset', async ({ page }) => {
  await page.goto('/embed-generator');
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Test: clipboard unavailable'); } } }));
  await page.getByRole('button', { name: 'Copy code' }).click();
  await expect(page.getByRole('status')).toHaveText('Clipboard unavailable. Select and copy the code below.');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download HTML' }).click();
  expect((await downloadEvent).suggestedFilename()).toBe('sniperlink-embed.html');
});

test('demo works for supported and custom domains, without fabricated signup success', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText(/does not send an email or confirm a signup/)).toBeVisible();
  await page.getByLabel('Recipient email').fill('reader@proton.me');
  await page.getByRole('button', { name: 'Generate inbox link' }).click();
  await expect(page.getByRole('link', { name: 'Open ProtonMail' })).toBeVisible();
  await page.getByLabel('Recipient email').fill('reader@custom.example.com');
  await page.getByRole('button', { name: 'Generate inbox link' }).click();
  await expect(page.getByRole('button', { name: 'How to find your email' })).toBeVisible();
});

test('widget works offline after loading and destruction leaves other widgets styled', async ({ page, context }) => {
  await install(page);
  await context.setOffline(true);
  await page.evaluate(() => {
    const target = document.createElement('div');
    document.body.append(target);
    const widget = window.SniperLink.create({ container: target, email: 'reader@outlook.com' });
    widget.init();
    widget.destroy();
    document.querySelector('[data-sniperlink]')!.setAttribute('data-email', 'reader@yahoo.com');
  });
  await expect(page.getByRole('link', { name: 'Open Yahoo' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Yahoo' })).toHaveCSS('background-color', 'rgb(109, 40, 217)');
});

test('direct docs, privacy and home routes render styled content with honest availability', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const route of ['/docs', '/privacy', '/']) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('font-weight', '700');
  await expect(page.getByText(/billing are not available/)).toBeVisible();
  expect(errors).toEqual([]);
});
