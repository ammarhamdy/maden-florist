import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { validUser, invalidUsers } from '../../data/users';
import { qase } from 'playwright-qase-reporter';
import { createJiraBug, listIssueTypes } from '../../utils/jira-helper';


//  afterEach hook (global, outside any describe)
test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== 'passed') {
        await createJiraBug(
            testInfo.title,
            testInfo.error?.message || 'Test failed'
        );
    }
});

// test('debug - list issue types', async () => {
//   await listIssueTypes();
// });

// Login - Success Case
test.describe('Login Tests', () => {

    test('Login - Success', async ({ page }) => {
        // qase.id(8);
        // qase.title('User can login with valid credentials');
        // qase.description('This test verifies that a user can successfully log in with valid credentials.');
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(validUser.username, validUser.password);
        await expect(page).toHaveURL('/dashboard/homee');
    });

});


// Login - Failure Cases
// test.describe('Login - Failure Cases', () => {

//     invalidUsers.forEach((user) => {
//         test(`login fails for case: ${user.reason}`, async ({ page }) => {
//             const loginPage = new LoginPage(page);
//             await loginPage.goto();
//             await loginPage.login(user.username, user.password);
//             await expect(loginPage.errorMessage).toBeVisible();
//         });
//     });

// });


