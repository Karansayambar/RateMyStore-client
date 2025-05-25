"use client";

import { useState, useMemo } from "react";

import { Search, Star } from "lucide-react";
import { RatingDialog } from "./rating-dialog";
import { useData } from "../../contexts/data-context";
import { useAuth } from "../../contexts/auth-context";
import { Input } from "../../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";

export function StoresListUser() {
  const { stores } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const filteredStores = useMemo(() => {
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stores, searchTerm]);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search stores by name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            userId={user?.id || ""}
            onRateClick={() => setSelectedStore(store.id)}
          />
        ))}
      </div>

      {selectedStore && (
        <RatingDialog
          storeId={selectedStore}
          userId={user?.id || ""}
          onClose={() => setSelectedStore(null)}
        />
      )}
    </div>
  );
}

interface StoreCardProps {
  store: any;
  userId: string;
  onRateClick: () => void;
}

function StoreCard({ store, userId, onRateClick }: StoreCardProps) {
  const { getUserRatingForStore } = useData();
  const userRating = getUserRatingForStore(userId, store.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{store.name}</CardTitle>
        <CardDescription>{store.address}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">
              {store.averageRating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">
              ({store.totalRatings} reviews)
            </span>
          </div>
        </div>

        {userRating && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Your rating:</span>
            <Badge variant="outline">{userRating.rating} ⭐</Badge>
          </div>
        )}

        <Button
          onClick={onRateClick}
          className="w-full"
          variant={userRating ? "outline" : "default"}
        >
          {userRating ? "Update Rating" : "Rate Store"}
        </Button>
      </CardContent>
    </Card>
  );
}
