import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const WebSocketComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Replace with your WebSocket server endpoint
    const socket = io('https://liclxnvmxb.kairaaexchange.com');

    // Listen for incoming messages
    socket.on('market-price-data', (message) => {
      console.log('Received message:', message);
      setData(message);
    });

    // Clean up on unmount
    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h1>WebSocket Data</h1>
      {data && (
        <div>
          <p>Last Price: {data.lastprice}</p>
          <p>Market Price: {data.marketprice}</p>
          <p>High: {data.high}</p>
          <p>Low: {data.low}</p>
          <p>Volume: {data.volume}</p>
          <p>Pair Name: {data.pair_name}</p>
          <p>First Currency: {data.firstcurrency}</p>
          <p>Second Currency: {data.secondcurrency}</p>
        </div>
      )}
    </div>
  );
};

export default WebSocketComponent;
