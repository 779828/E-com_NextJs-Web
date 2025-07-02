"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Rating from "@mui/material/Rating";
import Chip from "@mui/material/Chip";
import { Button, IconButton } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { toast } from "react-toastify";
import { addItemToCart } from "../../../store/cartItmeSlice";
import { useAppDispatch } from "../../../store/hooks";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  spec: string;
  image: string;
  rating: string;
  price: number;
  oldPrice: number;
  discount: number;
}

export default function ProductPage(param: Product) {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const [data, setData] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      const user = sessionData?.session?.user;
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setData(products as Product[]);
      }
    };

    fetchData();
  }, []);

  const handleAdd = (productId: string) => (param: any) => {
    dispatch(addItemToCart({ productId, quantity: 1 }));
    toast.success(`Item added to cart!`);
  };

  const handleNavigate = () => {
    router.push("/products/createProducts");
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleNavigate}>
          + Add Product
        </Button>
      </Box>

      <Grid container spacing={3}>
        {data.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" fontWeight={600}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.spec}
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  <Rating
                    name="product-rating"
                    value={parseFloat(product.rating)}
                    precision={0.1}
                    readOnly
                    size="small"
                  />
                  <Typography variant="caption" ml={0.5}>
                    ({product.rating})
                  </Typography>
                </Box>
                <Box display="flex" gap={1} mt={1} alignItems="center">
                  <Typography variant="h6" color="primary">
                    ₹{product.price}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textDecoration: "line-through" }}
                  >
                    ₹{product.oldPrice}
                  </Typography>
                  <Chip
                    label={`-${product.discount}%`}
                    color="error"
                    size="small"
                  />
                  <IconButton
                    onClick={handleAdd(product.id)}
                    color="primary"
                    aria-label="add to shopping cart"
                  >
                    <AddShoppingCartIcon
                      sx={{
                        padding: 1,
                        width: 40,
                        height: 40,
                        boxShadow: 2,
                        color: "black",
                        background: "orange",
                        borderRadius: 20,
                      }}
                    />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
