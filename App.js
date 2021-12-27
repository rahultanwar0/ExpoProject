import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View,Image } from 'react-native';
import { fakeServer } from './fakeServer';

const renderItem = ({ item }) => {
  return (

    <View>
       <Image
          source={require('./assets/favicon.png')}
          style={{hight:50, width: 50}}
        />

        <Text
      style={{
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        padding: 15,
        borderBottomColor: 'red',
        borderBottomWidth: 2,
      }}
    >
      {item}
    </Text>
    </View>
  
  );
};

let stopFetchMore = true;

const ListFooterComponent = () => (
  <Text
    style={{
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 5,
    }}
  >
    Loading...
  </Text>
);

export default function App() {
  const [data, setData] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchData = async () => {
    const response = await fakeServer(20);
    setData([...response]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOnEndReached = async () => {
    setLoadingMore(true);
    if (!stopFetchMore) {
      const response = await fakeServer(20);
      if (response === 'done') return setLoadingMore(false);
      setData([...data, ...response]);
      stopFetchMore = true;
    }
    setLoadingMore(false);
  };

  return (
    <FlatList
      data={data}
      keyExtractor={item => item}
      renderItem={renderItem}
      onEndReached={handleOnEndReached}
      onEndReachedThreshold={0.5}
      onScrollBeginDrag={() => {
        stopFetchMore = false;
      }}
      ListFooterComponent={() => loadingMore && <ListFooterComponent />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});