
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WishlistItem {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface WishlistState {
  items: WishlistItem[];
}

// Load wishlist from localStorage if available
const getInitialWishlist = (): WishlistItem[] => {
  if (typeof window !== 'undefined') {
    const savedWishlist = localStorage.getItem('smartWishlist');
    if (savedWishlist) {
      return JSON.parse(savedWishlist);
    }
  }
  return [];
};

const initialState: WishlistState = {
  items: getInitialWishlist(),
};

// Helper function to save wishlist to localStorage
const saveWishlist = (items: WishlistItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('smartWishlist', JSON.stringify(items));
  }
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      if (!state.items.some(item => item.id === action.payload.id)) {
        state.items.push(action.payload);
        saveWishlist(state.items);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveWishlist(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlist(state.items);
    },
  },
});

export const { 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist 
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
