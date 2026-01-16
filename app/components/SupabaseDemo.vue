<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">
        Supabase Connection Status
      </h3>
    </template>

    <div class="space-y-4">
      <div
        v-if="user"
        class="space-y-2"
      >
        <p class="text-sm text-muted">
          Authenticated as:
        </p>
        <p class="font-medium">
          {{ user.email }}
        </p>
        <UButton
          size="sm"
          color="error"
          variant="outline"
          @click="handleSignOut"
        >
          Sign Out
        </UButton>
      </div>

      <div v-else>
        <p class="text-sm text-muted mb-2">
          Not authenticated
        </p>
        <UButton
          size="sm"
          color="primary"
          to="/demo/supabase"
        >
          Go to Auth Demo
        </UButton>
      </div>

      <div class="pt-4 border-t">
        <p class="text-xs text-muted">
          Supabase: {{ isConfigured ? 'Enabled & Configured' : 'Enabled (Demo Mode)' }}
        </p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const supabaseClient = useSupabaseClient()
const user = useSupabaseUser()

const supabaseUrl = config.public.supabaseUrl || ''
const isConfigured = supabaseUrl && supabaseUrl !== 'https://demo.supabase.co'

const handleSignOut = async () => {
  try {
    const { error } = await supabaseClient.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Sign out error:', error instanceof Error ? error.message : String(error))
  }
}
</script>
