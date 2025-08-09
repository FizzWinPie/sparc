import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Stars from "@/components/Stars"; 
import { 
  getAverageRatingByHost, 
  getReviewsByHost, 
  createReview, 
  deleteReviewById 
} from "@/lib/reviews"; 
import Colors from "@/constants/Colors";

export default function ReviewsScreen() {
  const { hostId } = useLocalSearchParams<{ hostId: string }>();
  
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState<number>(5);

  // Fetch data on load
  useEffect(() => {
    if (hostId) {
      fetchData();
    }
  }, [hostId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const avg = await getAverageRatingByHost(hostId);
      setAverageRating(avg);

      const revs = await getReviewsByHost(hostId);
      setReviews(revs);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async () => {
    try {
      if (!newComment.trim()) {
        Alert.alert("Error", "Please enter a comment");
        return;
      }
      await createReview(
        hostId,
        "user_30sj8M9oiz7ZZkjR3Hb5PA4mXWU", // replace with logged-in user ID
        newRating,
        newComment
      );
      setNewComment("");
      fetchData(); // refresh reviews
    } catch (err) {
      console.error("Error creating review:", err);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await deleteReviewById(id);
      fetchData(); // refresh
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Host Reviews</Text>
      <Stars rating={averageRating} size={16} />
      <Text style={styles.avgText}>{averageRating.toFixed(1)} / 5</Text>

      {/* Review List */}
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.reviewItem}>
              <Stars rating={item.rating} size={14} />
              <Text style={styles.comment}>{item.comment}</Text>
              <TouchableOpacity onPress={() => handleDeleteReview(item._id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Add Review */}
      <View style={styles.addReview}>
        <TextInput
          style={styles.input}
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Write your review..."
        />
        <TouchableOpacity style={styles.button} onPress={handleCreateReview}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 💅 Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  avgText: { fontSize: 14, color: Colors.secondary, marginBottom: 12 },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
  },
  comment: { fontSize: 14, marginVertical: 4 },
  deleteText: { color: "red", fontSize: 12 },
  addReview: { flexDirection: "row", marginTop: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", padding: 8, borderRadius: 6 },
  button: { backgroundColor: Colors.accent, paddingHorizontal: 12, justifyContent: "center", borderRadius: 6, marginLeft: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
