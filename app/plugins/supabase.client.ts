import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // Only initialize if Supabase is enabled
  if (!config.public.enableSupabase) {
    return
  }

  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseKey

  // Skip if using demo credentials
  if (!supabaseUrl || supabaseUrl === 'https://demo.supabase.co' || !supabaseKey || supabaseKey === 'demo-anon-key') {
    return
  }

  const supabaseClient = createClient(supabaseUrl, supabaseKey)

  return {
    provide: {
      supabaseClient
    }
  }
})
