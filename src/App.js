import axios from "./utils/axios";
import React, {useState, useEffect} from 'react';

import AssetItem from './components/AssetItem/AssetItem';


function App() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false)

  const loadAssets = async () => {
    try {
      setLoading(true)
      const all_assets = (await axios.get('/assets',)).data
      setAssets(all_assets.result.filter(item => !item.fiat));
      setLoading(false)
    } catch(e) {
      alert("An unexpected error has occured!");
      setLoading(false)
    }
  };

  useEffect(() => {
    loadAssets()
  }, [])

  if(loading) {
    return (
      <div className="loading"></div>
    )

  }

  return (
    <div className="bg-gray-800 container justify-center mx-auto p-2 flex flex-row flex-wrap">
      {assets.map(asset => <AssetItem asset={asset} key={asset.symbol}/>)}
    </div>
  );
}

export default App;
