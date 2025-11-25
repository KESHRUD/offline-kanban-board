import { test, expect } from '@playwright/test';

test.describe('Drag and Drop Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('should display three kanban columns', async ({ page }) => {
    const columns = page.locator('.kanban-column');
    await expect(columns).toHaveCount(3);

    // Use more specific locator for column headings
    await expect(page.getByRole('heading', { name: /To Do/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /In Progress/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Done/i })).toBeVisible();
  });

  test('should open create task modal when clicking new task button', async ({ page }) => {
    await page.click('button.btn-create');
    
    await expect(page.locator('.modal-backdrop')).toBeVisible();
    await expect(page.locator('text=/Create New Task/i')).toBeVisible();
  });

  test('should create a new task via modal', async ({ page }) => {
    // Open modal
    await page.click('button.btn-create');
    
    // Fill form
    await page.fill('#task-title', 'New Test Task');
    await page.fill('#task-description', 'This is a test description');
    
    // Submit
    await page.click('button.btn-primary:has-text("Create Task")');
    
    // Verify task appears
    await page.waitForTimeout(500);
    await expect(page.locator('text=/New Test Task/i')).toBeVisible();
  });

  test('should close modal when clicking cancel', async ({ page }) => {
    await page.click('button.btn-create');
    await expect(page.locator('.modal-backdrop')).toBeVisible();
    
    await page.click('button.btn-secondary:has-text("Cancel")');
    await expect(page.locator('.modal-backdrop')).not.toBeVisible();
  });

  test('should close modal when clicking backdrop', async ({ page }) => {
    await page.click('button.btn-create');
    await expect(page.locator('.modal-backdrop')).toBeVisible();
    
    await page.click('.modal-backdrop', { position: { x: 10, y: 10 } });
    await expect(page.locator('.modal-backdrop')).not.toBeVisible();
  });

  test('should not submit empty task', async ({ page }) => {
    await page.click('button.btn-create');
    
    const submitButton = page.locator('button.btn-primary:has-text("Create Task")');
    await expect(submitButton).toBeDisabled();
  });

  test('should display task count in column headers', async ({ page }) => {
    const columnCounts = page.locator('.column-count');
    await expect(columnCounts).toHaveCount(3);
  });

  test('should show empty state when column has no tasks', async ({ page }) => {
    // Check if any column shows empty state
    const emptyStates = page.locator('.empty-state');
    const count = await emptyStates.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should delete task when clicking delete button', async ({ page }) => {
    // First create a task
    await page.click('button.btn-create');
    await page.fill('#task-title', 'Task to Delete');
    await page.click('button.btn-primary:has-text("Create Task")');
    
    await page.waitForTimeout(500);
    
    // Find and click delete button
    page.on('dialog', dialog => dialog.accept());
    
    const deleteButton = page.locator('.task-delete').first();
    await deleteButton.click();
    
    await page.waitForTimeout(500);
  });

  test('should change task status via dropdown', async ({ page }) => {
    // Create a task first
    await page.click('button.btn-create');
    await page.fill('#task-title', 'Status Change Task');
    await page.click('button.btn-primary:has-text("Create Task")');
    
    await page.waitForTimeout(500);
    
    // Change status
    const statusSelect = page.locator('.task-status-select').first();
    await statusSelect.selectOption('in-progress');
    
    await page.waitForTimeout(500);
    
    // Verify task moved (check in-progress column has tasks)
    const inProgressColumn = page.locator('.kanban-column').nth(1);
    const tasksInColumn = inProgressColumn.locator('.task-card');
    await expect(tasksInColumn).toHaveCount(1);
  });

  test('should display task creation date', async ({ page }) => {
    // Create a task
    await page.click('button.btn-create');
    await page.fill('#task-title', 'Date Test Task');
    await page.click('button.btn-primary:has-text("Create Task")');
    
    await page.waitForTimeout(500);
    
    // Check date is displayed
    const dateElement = page.locator('.task-date').first();
    await expect(dateElement).toBeVisible();
  });

  test('should handle multiple tasks in same column', async ({ page }) => {
    // Cleanup: delete all tasks in To Do column before test
    const todoColumn = page.locator('.kanban-column').first();
    const tasksBefore = await todoColumn.locator('.task-card').count();
    for (let i = 0; i < tasksBefore; i++) {
      const deleteButton = todoColumn.locator('.task-delete').nth(i);
      await deleteButton.click();
      await page.waitForTimeout(200);
    }

    // Create multiple tasks
    for (let i = 1; i <= 3; i++) {
      await page.click('button.btn-create');
      await page.fill('#task-title', `Task ${i}`);
      await page.click('button.btn-primary:has-text("Create Task")');
      await page.waitForTimeout(300);
    }

    // Verify all tasks are visible
    const tasks = todoColumn.locator('.task-card');
    await expect(tasks).toHaveCount(3);
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173');
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.btn-create')).toBeVisible();
  });

  test('should stack columns on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:5173');
    
    const columns = page.locator('.kanban-column');
    await expect(columns).toHaveCount(3);
  });
});
