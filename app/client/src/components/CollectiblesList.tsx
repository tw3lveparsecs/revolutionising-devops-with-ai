import React from "react";
import { Collectible } from "../types/models";
import "./Components.css";

interface CollectiblesListProps {
  title: string;
  data: { message: string; data?: Collectible[] };
}

const CollectiblesList: React.FC<CollectiblesListProps> = ({ title, data }) => {
  // For now, we'll use mock data since the actual API returns just a message
  const mockCollectibles: Collectible[] = [
    {
      id: "1",
      name: "Darth Vader Helmet",
      description: "Authentic replica of Darth Vader's helmet",
      category: "Replicas",
      price: 299.99,
      imageUrl: "/images/darth-vader-helmet.jpg",
      inStock: true,
      rarity: "Rare",
    },
    {
      id: "2",
      name: "Millennium Falcon Model",
      description: "Detailed scale model of the Millennium Falcon",
      category: "Models",
      price: 149.99,
      imageUrl: "/images/millennium-falcon.jpg",
      inStock: true,
      rarity: "Common",
    },
    {
      id: "3",
      name: "Lightsaber - Luke Skywalker",
      description:
        "Replica of Luke Skywalker's lightsaber from Return of the Jedi",
      category: "Weapons",
      price: 199.99,
      imageUrl: "/images/luke-lightsaber.jpg",
      inStock: false,
      rarity: "Uncommon",
    },
    {
      id: "4",
      name: "Stormtrooper Helmet",
      description: "Imperial Stormtrooper helmet with detailed finish",
      category: "Replicas",
      price: 189.99,
      imageUrl: "/images/stormtrooper-helmet.jpg",
      inStock: true,
      rarity: "Common",
    },
    {
      id: "5",
      name: "Grogu (Baby Yoda) Figure",
      description: "Detailed collectible figure of Grogu from The Mandalorian",
      category: "Figures",
      price: 59.99,
      imageUrl: "/images/grogu-figure.jpg",
      inStock: true,
      rarity: "Rare",
    },
    {
      id: "6",
      name: "Mandalorian Helmet",
      description: "High-quality replica of the Mandalorian's beskar helmet",
      category: "Replicas",
      price: 249.99,
      imageUrl: "/images/mandalorian-helmet.jpg",
      inStock: true,
      rarity: "Uncommon",
    },
  ];

  // Default placeholder image from our local images
  const defaultPlaceholder = "/images/millennium-falcon.jpg";

  // Handle image loading errors
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    // Fall back to local placeholder if image fails to load
    target.src = defaultPlaceholder;
  };

  return (
    <div className="component-container">
      <h2>{title}</h2>

      <div className="collectibles-grid">
        {mockCollectibles.map((item) => (
          <div key={item.id} className="collectible-card">
            <div className="collectible-image">
              <img
                src={item.imageUrl}
                alt={item.name}
                onError={handleImageError}
              />
              {!item.inStock && (
                <span className="out-of-stock-badge">Out of Stock</span>
              )}
            </div>
            <div className="collectible-info">
              <h3>{item.name}</h3>
              <p className="collectible-description">{item.description}</p>
              <div className="collectible-meta">
                <span className="collectible-category">{item.category}</span>
                <span
                  className={`collectible-rarity ${item.rarity?.toLowerCase()}`}
                >
                  {item.rarity}
                </span>
              </div>
              <div className="collectible-price-row">
                <span className="collectible-price">
                  ${item.price.toFixed(2)}
                </span>
                <button className="collectible-button" disabled={!item.inStock}>
                  {item.inStock ? "Add to Cart" : "Sold Out"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectiblesList;
