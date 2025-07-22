import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { fetchNotifications, markNotificationRead } from '@/lib/notifications';

type Notification = {
    _id: string;
    message: string;
    read: boolean;
    createdAt: string;
  };

export default function Notifications() {
  const { user } = useUser();
  const [data, setData] = useState<Notification[]>([]);

  const load = async () => {
    const notes = await fetchNotifications(user!.id);
    setData(notes);
  };

  useEffect(() => { load(); }, []);

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={async () => {
        await markNotificationRead(item._id);
        load();
      }}
      style={{ padding: 16, backgroundColor: item.read ? '#fff' : '#e8f7ff' }}
    >
      <Text>{item.message}</Text>
      <Text style={{ fontSize: 12, color: '#888' }}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={n => n._id}
      renderItem={renderItem}
      onRefresh={load}
      refreshing={false}
    />
  );
}
