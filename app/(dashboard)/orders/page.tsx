"use client";

import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Avatar, Typography } from "@mui/material";
import { supabase } from "../../../utils/supabase";

interface Order {
  id: string;
  created_at: string;
  payment_method: string;
  product_id: number;
  quantity: number;
  status: string;
  total: number;
  address: {
    title: string;
    subtitle: string;
  };
  products?: {
    id: number;
    image: string;
    name: string;
    price: string;
  };
}

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;

      if (!userId) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          products (
            id,
            name,
            price,
            image
          )
        `
        )
        .eq("vendor_id", userId);

      if (error) throw error;

      setOrders(data as Order[]);
    } catch (err) {
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  console.log(orders);

  useEffect(() => {
    fetchData();
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "Order ID", width: 200, flex: 1 },
    { field: "status", headerName: "Status", width: 150 },
    {
      field: "payment_method",
      headerName: "Payment Method",
      width: 180,
    },
    { field: "quantity", headerName: "Qty", width: 80 },
    { field: "total", headerName: "Total (₹)", width: 100 },
    {
      field: "address",
      headerName: "Address",
      width: 220,
      renderCell: (params) => (
        <Box>
          <Typography fontWeight="bold">{params.value.title}</Typography>
          <Typography variant="body2">{params.value.subtitle}</Typography>
        </Box>
      ),
    },
    {
      field: "products",
      headerName: "Product",
      width: 250,
      flex: 1,
      renderCell: (params) => {
        const product = params.value;
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar src={product?.image} alt={product?.name} />
            <Box>
              <Typography fontWeight="bold">{product?.name}</Typography>
              {/* <Typography variant="body2">₹{product?.price}</Typography> */}
            </Box>
          </Box>
        );
      },
    },
    // {
    //   field: "created_at",
    //   headerName: "Ordered At",
    //   width: 180,
    //   flex: 1,
    //   valueGetter: (params) => new Date(params.value),
    // },
  ];

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={orders.map((order) => ({ ...order, id: order.id }))}
            columns={columns}
            pageSize={10}
            getRowId={(row) => row.id}
          />
        </div>
      )}
    </Box>
  );
};

export default OrderPage;
