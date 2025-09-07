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
            <!-- Search Bar -->
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search products..."
                class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            
            <!-- Cart Icon -->
            <router-link to="/cart" class="relative p-2 text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
              </svg>
              <span v-if="cartItemCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {{ cartItemCount }}
              </span>
            </router-link>
            
            <!-- User Menu -->
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
                <router-link to="/orders" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</router-link>
                <a @click="logout" href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex mb-6" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <router-link to="/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              Dashboard
            </router-link>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">Shop</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Filters and Sort -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <!-- Category Filter -->
            <div class="flex items-center space-x-4">
              <label class="text-sm font-medium text-gray-700">Category:</label>
              <select
                v-model="selectedCategory"
                class="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            
            <!-- Sort Options -->
            <div class="flex items-center space-x-4">
              <label class="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                v-model="sortBy"
                class="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <!-- Product Image -->
          <div class="aspect-w-16 aspect-h-9 bg-gray-200">
            <img
              :src="product.image"
              :alt="product.name"
              class="w-full h-48 object-cover"
            />
            <div v-if="product.discount" class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              -{{ product.discount }}%
            </div>
          </div>
          
          <!-- Product Info -->
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {{ product.name }}
            </h3>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">
              {{ product.description }}
            </p>
            
            <!-- Rating -->
            <div class="flex items-center mb-3">
              <div class="flex items-center">
                <svg
                  v-for="i in 5"
                  :key="i"
                  class="h-4 w-4"
                  :class="i <= product.rating ? 'text-yellow-400' : 'text-gray-300'"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <span class="ml-2 text-sm text-gray-600">({{ product.reviewCount }})</span>
            </div>
            
            <!-- Price -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-2">
                <span class="text-lg font-bold text-gray-900">${{ product.price }}</span>
                <span v-if="product.originalPrice" class="text-sm text-gray-500 line-through">
                  ${{ product.originalPrice }}
                </span>
              </div>
              <span v-if="product.stock < 10" class="text-xs text-red-600 font-medium">
                Only {{ product.stock }} left!
              </span>
            </div>
            
            <!-- Actions -->
            <div class="flex space-x-2">
              <button
                @click="addToCart(product)"
                :disabled="product.stock === 0"
                class="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
              </button>
              <button
                @click="toggleWishlist(product)"
                class="p-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                :class="{ 'text-red-500': isInWishlist(product.id) }"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex items-center justify-between">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
              to <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }}</span>
              of <span class="font-medium">{{ filteredProducts.length }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  page === currentPage
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                ]"
              >
                {{ page }}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();
const { user, logout: authLogout } = useAuth();

// State
const searchQuery = ref('');
const selectedCategory = ref('');
const sortBy = ref('name');
const currentPage = ref(1);
const itemsPerPage = ref(12);
const showDropdown = ref(false);
const cartItemCount = ref(0);
const wishlist = ref<number[]>([]);

const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

// Mock data
const categories = ref([
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Clothing' },
  { id: 3, name: 'Home & Garden' },
  { id: 4, name: 'Sports' },
  { id: 5, name: 'Books' }
]);

const products = ref([
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 99.99,
    originalPrice: 129.99,
    discount: 23,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 1,
    rating: 4.5,
    reviewCount: 128,
    stock: 25
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring.',
    price: 199.99,
    originalPrice: null,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 1,
    rating: 4.2,
    reviewCount: 89,
    stock: 15
  },
  {
    id: 3,
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt in various colors.',
    price: 24.99,
    originalPrice: 29.99,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 2,
    rating: 4.7,
    reviewCount: 203,
    stock: 8
  },
  {
    id: 4,
    name: 'Indoor Plant Collection',
    description: 'Beautiful collection of low-maintenance indoor plants perfect for home decoration.',
    price: 49.99,
    originalPrice: null,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 3,
    rating: 4.4,
    reviewCount: 67,
    stock: 12
  },
  {
    id: 5,
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat with extra cushioning for comfortable workouts.',
    price: 39.99,
    originalPrice: 49.99,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 4,
    rating: 4.6,
    reviewCount: 145,
    stock: 20
  },
  {
    id: 6,
    name: 'Programming Fundamentals Book',
    description: 'Comprehensive guide to programming fundamentals for beginners.',
    price: 29.99,
    originalPrice: null,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 5,
    rating: 4.8,
    reviewCount: 312,
    stock: 0
  }
]);

// Computed properties
const filteredProducts = computed(() => {
  let filtered = products.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  }

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.category === parseInt(selectedCategory.value));
  }

  // Sort products
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return filtered;
});

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
});

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Methods
const addToCart = (product: any) => {
  // In a real app, this would make an API call
  cartItemCount.value++;
  console.log('Added to cart:', product.name);
  
  // Show success message (you could use a toast notification library)
  alert(`${product.name} added to cart!`);
};

const toggleWishlist = (product: any) => {
  const index = wishlist.value.indexOf(product.id);
  if (index > -1) {
    wishlist.value.splice(index, 1);
  } else {
    wishlist.value.push(product.id);
  }
};

const isInWishlist = (productId: number) => {
  return wishlist.value.includes(productId);
};

const logout = () => {
  authLogout();
  router.push('/login');
};

// Initialize
onMounted(() => {
  // Load cart count from localStorage or API
  const savedCartCount = localStorage.getItem('cartItemCount');
  if (savedCartCount) {
    cartItemCount.value = parseInt(savedCartCount);
  }
  
  // Load wishlist from localStorage
  const savedWishlist = localStorage.getItem('wishlist');
  if (savedWishlist) {
    wishlist.value = JSON.parse(savedWishlist);
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

