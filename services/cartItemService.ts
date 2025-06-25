import { supabase } from "../utils/supabase";

export const addToCart = async (productId, quantity = 1) => {
  try {
    const currentSession = await supabase.auth.getSession();

    console.log(currentSession?.data?.session?.user?.id);

    if (!currentSession || !currentSession?.data?.session) {
      throw new Error("User not authenticated");
    }

    const userId = currentSession?.data?.session?.user?.id;

    const { data: existingItem, error: fetchError } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking cart item:", fetchError);
      throw fetchError;
    }

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", existingItem.id)
        .select(
          `
        id,
        quantity,
        products (
          id,
          name,
          price,
          image,
          spec,
          oldPrice,
          rating,
          discount
        )
      `
        )
        .single();

      if (error) {
        console.error("Error updating cart item:", error);
        throw error;
      }
      return data;
    } else {
      const { data, error } = await supabase
        .from("cart_items")
        .insert([{ user_id: userId, product_id: productId, quantity }])
        .select(
          `
        id,
        quantity,
        products (
          id,
          name,
          price,
          image,
          spec,
          oldPrice,
          rating,
          discount
        )
      `
        )
        .single();

      if (error) {
        console.error("Error adding to cart:", error);
        throw error;
      }
      return data;
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    throw error;
  }
};

export const fetchCartItems = async () => {
  try {
    const currentSession = await supabase.auth.getSession();

    if (
      !currentSession ||
      !currentSession.data ||
      !currentSession?.data?.session
    ) {
      throw new Error("User not authenticated");
    }

    const userId = currentSession?.data?.session?.user?.id;

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        id,
        quantity,
        products (
          id,
          name,
          spec,
          price,
          oldPrice,
          rating,
          discount,
          image
        )
      `
      )
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching cart items:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Fetch cart items error:", error);
    throw error;
  }
};

export const updateCartItemQuantity = async (cartItemId, quantity) => {
  try {
    const currentSession = await supabase.auth.getSession();

    if (!currentSession || !currentSession?.data) {
      throw new Error("User not authenticated");
    }

    const userId = currentSession?.data?.session?.user?.id;

    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", cartItemId)
      .eq("user_id", userId)
      .select(
        `
        id,
        quantity,
        products (
          id,
          name,
          price,
          image,
          spec,
          oldPrice,
          rating,
          discount
        )
      `
      )
      .single();

    if (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Update cart item error:", error);
    throw error;
  }
};

export const removeFromCart = async (cartItemId) => {
  try {
    const currentSession = await supabase.auth.getSession();

    if (!currentSession || !currentSession?.data) {
      throw new Error("User not authenticated");
    }

    const userId = currentSession?.data?.session?.user?.id;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Remove from cart error:", error);
    throw error;
  }
};

export const clearCartItem = async () => {
  try {
    const currentSession = await supabase.auth.getSession();

    if (!currentSession || !currentSession.data) {
      throw new Error("User not authenticated");
    }

    const userId = currentSession?.data?.session?.user?.id;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.error("Error clearing cart items:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Clear cart items error:", error);
    throw error;
  }
};
