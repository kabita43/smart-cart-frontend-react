
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface ProductsState {
  items: Product[];
  filteredItems: Product[];
  categories: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    category: string;
    minPrice: number;
    maxPrice: number;
    search: string;
  };
}

const initialState: ProductsState = {
  items: [],
  filteredItems: [],
  categories: [],
  status: 'idle',
  error: null,
  filters: {
    category: 'all',
    minPrice: 0,
    maxPrice: 1000,
    search: '',
  },
};

// Async thunks for fetching data
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await fetch('https://fakestoreapi.com/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json() as Promise<Product[]>;
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async () => {
  const response = await fetch('https://fakestoreapi.com/products/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json() as Promise<string[]>;
});

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<{ key: string; value: string | number }>) {
      const { key, value } = action.payload;
      state.filters = {
        ...state.filters,
        [key]: value,
      };
      
      // Apply filters
      state.filteredItems = state.items.filter(item => {
        const matchesCategory = 
          state.filters.category === 'all' || 
          item.category === state.filters.category;
        
        const matchesPrice = 
          item.price >= state.filters.minPrice && 
          item.price <= state.filters.maxPrice;
        
        const matchesSearch = 
          state.filters.search === '' || 
          item.title.toLowerCase().includes(state.filters.search.toLowerCase()) ||
          item.description.toLowerCase().includes(state.filters.search.toLowerCase());
        
        return matchesCategory && matchesPrice && matchesSearch;
      });
    },
    clearFilters(state) {
      state.filters = {
        category: 'all',
        minPrice: 0,
        maxPrice: 1000,
        search: '',
      };
      state.filteredItems = state.items;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.filteredItems = action.payload;
        
        // Find highest price for filter range
        const highestPrice = Math.max(...state.items.map(item => item.price));
        state.filters.maxPrice = Math.ceil(highestPrice);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { setFilter, clearFilters } = productSlice.actions;
export default productSlice.reducer;
