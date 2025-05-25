"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface Store {
  id: string
  name: string
  email: string
  address: string
  ownerId: string
  averageRating: number
  totalRatings: number
}

export interface Rating {
  id: string
  userId: string
  storeId: string
  rating: number
  createdAt: string
}

interface DataContextType {
  stores: Store[]
  ratings: Rating[]
  addStore: (store: Omit<Store, "id" | "averageRating" | "totalRatings">) => void
  addRating: (rating: Omit<Rating, "id" | "createdAt">) => void
  updateRating: (ratingId: string, newRating: number) => void
  getUserRatingForStore: (userId: string, storeId: string) => Rating | undefined
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Dummy stores data
const dummyStores: Store[] = [
  {
    id: "1",
    name: "Tech Electronics Superstore",
    email: "contact@techelectronics.com",
    address: "789 Store Boulevard, Store City, SC 11111",
    ownerId: "3",
    averageRating: 4.2,
    totalRatings: 15,
  },
  {
    id: "2",
    name: "Coffee Bean Paradise Cafe",
    email: "hello@coffeebean.com",
    address: "321 Coffee Lane, Coffee City, CC 22222",
    ownerId: "4",
    averageRating: 4.7,
    totalRatings: 23,
  },
  {
    id: "3",
    name: "Fashion Forward Boutique",
    email: "info@fashionforward.com",
    address: "555 Fashion Street, Fashion District, FD 33333",
    ownerId: "5",
    averageRating: 3.8,
    totalRatings: 12,
  },
  {
    id: "4",
    name: "Healthy Grocery Market",
    email: "support@healthygrocery.com",
    address: "777 Health Avenue, Wellness City, WC 44444",
    ownerId: "6",
    averageRating: 4.5,
    totalRatings: 31,
  },
]

// Dummy ratings data
const dummyRatings: Rating[] = [
  {
    id: "1",
    userId: "2",
    storeId: "1",
    rating: 4,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    userId: "2",
    storeId: "2",
    rating: 5,
    createdAt: "2024-01-16T14:20:00Z",
  },
]

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [stores, setStores] = useState<Store[]>(dummyStores)
  const [ratings, setRatings] = useState<Rating[]>(dummyRatings)

  const addStore = (storeData: Omit<Store, "id" | "averageRating" | "totalRatings">) => {
    const newStore: Store = {
      ...storeData,
      id: Date.now().toString(),
      averageRating: 0,
      totalRatings: 0,
    }
    setStores((prev) => [...prev, newStore])
  }

  const addRating = (ratingData: Omit<Rating, "id" | "createdAt">) => {
    const newRating: Rating = {
      ...ratingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    setRatings((prev) => [...prev, newRating])

    // Update store's average rating
    setStores((prev) =>
      prev.map((store) => {
        if (store.id === ratingData.storeId) {
          const storeRatings = [...ratings.filter((r) => r.storeId === store.id), newRating]
          const averageRating = storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length
          return {
            ...store,
            averageRating: Math.round(averageRating * 10) / 10,
            totalRatings: storeRatings.length,
          }
        }
        return store
      }),
    )
  }

  const updateRating = (ratingId: string, newRating: number) => {
    setRatings((prev) => prev.map((rating) => (rating.id === ratingId ? { ...rating, rating: newRating } : rating)))

    // Update store's average rating
    const updatedRating = ratings.find((r) => r.id === ratingId)
    if (updatedRating) {
      setStores((prev) =>
        prev.map((store) => {
          if (store.id === updatedRating.storeId) {
            const storeRatings = ratings
              .map((r) => (r.id === ratingId ? { ...r, rating: newRating } : r))
              .filter((r) => r.storeId === store.id)
            const averageRating = storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length
            return {
              ...store,
              averageRating: Math.round(averageRating * 10) / 10,
            }
          }
          return store
        }),
      )
    }
  }

  const getUserRatingForStore = (userId: string, storeId: string): Rating | undefined => {
    return ratings.find((r) => r.userId === userId && r.storeId === storeId)
  }

  return (
    <DataContext.Provider
      value={{
        stores,
        ratings,
        addStore,
        addRating,
        updateRating,
        getUserRatingForStore,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
