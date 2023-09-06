import { test, describe, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { i18n } from '@/global/i18n';
import App from '@/App.vue';
import { createTestingPinia } from '@pinia/testing'
import { ElConfigProvider } from 'element-plus'
import Loading from '@/components/Loading/Loading.vue'

describe('App.vue', () => {
  const wrapper = shallowMount(App, {
    global: {
      plugins: [i18n, createTestingPinia(
        { createSpy: vi.fn, }
      )]
    }
  });

  test('ElConfigProvider 元件是否存在於畫面上', () => {
    expect(wrapper.findComponent(ElConfigProvider).exists()).toBe(true);
  });

  test('Loading 元件是否存在於畫面上', () => {
    expect(wrapper.findComponent(Loading).exists()).toBe(true);
  });
});