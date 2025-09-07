<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/dashboard" class="text-xl font-bold text-gray-900">ERP System</router-link>
          </div>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <button @click="showDropdown = !showDropdown" class="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <img class="h-8 w-8 rounded-full" :src="user?.avatar || defaultAvatar" alt="User avatar">
                <span class="text-gray-700">{{ user?.name || 'User' }}</span>
                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</router-link>
                <router-link to="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</router-link>
                <a @click="logout" href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
          <p class="mt-1 text-sm text-gray-500">Manage your account settings and preferences.</p>
        </div>
      </div>

      <!-- Settings Tabs -->
      <div class="bg-white shadow rounded-lg">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              <component :is="tab.icon" class="w-5 h-5 mr-2 inline" />
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Success/Error Messages -->
          <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {{ errorMessage }}
          </div>

          <!-- Account Settings -->
          <div v-if="activeTab === 'account'" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900">Account Settings</h3>
            
            <form @submit.prevent="updateAccountSettings" class="space-y-6">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    v-model="accountSettings.email"
                    type="email"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    v-model="accountSettings.phone"
                    type="tel"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Language</label>
                <select
                  v-model="accountSettings.language"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Timezone</label>
                <select
                  v-model="accountSettings.timezone"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
              
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <span v-if="isLoading" class="mr-2">
                    <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  {{ isLoading ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Notification Settings -->
          <div v-if="activeTab === 'notifications'" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900">Notification Preferences</h3>
            
            <form @submit.prevent="updateNotificationSettings" class="space-y-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <p class="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="notificationSettings.email"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Push Notifications</h4>
                    <p class="text-sm text-gray-500">Receive push notifications in browser</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="notificationSettings.push"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Order Updates</h4>
                    <p class="text-sm text-gray-500">Get notified about order status changes</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="notificationSettings.orderUpdates"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Marketing Emails</h4>
                    <p class="text-sm text-gray-500">Receive promotional emails and offers</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="notificationSettings.marketing"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
              
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <span v-if="isLoading" class="mr-2">
                    <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  {{ isLoading ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Security Settings -->
          <div v-if="activeTab === 'security'" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900">Security Settings</h3>
            
            <!-- Change Password -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="text-md font-medium text-gray-900 mb-4">Change Password</h4>
              <form @submit.prevent="changePassword" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    v-model="passwordForm.newPassword"
                    type="password"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div class="flex justify-end">
                  <button
                    type="submit"
                    :disabled="isLoading || passwordForm.newPassword !== passwordForm.confirmPassword"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    <span v-if="isLoading" class="mr-2">
                      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    {{ isLoading ? 'Updating...' : 'Update Password' }}
                  </button>
                </div>
              </form>
            </div>
            
            <!-- Two-Factor Authentication -->
            <div class="bg-gray-50 rounded-lg p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-md font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p class="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="securitySettings.twoFactor"
                    type="checkbox"
                    class="sr-only peer"
                    @change="toggleTwoFactor"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
            
            <!-- Login Sessions -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="text-md font-medium text-gray-900 mb-4">Active Sessions</h4>
              <div class="space-y-3">
                <div v-for="session in activeSessions" :key="session.id" class="flex items-center justify-between p-3 bg-white rounded-md">
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ session.device }}</p>
                    <p class="text-xs text-gray-500">{{ session.location }} • {{ session.lastActive }}</p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span v-if="session.current" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Current
                    </span>
                    <button
                      v-if="!session.current"
                      @click="revokeSession(session.id)"
                      class="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Privacy Settings -->
          <div v-if="activeTab === 'privacy'" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900">Privacy Settings</h3>
            
            <form @submit.prevent="updatePrivacySettings" class="space-y-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Profile Visibility</h4>
                    <p class="text-sm text-gray-500">Make your profile visible to other users</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="privacySettings.profileVisible"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Activity Status</h4>
                    <p class="text-sm text-gray-500">Show when you're online</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="privacySettings.activityStatus"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Data Analytics</h4>
                    <p class="text-sm text-gray-500">Allow us to use your data for analytics and improvements</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="privacySettings.dataAnalytics"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
              
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <span v-if="isLoading" class="mr-2">
                    <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  {{ isLoading ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();
const { user, logout: authLogout } = useAuth();

// State
const activeTab = ref('account');
const isLoading = ref(false);
const showDropdown = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

// Tab configuration
const tabs = [
  { id: 'account', name: 'Account', icon: 'svg' },
  { id: 'notifications', name: 'Notifications', icon: 'svg' },
  { id: 'security', name: 'Security', icon: 'svg' },
  { id: 'privacy', name: 'Privacy', icon: 'svg' }
];

// Form data
const accountSettings = reactive({
  email: '',
  phone: '',
  language: 'en',
  timezone: 'UTC'
});

const notificationSettings = reactive({
  email: true,
  push: true,
  orderUpdates: true,
  marketing: false
});

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const securitySettings = reactive({
  twoFactor: false
});

const privacySettings = reactive({
  profileVisible: true,
  activityStatus: true,
  dataAnalytics: true
});

// Mock data
const activeSessions = ref([
  {
    id: 1,
    device: 'Chrome on Windows',
    location: 'New York, NY',
    lastActive: '2 minutes ago',
    current: true
  },
  {
    id: 2,
    device: 'Safari on iPhone',
    location: 'New York, NY',
    lastActive: '1 hour ago',
    current: false
  }
]);

// Methods
const clearMessages = () => {
  successMessage.value = '';
  errorMessage.value = '';
};

const updateAccountSettings = async () => {
  isLoading.value = true;
  clearMessages();
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    successMessage.value = 'Account settings updated successfully!';
  } catch (error) {
    errorMessage.value = 'Failed to update account settings. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const updateNotificationSettings = async () => {
  isLoading.value = true;
  clearMessages();
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    successMessage.value = 'Notification settings updated successfully!';
  } catch (error) {
    errorMessage.value = 'Failed to update notification settings. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    errorMessage.value = 'New passwords do not match.';
    return;
  }
  
  isLoading.value = true;
  clearMessages();
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    successMessage.value = 'Password updated successfully!';
    
    // Reset form
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
  } catch (error) {
    errorMessage.value = 'Failed to update password. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const toggleTwoFactor = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    successMessage.value = securitySettings.twoFactor 
      ? 'Two-factor authentication enabled!' 
      : 'Two-factor authentication disabled!';
  } catch (error) {
    errorMessage.value = 'Failed to update two-factor authentication.';
    securitySettings.twoFactor = !securitySettings.twoFactor; // Revert
  }
};

const revokeSession = async (sessionId: number) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    activeSessions.value = activeSessions.value.filter(s => s.id !== sessionId);
    successMessage.value = 'Session revoked successfully!';
  } catch (error) {
    errorMessage.value = 'Failed to revoke session.';
  }
};

const updatePrivacySettings = async () => {
  isLoading.value = true;
  clearMessages();
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    successMessage.value = 'Privacy settings updated successfully!';
  } catch (error) {
    errorMessage.value = 'Failed to update privacy settings. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const logout = () => {
  authLogout();
  router.push('/login');
};

// Initialize data
onMounted(() => {
  if (user.value) {
    accountSettings.email = user.value.email || '';
    accountSettings.phone = user.value.phone || '';
  }
});
</script>

<style scoped>
/* Custom styles for toggle switches */
</style>

