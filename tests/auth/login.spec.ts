import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { validUser, invalidUsers } from '../../data/users';
import { qase } from 'playwright-qase-reporter';


// Login - Success Case
test.describe('Login Tests', () => {
    test('Login - Success', async ({ page }) => {
        qase.id(1);
        qase.title('User can login with valid credentials');
        // qase.description('This test verifies that a user can successfully log in with valid credentials.');
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(validUser.username, validUser.password);
        await expect(page).toHaveURL('/dashboard/home');
    });

});


// Login - Failure Cases
test.describe('Login - Failure Cases', () => {

    invalidUsers.forEach((user) => {
        test(`login fails for case: ${user.reason}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            await loginPage.goto();
            await loginPage.login(user.username, user.password);
            await expect(loginPage.errorMessage).toBeVisible();
        });
    });

});


