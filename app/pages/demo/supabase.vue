<template>
  <div>
    <UPageHero
      title="Supabase Demo"
      description="Demonstrates Supabase authentication and database queries. Configure your Supabase credentials in .env to see it in action."
    />

    <UPageSection v-if="!isConfigured">
      <UAlert
        color="info"
        variant="soft"
        title="Demo Mode"
        description="Supabase is running in demo mode. Configure your Supabase credentials in .env to connect to your project."
      />
    </UPageSection>

    <UPageSection>
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            Authentication Status
          </h2>
        </template>

        <div
          v-if="user"
          class="space-y-4"
        >
          <div>
            <p class="text-sm text-muted mb-2">
              Logged in as:
            </p>
            <p class="font-medium">
              {{ user.email }}
            </p>
            <p class="text-sm text-muted mt-1">
              User ID: {{ user.id }}
            </p>
          </div>

          <UButton
            color="error"
            variant="outline"
            @click="signOut"
          >
            Sign Out
          </UButton>
        </div>

        <div
          v-else
          class="space-y-4"
        >
          <p class="text-muted">
            Not authenticated
          </p>

          <div class="flex gap-2">
            <UButton
              color="primary"
              @click="showSignIn = true"
            >
              Sign In
            </UButton>
            <UButton
              variant="outline"
              @click="showSignUp = true"
            >
              Sign Up
            </UButton>
          </div>
        </div>
      </UCard>
    </UPageSection>

    <UPageSection>
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            Database Query Example
          </h2>
        </template>

        <div class="space-y-4">
          <p class="text-sm text-muted">
            This example demonstrates how to query data from Supabase. Make sure you have configured your Supabase URL and key in .env
          </p>

          <UButton
            :loading="loading"
            @click="testQuery"
          >
            Test Database Connection
          </UButton>

          <div
            v-if="queryResult"
            class="mt-4"
          >
            <p class="text-sm font-medium mb-2">
              Query Result:
            </p>
            <pre class="bg-muted p-4 rounded-lg text-xs overflow-auto">{{ JSON.stringify(queryResult, null, 2) }}</pre>
          </div>

          <UAlert
            v-if="queryError"
            color="error"
            variant="soft"
            :title="queryError"
          />
        </div>
      </UCard>
    </UPageSection>

    <!-- Sign In Modal -->
    <UModal v-model="showSignIn">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">
            Sign In
          </h3>
        </template>

        <form
          class="space-y-4"
          @submit.prevent="signIn"
        >
          <UInput
            v-model="signInEmail"
            type="email"
            label="Email"
            placeholder="your@email.com"
            required
          />

          <UInput
            v-model="signInPassword"
            type="password"
            label="Password"
            placeholder="••••••••"
            required
          />

          <div class="flex gap-2 justify-end">
            <UButton
              variant="ghost"
              @click="showSignIn = false"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              :loading="signingIn"
            >
              Sign In
            </UButton>
          </div>
        </form>
      </UCard>
    </UModal>

    <!-- Sign Up Modal -->
    <UModal v-model="showSignUp">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">
            Sign Up
          </h3>
        </template>

        <form
          class="space-y-4"
          @submit.prevent="signUp"
        >
          <UInput
            v-model="signUpEmail"
            type="email"
            label="Email"
            placeholder="your@email.com"
            required
          />

          <UInput
            v-model="signUpPassword"
            type="password"
            label="Password"
            placeholder="••••••••"
            required
          />

          <div class="flex gap-2 justify-end">
            <UButton
              variant="ghost"
              @click="showSignUp = false"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              :loading="signingUp"
            >
              Sign Up
            </UButton>
          </div>
        </form>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const supabaseClient = useSupabaseClient()
const user = useSupabaseUser()

const isConfigured = config.public.supabaseUrl && config.public.supabaseUrl !== 'https://demo.supabase.co'

const showSignIn = ref(false)
const showSignUp = ref(false)
const signingIn = ref(false)
const signingUp = ref(false)
const loading = ref(false)
const queryResult = ref<unknown>(null)
const queryError = ref('')

const signInEmail = ref('')
const signInPassword = ref('')
const signUpEmail = ref('')
const signUpPassword = ref('')

const signIn = async () => {
  if (!isConfigured) {
    alert('Please configure your Supabase credentials in .env to use authentication')
    return
  }
  try {
    signingIn.value = true
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: signInEmail.value,
      password: signInPassword.value
    })

    if (error) throw error

    showSignIn.value = false
    signInEmail.value = ''
    signInPassword.value = ''
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Failed to sign in')
  } finally {
    signingIn.value = false
  }
}

const signUp = async () => {
  if (!isConfigured) {
    alert('Please configure your Supabase credentials in .env to use authentication')
    return
  }
  try {
    signingUp.value = true
    const { error } = await supabaseClient.auth.signUp({
      email: signUpEmail.value,
      password: signUpPassword.value
    })

    if (error) throw error

    alert('Check your email for the confirmation link!')
    showSignUp.value = false
    signUpEmail.value = ''
    signUpPassword.value = ''
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Failed to sign up')
  } finally {
    signingUp.value = false
  }
}

const signOut = async () => {
  try {
    const { error } = await supabaseClient.auth.signOut()
    if (error) throw error
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Failed to sign out')
  }
}

const testQuery = async () => {
  if (!isConfigured) {
    queryError.value = 'Please configure your Supabase credentials in .env to test database queries'
    return
  }
  try {
    loading.value = true
    queryError.value = ''
    queryResult.value = null

    const { data, error } = await supabaseClient
      .from('_test')
      .select('*')
      .limit(1)

    if (error) {
      queryError.value = `Query attempted. Note: ${error.message}. Create a table in your Supabase project to test queries.`
      queryResult.value = { error: error.message, hint: 'Configure your Supabase database and create tables to test queries' }
    } else {
      queryResult.value = data
    }
  } catch (error) {
    queryError.value = error instanceof Error ? error.message : 'Failed to query database'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Supabase Demo'
})
</script>
