import {test, expect} from '@playwright/test';

test('deepword: global is a function', async ({page}) => {
    await page.goto('/');
    
    const type = await page.evaluate(() => typeof globalThis.deepword);
    
    expect(type).toBe('function');
});

test('deepword: editor is shown without errors', async ({page}) => {
    const errors = [];
    
    page.on('pageerror', ({message}) => {
        errors.push(message);
    });
    
    await page.goto('/');
    await expect(page.locator('.monaco-editor')).toBeVisible();
    
    expect(errors).toEqual([]);
});

test('deepword: file content is shown', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('.monaco-editor .view-lines')).toContainText(/"name":.+"deepword"/);
});
