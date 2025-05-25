import { useState } from "react";
import { useToast } from "../../ui/use-toast";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { useData } from "../../contexts/data-context";

export function AddStoreForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { addStore } = useData();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = "Store name must be between 20 and 60 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.address.length > 400) {
      newErrors.address = "Address must not exceed 400 characters";
    }

    if (!formData.ownerId) {
      newErrors.ownerId = "Owner ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      addStore(formData);
      toast({
        title: "Store added successfully",
        description: `${formData.name} has been registered on the platform`,
      });
      setFormData({ name: "", email: "", address: "", ownerId: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while adding the store",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="store-name">Store Name</Label>
        <Input
          id="store-name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          required
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="store-email">Email</Label>
        <Input
          id="store-email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="store-address">Address</Label>
        <Textarea
          id="store-address"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          required
        />
        {errors.address && (
          <p className="text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="owner-id">Owner ID</Label>
        <Input
          id="owner-id"
          type="text"
          value={formData.ownerId}
          onChange={(e) => handleInputChange("ownerId", e.target.value)}
          placeholder="Enter the owner's user ID"
          required
        />
        {errors.ownerId && (
          <p className="text-sm text-red-600">{errors.ownerId}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Adding Store..." : "Add Store"}
      </Button>
    </form>
  );
}
