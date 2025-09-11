<template>
  <AdminLayout page-title="Product Management" page-description="Manage products, categories, and inventory">
    <!-- Action Bar -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center space-x-4">
        <!-- Search -->
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
        
        <!-- Category Filter -->
        <select
          v-model="categoryFilter"
          class="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        
        <!-- Status Filter -->
        <select
          v-model="statusFilter"
          class="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>
      
      <div class="mt-4 sm:mt-0">
        <button
          @click="showAddProductModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Product
        </button>
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
          <div class="absolute top-2 right-2">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getStatusClass(product.status)"
            >
              {{ product.status }}
            </span>
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
          
          <!-- Category -->
          <div class="mb-3">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {{ getCategoryName(product.categoryId) }}
            </span>
          </div>
          
          <!-- Price and Stock -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-2">
              <span class="text-lg font-bold text-gray-900">${{ product.price }}</span>
              <span v-if="product.originalPrice" class="text-sm text-gray-500 line-through">
                ${{ product.originalPrice }}
              </span>
            </div>
            <span class="text-sm text-gray-500">
              Stock: {{ product.stock }}
            </span>
          </div>
          
          <!-- Actions -->
          <div class="flex space-x-2">
            <button
              @click="editProduct(product)"
              class="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm font-medium"
            >
              Edit
            </button>
            <button
              @click="toggleProductStatus(product)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2',
                product.status === 'active' 
                  ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500' 
                  : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
              ]"
            >
              {{ product.status === 'active' ? 'Deactivate' : 'Activate' }}
            </button>
            <button
              @click="deleteProduct(product)"
              class="p-2 border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-red-600"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredProducts.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
      <div class="mt-6">
        <button
          @click="showAddProductModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Product
        </button>
      </div>
    </div>

    <!-- Add/Edit Product Modal -->
    <div v-if="showAddProductModal || showEditProductModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showAddProductModal ? 'Add New Product' : 'Edit Product' }}
          </h3>
          
          <form @submit.prevent="saveProduct" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  v-model="productForm.name"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Category</label>
                <select
                  v-model="productForm.categoryId"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select Category</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                v-model="productForm.description"
                rows="3"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label class="block text-sm font-medium text-gray-700">Price</label>
                <input
                  v-model="productForm.price"
                  type="number"
                  step="0.01"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Original Price</label>
                <input
                  v-model="productForm.originalPrice"
                  type="number"
                  step="0.01"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  v-model="productForm.stock"
                  type="number"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                v-model="productForm.image"
                type="url"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div class="flex items-center">
              <input
                v-model="productForm.isActive"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">Active</label>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isLoading"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {{ isLoading ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '../../components/AdminLayout.vue';

// State
const searchQuery = ref('');
const categoryFilter = ref('');
const statusFilter = ref('');
const showAddProductModal = ref(false);
const showEditProductModal = ref(false);
const isLoading = ref(false);
const editingProduct = ref<any>(null);

const productForm = ref({
  name: '',
  description: '',
  categoryId: '',
  price: '',
  originalPrice: '',
  stock: '',
  image: '',
  isActive: true
});

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
    categoryId: 1,
    stock: 25,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring.',
    price: 199.99,
    originalPrice: null,
    categoryId: 1,
    stock: 15,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 3,
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt in various colors.',
    price: 24.99,
    originalPrice: 29.99,
    categoryId: 2,
    stock: 0,
    status: 'out_of_stock',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 4,
    name: 'Indoor Plant Collection',
    description: 'Beautiful collection of low-maintenance indoor plants perfect for home decoration.',
    price: 49.99,
    originalPrice: null,
    categoryId: 3,
    stock: 12,
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
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
  if (categoryFilter.value) {
    filtered = filtered.filter(product => product.categoryId === parseInt(categoryFilter.value));
  }

  // Filter by status
  if (statusFilter.value) {
    if (statusFilter.value === 'out_of_stock') {
      filtered = filtered.filter(product => product.stock === 0);
    } else {
      filtered = filtered.filter(product => product.status === statusFilter.value);
    }
  }

  return filtered;
});

// Methods
const getCategoryName = (categoryId: number) => {
  const category = categories.value.find(c => c.id === categoryId);
  return category ? category.name : 'Unknown';
};

const getStatusClass = (status: string) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    out_of_stock: 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const editProduct = (product: any) => {
  editingProduct.value = product;
  productForm.value = {
    name: product.name,
    description: product.description,
    categoryId: product.categoryId.toString(),
    price: product.price.toString(),
    originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
    stock: product.stock.toString(),
    image: product.image,
    isActive: product.status === 'active'
  };
  showEditProductModal.value = true;
};

const toggleProductStatus = async (product: any) => {
  const newStatus = product.status === 'active' ? 'inactive' : 'active';
  
  if (confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} this product?`)) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      product.status = newStatus;
      alert(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully.`);
    } catch (error) {
      alert('Failed to update product status. Please try again.');
    }
  }
};

const deleteProduct = async (product: any) => {
  if (confirm(`Are you sure you want to delete product "${product.name}"? This action cannot be undone.`)) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const index = products.value.findIndex(p => p.id === product.id);
      if (index > -1) {
        products.value.splice(index, 1);
      }
      
      alert('Product deleted successfully.');
    } catch (error) {
      alert('Failed to delete product. Please try again.');
    }
  }
};

const saveProduct = async () => {
  isLoading.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (showAddProductModal.value) {
      // Add new product
      const newProduct = {
        id: Date.now(),
        name: productForm.value.name,
        description: productForm.value.description,
        categoryId: parseInt(productForm.value.categoryId),
        price: parseFloat(productForm.value.price),
        originalPrice: productForm.value.originalPrice ? parseFloat(productForm.value.originalPrice) : null,
        stock: parseInt(productForm.value.stock),
        status: productForm.value.isActive ? 'active' : 'inactive',
        image: productForm.value.image
      };
      products.value.push(newProduct);
      alert('Product created successfully.');
    } else {
      // Update existing product
      const product = products.value.find(p => p.id === editingProduct.value.id);
      if (product) {
        product.name = productForm.value.name;
        product.description = productForm.value.description;
        product.categoryId = parseInt(productForm.value.categoryId);
        product.price = parseFloat(productForm.value.price);
        product.originalPrice = productForm.value.originalPrice ? parseFloat(productForm.value.originalPrice) : null;
        product.stock = parseInt(productForm.value.stock);
        product.status = productForm.value.isActive ? 'active' : 'inactive';
        product.image = productForm.value.image;
      }
      alert('Product updated successfully.');
    }
    
    closeModal();
  } catch (error) {
    alert('Failed to save product. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

const closeModal = () => {
  showAddProductModal.value = false;
  showEditProductModal.value = false;
  editingProduct.value = null;
  productForm.value = {
    name: '',
    description: '',
    categoryId: '',
    price: '',
    originalPrice: '',
    stock: '',
    image: '',
    isActive: true
  };
};

// Initialize
onMounted(() => {
  // Load products from API
  console.log('Loading products...');
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

