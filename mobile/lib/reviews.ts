export const createReview = async (
  host_id: string,
  ev_owner_id: string,
  rating: number,
  comment: string
) => {
  try {
    // Validate required fields
    if (!host_id || !ev_owner_id || !rating) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send POST request to backend
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ host_id, ev_owner_id, rating, comment }),
      }
    );

    // Return parsed JSON
    return await res.json();
  } catch (err) {
    console.error("Failed to create review:", err);
    throw err;
  }
};

export const getReviewsByHost = async (hostId: string) => {
  try {
    // Validate required field
    if (!hostId) {
      return Response.json(
        { error: "Missing required hostId" },
        { status: 400 }
      );
    }

    // Send GET request to backend
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/reviews/${hostId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Return parsed JSON
    return await res.json();
  } catch (err) {
    console.error(`Failed to get reviews for host ${hostId}:`, err);
    throw err;
  }
};

export const getAverageRatingByHost = async (hostId: string) => {
  try {
    // Validate required field
    if (!hostId) {
      return Response.json(
        { error: "Missing required hostId" },
        { status: 400 }
      );
    }

    // Send GET request to backend
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/reviews/average/${hostId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Parse and return the average rating (default to 0 if not found)
    const data = await res.json();
    return data?.average ?? 0;
  } catch (err) {
    console.error(`Failed to get average rating for host ${hostId}:`, err);
    throw err;
  }
};

export const deleteReviewById = async (reviewId: string) => {
  try {
    if (!reviewId) {
      return Response.json(
        { error: "Missing required reviewId" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return await res.json();
  } catch (err) {
    console.error("Failed to delete review:", err);
    throw err;
  }
};

