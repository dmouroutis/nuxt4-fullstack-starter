import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AnalyticsPage from '~/pages/demo/analytics.vue'

describe('Analytics Demo Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    if (typeof window !== 'undefined') {
      window.gtag = undefined
    }
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        gtagId: ''
      }
    }))
  })

  it('can mount the analytics page', async () => {
    const component = await mountSuspended(AnalyticsPage)
    expect(component.exists()).toBe(true)
  })

  it('displays the page title', async () => {
    const component = await mountSuspended(AnalyticsPage)
    expect(component.text()).toContain('Google Analytics Demo')
  })

  it('shows configuration status when gtagId is not configured', async () => {
    const component = await mountSuspended(AnalyticsPage)
    expect(component.text()).toContain('Not configured')
  })

  it('shows configuration status when gtagId is configured', async () => {
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        gtagId: 'G-XXXXXXXXXX'
      }
    }))

    const component = await mountSuspended(AnalyticsPage)
    expect(component.text()).toContain('G-XXXXXXXXXX')
  })

  it('tracks button click event when gtag is available', async () => {
    const mockGtag = vi.fn()
    if (typeof window !== 'undefined') {
      window.gtag = mockGtag
    }
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        gtagId: 'G-XXXXXXXXXX'
      }
    }))

    const component = await mountSuspended(AnalyticsPage)
    const buttons = component.findAll('button')
    const buttonClickButton = buttons.find(btn => btn.text().includes('Track Button Click'))
    
    if (buttonClickButton) {
      await buttonClickButton.trigger('click')
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(mockGtag).toHaveBeenCalledWith(
        'event',
        'button_click',
        expect.objectContaining({
          event_category: 'engagement',
          event_label: 'Demo Button',
          value: 1
        })
      )
    }
  })

  it('tracks custom event when gtag is available', async () => {
    const mockGtag = vi.fn()
    if (typeof window !== 'undefined') {
      window.gtag = mockGtag
    }
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        gtagId: 'G-XXXXXXXXXX'
      }
    }))

    const component = await mountSuspended(AnalyticsPage)
    const buttons = component.findAll('button')
    const customEventButton = buttons.find(btn => btn.text().includes('Track Custom Event'))

    if (customEventButton) {
      await customEventButton.trigger('click')
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(mockGtag).toHaveBeenCalledWith(
        'event',
        'custom_event',
        expect.objectContaining({
          event_category: 'demo',
          event_label: 'Custom Demo Event',
          value: 42
        })
      )
    }
  })

  it('tracks download event when gtag is available', async () => {
    const mockGtag = vi.fn()
    if (typeof window !== 'undefined') {
      window.gtag = mockGtag
    }
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        gtagId: 'G-XXXXXXXXXX'
      }
    }))

    const component = await mountSuspended(AnalyticsPage)
    const buttons = component.findAll('button')
    const downloadButton = buttons.find(btn => btn.text().includes('Track Download Event'))

    if (downloadButton) {
      await downloadButton.trigger('click')
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(mockGtag).toHaveBeenCalledWith(
        'event',
        'file_download',
        expect.objectContaining({
          event_category: 'downloads',
          event_label: 'Demo File',
          value: 1
        })
      )
    }
  })

  it('tracks share event when gtag is available', async () => {
    const mockGtag = vi.fn()
    if (typeof window !== 'undefined') {
      window.gtag = mockGtag
    }
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        gtagId: 'G-XXXXXXXXXX'
      }
    }))

    const component = await mountSuspended(AnalyticsPage)
    const buttons = component.findAll('button')
    const shareButton = buttons.find(btn => btn.text().includes('Track Share Event'))

    if (shareButton) {
      await shareButton.trigger('click')
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(mockGtag).toHaveBeenCalledWith(
        'event',
        'share',
        expect.objectContaining({
          event_category: 'social',
          event_label: 'Demo Share',
          method: 'demo'
        })
      )
    }
  })

  it('shows last event message after tracking', async () => {
    const mockGtag = vi.fn()
    if (typeof window !== 'undefined') {
      window.gtag = mockGtag
    }
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        gtagId: 'G-XXXXXXXXXX'
      }
    }))

    const component = await mountSuspended(AnalyticsPage)
    const buttons = component.findAll('button')
    const buttonClickButton = buttons.find(btn => btn.text().includes('Track Button Click'))

    if (buttonClickButton) {
      await buttonClickButton.trigger('click')
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(component.text()).toContain('button_click')
    }
  })

  it('handles tracking when gtag is not available', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const component = await mountSuspended(AnalyticsPage)
    const buttons = component.findAll('button')
    const buttonClickButton = buttons.find(btn => btn.text().includes('Track Button Click'))

    if (buttonClickButton) {
      await buttonClickButton.trigger('click')
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Google Analytics not configured')
      )
      expect(component.text()).toContain('button_click')
    }

    consoleSpy.mockRestore()
  })
})
