import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  addToCart,
  clearCartItem,
  fetchCartItems,
  removeFromCart,
  updateCartItemQuantity,
} from "../services/cartItemService";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CartState = {
  items: [],
  status: "idle",
  error: null,
};

export const addItemToCart = createAsyncThunk<
  CartItem,
  { productId: string; quantity: number },
  { rejectValue: string }
>(
  "cart/addItemToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const data = await addToCart(productId, quantity);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserCart = createAsyncThunk<
  CartItem[],
  void,
  { rejectValue: string }
>("cart/fetchUserCart", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchCartItems();
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const updateItemQuantity = createAsyncThunk<
  CartItem,
  { cartItemId: string; quantity: number },
  { rejectValue: string }
>(
  "cart/updateItemQuantity",
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const data = await updateCartItemQuantity(cartItemId, quantity);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeItemFromCart = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("cart/removeItemFromCart", async (cartItemId, { rejectWithValue }) => {
  try {
    await removeFromCart(cartItemId);
    return cartItemId;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const clearCartItems = createAsyncThunk<
  boolean,
  void,
  { rejectValue: string }
>("cart/clearCartItems", async (_, { rejectWithValue }) => {
  try {
    await clearCartItem();
    return true;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Slice
const cartSlice = createSlice({
  name: "cartItem",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchUserCart.fulfilled,
        (state, action: PayloadAction<CartItem[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch cart";
      })
      .addCase(
        addItemToCart.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          const index = state.items.findIndex(
            (item) => item.id === action.payload.id
          );
          if (index !== -1) {
            state.items[index] = action.payload;
          } else {
            state.items.push(action.payload);
          }
        }
      )
      .addCase(addItemToCart.rejected, (state, action) => {
        state.error = action.payload || "Failed to add item";
      })
      .addCase(
        updateItemQuantity.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          const index = state.items.findIndex(
            (item) => item.id === action.payload.id
          );
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      )
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.error = action.payload || "Failed to update quantity";
      })
      .addCase(
        removeItemFromCart.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter(
            (item) => item.id !== action.payload
          );
        }
      )
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.error = action.payload || "Failed to remove item";
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
