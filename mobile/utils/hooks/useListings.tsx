import { useEffect, useState } from "react";
import { Listing } from "@/types";
import { getListings } from "@/lib/listing";

const useListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
    fetchListings();
  }, []);

  return { listings };
};

export default useListings;
