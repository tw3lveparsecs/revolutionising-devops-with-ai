import React from "react";
import { User } from "../types/models";
import "./Components.css";

interface UsersListProps {
  title: string;
  data: { message: string; data?: User[] };
}

const UsersList: React.FC<UsersListProps> = ({ title, data }) => {
  // Mock data until real data is available
  const mockUsers: User[] = [
    {
      id: "1",
      name: "Luke Skywalker",
      email: "luke@resistance.org",
      role: "admin",
      joinedDate: "2023-01-15",
    },
    {
      id: "2",
      name: "Leia Organa",
      email: "leia@resistance.org",
      role: "admin",
      joinedDate: "2023-01-16",
    },
    {
      id: "3",
      name: "Han Solo",
      email: "han@millennium-falcon.com",
      role: "user",
      joinedDate: "2023-02-20",
    },
    {
      id: "4",
      name: "Chewbacca",
      email: "chewie@millennium-falcon.com",
      role: "user",
      joinedDate: "2023-02-21",
    },
  ];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="component-container">
      <h2>{title}</h2>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`user-role ${user.role}`}>{user.role}</span>
                </td>
                <td>{formatDate(user.joinedDate)}</td>
                <td>
                  <div className="user-actions">
                    <button className="user-action-button view">View</button>
                    <button className="user-action-button edit">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
