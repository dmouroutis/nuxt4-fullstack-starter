import { expect, test } from '@nuxt/test-utils/playwright'

test('analytics demo page loads correctly', async ({ page, goto }) => {
  await goto('/demo/analytics', { waitUntil: 'hydration' })
  await expect(page).toHaveTitle(/Google Analytics Demo/)
  await expect(page.locator('text=Google Analytics Demo')).toBeVisible()
})

test('analytics demo page shows page view tracking section', async ({ page, goto }) => {
  await goto('/demo/analytics', { waitUntil: 'hydration' })
  await expect(page.locator('text=Page View Tracking')).toBeVisible()
  await expect(page.locator('text=Page views are automatically tracked')).toBeVisible()
})

test('analytics demo page shows event tracking examples', async ({ page, goto }) => {
  await goto('/demo/analytics', { waitUntil: 'hydration' })
  await expect(page.locator('text=Event Tracking Examples')).toBeVisible()
  await expect(page.locator('button:has-text("Track Button Click")')).toBeVisible()
  await expect(page.locator('button:has-text("Track Custom Event")')).toBeVisible()
  await expect(page.locator('button:has-text("Track Download Event")')).toBeVisible()
  await expect(page.locator('button:has-text("Track Share Event")')).toBeVisible()
})

test('analytics demo page shows configuration status', async ({ page, goto }) => {
  await goto('/demo/analytics', { waitUntil: 'hydration' })
  await expect(page.locator('text=Configuration Status')).toBeVisible()
  await expect(page.locator('text=Google Analytics ID')).toBeVisible()
})

test('analytics demo page tracks button click event', async ({ page, goto }) => {
  await goto('/demo/analytics', { waitUntil: 'hydration' })

  // Mock gtag function
  await page.addInitScript(() => {
    window.gtag = () => {}
  })

  const button = page.locator('button:has-text("Track Button Click")')
  await button.click()

  // Wait for the event message to appear
  await expect(page.locator('text=Event tracked: button_click')).toBeVisible({ timeout: 2000 })
})

test('analytics demo page tracks custom event', async ({ page, goto }) => {
  await goto('/demo/analytics', { waitUntil: 'hydration' })

  // Mock gtag function
  await page.addInitScript(() => {
    window.gtag = () => {}
  })

  const button = page.locator('button:has-text("Track Custom Event")')
  await button.click()

  // Wait for the event message to appear
  await expect(page.locator('text=Event tracked: custom_event')).toBeVisible({ timeout: 2000 })
})

test('analytics demo page tracks download event', async ({ page, goto }) => {
  await goto('/demo/analytics', { waitUntil: 'hydration' })

  // Mock gtag function
  await page.addInitScript(() => {
    window.gtag = () => {}
  })

  const button = page.locator('button:has-text("Track Download Event")')
  await button.click()

  // Wait for the event message to appear
  await expect(page.locator('text=Event tracked: file_download')).toBeVisible({ timeout: 2000 })
})

test('analytics demo page tracks share event', async ({ page, goto }) => {
  await goto('/demo/analytics', { waitUntil: 'hydration' })

  // Mock gtag function
  await page.addInitScript(() => {
    window.gtag = () => {}
  })

  const button = page.locator('button:has-text("Track Share Event")')
  await button.click()

  // Wait for the event message to appear
  await expect(page.locator('text=Event tracked: share')).toBeVisible({ timeout: 2000 })
})

test('analytics demo page shows simulated event when gtag is not configured', async ({ page, goto }) => {
  await goto('/demo/analytics', { waitUntil: 'hydration' })

  // Don't mock gtag - simulate unconfigured state
  const button = page.locator('button:has-text("Track Button Click")')
  await button.click()

  // Wait for the simulated event message to appear
  await expect(page.locator('text=Event tracked: button_click (simulated)')).toBeVisible({ timeout: 2000 })
})
