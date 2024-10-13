import { type Page } from '@playwright/test';

export class PageActions {
    /**
     * Waits for the page to fully load.
     *
     * @function waitForPageLoad
     * @param {Page} page - The Page object representing the browser tab.
     * @param {number} [timeout=30000] - (Optional) The maximum time to wait for the page load in milliseconds. Default is 30 seconds.
     * @returns {Promise<void>} A promise that resolves when the page is fully loaded.
     */
    async waitForPageLoad(page: Page, timeout: number = 30000): Promise<void> {
        await page.waitForLoadState('load', { timeout });
    }
}