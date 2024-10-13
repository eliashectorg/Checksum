import { test, expect, Locator } from '@playwright/test';
import { BoardPage } from '../../pom/pages/BoardPage';
import { BrowserActions } from '../../actions/BrowserActions';
import { PageActions } from '../../actions/PageActions';

// Page Objects
let boardPage: BoardPage;
let browserActions: BrowserActions;

// Variables to store the state and names of the card and subtasks
let completedSubtaskName: string | null = null;
let selectedCardName: string | null = null;
let initialSubtaskStatus: string | null = null;

// Test configuration: slow motion for visualization
test.use({
    launchOptions: {
        slowMo: 3000 // 3 seconds delay between actions
    }
});

test.describe('Kanban Board Feature', () => {

    test.beforeEach(async ({ page }) => {
        boardPage = new BoardPage(page);
        browserActions = new BrowserActions();

        await test.step('Given I am on the Kanban page', async () => {
            await browserActions.navigateToUrl(page, '/');
        });
    });


    test('Edit a Kanban Card', async ({ page }) => {

        // Test annotations
        test.info().annotations.push({
            type: 'TC01-Kanban',
            description: 'As a user of the Kanban board, I want to edit a card to mark a subtask as completed and move the card to the first column, so that I can keep track of the progress and organize tasks efficiently.',
        });



        await test.step('When I select the card with incompleted subtasks', async () => {
            const { cardName, subtaskStatus } = await boardPage.selectCardWithIncompleteSubtasks();
            expect(cardName).not.toBeNull(); // Verify that a card was selected.
            selectedCardName = cardName; // Store the card name.
            initialSubtaskStatus = subtaskStatus; // Store the initial subtask status.
        });


        await test.step('And I mark a subtask as completed', async () => {
            completedSubtaskName = await boardPage.markSubtaskAsCompleted();
        });



        await test.step('And I move the task to the first column', async () => {
            await boardPage.selectFirstStatusFromCustomDropdown();
        });



        await test.step('Then I should see that the completed subtask is striked through', async () => {
            if (completedSubtaskName) {
                const subtaskLocator: Locator = boardPage.subtaskContainer.locator(`span:has-text("${completedSubtaskName}")`);
                await expect(subtaskLocator, 'The subtask should have line-through styling.').toHaveClass(/line-through/); // Verify the subtask has line-through styling
            }
        });



        await test.step('And I close the card edit view', async () => {
            await boardPage.closeModalByClickingOutside();
        });



        await test.step('Then I should see that the number of completed subtasks is correct', async () => {
            if (selectedCardName && initialSubtaskStatus) {
                // Locate the card by its name in the first column.
                const updatedCard = boardPage.firstColumn.locator(`article:has(h3:has-text("${selectedCardName}"))`);
                await expect(updatedCard, 'The card should be visible.').toBeVisible(); 

                // Wait explicitly for the subtask status element to be visible
                const subtaskStatusLocator = updatedCard.locator('p.text-xs.text-medium-grey.font-bold');

                // Get the new subtask status
                const updatedSubtaskStatus: string | null = await subtaskStatusLocator.textContent();

                // Ensure we're working with strings.
                const initialStatus = initialSubtaskStatus as string;
                const updatedStatus = updatedSubtaskStatus as string;

                // Extract numbers from the initial and updated statuses.
                const [initialCompleted, initialTotal] = (initialStatus.match(/\d+/g) || []).map(Number);
                const [updatedCompleted, updatedTotal] = (updatedStatus.match(/\d+/g) || []).map(Number);

                // Verify that the total number of subtasks hasn't changed and that the number of completed subtasks increased by 1
                expect(updatedTotal, 'The total number should not be changed.').toBe(initialTotal);
                expect(updatedCompleted, 'The number of completed subtasks should increase by 1.').toBe(initialCompleted + 1);
            }
        });


        await test.step('And I should see the card in the first column', async () => {
            if (selectedCardName) {
                // Locate the card in the first column by its name
                const firstColumnCard: Locator = boardPage.firstColumn.locator(`h3:has-text("${selectedCardName}")`);
                await expect(firstColumnCard, 'The card should be visible.').toBeVisible();
            }
        });
    });
});