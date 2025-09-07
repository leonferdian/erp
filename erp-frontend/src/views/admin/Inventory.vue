<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <button
          @click="showAddProductModal = true"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Product
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Search</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search products..."
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Category</label>
            <select
              v-model="filters.category"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Stock Status</label>
            <select
              v-model="filters.stockStatus"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="applyFilters"
              class="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Inventory Table -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div v-if="loading" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Low Stock Threshold
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in products" :key="product.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img
                        :src="product.images?.[0]?.url || '/placeholder-product.jpg'"
                        :alt="product.name"
                        class="h-10 w-10 rounded-full object-cover"
                      />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                      <div class="text-sm text-gray-500">{{ product.brand }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ product.sku }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ product.inventory?.quantity || 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ product.inventory?.lowStockThreshold || 10 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStockStatusClass(product.inventory)"
                  >
                    {{ getStockStatus(product.inventory) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="editInventory(product)"
                    class="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="adjustStock(product)"
                    class="text-green-600 hover:text-green-900"
                  >
                    Adjust
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Edit Inventory Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Edit Inventory</h3>
            <form @submit.prevent="updateInventory">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Current Stock</label>
                <input
                  v-model="editForm.quantity"
                  type="number"
                  min="0"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Low Stock Threshold</label>
                <input
                  v-model="editForm.lowStockThreshold"
                  type="number"
                  min="0"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div class="mb-4">
                <label class="flex items-center">
                  <input
                    v-model="editForm.trackInventory"
                    type="checkbox"
                    class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span class="ml-2 text-sm text-gray-700">Track Inventory</span>
                </label>
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="showEditModal = false"
                  class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '../../components/AdminLayout.vue'

const products = ref([])
const categories = ref([])
const loading = ref(true)
const showEditModal = ref(false)
const showAddProductModal = ref(false)

const filters = ref({
  search: '',
  category: '',
  stockStatus: ''
})

const editForm = ref({
  productId: null,
  quantity: 0,
  lowStockThreshold: 10,
  trackInventory: true
})

const fetchProducts = async () => {
  try {
    loading.value = true
    // Mock data for now
    products.value = [
      {
        id: 1,
        name: 'Wireless Headphones',
        brand: 'TechBrand',
        sku: 'WH-001',
        images: [{ url: '/placeholder-product.jpg' }],
        inventory: {
          quantity: 25,
          lowStockThreshold: 10,
          trackInventory: true
        }
      }
    ]
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    // Mock categories
    categories.value = [
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Clothing' },
      { id: 3, name: 'Books' }
    ]
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const applyFilters = () => {
  fetchProducts()
}

const getStockStatus = (inventory: any) => {
  if (!inventory?.trackInventory) return 'Unlimited'
  if (inventory.quantity === 0) return 'Out of Stock'
  if (inventory.quantity <= inventory.lowStockThreshold) return 'Low Stock'
  return 'In Stock'
}

const getStockStatusClass = (inventory: any) => {
  if (!inventory?.trackInventory) return 'bg-gray-100 text-gray-800'
  if (inventory.quantity === 0) return 'bg-red-100 text-red-800'
  if (inventory.quantity <= inventory.lowStockThreshold) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

const editInventory = (product: any) => {
  editForm.value = {
    productId: product.id,
    quantity: product.inventory?.quantity || 0,
    lowStockThreshold: product.inventory?.lowStockThreshold || 10,
    trackInventory: product.inventory?.trackInventory || true
  }
  showEditModal.value = true
}

const adjustStock = (product: any) => {
  // Implement stock adjustment logic
  console.log('Adjusting stock for product:', product.id)
}

const updateInventory = async () => {
  try {
    // Update inventory logic
    console.log('Updating inventory:', editForm.value)
    showEditModal.value = false
    fetchProducts()
  } catch (error) {
    console.error('Error updating inventory:', error)
  }
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>

