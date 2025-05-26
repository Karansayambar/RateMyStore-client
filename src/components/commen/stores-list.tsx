"use client";

import { useState, useMemo, useEffect } from "react";

import { ArrowUpDown, Search } from "lucide-react";
import { useData } from "../../contexts/data-context";
import { Input } from "../../ui/input";
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

export function StoresList() {
  // const { stores } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [mockStores, setMockStores] = useState([]);
  const [initialStores, setInitialStores] = useState([]);
  const [sortField, setSortField] = useState<
    "name" | "email" | "address" | "rating"
  >("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    // Fetch users from the API
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/store/");
        console.log("Fetched stores:", response.data);
        setMockStores(response.data.stores);
        setInitialStores(response.data.stores);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredAndSortedStores = () => {
    const filtered = initialStores.filter(
      (store: any) =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a: any, b: any) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "rating":
          aValue = a.averageRating;
          bValue = b.averageRating;
          break;
        default:
          aValue = a[sortField].toLowerCase();
          bValue = b[sortField].toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  useEffect(() => {
    // Update mockUsers with filtered and sorted users
    const updatedUsers = filteredAndSortedStores();
    setMockStores(updatedUsers);
  }, [searchTerm, sortField, sortDirection]);

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by name, email, or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
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
                  onClick={() => handleSort("rating")}
                  className="h-auto p-0 font-semibold"
                >
                  Rating
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockStores.map((store: any) => (
              <TableRow key={store.id}>
                <TableCell className="font-medium">{store.name}</TableCell>
                <TableCell>{store.email}</TableCell>
                <TableCell>{store.address}</TableCell>
                <TableCell>
                  <Badge variant="secondary">2⭐4</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
