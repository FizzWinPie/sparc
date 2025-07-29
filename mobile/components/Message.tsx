import { View, Text, TextInput, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { FlatList } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';

export const socket = io("http://192.168.1.108:8000", {
  transports: ["websocket"],
});

type MessageProps = {
  conversationId: string;
  userId: string;
};

type MessageType = {
  _id: string;
  sender: string;
  text: string;
};

const Message = ({ conversationId, userId }: MessageProps) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.emit("joinRoom", conversationId);

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    fetch(`http://192.168.1.108:8000/conversations/${conversationId}/messages`)
      .then((res) => res.json())
      .then(setMessages);

    return () => {
      socket.off("newMessage");
    };
  }, [conversationId]);

  const sendMessage = () => {
    if (text.trim()) {
      socket.emit("sendMessage", {
        conversationId,
        sender: userId,
        text,
      });
      setText("");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Text
            style={{
              fontWeight: item.sender === userId ? "bold" : "normal",
              alignSelf: item.sender === userId ? "flex-end" : "flex-start",
              backgroundColor: item.sender === userId ? Colors.blueVariations.vistaBlue : "#FFF",
              padding: 10,
              marginVertical: 2,
              borderRadius: 5,
              maxWidth: "70%",
              color: "white"
            }}
          >
            {item.text}
          </Text>
        )}
      />

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type a message"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginVertical: 10,
          borderRadius: 5,
        }}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

export default Message;
