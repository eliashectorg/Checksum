import { type Locator } from '@playwright/test';

export class ElementActions {
    /**
     * Clicks on a specified element.
     *
     * @function clickElement
     * @param {Locator} element - The Locator of the element to click.
     * @returns {Promise<void>} A promise that resolves when the element has been clicked.
     */
    async clickElement(element: Locator): Promise<void> {
        await element.click();
    }

    /**
     * Double-Clicks on a specified element.
     *
     * @function doubleClickElement
     * @param {Locator} element - The Locator of the element to double-click.
     * @returns {Promise<void>} A promise that resolves when the element has been double-clicked.
     */
    async doubleClickElement(element: Locator): Promise<void> {
        await element.dblclick();
    }

    /**
     * Fills a text input with the provided text.
     *
     * @function enterText
     * @param {Locator} element - The Locator of the input element to fill.
     * @param {string} text - The text to enter into the input field.
     * @returns {Promise<void>} A promise that resolves when the text has been entered.
     */
    async enterText(element: Locator, text: string): Promise<void> {
        await element.fill(text);
    }

    /**
     * Drags an element and drops it onto another element.
     *
     * @function dragAndDrop
     * @param {Locator} source - The Locator of the element to drag.
     * @param {Locator} target - The Locator of the target element where the source element will be dropped.
     * @returns {Promise<void>} A promise that resolves when the element has been dragged and dropped.
     */
    async dragAndDrop(source: Locator, target: Locator): Promise<void> {
        await source.dragTo(target);
    }

    /**
     * Selects an option in a dropdown by its value.
     *
     * @function selectOptionByValue
     * @param {Locator} element - The Locator of the dropdown element.
     * @param {string} value - The value of the option to select.
     * @returns {Promise<void>} A promise that resolves when the option has been selected.
     */
    async selectOptionByValue(element: Locator, value: string): Promise<void> {
        await element.selectOption({ value });
    }

    /**
     * Selects an option in a dropdown by the visible text.
     *
     * @function selectOptionByText
     * @param {Locator} element - The Locator of the dropdown element.
     * @param {string} text - The visible text of the option to select.
     * @returns {Promise<void>} A promise that resolves when the option has been selected.
     */
    async selectOptionByText(element: Locator, text: string): Promise<void> {
        await element.selectOption({ label: text });
    }

    /**
     * Checks a checkbox or radio button (If the element is already checked, this method does nothing).
     *
     * @function checkElement
     * @param {Locator} element - The Locator of the element to check.
     * @returns {Promise<void>} A promise that resolves when the element has been checked.
     */
    async checkElement(element: Locator): Promise<void> {
        await element.check();
    }

    /**
     * Unchecks a checkbox (If the element is already unchecked, this method does nothing).
     * Note: This method only works with checkboxes, not radio buttons.
     *
     * @function uncheckElement
     * @param {Locator} element - The Locator of the element to uncheck.
     * @returns {Promise<void>} A promise that resolves when the element has been unchecked.
     */
    async uncheckElement(element: Locator): Promise<void> {
        await element.uncheck();
    }

    /**
     * Returns the text content of a specified web element.
     *
     * @function getTextContent
     * @param {Locator} element - The Locator of the web element whose text content is to be retrieved.
     * @returns {Promise<string>} A promise that resolves to the text content of the element.
     */
    async getTextContent(element: Locator): Promise<string> {
        return (await element.textContent()) ?? '';
    }
}