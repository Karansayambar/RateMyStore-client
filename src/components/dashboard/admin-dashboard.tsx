"use client";

import { useEffect, useState } from "react";

import { LogOut, Users, Store, Star } from "lucide-react";
import { useAuth } from "../../contexts/auth-context";
import { Button } from "../../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { AddStoreForm } from "../forms/add-store-form";
import { AddUserForm } from "../forms/add-user-form";
import { StoresList } from "../commen/stores-list";
import { UsersList } from "../commen/users-list";
import axiosInstance from "../../utils/common.utils";
export function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [commonData, setCommonData] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  useEffect(() => {
    axiosInstance
      .get("/api/store/common-length")
      .then((response) => {
        // Assuming response.data contains the ratings
        // You can update your state or context with the fetched ratings if needed
        console.log("Fetched ratings:", response.data);
        setCommonData({
          totalUsers: response.data.userCount,
          totalStores: response.data.storeCount,
          totalRatings: response.data.ratingCount,
        });
      })
      .catch((error) => {
        console.error("Error fetching ratings:", error);
      });
  }, []);

  // Mock data for total users (including the dummy users)


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <Button onClick={logout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="stores">Stores</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="add-store">Add Store</TabsTrigger>
            <TabsTrigger value="add-user">Add User</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users  className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{commonData.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered users on platform
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Stores
                  </CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{commonData.totalStores}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered stores
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Ratings
                  </CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{commonData.totalRatings}</div>
                  <p className="text-xs text-muted-foreground">
                    Submitted ratings
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stores">
            <Card>
              <CardHeader>
                <CardTitle>Stores Management</CardTitle>
                <CardDescription>
                  View and manage all registered stores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StoresList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
                <CardDescription>
                  View and manage all registered users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UsersList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-store">
            <Card>
              <CardHeader>
                <CardTitle>Add New Store</CardTitle>
                <CardDescription>
                  Register a new store on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddStoreForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-user">
            <Card>
              <CardHeader>
                <CardTitle>Add New User</CardTitle>
                <CardDescription>Create a new user account</CardDescription>
              </CardHeader>
              <CardContent>
                <AddUserForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
