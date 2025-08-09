import React from "react";
import { View, ViewStyle, StyleProp, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StarsProps {
    rating: number | null; // rating can be null if no data
    size?: number;         // optional size of stars
    color?: string; // optional color for stars
    emptyColor?: string; // optional color for empty stars
    style?: StyleProp<ViewStyle>; // optional style for the container
    onPress?: () => void; // optional onPress handler
}

const Stars: React.FC<StarsProps> = ({ 
    rating, 
    size = 12,
    color = "gold",
    emptyColor = "grey",
    style,
    onPress,
 }) => {
    // render nothing if rating is null
    if (rating === null) return null;
    
    // count # of full stars, half stars, and empty stars
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    const content = (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, index) => (
        <Ionicons key={`full-${index}`} name="star" size={size} color={color} />
      ))}

      {/* Half star */}
      {halfStar && (
        <View key="half" style={{ width: size, height: size, position: "relative" }}>
          {/* Grey star background */}
          <Ionicons name="star" size={size} color={emptyColor} style={{ position: "absolute", left: 0, top: 0 }}/>
          {/* Gold half to the left half */}
          <View style={{ position: "absolute", left: 0, top: 0, width: size / 2, height: size, overflow: "hidden" }}>
            <Ionicons name="star" size={size} color={color} />
          </View>
        </View>
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <Ionicons key={`empty-${index}`} name="star" size={size} color={emptyColor} />
      ))}
    </View>
    );

    return onPress ? (
        <TouchableOpacity onPress={onPress} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            {content}
        </TouchableOpacity>
    ) : (
        content
    );
    
//     return (
//     <View style={{ flexDirection: "row", alignItems: "center" }}>
//       {/* Full stars */}
//       {Array.from({ length: fullStars }).map((_, index) => (
//         <Ionicons key={`full-${index}`} name="star" size={size} color={color} />
//       ))}

//       {/* Half star */}
//       {halfStar && (
//         <View key="half" style={{ width: size, height: size, position: "relative" }}>
//           {/* Grey star background */}
//           <Ionicons name="star" size={size} color={emptyColor} style={{ position: "absolute", left: 0, top: 0 }}/>
//           {/* Gold half to the left half */}
//           <View style={{ position: "absolute", left: 0, top: 0, width: size / 2, height: size, overflow: "hidden" }}>
//             <Ionicons name="star" size={size} color={color} />
//           </View>
//         </View>
//       )}

//       {/* Empty stars */}
//       {Array.from({ length: emptyStars }).map((_, index) => (
//         <Ionicons key={`empty-${index}`} name="star" size={size} color={emptyColor} />
//       ))}
//     </View>
//   );
};

export default Stars;
