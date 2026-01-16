<template>
  <div>
    <UPageHero
      title="Google Analytics Demo"
      description="Demonstrates Google Analytics event tracking. Configure your GTAG_ID in .env to enable tracking."
    />

    <UPageSection>
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            Page View Tracking
          </h2>
        </template>

        <div class="space-y-4">
          <p class="text-muted">
            Page views are automatically tracked when you navigate between pages. This page view was tracked automatically when you loaded it.
          </p>

          <UAlert
            color="info"
            variant="soft"
            title="Automatic Tracking"
            description="Google Analytics automatically tracks page views when configured. No code needed!"
          />
        </div>
      </UCard>
    </UPageSection>

    <UPageSection>
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            Event Tracking Examples
          </h2>
        </template>

        <div class="space-y-4">
          <p class="text-muted">
            Click the buttons below to see custom event tracking in action. Check your Google Analytics dashboard to see the events.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UButton
              color="primary"
              block
              @click="trackButtonClick"
            >
              Track Button Click
            </UButton>

            <UButton
              color="success"
              variant="outline"
              block
              @click="trackCustomEvent"
            >
              Track Custom Event
            </UButton>

            <UButton
              color="warning"
              variant="outline"
              block
              @click="trackDownload"
            >
              Track Download Event
            </UButton>

            <UButton
              color="secondary"
              variant="outline"
              block
              @click="trackShare"
            >
              Track Share Event
            </UButton>
          </div>

          <div
            v-if="lastEvent"
            class="mt-4"
          >
            <UAlert
              color="success"
              variant="soft"
              :title="`Event tracked: ${lastEvent}`"
              description="Check your Google Analytics dashboard to see this event."
            />
          </div>
        </div>
      </UCard>
    </UPageSection>

    <UPageSection>
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            Configuration Status
          </h2>
        </template>

        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <UIcon
              :name="gtagId ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
              :class="gtagId ? 'text-green-500' : 'text-red-500'"
            />
            <span>Google Analytics ID: {{ gtagId || 'Not configured' }}</span>
          </div>

          <p class="text-sm text-muted mt-4">
            To enable tracking, add your GTAG_ID to your .env file:
          </p>
          <code class="block bg-muted p-2 rounded text-sm mt-2">
            GTAG_ID=G-XXXXXXXXXX
          </code>
        </div>
      </UCard>
    </UPageSection>
  </div>
</template>

<script setup lang="ts">
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void
  }
}

const lastEvent = ref('')
const config = useRuntimeConfig()
const gtagId = config.public.gtagId || process.env.GTAG_ID || ''

const trackButtonClick = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'button_click', {
      event_category: 'engagement',
      event_label: 'Demo Button',
      value: 1
    })
    lastEvent.value = 'button_click'
  } else {
    console.log('Google Analytics not configured. Event would be: button_click')
    lastEvent.value = 'button_click (simulated)'
  }
}

const trackCustomEvent = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'custom_event', {
      event_category: 'demo',
      event_label: 'Custom Demo Event',
      value: 42
    })
    lastEvent.value = 'custom_event'
  } else {
    console.log('Google Analytics not configured. Event would be: custom_event')
    lastEvent.value = 'custom_event (simulated)'
  }
}

const trackDownload = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'file_download', {
      event_category: 'downloads',
      event_label: 'Demo File',
      value: 1
    })
    lastEvent.value = 'file_download'
  } else {
    console.log('Google Analytics not configured. Event would be: file_download')
    lastEvent.value = 'file_download (simulated)'
  }
}

const trackShare = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'share', {
      event_category: 'social',
      event_label: 'Demo Share',
      method: 'demo'
    })
    lastEvent.value = 'share'
  } else {
    console.log('Google Analytics not configured. Event would be: share')
    lastEvent.value = 'share (simulated)'
  }
}

useHead({
  title: 'Google Analytics Demo'
})
</script>
