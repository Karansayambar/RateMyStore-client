"use client";

import { useState, useEffect } from "react";
import { useToast } from "../../ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Star } from "lucide-react";
import { Button } from "../../ui/button";
import { useData } from "../../contexts/data-context";

interface RatingDialogProps {
  storeId: string;
  userId: string;
  onClose: () => void;
}

export function RatingDialog({ storeId, userId, onClose }: RatingDialogProps) {
  const { stores, getUserRatingForStore, addRating, updateRating } = useData();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const store = stores.find((s) => s.id === storeId);
  const existingRating = getUserRatingForStore(userId, storeId);

  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.rating);
    }
  }, [existingRating]);

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "You must select a rating between 1 and 5 stars",
        variant: "destructive",
      });
      return;
    }

    if (existingRating) {
      updateRating(existingRating.id, rating);
      toast({
        title: "Rating updated",
        description: `Your rating for ${store?.name} has been updated to ${rating} stars`,
      });
    } else {
      addRating({ userId, storeId, rating });
      toast({
        title: "Rating submitted",
        description: `Thank you for rating ${store?.name} with ${rating} stars`,
      });
    }

    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {existingRating ? "Update Rating" : "Rate Store"}
          </DialogTitle>
          <DialogDescription>
            {existingRating
              ? `Update your rating for ${store?.name}`
              : `How would you rate ${store?.name}?`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-6">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-colors"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {existingRating ? "Update Rating" : "Submit Rating"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
