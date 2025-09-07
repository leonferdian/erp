<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Product Images -->
      <div class="space-y-4">
        <div class="aspect-w-1 aspect-h-1">
          <img
            :src="product.images?.[0]?.url || '/placeholder-product.jpg'"
            :alt="product.name"
            class="w-full h-96 object-cover rounded-lg"
          />
        </div>
        <div v-if="product.images && product.images.length > 1" class="grid grid-cols-4 gap-2">
          <img
            v-for="(image, index) in product.images.slice(1, 5)"
            :key="index"
            :src="image.url"
            :alt="image.alt || product.name"
            class="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75"
            @click="selectedImage = image.url"
          />
        </div>
      </div>

      <!-- Product Info -->
      <div class="space-y-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>
          <p class="text-lg text-gray-600 mt-2">{{ product.brand }}</p>
        </div>

        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <div class="flex items-center">
              <span v-for="star in 5" :key="star" class="text-yellow-400">
                <svg class="w-5 h-5" :class="{ 'text-gray-300': star > product.ratings?.average }" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
            </div>
            <span class="ml-2 text-sm text-gray-600">
              {{ product.ratings?.average || 0 }} ({{ product.ratings?.count || 0 }} reviews)
            </span>
          </div>
        </div>

        <div class="text-3xl font-bold text-gray-900">
          ${{ product.price }}
          <span v-if="product.originalPrice && product.originalPrice > product.price" class="text-lg text-gray-500 line-through ml-2">
            ${{ product.originalPrice }}
          </span>
        </div>

        <div class="prose max-w-none">
          <p>{{ product.description }}</p>
        </div>

        <!-- Specifications -->
        <div v-if="product.specifications" class="border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
          <dl class="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
            <div v-for="(value, key) in product.specifications" :key="key" v-if="value">
              <dt class="text-sm font-medium text-gray-500 capitalize">{{ key.replace(/([A-Z])/g, ' $1').trim() }}</dt>
              <dd class="text-sm text-gray-900">{{ value }}</dd>
            </div>
          </dl>
        </div>

        <!-- Add to Cart -->
        <div class="border-t pt-6">
          <div class="flex items-center space-x-4 mb-4">
            <label for="quantity" class="text-sm font-medium text-gray-700">Quantity:</label>
            <select v-model="quantity" id="quantity" class="border border-gray-300 rounded-md px-3 py-2">
              <option v-for="i in Math.min(10, product.inventory?.quantity || 1)" :key="i" :value="i">{{ i }}</option>
            </select>
          </div>

          <div class="flex space-x-4">
            <button
              @click="addToCart"
              :disabled="!product.inventory?.quantity || product.inventory.quantity === 0"
              class="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ product.inventory?.quantity > 0 ? 'Add to Cart' : 'Out of Stock' }}
            </button>
            <button
              @click="addToWishlist"
              class="px-6 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <h2 class="text-2xl font-bold text-gray-900">Product not found</h2>
      <p class="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
      <router-link to="/shop" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
        Back to Shop
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const product = ref(null)
const loading = ref(true)
const quantity = ref(1)
const selectedImage = ref('')

const fetchProduct = async () => {
  try {
    const response = await fetch(`/api/products/${route.params.id}`)
    if (response.ok) {
      const data = await response.json()
      product.value = data.product
      if (product.value?.images?.[0]?.url) {
        selectedImage.value = product.value.images[0].url
      }
    }
  } catch (error) {
    console.error('Error fetching product:', error)
  } finally {
    loading.value = false
  }
}

const addToCart = () => {
  // Add to cart logic
  console.log('Adding to cart:', { productId: product.value.id, quantity: quantity.value })
}

const addToWishlist = () => {
  // Add to wishlist logic
  console.log('Adding to wishlist:', product.value.id)
}

onMounted(() => {
  fetchProduct()
})
</script>

