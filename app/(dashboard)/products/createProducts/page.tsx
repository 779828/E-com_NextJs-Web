"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../../utils/supabase";
import { createProduct } from "../../../../services/productService";
import {
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  spec: string;
  price: string;
  oldPrice: string;
  rating: string;
  discount: string;
  image: string;
  category_id: number | null;
}

interface Category {
  id: number;
  name: string;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const ImagePreview = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  "& img": {
    width: 100,
    height: 100,
    objectFit: "cover",
  },
}));

const CreateProductScreen: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    name: "",
    spec: "",
    price: "",
    oldPrice: "",
    rating: "",
    discount: "",
    image: "",
    category_id: null,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchCategories = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .in("name", ["Grocery", "Electronics", "Fashion"]);
      if (error) {
        console.error("Error fetching categories:", error);
        alert("Failed to load categories");
        return;
      }
      setCategories(data as Category[]);
    } catch (error) {
      console.error("Fetch categories error:", error);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (key: keyof FormData, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImagePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange("image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!form.category_id) {
      alert("Please select a category");
      return;
    }

    try {
      let imageUrl = "";
      if (imageFile) {
        const fileName = `product-${Date.now()}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("product-image01")
          .upload(fileName, imageFile, {
            contentType: "image/jpeg",
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from("product-image01")
          .getPublicUrl(fileName);

        if (!urlData.publicUrl) {
          console.error("URL error: No public URL returned");
          throw new Error("Failed to get public URL");
        }

        imageUrl = urlData.publicUrl;
      }

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      const data = await createProduct({
        name: form.name,
        spec: form.spec,
        price: parseFloat(form.price),
        oldPrice: parseFloat(form.oldPrice),
        rating: parseFloat(form.rating),
        discount: parseFloat(form.discount),
        image: imageUrl,
        category_id: form.category_id,
        user_id: user?.id || null,
      });

      if (data) {
        toast.success("Product created successfully");
        setForm({
          name: "",
          spec: "",
          price: "",
          oldPrice: "",
          rating: "",
          discount: "",
          image: "",
          category_id: null,
        });
        setImageFile(null);
        router.push("/products");
      } else {
        toast.error("Failed to create product");
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(`Failed to create product: ${error.message}`);
    }
  };

  return (
    <Container maxWidth="sm">
      <StyledPaper elevation={3}>
        <Typography variant="h5" component="h1" gutterBottom>
          Create Product
        </Typography>

        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          fullWidth
          variant="outlined"
        />

        <TextField
          label="Spec"
          value={form.spec}
          onChange={(e) => handleChange("spec", e.target.value)}
          fullWidth
          variant="outlined"
        />

        <TextField
          label="Price"
          type="number"
          value={form.price}
          onChange={(e) => handleChange("price", e.target.value)}
          fullWidth
          variant="outlined"
        />

        <TextField
          label="Old Price"
          type="number"
          value={form.oldPrice}
          onChange={(e) => handleChange("oldPrice", e.target.value)}
          fullWidth
          variant="outlined"
        />

        <TextField
          label="Rating"
          type="number"
          value={form.rating}
          onChange={(e) => handleChange("rating", e.target.value)}
          fullWidth
          variant="outlined"
        />

        <TextField
          label="Discount"
          type="number"
          value={form.discount}
          onChange={(e) => handleChange("discount", e.target.value)}
          fullWidth
          variant="outlined"
        />

        <FormControl fullWidth variant="outlined">
          <InputLabel>Select Category</InputLabel>
          <Select
            value={form.category_id || ""}
            onChange={(e) =>
              handleChange("category_id", e.target.value as number)
            }
            label="Select Category"
          >
            <MenuItem value="">
              <em>Select Category</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="outlined" component="label" sx={{ marginTop: 2 }}>
          Choose Image
          <input
            type="file"
            accept="image/jpeg,image/png"
            hidden
            onChange={handleImagePick}
          />
        </Button>

        {form.image && (
          <ImagePreview>
            <img src={form.image} alt="Preview" />
          </ImagePreview>
        )}

        <StyledButton
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Add Product
        </StyledButton>
      </StyledPaper>
    </Container>
  );
};

export default CreateProductScreen;
