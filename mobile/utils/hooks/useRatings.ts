import { useEffect, useState } from "react";
import axios from "axios";
// import { getAverageRatingByHost } from "@/lib/reviews";

type RatingResponse = {
  average: number;
};

const useRatings = (hostId: string) => {
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await axios.get<RatingResponse>(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/reviews/average/${hostId}`);
        setRating(res.data.average);
      } catch (err) {
        console.error("Failed to fetch rating", err);
        setRating(null);
      }
    };

    if (hostId) {
      fetchRating();
    }
  }, [hostId]);

  return rating;
};

export default useRatings;

// export default function useRatings(hostId: string) {
//   const [rating, setRating] = useState<number | null>(null);

//   useEffect(() => {
//     let cancelled = false;

//     const run = async () => {
//       if (!hostId) {
//         setRating(null);
//         return;
//       }
//       try {
//         const avg = await getAverageRatingByHost(hostId); // <-- uses your API fn
//         if (!cancelled) setRating(typeof avg === "number" ? avg : 0);
//       } catch (e) {
//         console.error("useRatings failed:", e);
//         if (!cancelled) setRating(null);
//       }
//     };

//     run();
//     return () => {
//       cancelled = true; // avoid setState after unmount
//     };
//   }, [hostId]);

//   return rating;
// }
