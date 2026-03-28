import { BasePage } from "./base.page";
import { Page, Locator } from '@playwright/test';


export interface Admin {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    avatarPath?: string;
}

export type AdminBasic = Pick<Admin, 'name' | 'email'>;

export function generateUniqueAdmin(picture?: string): Admin {
    const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 100)}`; // To ensure unique email
    const dummyAdmin: Admin = {
        name: 'Test Admin',
        email: `testadmin${uniqueSuffix}@example.com`,
        password: 'Admin#123',
        confirmPassword: 'Admin#123',
        avatarPath: picture
    };
    return dummyAdmin;
}

export class AdminsPage extends BasePage {
    // Admins page locators
    readonly searchInput: Locator;
    readonly addAdminButton: Locator;
    readonly arabicLanguageButton: Locator;
    readonly englishLanguageButton: Locator;
    // Admin creation form locators
    readonly adminNameInput: Locator;
    readonly adminEmailInput: Locator;
    readonly adminPasswordInput: Locator;
    readonly adminConfirmPasswordInput: Locator;
    readonly uploadAvatarInput: Locator;
    readonly createAdminButton: Locator;
    readonly adminsDataRows: Locator;
    readonly confirmDeleteButton: Locator;
    readonly cancelDialogButton: Locator;

    constructor(page: Page) {
        super(page);
        // Admins page locators
        this.searchInput = page.locator('#dt-search-0');
        this.addAdminButton = page.locator('#btn-create-admin'); //.filter({ hasText: 'Add Admin' });
        this.arabicLanguageButton = page.locator('button[data-locale="ar"]');
        this.englishLanguageButton = page.locator('button[data-locale="en"]');
        // Admin creation form locators
        this.adminNameInput = page.locator('#name');
        this.adminEmailInput = page.locator('#email');
        this.adminPasswordInput = page.locator('#password');
        this.adminConfirmPasswordInput = page.locator('#password_confirmation');
        this.uploadAvatarInput = page.locator('input[type="file"]');
        this.createAdminButton = page.locator('#admin-submit');
        this.adminsDataRows = page.locator('#admins-table tbody tr');
        this.confirmDeleteButton = page.locator('#confirm-delete-admin');
        this.cancelDialogButton = page.getByRole('button', { name: 'Cancel' });
    }

    async searchAdmin(adminName: string) {
        await this.searchInput.fill(adminName);
        const admins = await this.getAdminsList();
        return admins
    }

    async getAdminsList(): Promise<AdminBasic[]> {
        const admins: AdminBasic[] = [];
        const rowCount = await this.adminsDataRows.count();
        for (let i = 0; i < rowCount; i++) {
            const row = this.adminsDataRows.nth(i);
            const name = await row.locator('td:nth-child(2)').innerText();
            const email = await row.locator('td:nth-child(3)').innerText();
            admins.push({ name, email });
        }
        return admins;
    }

    async closeDialog() {
        await this.cancelDialogButton.click();
    }

    async addAdmin(admin: Admin) {
        await this.addAdminButton.click();
        await this.adminNameInput.fill(admin.name);
        await this.adminEmailInput.fill(admin.email);
        await this.adminPasswordInput.fill(admin.password);
        await this.adminConfirmPasswordInput.fill(admin.confirmPassword);
        if (admin.avatarPath)
            await this.uploadAvatarInput.setInputFiles(admin.avatarPath);
        await this.createAdminButton.click();
    }

    async deleteAdmin(email: string) {
        const rowCount = await this.adminsDataRows.count();
        for (let i = 0; i < rowCount; i++) {
            const row = this.adminsDataRows.nth(i);
            const rowEmail = await row.locator('td:nth-child(3)').innerText();
            if (rowEmail.trim() === email) {
                // Click Delete
                await row.locator('button.btn-delete-admin').click();
                // Confirm deletion
                await this.confirmDeleteButton.click();
                break; // Exit loop after deleting the admin
            }
        }
    }

    async editAdmin(email: string) {
        const rowCount = await this.adminsDataRows.count();
        for (let i = 0; i < rowCount; i++) {
            const row = this.adminsDataRows.nth(i);
            const rowEmail = await row.locator('td:nth-child(3)').innerText();
            if (rowEmail.trim() === email) {
                // Click Edit
                await row.locator('button.btn-edit-admin').click();
            }
        }
    }

    async goto() {
        await super.goto('/admins');
    }

}