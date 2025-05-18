import React, { useEffect, useState } from "react";
import "./App.css";
import { collectiblesApi, usersApi, ordersApi } from "./services/api";
import CollectiblesList from "./components/CollectiblesList";
import UsersList from "./components/UsersList";
import OrdersList from "./components/OrdersList";

// Define types for our API responses
interface ApiResponse {
  message: string;
  data?: any;
}

function App() {
  const [collectibles, setCollectibles] = useState<ApiResponse | null>(null);
  const [users, setUsers] = useState<ApiResponse | null>(null);
  const [orders, setOrders] = useState<ApiResponse | null>(null);
  const [activeTab, setActiveTab] = useState<
    "collectibles" | "users" | "orders"
  >("collectibles");

  useEffect(() => {
    // Function to fetch data from all endpoints
    const fetchData = async () => {
      try {
        // Fetch data from all endpoints
        const collectiblesData =
          (await collectiblesApi.getAll()) as ApiResponse;
        const usersData = (await usersApi.getAll()) as ApiResponse;
        const ordersData = (await ordersApi.getAll()) as ApiResponse;

        setCollectibles(collectiblesData);
        setUsers(usersData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Render the component based on the active tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "collectibles":
        return collectibles ? (
          <CollectiblesList
            title="Star Wars Collectibles"
            data={collectibles}
          />
        ) : (
          <p>Loading collectibles...</p>
        );
      case "users":
        return users ? (
          <UsersList title="Users" data={users} />
        ) : (
          <p>Loading users...</p>
        );
      case "orders":
        return orders ? (
          <OrdersList title="Orders" data={orders} />
        ) : (
          <p>Loading orders...</p>
        );
      default:
        return <p>Select a tab to view data</p>;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Star Wars Collectibles Shop</h1>

        <nav className="app-navigation">
          <ul>
            <li>
              <button
                className={activeTab === "collectibles" ? "active" : ""}
                onClick={() => setActiveTab("collectibles")}
              >
                Collectibles
              </button>
            </li>
            <li>
              <button
                className={activeTab === "users" ? "active" : ""}
                onClick={() => setActiveTab("users")}
              >
                Users
              </button>
            </li>
            <li>
              <button
                className={activeTab === "orders" ? "active" : ""}
                onClick={() => setActiveTab("orders")}
              >
                Orders
              </button>
            </li>
          </ul>
        </nav>

        <main className="app-main">{renderActiveComponent()}</main>
      </header>
    </div>
  );
}

export default App;
