import React, { useContext, useState, useEffect } from 'react';
import './Myorders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { url, token } = useContext(StoreContext);

  const fetchOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data?.success && Array.isArray(response.data.data)) {
        setData(response.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
    else setLoading(false);
  }, [token]);

  if (loading) {
    return (
      <div className='my-orders'>
        <h2>My Orders</h2>
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          data.map((order) => (
            <div key={order._id} className="my-orders-order">
              <img src={assets.parcel_icon} alt="Parcel icon" />
              <p>
                {order.items
                  .map((item) => `${item.name} x ${item.quantity}`)
                  .join(", ")}
              </p>
              <p>${order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p>
                <span>&#x25cf;</span>{" "}
                <b>{order.status === "Food Proccessing" ? "Food Processing" : order.status}</b>
              </p>
              <button onClick={fetchOrders}>Track Order</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
