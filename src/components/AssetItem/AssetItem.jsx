import React, {useState, useEffect, useRef} from 'react'
import axios from '../../utils/axios'
import { AnimatePresence } from 'framer-motion';
import Modal from '../Modal/modal';

function AssetPrice(props) {
  const {exchange, pair} = props;
  const [price, setPrice] = useState()
  const timerRef = useRef()
  const [timeToRefresh, setTimeToRefresh] = useState(5)

  const loadPrice = async () => {
    try {
      const pr = (await axios.get(`/markets/${exchange}/${pair}/price`)).data
      setPrice(pr.result.price)
    startTimer()
    } catch(e) {
      setPrice("An error has occured!")
    }
  }
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const timerInterval = setInterval(() => {
      if(timeToRefresh === 0) {
        setTimeToRefresh(5);
        clearInterval(timerRef.current)
        loadPrice()
      } else setTimeToRefresh(t => t - 1);
    }, 1000);
    timerRef.current = timerInterval;
  };

  useEffect(() => {
    loadPrice()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  })
  return (
    <div className="flex flex-row">
      <div className="flex flex-col flex-grow m-2 text-gray-800">{exchange}</div>
      <div className="flex flex-col flex-grow m-2 text-gray-800">{pair}</div>
      <div className="flex flex-col flex-grow m-2 text-gray-800">{price}</div>
      <div className="flex flex-col flex-grow m-2 text-gray-800">Refreshing in {timeToRefresh}</div>
    </div>
  )

}

export default function AssetItem(props) {
  const {asset, price} = props;

  const [details, setDetails] = useState();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const loadDetails = async () => {
    try {
      setLoading(true);
      const det = (await axios.get(`/assets/${asset.symbol}`,)).data
      setDetails(det.result.markets.base.slice(0, 5).map(
        item => {
          return {
            exchange: item.exchange,
            pair: item.pair,
          }
        }

      ));
      setLoading(false);
    } catch(e) {
      setLoading(false);
      alert("An unexpected error has occured");
    }
  }

  const loadModal = () => {
    loadDetails()
    setModal(true)
  }
  
  return (
    <div className="hover:scale-110 bg-purple-200 cursor-pointer m-4 p-3 w-1/5 h-16 rounded-xl shadow-md" onClick={loadModal}>
      <div className="flex flex-col">
        <div className="text-md text-black">{asset.name}</div>
        <div className="text-xs text-pink-600 font-semibold">{asset.symbol}</div>
      </div>

      <AnimatePresence
      initial={false}
      exitBeforeEnter={true}
      onExitComplete={() => null}
      >
        {modal && (<Modal close={() => {
          setModal(false)
        }}>
          {loading && <div className="loading"/>}
          <div className="flex flex-col h-full overflow-auto">
            <div className="flex flex-row">
              <div className="flex flex-col flex-grow m-2 text-indigo-800">exchange</div>
              <div className="flex flex-col flex-grow m-2 text-indigo-800">pair</div>
              <div className="flex flex-col flex-grow m-2 text-indigo-800">price</div>
            </div>
            {details?.map(item => (<AssetPrice key={item} {...item}/>))}
          </div>

          </Modal>)}

      </AnimatePresence>
      
    </div>
  )
}
