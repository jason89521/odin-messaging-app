<script setup lang="ts">
import { store } from './store';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  store.init().then(success => {
    if (!success) {
      router.push('/');
    }
  });
});
</script>

<template>
  <div class="h-dvh bg-slate-400 flex flex-col overflow-auto">
    <RouterView name="Header" />
    <div class="flex-1 overflow-auto">
      <div class="h-full">
        <RouterView />
      </div>
    </div>
    <RouterView name="Footer" />
  </div>
</template>
