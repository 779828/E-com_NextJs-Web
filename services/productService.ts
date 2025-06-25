import { supabase } from "../utils/supabase";

// GET
export const fetchProducts = async (category_id = null, searchQuery = "") => {
  let query = supabase.from("products").select("*");

  if (category_id) {
    query = query.eq("category_id", category_id);
  }

  if (searchQuery) {
    query = query.ilike("name", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching cards:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    console.warn("No cards found in the database.");
  }

  return data || [];
};

// GET
export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, image, desc")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }

  return data;
};

// POST
export const createProduct = async ({
  name,
  spec,
  price,
  oldPrice,
  rating,
  discount,
  image,
  category_id,
  user_id,
}) => {
  console.log(user_id, "user_id in createCard");

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        name,
        spec,
        price,
        oldPrice,
        rating,
        discount,
        image,
        category_id,
        user_id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Insert error:", error.message);
    return null;
  }

  return data;
};
