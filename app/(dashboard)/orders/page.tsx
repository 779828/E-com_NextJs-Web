"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { green, orange, blue } from "@mui/material/colors";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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
  products: {
    id: number;
    image: string;
    name: string;
    price: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // Detects screens between 'sm' and 'md' (600px-960px)

  const fetchData = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user_id = sessionData?.session?.user.id;
    if (!user_id) {
      console.error("User not authenticated");
      return;
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        total,
        quantity,
        status,
        payment_method,
        created_at,
        address,
        product_id,
        products:product_id (
          id,
          name,
          price,
          image
        )
        `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(orders as Order[]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const rows = orders
    .filter((order) => order.id.toLowerCase().includes(search.toLowerCase()))
    .map((order, index) => ({
      id: order.id,
      product: order.products.name,
      image: order.products.image,
      total: `$${order.total}`,
      payment_method: order.payment_method,
      status: order.status,
      address: `${order.address.title}, ${order.address.subtitle}`,
      index,
    }));

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Order ID",
      flex: isMobile ? 0.8 : 1.5,
      // minWidth: 100,
      renderCell: (params) => (
        <Typography variant={isMobile ? "caption" : "body2"}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "product",
      headerName: "Product",
      flex: isMobile ? 1 : 1.5,
      // minWidth: 150,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <img
            src={rows[params.row.index].image}
            alt={params.value}
            style={{
              width: isMobile ? 30 : 40,
              height: isMobile ? 30 : 40,
              borderRadius: 6,
            }}
          />
          <Typography variant={isMobile ? "caption" : "body2"}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "total",
      headerName: "Total",
      flex: isMobile ? 0.6 : 1,
      // minWidth: 80,
      renderCell: (params) => (
        <Typography variant={isMobile ? "caption" : "body2"}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "payment_method",
      headerName: "Payment Method",
      flex: 1,
      // minWidth: 120,
      hide: isMobile,
      renderCell: (params) => (
        <Typography variant={isMobile ? "caption" : "body2"}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Order Status",
      flex: isMobile ? 0.8 : 1,
      // minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          sx={{
            backgroundColor:
              params.value === "confirmed"
                ? green[500]
                : params.value === "pending"
                ? orange[500]
                : blue[500],
            color: "white",
            fontWeight: 500,
            fontSize: isMobile ? "0.7rem" : "0.875rem",
            height: isMobile ? 24 : 32,
          }}
        />
      ),
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1.5,
      // minWidth: 150,
      hide: isMobile || isTablet,
      renderCell: (params) => (
        <Typography
          variant={isMobile ? "caption" : "body2"}
          color="text.secondary"
        >
          {params.value}
        </Typography>
      ),
    },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   flex: 0.8,
    //   minWidth: 100,
    //   hide: isMobile, // Hide on mobile
    //   renderCell: () => (
    //     <Button variant="outlined" size="small">
    //       Actions
    //     </Button>
    //   ),
    // },
  ];

  return (
    <Box
      p={{ xs: 1, sm: 2, md: 3 }}
      sx={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      <Typography variant={isMobile ? "h6" : "h5"} mb={2}>
        All Orders
      </Typography>

      {/* <TextField
        fullWidth
        label="Search by Order ID"
        variant="outlined"
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size={isMobile ? "small" : "medium"}
      /> */}

      <Box
        sx={{
          height: isMobile ? 400 : 600,
          width: "100%",
          "& .MuiDataGrid-root": {
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[10, 20, 50]}
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-cell": {
              padding: isMobile ? "4px" : "8px",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.paper,
              fontSize: isMobile ? "0.8rem" : "1rem",
            },
          }}
        />
      </Box>
    </Box>
  );
}
