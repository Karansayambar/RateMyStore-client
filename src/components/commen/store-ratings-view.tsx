"use client";

import { useMemo } from "react";

import { Star } from "lucide-react";
import { useData } from "../../contexts/data-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Badge } from "../../ui/badge";

interface StoreRatingsViewProps {
  storeId: string;
}

// Mock user data for displaying user names
const mockUsers = [
  { id: "2", name: "John Doe Regular Customer" },
  { id: "5", name: "Alice Johnson Happy Shopper" },
  { id: "6", name: "Mike Brown Frequent Visitor" },
];

export function StoreRatingsView({ storeId }: StoreRatingsViewProps) {
  const { ratings } = useData();

  const storeRatings = useMemo(() => {
    return ratings
      .filter((rating) => rating.storeId === storeId)
      .map((rating) => ({
        ...rating,
        userName:
          mockUsers.find((user) => user.id === rating.userId)?.name ||
          "Unknown User",
      }))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [ratings, storeId]);

  if (storeRatings.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No ratings submitted yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storeRatings.map((rating) => (
              <TableRow key={rating.id}>
                <TableCell className="font-medium">{rating.userName}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{rating.rating} ⭐</Badge>
                </TableCell>
                <TableCell>
                  {new Date(rating.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
