import { Locator, Page } from '@playwright/test';
import { ElementActions } from '../../actions/ElementActions';

export class BoardPage {

    // Page object locators.
    readonly page: Page;
    readonly firstColumn: Locator;
    readonly secondColumn: Locator;
    readonly secondColumnCards: Locator;
    readonly currentStatusDropdown: Locator;
    readonly subtaskContainer: Locator;
    readonly subtaskLabel: Locator;
    readonly allColumns: Locator;

    // Actions handler for interacting with elements.
    private elementActions: ElementActions;

    // Initializes the BoardPage class with locators and actions
    constructor(page: Page) {
        this.page = page;

        // Locators for different sections and elements within the board.
        this.firstColumn = page.locator('section.box-content').nth(0);
        this.secondColumn = page.locator('section.box-content').nth(1);
        this.secondColumnCards = this.secondColumn.locator('article.group');
        this.currentStatusDropdown = page.locator('div[tabindex="1"].w-full');
        this.subtaskContainer = page.locator('div.flex.flex-col.gap-2');
        this.subtaskLabel = page.locator('p.text-xs.text-medium-grey.font-bold');
        this.allColumns = page.locator('section.box-content');

        // Initialize ElementActions class for custom actions.
        this.elementActions = new ElementActions();
    }


    // Select a card with incomplete subtasks and return its name and subtask status.
    async selectCardWithIncompleteSubtasks(): Promise<{ cardName: string | null, subtaskStatus: string | null }> {
        const columnCount: number = await this.allColumns.count();

        // Iterate over columns 2, 3, etc. (skip the first column)
        for (let columnIndex: number = 1; columnIndex < columnCount; columnIndex++) {
            const cardsInColumn: Locator = this.allColumns.nth(columnIndex).locator('article.group');
            const cardsCount: number = await cardsInColumn.count();

            // Iterate over each card in the current column.
            for (let index: number = 0; index < cardsCount; index++) {
                const subtaskText: string | null = await cardsInColumn.nth(index).locator('p.text-xs').textContent();
                const cardName: string | null = await cardsInColumn.nth(index).locator('h3').textContent();

                if (subtaskText && cardName) {
                    // Extract numbers from "x of y subtasks" and check for incomplete subtasks
                    const [completed, total] = subtaskText.match(/\d+/g)?.map(Number) || [];

                    if (completed < total) {
                        const cardLocator: Locator = cardsInColumn.nth(index);
                        await this.elementActions.clickElement(cardLocator);
                        return { cardName, subtaskStatus: subtaskText };
                    }
                }
            }
        }

        // If no card with incomplete subtasks is found
        throw new Error('No card with incomplete subtasks found in columns.');
    }


    // Mark a subtask as completed and return the name of the subtask.
    async markSubtaskAsCompleted(): Promise<string | null> {
        const subtasksCount: number = await this.subtaskContainer.locator('label').count();

        // Iterate over each subtask to find an incomplete one.
        for (let index: number = 0; index < subtasksCount; index++) {
            const subtaskText: Locator = this.subtaskContainer.locator('label').nth(index).locator('span');
            const checkbox: Locator = this.subtaskContainer.locator('label').nth(index).locator('input[type="checkbox"]');

            const isChecked: boolean = await checkbox.isChecked();

            // If subtask is not checked, mark it as completed.
            if (!isChecked) {
                if (await subtaskText.isVisible()) {
                    const subtaskName: string | null = await subtaskText.textContent();
                    await this.elementActions.clickElement(subtaskText);
                    return subtaskName; // Return the completed subtask name.
                }
            }
        }

        // If no subtask was marked as completed, throw an error.
        throw new Error('No incomplete subtask found to mark as completed.');
    }

    // Select the first option from the custom dropdown to move the card
    async selectFirstStatusFromCustomDropdown(): Promise<void> {
        await this.currentStatusDropdown.click(); // Open the dropdown.
        const firstOption: Locator = this.page.locator('div.hidden.absolute div.p-4').first();
        await this.elementActions.clickElement(firstOption); // Select the first option.
    }


    // Close the modal by clicking outside of it.
    async closeModalByClickingOutside(): Promise<void> {
        await this.page.mouse.click(0, 0); // Click outside to close.
    }
}
