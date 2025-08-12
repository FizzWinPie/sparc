export const getListings = async () => {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/listings`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await res.json();
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
};

export const getListingsByHostId = async (hostId: string) => {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/listings/users/${hostId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await res.json();
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
};

export const createListing = async (listingData: any) => {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/listings/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host_id: listingData.host_id,
          charger_type: listingData.charger_type,
          power_output_kw: listingData.power_output_kw,
          connector_type: listingData.connector_type,
          address: listingData.address,
          latitude: listingData.latitude,
          longitude: listingData.longitude,
          availability_schedule: listingData.availability_schedule,
          price_per_hour: listingData.price_per_hour,
          min_price: listingData.min_price,
          images: listingData.images,
          instructions: listingData.instructions,
          is_active: listingData.is_active,
        }),
      }
    );
    return await res.json();
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
};

export const deleteListing = async (listingId: string) => {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/listings/${listingId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await res.json();
  } catch (error) {
    console.error("Failed to delete listing:", error);
    throw error;
  }
};

export const updateListing = async (listingId: string, updatedData: any) => {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/listings/${listingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to update listing");
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to update listing:", error);
    throw error;
  }
};
