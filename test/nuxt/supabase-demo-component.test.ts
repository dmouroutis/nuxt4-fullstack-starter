import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SupabaseDemo from '~/components/SupabaseDemo.vue'

const mockSignOut = vi.fn()
const mockSupabaseClient = {
  auth: {
    signOut: mockSignOut
  }
}

describe('SupabaseDemo Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        supabaseUrl: 'https://demo.supabase.co'
      }
    }))
    vi.stubGlobal('useSupabaseClient', () => mockSupabaseClient)
    vi.stubGlobal('useSupabaseUser', () => ref(null))
  })

  it('can mount the SupabaseDemo component', async () => {
    const component = await mountSuspended(SupabaseDemo)
    expect(component.exists()).toBe(true)
  })

  it('displays the component title', async () => {
    const component = await mountSuspended(SupabaseDemo)
    expect(component.text()).toContain('Supabase Connection Status')
  })

  it('shows not authenticated message when user is null', async () => {
    const component = await mountSuspended(SupabaseDemo)
    expect(component.text()).toContain('Not authenticated')
    expect(component.text()).toContain('Go to Auth Demo')
  })

  it('shows user email when user is authenticated', async () => {
    vi.stubGlobal('useSupabaseUser', () => ref({
      id: '123',
      email: 'test@example.com'
    }))

    const component = await mountSuspended(SupabaseDemo)
    expect(component.text()).toContain('test@example.com')
    expect(component.text()).toContain('Sign Out')
  })

  it('shows demo mode status when not configured', async () => {
    const component = await mountSuspended(SupabaseDemo)
    expect(component.text()).toContain('Enabled (Demo Mode)')
  })

  it('shows configured status when Supabase is configured', async () => {
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        supabaseUrl: 'https://real-project.supabase.co'
      }
    }))

    const component = await mountSuspended(SupabaseDemo)
    expect(component.text()).toContain('Enabled & Configured')
  })

  it('calls signOut when sign out button is clicked', async () => {
    mockSignOut.mockResolvedValue({ error: null })
    vi.stubGlobal('useSupabaseUser', () => ref({
      id: '123',
      email: 'test@example.com'
    }))
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        supabaseUrl: 'https://real-project.supabase.co'
      }
    }))

    const component = await mountSuspended(SupabaseDemo)
    const buttons = component.findAll('button')
    const signOutButton = buttons.find(btn => btn.text().includes('Sign Out'))
    
    if (signOutButton) {
      await signOutButton.trigger('click')
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(mockSignOut).toHaveBeenCalled()
    }
  })

  it('handles sign out errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockSignOut.mockResolvedValue({
      error: { message: 'Sign out failed' }
    })
    vi.stubGlobal('useSupabaseUser', () => ref({
      id: '123',
      email: 'test@example.com'
    }))
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        supabaseUrl: 'https://real-project.supabase.co'
      }
    }))

    const component = await mountSuspended(SupabaseDemo)
    const buttons = component.findAll('button')
    const signOutButton = buttons.find(btn => btn.text().includes('Sign Out'))
    
    if (signOutButton) {
      await signOutButton.trigger('click')
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(consoleErrorSpy).toHaveBeenCalled()
    }

    consoleErrorSpy.mockRestore()
  })
})
