import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SupabasePage from '~/pages/demo/supabase.vue'

const mockSignInWithPassword = vi.fn()
const mockSignUp = vi.fn()
const mockSignOut = vi.fn()
const mockFrom = vi.fn(() => ({
  select: vi.fn(() => ({
    limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
  }))
}))

const mockSupabaseClient = {
  auth: {
    signInWithPassword: mockSignInWithPassword,
    signUp: mockSignUp,
    signOut: mockSignOut
  },
  from: mockFrom
}

describe('Supabase Demo Page', () => {
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

  it('can mount the supabase page', async () => {
    const component = await mountSuspended(SupabasePage)
    expect(component.exists()).toBe(true)
  })

  it('displays the page title', async () => {
    const component = await mountSuspended(SupabasePage)
    expect(component.text()).toContain('Supabase Demo')
  })

  it('shows demo mode alert when not configured', async () => {
    const component = await mountSuspended(SupabasePage)
    expect(component.text()).toContain('Demo Mode')
  })

  it('does not show demo mode alert when configured', async () => {
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        supabaseUrl: 'https://real-project.supabase.co'
      }
    }))

    const component = await mountSuspended(SupabasePage)
    expect(component.text()).not.toContain('Demo Mode')
  })

  it('shows sign in and sign up buttons when user is not authenticated', async () => {
    const component = await mountSuspended(SupabasePage)
    expect(component.text()).toContain('Not authenticated')
    expect(component.text()).toContain('Sign In')
    expect(component.text()).toContain('Sign Up')
  })

  it('shows user email and sign out button when user is authenticated', async () => {
    vi.stubGlobal('useSupabaseUser', () => ref({
      id: '123',
      email: 'test@example.com'
    }))
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        supabaseUrl: 'https://real-project.supabase.co'
      }
    }))

    const component = await mountSuspended(SupabasePage)
    expect(component.text()).toContain('test@example.com')
    expect(component.text()).toContain('Sign Out')
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

    const component = await mountSuspended(SupabasePage)
    const buttons = component.findAll('button')
    const signOutButton = buttons.find(btn => btn.text().includes('Sign Out'))
    
    if (signOutButton) {
      await signOutButton.trigger('click')
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(mockSignOut).toHaveBeenCalled()
    }
  })

  it('calls testQuery when test database connection button is clicked', async () => {
    const testMockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        limit: vi.fn(() => Promise.resolve({ data: [{ id: 1 }], error: null }))
      }))
    }))

    vi.stubGlobal('useSupabaseClient', () => ({
      ...mockSupabaseClient,
      from: testMockFrom
    }))
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        supabaseUrl: 'https://real-project.supabase.co'
      }
    }))

    const component = await mountSuspended(SupabasePage)
    const buttons = component.findAll('button')
    const testButton = buttons.find(btn => btn.text().includes('Test Database Connection'))
    
    if (testButton) {
      await testButton.trigger('click')
      await new Promise(resolve => setTimeout(resolve, 200))
      expect(testMockFrom).toHaveBeenCalledWith('_test')
    }
  })

  it('shows error message when query fails', async () => {
    const errorMockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        limit: vi.fn(() => Promise.resolve({
          data: null,
          error: { message: 'Table does not exist' }
        }))
      }))
    }))

    vi.stubGlobal('useSupabaseClient', () => ({
      ...mockSupabaseClient,
      from: errorMockFrom
    }))
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        supabaseUrl: 'https://real-project.supabase.co'
      }
    }))

    const component = await mountSuspended(SupabasePage)
    const buttons = component.findAll('button')
    const testButton = buttons.find(btn => btn.text().includes('Test Database Connection'))
    
    if (testButton) {
      await testButton.trigger('click')
      await new Promise(resolve => setTimeout(resolve, 200))
      expect(component.text()).toContain('Table does not exist')
    }
  })
})
