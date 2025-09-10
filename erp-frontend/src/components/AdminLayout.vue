<template>
  <div class="min-h-screen bg-gray-50">
    <main class="flex-1 relative overflow-y-auto focus:outline-none">
      <div class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <!-- Page Header -->
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
            <p v-if="pageDescription" class="mt-1 text-sm text-gray-500">{{ pageDescription }}</p>
          </div>

          <!-- Page Content -->
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { user, logout: authLogout } = useAuth();

// Props
defineProps<{
  pageTitle: string;
  pageDescription?: string;
}>();

// State
const showDropdown = ref(false);
const notificationCount = ref(3); // Mock notification count

const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

// Methods
const logout = () => {
  authLogout();
  router.push('/login');
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
