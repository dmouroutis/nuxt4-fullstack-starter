// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  languageOptions: {
    globals: {
      process: 'readonly'
    }
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
})
