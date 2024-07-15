import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const App = () => {
  const [activeTab, setActiveTab] = useState('inr');
  const [searchTerm, setSearchTerm] = useState('');
  const [apiData, setApiData] = useState(null);
  const [lastPriceData, setLastPriceData] = useState({}); // State for storing last received lastprice

  // Fetch initial data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://demoback.kairaaexchange.com/api/v1/pair-list");
        setApiData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const socket = io('wss://liclxnvmxb.kairaaexchange.com');

    socket.on('market-price-data', (message) => {
      console.log('Received message:', message);

      // Update lastPriceData only if lastprice changes
      if (message.lastprice && message.pair_name) {
        setLastPriceData(prevData => ({
          ...prevData,
          [message.pair_name]: message.lastprice
        }));
      }
    });

    // Clean up WebSocket connection
    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle tab click event
  const handleTabClick = (tab) => {
    setActiveTab(tab); // Set active currency tab
    setSearchTerm(''); // Clear search term
  };

  if (!apiData) {
    return <div>Loading...</div>; // Render loading message until API data is fetched
  }

  // Filter data based on activeTab and searchTerm
  const filteredData = apiData.data.filter(item =>
    item.secondcurrency.toLowerCase() === activeTab &&
    (item.firstcurrency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.secondcurrency.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-[40%]">
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search by currency..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg mr-2"
        />
        <select
          value={activeTab}
          onChange={(e) => handleTabClick(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="inr">INR</option>
          <option value="usdt">USDT</option>
          <option value="kait">KAIT</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Currency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pair Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Second Currency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={item.logo} alt={item.name} className="w-12 h-12 object-cover" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {lastPriceData[item.pair] || item.lastprice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.firstcurrency}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.pair}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.secondcurrency.toUpperCase()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
