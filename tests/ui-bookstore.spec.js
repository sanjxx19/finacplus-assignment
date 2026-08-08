
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { userName, password } = require('../config/credentials');

const BOOK_TITLE = 'Learning JavaScript Design Patterns';
const OUTPUT_DIR = path.join(__dirname, '..', 'output');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'book-details.txt');

test.describe('DemoQA Book Store - UI flow', () => {

  test('login, search book, capture details, logout', async ({ page }) => {

    
    await page.goto('https://demoqa.com/');

    
    await page.goto('https://demoqa.com/login');

    
    await page.locator('#userName').fill(userName);
    await page.locator('#password').fill(password);
    await page.locator('#login').click();

    const loginError = page.locator('#name');
    if (await loginError.isVisible().catch(() => false)) {
      const msg = await loginError.textContent();
      throw new Error(`Login failed: ${msg}. Check config/credentials.js`);
    }

    
    await expect(page.locator('#userName-value')).toHaveText(userName);
    const logoutButton = page.getByRole('button', { name: /log\s?out/i });
    await expect(logoutButton).toBeVisible();

    
    await page.getByRole('button', { name: 'Go To Book Store' }).click();
    await expect(page).toHaveURL(/.*\/books/);

    
    await page.locator('#searchBox').fill(BOOK_TITLE);
    
    const bookRow = page.getByRole('row', { name: new RegExp(BOOK_TITLE) });
    await expect(bookRow).toBeVisible();

    
    await expect(bookRow).toContainText(BOOK_TITLE);

    const cells = await bookRow.getByRole('cell').allTextContents();
    const cleanCells = cells.map(c => c.trim()).filter(c => c.length > 0);

    const [title, author, publisher] = cleanCells;

    expect(title).toContain(BOOK_TITLE);
    expect(author).toBeTruthy();
    expect(publisher).toBeTruthy();

    
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    const content =
      `Title: ${title}\n` +
      `Author: ${author}\n` +
      `Publisher: ${publisher}\n`;
    fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
    console.log(`Book details written to ${OUTPUT_FILE}`);

    
    await page.goto('https://demoqa.com/profile');
    await page.getByRole('button', { name: /log\s?out/i }).click();

    await expect(page).toHaveURL(/.*\/login/);
  });

});
