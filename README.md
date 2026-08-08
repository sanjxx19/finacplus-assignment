# Test Execution Report - DemoQA + ReqRes Automation
 
- **Author:** Sanjushree Rajan
- **Date:** August 8, 2026
- **Tool:** Playwright (chromium)
- **Total tests:** 4
- **Result:** 4 passed, 0 failed


## Screenshots

| Login | Book search | Logout |
|---|---|---|
| ![Login success](./docs/screenshots/01-login-success.png) | ![Book search result](./docs/screenshots/02-book-search-result.png) | ![Logout success](./docs/screenshots/03-logout-success.png) |

## Scope

Two flows were automated per the assignment brief:

1. UI - DemoQA Book Store: manual user login, search, capture book details, logout.
2. API - reqres.in: create, fetch, and update a user via CRUD requests.

## Results

| # | Test | File | Status | Duration |
|---|------|------|--------|----------|
| 1 | create a user and validate status code + store userId | `api-reqres.spec.js` |  Pass | 1.0s |
| 2 | get the created user and validate the response | `api-reqres.spec.js` |  Pass | 387ms |
| 3 | update the user name and validate the response | `api-reqres.spec.js` |  Pass | 265ms |
| 4 | login, search book, capture details, logout | `ui-bookstore.spec.js` |  Pass | 11.8s |

## UI flow details

- Logged in with a manually created DemoQA account.
- Confirmed username and logout button rendered after login.

  ![Login success](./docs/screenshots/01-login-success.png)

- Navigated to the Book Store, searched "Learning JavaScript Design Patterns".
- Confirmed the result row appeared and contained the book.

  ![Book search result](./docs/screenshots/02-book-search-result.png)

- Captured Title, Author, and Publisher into `output/book-details.txt`.
- Logged out and confirmed redirect back to the login page.

  ![Logout success](./docs/screenshots/03-logout-success.png)

Captured output:

```
Title: Learning JavaScript Design Patterns
Author: Addy Osmani
Publisher: O'Reilly Media
```

## API flow details

- **Create:** `POST /api/users` → 201, response echoed the submitted name and job, `id` stored for later steps.
- **Get:** `GET /api/users/{id}` → 200. reqres.in's seed data only covers ids 1–12, so the test falls back to a known seed id when the created id falls outside that range - this is expected reqres.in behaviour, not a bug in the suite.
- **Update:** `PUT /api/users/{id}` → 200, response reflected the new name and an updated timestamp.

![API tests passing](./docs/screenshots/04-api-tests-passing.png)

## Issues found during development and how they were resolved

| Issue | Cause | Fix |
|---|---|---|
| UI test failing on `toBeVisible()` for the book search row | DemoQA changed the book table from a div-based react-table (`.rt-tr-group`) to a semantic HTML `<table>` | Switched the locator to `page.getByRole('row', { name: ... })` |
| API tests returning 403 | Hardcoded API key was a shared/public tutorial key, throttled due to overuse across many projects | Signed up for a personal reqres.in account and key, moved it to `.env` |
| API tests still returning 403 after key rotation | `.env` wasn't actually being loaded - `dotenv` wasn't wired into `playwright.config.js` | Added `require('dotenv').config()` as the first line of `playwright.config.js` |
| API key hardcoded in source | Original spec had a fallback key baked into the code | Removed the fallback, added a `beforeAll` check that fails fast with a clear message if `REQRES_API_KEY` isn't set |

## Notes

- `.env` and `config/credentials.js` are excluded from version control; `.env.example` documents the required variable.
- Full HTML report available via `npx playwright show-report` after any local run.
