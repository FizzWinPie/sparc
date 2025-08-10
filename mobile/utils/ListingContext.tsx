import React, { createContext, useContext, useEffect, useState } from "react";
import { Listing } from "@/types";
import { getListings } from "@/lib/listing";

interface ListingsContextType {
  listings: Listing[];
  refreshListings: () => Promise<void>;
  loading: boolean;
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export const ListingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshListings = async () => {
    try {
      setLoading(true);
      const data = await getListings();
      setListings(data);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshListings();
  }, []);

  return (
    <ListingsContext.Provider value={{ listings, refreshListings, loading }}>
      {children}
    </ListingsContext.Provider>
  );
};

export const useListings = () => {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error("useListings must be used within a ListingsProvider");
  }
  return context;
};