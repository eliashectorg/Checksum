import { type Page } from '@playwright/test';

export class BrowserActions {
    /**
     * Navigates to the specified URL in the given page.
     *
     * @function navigateToUrl
     * @param {Page} page - The Page object where the navigation will occur.
     * @param {string} url - The URL to navigate to.
     * @returns {Promise<void>} A promise that resolves when the navigation is complete.
     */
    async navigateToUrl(page: Page, url: string): Promise<void> {
        await page.goto(url, { waitUntil: 'load' });
    }

    /**
     * Closes the given page.
     *
     * @function closePage
     * @param {Page} page - The Page object to close.
     * @returns {Promise<void>} A promise that resolves when the page is closed.
     */
    async closePage(page: Page): Promise<void> {
        await page.close();
    }
}