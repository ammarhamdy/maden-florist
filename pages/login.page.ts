import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { runInThisContext } from 'node:vm';


export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {   
    super(page);
    this.usernameInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button');
    this.errorMessage = page.locator('text=البيانات غير صحيحة.'); // page.locator('.alert-danger')
  }

  async goto() {
    await super.goto('/dashboard/login');
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }
}
