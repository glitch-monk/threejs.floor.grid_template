export default {
  build: {
    target: 'esnext',
  },
  esbuild: {
    supported: {
      'top-level-await': true
    },
  }
}
