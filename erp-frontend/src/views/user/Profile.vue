<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/dashboard" class="hidden text-xl font-bold text-gray-900">ERP System</router-link>
          </div>
          <div class="flex items-center space-x-4">
            <div class="hidden relative">
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
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900">Profile</h1>
            <button
              @click="toggleEditMode"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              {{ isEditing ? 'Cancel' : 'Edit Profile' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Profile Content -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Profile Picture & Basic Info -->
        <div class="lg:col-span-1">
          <div class="bg-white shadow rounded-lg p-6">
            <div class="text-center">
              <!-- Avatar -->
              <div class="relative inline-block">
                <img
                  class="h-32 w-32 rounded-full mx-auto"
                  :src="user?.avatar || defaultAvatar"
                  alt="Profile picture"
                />
                <button
                  v-if="isEditing"
                  @click="triggerFileUpload"
                  class="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </button>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleFileUpload"
                  class="hidden"
                />
              </div>
              
              <h2 class="mt-4 text-xl font-semibold text-gray-900">
                {{ isEditing ? editForm.name : user?.name }}
              </h2>
              <p class="text-sm text-gray-500">{{ user?.email }}</p>
              <p class="text-sm text-gray-500 capitalize">{{ user?.role }}</p>
              
              <!-- Upload Progress -->
              <div v-if="uploading" class="mt-4">
                <div class="bg-gray-200 rounded-full h-2">
                  <div class="bg-indigo-600 h-2 rounded-full" :style="{ width: uploadProgress + '%' }"></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">Uploading... {{ uploadProgress }}%</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Details -->
        <div class="lg:col-span-2">
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Profile Information</h3>
              
              <!-- Success/Error Messages -->
              <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {{ successMessage }}
              </div>
              <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {{ errorMessage }}
              </div>

              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <!-- Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      v-if="isEditing"
                      v-model="editForm.name"
                      type="text"
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <p v-else class="mt-1 text-sm text-gray-900">{{ user?.name }}</p>
                  </div>

                  <!-- Email -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      v-if="isEditing"
                      v-model="editForm.email"
                      type="email"
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <p v-else class="mt-1 text-sm text-gray-900">{{ user?.email }}</p>
                  </div>

                  <!-- Phone -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      v-if="isEditing"
                      v-model="editForm.phone"
                      type="tel"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <p v-else class="mt-1 text-sm text-gray-900">{{ user?.phone || 'Not provided' }}</p>
                  </div>

                  <!-- Role -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Role</label>
                    <p class="mt-1 text-sm text-gray-900 capitalize">{{ user?.role }}</p>
                  </div>

                  <!-- Address -->
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      v-if="isEditing"
                      v-model="editForm.address"
                      rows="3"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                    <p v-else class="mt-1 text-sm text-gray-900">{{ user?.address || 'Not provided' }}</p>
                  </div>

                  <!-- Bio -->
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                      v-if="isEditing"
                      v-model="editForm.bio"
                      rows="3"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Tell us about yourself..."
                    ></textarea>
                    <p v-else class="mt-1 text-sm text-gray-900">{{ user?.bio || 'No bio provided' }}</p>
                  </div>
                </div>

                <!-- Submit Button -->
                <div v-if="isEditing" class="flex justify-end">
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

          <!-- Account Stats -->
          <div class="mt-6 bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Account Statistics</h3>
              <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <svg class="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-500">Total Orders</p>
                      <p class="text-lg font-semibold text-gray-900">{{ userStats.totalOrders }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-500">Total Spent</p>
                      <p class="text-lg font-semibold text-gray-900">${{ userStats.totalSpent }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <svg class="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-500">Member Since</p>
                      <p class="text-lg font-semibold text-gray-900">{{ formatDate(user?.createdAt) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
const isEditing = ref(false);
const isLoading = ref(false);
const uploading = ref(false);
const uploadProgress = ref(0);
const showDropdown = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const fileInput = ref<HTMLInputElement | null>(null);

const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

// Form data
const editForm = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  bio: ''
});

// User stats (mock data)
const userStats = reactive({
  totalOrders: 24,
  totalSpent: 1250.50
});

// Methods
const toggleEditMode = () => {
  if (isEditing.value) {
    // Cancel editing
    resetForm();
  } else {
    // Start editing
    editForm.name = user.value?.name || '';
    editForm.email = user.value?.email || '';
    editForm.phone = user.value?.phone || '';
    editForm.address = user.value?.address || '';
    editForm.bio = user.value?.bio || '';
  }
  isEditing.value = !isEditing.value;
  clearMessages();
};

const resetForm = () => {
  editForm.name = '';
  editForm.email = '';
  editForm.phone = '';
  editForm.address = '';
  editForm.bio = '';
};

const clearMessages = () => {
  successMessage.value = '';
  errorMessage.value = '';
};

const handleSubmit = async () => {
  isLoading.value = true;
  clearMessages();
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update user data (in real app, this would be an API call)
    if (user.value) {
      user.value.name = editForm.name;
      user.value.email = editForm.email;
      user.value.phone = editForm.phone;
      user.value.address = editForm.address;
      user.value.bio = editForm.bio;
    }
    
    successMessage.value = 'Profile updated successfully!';
    isEditing.value = false;
  } catch (error) {
    errorMessage.value = 'Failed to update profile. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Please select an image file.';
    return;
  }
  
  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'File size must be less than 5MB.';
    return;
  }
  
  uploading.value = true;
  uploadProgress.value = 0;
  clearMessages();
  
  try {
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      uploadProgress.value += 10;
      if (uploadProgress.value >= 100) {
        clearInterval(progressInterval);
      }
    }, 100);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      if (user.value && e.target?.result) {
        user.value.avatar = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
    
    successMessage.value = 'Avatar updated successfully!';
  } catch (error) {
    errorMessage.value = 'Failed to upload avatar. Please try again.';
  } finally {
    uploading.value = false;
    uploadProgress.value = 0;
  }
};

const logout = () => {
  authLogout();
  router.push('/login');
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Initialize form data
onMounted(() => {
  if (user.value) {
    editForm.name = user.value.name || '';
    editForm.email = user.value.email || '';
    editForm.phone = user.value.phone || '';
    editForm.address = user.value.address || '';
    editForm.bio = user.value.bio || '';
  }
});
</script>

<style scoped>
/* Additional custom styles if needed */
</style>

