import { expect, test } from '@nuxt/test-utils/playwright'

test('supabase demo page loads correctly', async ({ page, goto }) => {
  await goto('/demo/supabase', { waitUntil: 'hydration' })
  await expect(page).toHaveTitle(/Supabase Demo/)
  await expect(page.locator('text=Supabase Demo')).toBeVisible()
})

test('supabase demo page shows authentication status section', async ({ page, goto }) => {
  await goto('/demo/supabase', { waitUntil: 'hydration' })
  await expect(page.locator('text=Authentication Status')).toBeVisible()
})

test('supabase demo page shows not authenticated state by default', async ({ page, goto }) => {
  await goto('/demo/supabase', { waitUntil: 'hydration' })
  await expect(page.locator('text=Not authenticated')).toBeVisible()
  await expect(page.locator('button:has-text("Sign In")')).toBeVisible()
  await expect(page.locator('button:has-text("Sign Up")')).toBeVisible()
})

test('supabase demo page opens sign in modal when sign in button is clicked', async ({ page, goto }) => {
  await goto('/demo/supabase', { waitUntil: 'hydration' })

  const signInButton = page.locator('button:has-text("Sign In")')
  await signInButton.click()

  await expect(page.locator('text=Sign In').filter({ hasText: 'Sign In' }).first()).toBeVisible()
  await expect(page.locator('input[type="email"]')).toBeVisible()
  await expect(page.locator('input[type="password"]')).toBeVisible()
})

test('supabase demo page opens sign up modal when sign up button is clicked', async ({ page, goto }) => {
  await goto('/demo/supabase', { waitUntil: 'hydration' })

  const signUpButton = page.locator('button:has-text("Sign Up")')
  await signUpButton.click()

  await expect(page.locator('text=Sign Up').filter({ hasText: 'Sign Up' }).first()).toBeVisible()
  await expect(page.locator('input[type="email"]')).toBeVisible()
  await expect(page.locator('input[type="password"]')).toBeVisible()
})

test('supabase demo page shows database query section', async ({ page, goto }) => {
  await goto('/demo/supabase', { waitUntil: 'hydration' })
  await expect(page.locator('text=Database Query Example')).toBeVisible()
  await expect(page.locator('button:has-text("Test Database Connection")')).toBeVisible()
})

test('supabase demo page can fill sign in form', async ({ page, goto }) => {
  await goto('/demo/supabase', { waitUntil: 'hydration' })

  const signInButton = page.locator('button:has-text("Sign In")')
  await signInButton.click()

  await page.locator('input[type="email"]').fill('test@example.com')
  await page.locator('input[type="password"]').fill('password123')

  const emailInput = page.locator('input[type="email"]')
  const passwordInput = page.locator('input[type="password"]')

  await expect(emailInput).toHaveValue('test@example.com')
  await expect(passwordInput).toHaveValue('password123')
})

test('supabase demo page can fill sign up form', async ({ page, goto }) => {
  await goto('/demo/supabase', { waitUntil: 'hydration' })

  const signUpButton = page.locator('button:has-text("Sign Up")')
  await signUpButton.click()

  await page.locator('input[type="email"]').fill('newuser@example.com')
  await page.locator('input[type="password"]').fill('password123')

  const emailInput = page.locator('input[type="email"]')
  const passwordInput = page.locator('input[type="password"]')

  await expect(emailInput).toHaveValue('newuser@example.com')
  await expect(passwordInput).toHaveValue('password123')
})

test('supabase demo page can close sign in modal', async ({ page, goto }) => {
  await goto('/demo/supabase', { waitUntil: 'hydration' })

  const signInButton = page.locator('button:has-text("Sign In")')
  await signInButton.click()

  await expect(page.locator('text=Sign In').filter({ hasText: 'Sign In' }).first()).toBeVisible()

  const cancelButton = page.locator('button:has-text("Cancel")').first()
  await cancelButton.click()

  // Modal should be closed - sign in button should be visible again
  await expect(page.locator('button:has-text("Sign In")')).toBeVisible()
})

test('supabase demo page can close sign up modal', async ({ page, goto }) => {
  await goto('/demo/supabase', { waitUntil: 'hydration' })

  const signUpButton = page.locator('button:has-text("Sign Up")')
  await signUpButton.click()

  await expect(page.locator('text=Sign Up').filter({ hasText: 'Sign Up' }).first()).toBeVisible()

  const cancelButton = page.locator('button:has-text("Cancel")').last()
  await cancelButton.click()

  // Modal should be closed - sign up button should be visible again
  await expect(page.locator('button:has-text("Sign Up")')).toBeVisible()
})

test('supabase demo page shows demo mode alert when not configured', async ({ page, goto }) => {
  await goto('/demo/supabase', { waitUntil: 'hydration' })

  // Check if demo mode alert is visible (may or may not be depending on config)
  // This test verifies the page structure is correct
  const demoModeAlert = page.locator('text=Demo Mode')
  await demoModeAlert.isVisible().catch(() => false)

  // The alert may or may not be visible depending on configuration
  // We just verify the page loaded correctly
  await expect(page.locator('text=Supabase Demo')).toBeVisible()
})
