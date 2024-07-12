import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('https://liclxnvmxb.kairaaexchange.com');

const App = () => {
  const [data, setData] = useState(null);
  const [socketData, setSocketData] = useState(null); // State for WebSocket data
  const [activeTab, setActiveTab] = useState('inr');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch initial data from REST API
    const fetchData = async () => {
      try {
        const response = await axios.get("https://demoback.kairaaexchange.com/api/v1/pair-list");
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Socket event listeners
    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socket.on('marketData', (marketData) => {
      console.log('Received market data:', marketData);
      setSocketData(marketData); // Update state with incoming socket data
    });

    return () => {
      // Clean up socket connection on component unmount
      socket.disconnect();
    };
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  const filteredData = data.data.filter(item =>
    item.secondcurrency.toLowerCase() === activeTab &&
    (item.firstcurrency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.secondcurrency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pair_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.pair_name.toLowerCase() === item.firstcurrency.toLowerCase())
    )
  );

  return (
    <div className='mt-20 w-[80%] m-auto'>
      <h1 className='text-center text-5xl mb-9 font-bold' style={{ fontFamily: "Nunito, sans-serif" }}>Data</h1>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search by currency or pair name..."
          value={searchTerm}
          onChange={handleSearchChange}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Second Currency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pair Name (WebSocket)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((e, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={e.logo} alt={e.name} className='w-12 h-12 object-cover' />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{e.lastprice}</td>
                <td className="px-6 py-4 whitespace-nowrap">{e.firstcurrency}</td>
                <td className="px-6 py-4 whitespace-nowrap">{e.secondcurrency.toUpperCase()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{socketData && socketData.pair_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
