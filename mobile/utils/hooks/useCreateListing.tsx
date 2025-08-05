import { useState } from "react";
import { createListing } from "@/lib/listing";
import { useUser } from "@clerk/clerk-expo";
import { ListingFormData } from "@/types";

const useCreateListing = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const createNewListing = async (listingData: ListingFormData) => {
    if (!user) return;

    try {
      setLoading(true);
      const newListing = await createListing({
        host_id: user.id,
        charger_type: listingData.chargerType,
        power_output_kw: listingData.powerOutput,
        connector_type: listingData.connectorType,
        address: listingData.address,
        latitude: listingData.latitude ?? 40.7831,
        longitude: listingData.longitude ?? -73.9712,
        availability_schedule: listingData.availabilitySchedule,
        price_per_hour: listingData.pricePerHour,
        min_price: listingData.minPrice,
        images: listingData.images,
        instructions: listingData.instructions,
        is_active: true,
      });
      return newListing;
    } catch (error) {
      console.error("Listing creation failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createNewListing,
    loading,
  };
};

export default useCreateListing;
