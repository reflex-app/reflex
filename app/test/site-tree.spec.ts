import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSiteTree } from '@/store/site-tree'

beforeAll(() => {
  setActivePinia(createPinia())
})

describe('SiteTree', () => {
  let store: ReturnType<typeof useSiteTree>

  beforeEach(() => {
    store = useSiteTree()
  })

  afterEach(() => {
    store.$reset()
  })

  test('Store is created', () => {
    expect(store).toBeDefined()
  })

  test('Add site without prefix', async () => {
    store.addSite('google.com')
    expect(store.urls).toHaveLength(1)
    expect(store.urls[0].site).toBe('https://google.com')
  })

  test('Add site with http:// prefix', async () => {
    store.addSite('http://google.com')
    expect(store.urls).toHaveLength(1)
    expect(store.urls[0].site).toBe('http://google.com')
  })

  test('Add path', async () => {
    store.addSite('https://www.google.com')
    store.addPath('https://www.google.com', '/company')
    expect(store.urls[0].paths[0].path).toBe('company')
  })

  test('Add path (nested)', async () => {
    store.addSite('https://www.google.com')
    store.addPath('https://www.google.com', '/company/privacy-policy/en')
    expect(store.urls[0].paths[0].path).toBe('company')
    expect(store.urls[0].paths[0].children[0].path).toBe('privacy-policy')
    expect(store.urls[0].paths[0].children[0].children[0].path).toBe('en')
  })

  test('Remove path (nested)', async () => {
    // Add
    store.addSite('https://www.google.com')
    store.addPath('https://www.google.com', '/company/privacy-policy/en')
    expect(store.urls[0].paths[0].path).toBe('company')
    expect(store.urls[0].paths[0].children[0].path).toBe('privacy-policy')
    expect(store.urls[0].paths[0].children[0].children[0].path).toBe('en')

    // Remove partial path (/en)
    store.removePath('https://www.google.com', '/company/privacy-policy/en')
    expect(store.urls[0].paths[0].children[0].children).toHaveLength(0)

    // Remove entire nested path
    store.removePath('https://www.google.com', '/company')
    expect(store.urls[0].paths).toHaveLength(0)
  })
})
