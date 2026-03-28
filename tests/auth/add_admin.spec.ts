import { test, expect } from '@playwright/test';
import { Admin, AdminBasic, AdminsPage, generateUniqueAdmin } from '../../pages/admins.page';
import { LoginPage } from '../../pages/login.page';
import { validUser } from '../../data/users';


test.describe('Search for admin tests', () => {
    test('should search for admin by email', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const adminsPage = new AdminsPage(page);

        // Generate a unique email for the new admin
        const dummyAdmin: Admin = generateUniqueAdmin()

        // Login as a valid user
        await loginPage.goto();
        await loginPage.login(validUser.username, validUser.password);
        await expect(page).toHaveURL('/home');

        // Navigate to Admins page
        await page.goto('/admins');
        await expect(page).toHaveURL('/admins');

        // Add a new admin
        await adminsPage.addAdmin(dummyAdmin);

        // Search for the newly added admin
        await adminsPage.searchAdmin(dummyAdmin.name);

        // Verify the searched admin appears in the results
        const adminsList: AdminBasic[] = await adminsPage.getAdminsList();
        const targetEmail = dummyAdmin.email;
        const isFiltered = adminsList.every(admin => admin.email === targetEmail);
        expect(isFiltered).toBe(true);

        // Clear the search input
        await adminsPage.searchInput.fill('');

        // Cleanup: Delete the created admin
        await adminsPage.deleteAdmin(dummyAdmin.email);
    });

});


test.describe('Add Admin Tests', () => {
    test('should add a new admin successfully', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const adminsPage = new AdminsPage(page);
        const avatarPath = 'fixtures/images/valid/profile.png';
        
        // Generate a unique email for the new admin
        const dummyAdmin: Admin = generateUniqueAdmin(avatarPath);

        // Login as a valid user
        await loginPage.goto();
        await loginPage.login(validUser.username, validUser.password);
        await expect(page).toHaveURL('/home');

        // Navigate to Admins page
        await page.goto('/admins');
        await expect(page).toHaveURL('/admins');

        // Add a new admin
        await adminsPage.addAdmin(dummyAdmin);

        // Verify the new admin is added
        await expect(page.getByText(dummyAdmin.email)).toBeVisible();

        // Cleanup: Delete the created admin
        await adminsPage.deleteAdmin(dummyAdmin.email);
    });

    test('should not add the same admin email', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const adminsPage = new AdminsPage(page);
        const avatarPath = 'fixtures/images/valid/profile.png';

        // Generate a unique email for the new admin
        const dummyAdmin: Admin = generateUniqueAdmin(avatarPath);

        // Login as a valid user
        await loginPage.goto();
        await loginPage.login(validUser.username, validUser.password);
        await expect(page).toHaveURL('/home');

        // Navigate to Admins page
        await page.goto('/admins');
        await expect(page).toHaveURL('/admins');

        await adminsPage.addAdmin(dummyAdmin);

        // Verify the new admin is added
        await expect(page.getByText(dummyAdmin.name)).toBeVisible();

        // Second Add (Duplicate Email)
        await adminsPage.addAdmin(dummyAdmin);

        // Verify Error Message Appears
        await expect(page.getByText(/The email has already been taken/i)).toBeVisible();

        
        // Cleanup: Delete the created admin
        adminsPage.closeDialog(); // Close the dialog after error
        await adminsPage.deleteAdmin(dummyAdmin.email);

        // Optional: Verify Only One Record Exists
        // await expect(page.getByText(dummyAdmin.email)).toHaveCount(1);
    });  

});

// npx playwright test banners.spec.ts --headed