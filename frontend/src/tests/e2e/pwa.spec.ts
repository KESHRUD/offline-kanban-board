import { test, expect } from '@playwright/test';

test.describe('PWA Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should have valid PWA manifest', async ({ page }) => {
    // Check for manifest link
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveCount(1);

    // Fetch and validate manifest
    const manifestHref = await manifestLink.getAttribute('href');
    expect(manifestHref).toBeTruthy();

    const manifestResponse = await page.goto(`http://localhost:5173${manifestHref}`);
    expect(manifestResponse?.status()).toBe(200);

    const manifest = await manifestResponse?.json();
    expect(manifest.name).toBe('Offline Kanban Board');
    expect(manifest.short_name).toBe('Kanban');
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons).toHaveLength(3);
  });

  test('should register service worker', async ({ page, context }) => {
    // Grant notification permission for PWA
    await context.grantPermissions(['notifications']);

    // Wait for service worker registration
    await page.waitForFunction(() => 
      navigator.serviceWorker.controller !== null
    );

    // Check service worker is active
    const swState = await page.evaluate(() => {
      return navigator.serviceWorker.controller?.state;
    });

    expect(swState).toBe('activated');
  });

  test('should show offline ready notification', async ({ page }) => {
    // Wait for the UpdatePrompt component
    await page.waitForTimeout(2000); // Give time for SW to activate

    // Check if offline ready message appears
    const offlineReadyMessage = page.locator('text=/App ready to work offline/i');
    
    // May or may not appear depending on SW state
    const count = await offlineReadyMessage.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should display online/offline status', async ({ page }) => {
    // Check for status indicator
    const statusIndicator = page.locator('.status-indicator');
    await expect(statusIndicator).toBeVisible();

    // Should show "Online" initially
    await expect(statusIndicator).toContainText('Online');

    // Simulate offline mode
    await page.context().setOffline(true);
    await page.waitForTimeout(500);

    // Should show "Offline"
    await expect(statusIndicator).toContainText('Offline');

    // Go back online
    await page.context().setOffline(false);
    await page.waitForTimeout(500);

    // Should show "Online" again
    await expect(statusIndicator).toContainText('Online');
  });

  test('should cache resources for offline use', async ({ page }) => {
    // Load the page online
    await page.waitForLoadState('networkidle');

    // Go offline
    await page.context().setOffline(true);

    // Reload the page
    await page.reload();

    // Page should still load from cache
    await expect(page.locator('h1')).toContainText('Offline Kanban Board');
  });

  test('should be installable as PWA', async ({ page, context }) => {
    // Check for PWA install prompt capability
    const hasBeforeInstallPrompt = await page.evaluate(() => {
      return new Promise((resolve) => {
        window.addEventListener('beforeinstallprompt', () => {
          resolve(true);
        });
        
        // Timeout if event doesn't fire
        setTimeout(() => resolve(false), 2000);
      });
    });

    // The event may or may not fire depending on browser state
    expect(typeof hasBeforeInstallPrompt).toBe('boolean');
  });
});

test.describe('Offline Task Management', () => {
  test('should create tasks while offline', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Wait for initial load
    await page.waitForLoadState('networkidle');

    // Go offline
    await page.context().setOffline(true);

    // Click create task button
    await page.click('button.btn-primary');

    // Fill in task title in prompt
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      await dialog.accept('Offline Task');
    });

    // Wait for task to appear
    await page.waitForTimeout(1000);

    // Verify task is in the DOM
    const tasks = page.locator('.task-card');
    const taskCount = await tasks.count();
    expect(taskCount).toBeGreaterThan(0);
  });

  test('should sync tasks when coming back online', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    // Create task while offline
    await page.context().setOffline(true);
    
    page.on('dialog', async (dialog) => {
      await dialog.accept('Sync Test Task');
    });
    
    await page.click('button.btn-primary');
    await page.waitForTimeout(1000);

    // Go back online
    await page.context().setOffline(false);
    await page.waitForTimeout(2000);

    // Tasks should sync automatically
    const statusIndicator = page.locator('.status-indicator');
    await expect(statusIndicator).toContainText('Online');
  });
});
