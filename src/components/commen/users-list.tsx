"use client";

import { useState, useMemo, useEffect } from "react";

import { ArrowUpDown, Search } from "lucide-react";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import axiosInstance from "../../utils/common.utils";
import { se } from "date-fns/locale";

// Mock users data for admin view
const mockUsers1 = [
  {
    id: "1",
    name: "System Administrator User",
    email: "admin@example.com",
    address: "123 Admin Street, Admin City, AC 12345",
    role: "admin",
  },
  {
    id: "2",
    name: "John Doe Regular Customer",
    email: "john@example.com",
    address: "456 User Avenue, User City, UC 67890",
    role: "user",
  },
  {
    id: "3",
    name: "Jane Smith Store Manager",
    email: "jane@store1.com",
    address: "789 Store Boulevard, Store City, SC 11111",
    role: "owner",
  },
  {
    id: "4",
    name: "Bob Wilson Coffee Shop Owner",
    email: "bob@store2.com",
    address: "321 Coffee Lane, Coffee City, CC 22222",
    role: "owner",
  },
];

export function UsersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [mockUsers, setMockUsers] = useState([]);
  const [initialUsers, setInitialUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<
    "name" | "email" | "address" | "role"
  >("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    // Fetch users from the API
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/user/all-users");
        console.log("Fetched users:", response.data);
        setMockUsers(response.data.users);
        setInitialUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  },[]);

  const filteredAndSortedUsers = () => {
    const filtered = initialUsers.filter((user: any) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      console.log(
        `User: ${user.name}, Matches Search: ${matchesSearch}, Matches Role: ${matchesRole}`)

      return matchesSearch && matchesRole;
    });

    console.log("Filtered users:", filtered);

    filtered.sort((a: any, b: any) => {
      let aValue: string;
      let bValue: string;

      aValue = a[sortField].toLowerCase();
      bValue = b[sortField].toLowerCase();

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });


    return filtered;
  };

  useEffect(() => {
    // Update mockUsers with filtered and sorted users
    const updatedUsers = filteredAndSortedUsers();
    console.log("Updated mockUsers:", roleFilter);
    setMockUsers(updatedUsers);
  }, [searchTerm, roleFilter, sortField, sortDirection]);

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "STORE_OWNER":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="NORMAL_USER">User</SelectItem>
            <SelectItem value="STORE_OWNER">Store Owner</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="h-auto p-0 font-semibold"
                >
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("email")}
                  className="h-auto p-0 font-semibold"
                >
                  Email
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("address")}
                  className="h-auto p-0 font-semibold"
                >
                  Address
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("role")}
                  className="h-auto p-0 font-semibold"
                >
                  Role
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers?.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role === "ADMIN"
                      ? "Administrator"
                      : user.role === "STORE_OWNER"
                      ? "Store Owner"
                      : "User"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
