import React from "react";
import { Order } from "../types/models";
import "./Components.css";

interface OrdersListProps {
  title: string;
  data: { message: string; data?: Order[] };
}

const OrdersList: React.FC<OrdersListProps> = ({ title, data }) => {
  // Mock data until real data is available
  const mockOrders: Order[] = [
    {
      id: "1001",
      userId: "3",
      userName: "Han Solo",
      items: [
        {
          collectibleId: "1",
          collectibleName: "Darth Vader Helmet",
          quantity: 1,
          pricePerItem: 299.99,
        },
      ],
      totalPrice: 299.99,
      status: "delivered",
      orderDate: "2025-03-15T12:30:45Z",
    },
    {
      id: "1002",
      userId: "1",
      userName: "Luke Skywalker",
      items: [
        {
          collectibleId: "3",
          collectibleName: "Lightsaber - Luke Skywalker",
          quantity: 1,
          pricePerItem: 199.99,
        },
        {
          collectibleId: "2",
          collectibleName: "Millennium Falcon Model",
          quantity: 1,
          pricePerItem: 149.99,
        },
      ],
      totalPrice: 349.98,
      status: "processing",
      orderDate: "2025-04-22T09:15:22Z",
    },
    {
      id: "1003",
      userId: "4",
      userName: "Chewbacca",
      items: [
        {
          collectibleId: "2",
          collectibleName: "Millennium Falcon Model",
          quantity: 2,
          pricePerItem: 149.99,
        },
      ],
      totalPrice: 299.98,
      status: "pending",
      orderDate: "2025-04-25T17:45:10Z",
    },
  ];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "processing":
        return "status-processing";
      case "shipped":
        return "status-shipped";
      case "delivered":
        return "status-delivered";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  return (
    <div className="component-container">
      <h2>{title}</h2>

      <div className="orders-list">
        {mockOrders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-id">Order #{order.id}</div>
              <div className={`order-status ${getStatusClass(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>

            <div className="order-date">
              Placed on: {formatDate(order.orderDate)}
            </div>

            <div className="order-customer">Customer: {order.userName}</div>

            <div className="order-items">
              <h4>Items</h4>
              <table className="order-items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.collectibleName}</td>
                      <td>{item.quantity}</td>
                      <td>${item.pricePerItem.toFixed(2)}</td>
                      <td>${(item.quantity * item.pricePerItem).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="total-label">
                      Total:
                    </td>
                    <td className="order-total">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="order-actions">
              <button className="order-action-button view">View Details</button>
              {order.status === "pending" && (
                <button className="order-action-button cancel">
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersList;
