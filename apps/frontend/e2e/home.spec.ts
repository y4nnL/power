import { expect, test } from '@playwright/test'

test('displays the welcome message on the home page', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { level: 1, name: /bonjour power/i })
  ).toBeVisible()
  await expect(
    page.getByText('Une base React + Vite toute simple.')
  ).toBeVisible()
})
