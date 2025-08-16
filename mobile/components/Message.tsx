import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Colors from "@/constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import { FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const socket = io(`${process.env.EXPO_PUBLIC_JOHN_BACKEND_IP}`, {
  transports: ["websocket"],
  autoConnect: true,
});

type MessageProps = {
  conversationId: string;
};

type MessageType = {
  _id: string;
  sender: string;
  text: string;
  createdAt?: string;
};

const Message = ({ conversationId }: MessageProps) => {
  const { user } = useUser();
  const userId = user?.id;
  console.log(userId)
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [text, setText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Socket connection handlers
    socket.on("connect", () => console.log("Connected to socket"));
    socket.on("disconnect", () => console.log("Disconnected from socket"));
    socket.on("connect_error", (err) => console.log("Connection error:", err));

    socket.emit("joinRoom", conversationId);

    const handleNewMessage = (message: MessageType) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    };

    socket.on("newMessage", handleNewMessage);

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_JOHN_BACKEND_IP}/api/conversations/${conversationId}/messages`
        );
        const data = await response.json();
        setMessages(data);
        setTimeout(scrollToBottom, 100);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.emit("leaveRoom", conversationId);
    };
  }, [conversationId]);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const sendMessage = () => {
    if (text.trim()) {
      socket.emit(
        "sendMessage",
        {
          conversationId,
          sender: userId,
          text,
        },
        (acknowledgement: any) => {
          if (acknowledgement?.error) {
            console.error("Message send error:", acknowledgement.error);
          }
        }
      );
      setText("");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, marginBottom: 80 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <View style={{ flex: 1, padding: 16 }}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              style={{
                alignSelf: item.sender === userId ? "flex-end" : "flex-start",
                marginVertical: 4,
                maxWidth: "80%",
              }}
            >
              <View
                style={{
                  backgroundColor:
                    item.sender === userId
                      ? Colors.accent
                      : Colors.blueVariations.vistaBlue,
                  padding: 12,
                  borderRadius: 12,
                  borderBottomRightRadius: item.sender === userId ? 0 : 12,
                  borderBottomLeftRadius: item.sender === userId ? 12 : 0,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                  }}
                >
                  {item.text}
                </Text>
                {item.createdAt && (
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 10,
                      alignSelf: "flex-end",
                      marginTop: 4,
                    }}
                  >
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                )}
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
          onContentSizeChange={() => scrollToBottom()}
          onLayout={() => scrollToBottom()}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingTop: 8,
            paddingBottom: Platform.OS === "ios" ? 20 : 8,
            borderTopWidth: 1,
            borderTopColor: "#e1e1e1", // Light gray border
            backgroundColor: "white", // White background for the bar
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor="#9e9e9e" // Medium gray placeholder
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#e1e1e1", // Light gray border
              padding: 12,
              marginRight: 8,
              borderRadius: 24,
              backgroundColor: "white", // White input background
              color: "#1a1a1a", // Dark text color
              minHeight: 48,
              maxHeight: 120,
            }}
            multiline
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={{
              backgroundColor: Colors.accent,
              width: 48,
              height: 48,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
            disabled={!text.trim()}
          >
            <Ionicons name="send-sharp" size={18} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Message;
