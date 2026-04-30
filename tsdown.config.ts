import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: true,
  dts: {
    tsgo: true,
  },
  entry: ['src/*.ts'],
  hash: false,
  platform: 'node',
  shims: true,
})
