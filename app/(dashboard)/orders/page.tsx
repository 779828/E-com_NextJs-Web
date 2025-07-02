"use client";

import React, { useEffect, useState } from "react";
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
    user_id: string;
  };
  buyer?: {
    id: string;
    email: string;
  };
}

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);

      const { data: sessionData } = await supabase.auth.getSession();

      const userId = sessionData?.session?.user?.id;

      if (!userId) {
        console.error("User not authenticated");
        return;
      }

      console.log(userId);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("vendor_id", userId);

      if (error) throw new Error(error.message);

      setOrders((data as Order[]) || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";

      console.error("Error fetching orders:", message);

      setError(`Failed to fetch orders. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  console.log(orders);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Order Page</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              Order ID: {order.id}, Total: ${order.total}, Status:{" "}
              {order.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrderPage;
