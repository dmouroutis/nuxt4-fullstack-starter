import { defineStore } from 'pinia'

export interface ExampleState {
  count: number
  message: string
}

export const useExampleStore = defineStore('example', {
  state: (): ExampleState => ({
    count: 0,
    message: 'Hello from Pinia!'
  }),

  getters: {
    doubleCount: (state): number => state.count * 2,
    greeting: (state): string => `${state.message} Count: ${state.count}`
  },

  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    reset() {
      this.count = 0
    },
    setMessage(message: string) {
      this.message = message
    }
  }
})
