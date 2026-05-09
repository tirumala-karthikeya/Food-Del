import React, { useState, useEffect } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error(response.data.message || "Error fetching orders");
      }
    } catch (error) {
      console.error("fetchAllOrders failed:", error);
      toast.error("Could not load orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        toast.success("Status updated");
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || "Could not update status");
      }
    } catch (error) {
      console.error("statusHandler failed:", error);
      toast.error("Could not update status");
    }
  };

  const KNOWN_STATUSES = ["Food Processing", "Out for delivery", "Delivered"];
  const normalizeStatus = (s) =>
    s === "Food Proccessing" ? "Food Processing" : s;

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-item">
              <img src={assets.parcel_icon} alt="" />
              <div>
                <p className="order-item-food">
                  {order.items
                    .map((item) => `${item.name} x ${item.quantity}`)
                    .join(", ")}
                </p>
                <p className="order-item-name">
                  {order.address?.firstName} {order.address?.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address?.street},</p>
                  <p>
                    {order.address?.city}, {order.address?.state},{" "}
                    {order.address?.country}, {order.address?.zipcode}
                  </p>
                </div>
                <p className="order-item-phone">{order.address?.phone}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>${order.amount}</p>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={normalizeStatus(order.status) || KNOWN_STATUSES[0]}
              >
                {KNOWN_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
