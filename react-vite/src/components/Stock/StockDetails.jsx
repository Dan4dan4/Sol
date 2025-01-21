import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import './StockDetails.css'
import { useSelector, useDispatch } from "react-redux";
import {useModal} from '../../context/Modal'
import { thunkPurchaseStock } from "../../redux/portfolio";

function StockDetails() {
  const { stock_id } = useParams();
  const [stock, setStock] = useState(null); 
  const [error, setError] = useState(null);

  // const [quantity, setQuantity] = useState(0);
  const [purchaseError, setPurchaseError] = useState(null);
  const [sellError, setSellError] = useState(null);

  const [buyQuantity, setBuyQuantity] = useState(0);
  const [buyTotalValue, setBuyTotalValue] = useState(0);
  const [sellQuantity, setSellQuantity] = useState(0);
  const [sellTotalValue, setSellTotalValue] = useState(0);

  const selectedPortfolio = useSelector(state => state.portfolio.selectedPortfolio);
  const { setModalContent, setOnModalClose } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user_id = useSelector(state => state.session.user?.id);

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const response = await fetch(`/api/stock/${stock_id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          setStock(data); 
        } else {
          setError("Error fetching stock data");
        }
      } catch (error) {
        setError("Error fetching stock data");
      }
    };

    if (stock_id) {
      fetchStockDetails();
    }
  }, [stock_id]);

  // const handleBuyStock = async () => {
  //   if (!selectedPortfolio) {
  //     setPurchaseError("Please select a portfolio to buy stocks.");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`/api/stock/buy/${stock.name}/${selectedPortfolio.id}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         quantity: buyQuantity,
  //       }),
  //     });
  //     const data = await response.json();
  //     if (response.ok) {
  //       console.log(`Successfully purchased ${buyQuantity} of ${stock.name}!`);
  //       setModalContent(
  //         <div>
  //           <h2>Success!</h2>
  //           <p>You successfully purchased {buyQuantity} shares of {stock.name}.</p>
  //         </div>
  //       );
  //       setOnModalClose(() => {
  //         setBuyQuantity(0); 
  //         setBuyTotalValue(0); 
  //       });
  //     } else {
  //       setPurchaseError(data.error || "Error purchasing stock.");
  //     }
  //   } catch (error) {
  //     setPurchaseError("An error occurred while purchasing the stock.");
  //   }
  // };

  const handleBuyStock = async () => {
    if (!selectedPortfolio) {
      setPurchaseError("Please select a portfolio to buy stocks.");
      return;
    }
    const data = await dispatch(thunkPurchaseStock(selectedPortfolio.id, stock.name, buyQuantity));

    if (data?.error) {
      setPurchaseError(data.error);
    } else {
      console.log(`Successfully purchased ${buyQuantity} of ${stock.name}!`);
      setModalContent(
        <div>
          <h2>Success!</h2>
          <p>You successfully purchased {buyQuantity} shares of {stock.name}.</p>
        </div>
      );
      setOnModalClose(() => {
        setBuyQuantity(0); 
        setBuyTotalValue(0); 
      });

      if (selectedPortfolio) {
        navigate(`/portfolio/${user_id}/${selectedPortfolio.id}`);
      }
    }
  };


  const handleSellStock = async () => {
    if (!selectedPortfolio) {
      setSellError("Please select a portfolio to sell stocks.");
      return;
    }

    try {
      const response = await fetch(`/api/stock/sell/${stock.name}/${selectedPortfolio.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: sellQuantity,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(`Successfully sold ${sellQuantity} of ${stock.name}!`);
        setModalContent(
          <div>
            <h2>Success!</h2>
            <p>You successfully sold {sellQuantity} shares of {stock.name}.</p>
          </div>
        );
        setOnModalClose(() => {
          setSellQuantity(0); 
          setSellTotalValue(0); 
        });
      } else {
        setSellError(data.error || "Error selling stock.");
      }
    } catch (error) {
      setSellError("An error occurred while selling the stock.");
    }
  };

  const getOwnedStockQuantity = () => {
    if (selectedPortfolio) {
      const stockInPortfolio = selectedPortfolio.stocks.find(
        (item) => item.stock_name === stock.name
      );
      return stockInPortfolio ? stockInPortfolio.quantity : 0; 
    }
    return 0;
  };

  const handleBuyQuantityChange = (e) => {
    const qty = Number(e.target.value);
    setBuyQuantity(qty);
    if (stock) {
      setBuyTotalValue(qty * stock.volume_weighted_avg_price); 
    }
  };

  const handleSellQuantityChange = (e) => {
    const qty = Number(e.target.value);
    setSellQuantity(qty);
    if (stock) {
      setSellTotalValue(qty * stock.volume_weighted_avg_price); 
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!stock) {
    return <div>No data available</div>;
  }

  const navigatePort = () => {
    navigate(`/portfolio/${user_id}`)
  }

  return (
    <div className="twobox">
      <div className="details">
      <p className="titleme">{stock.name} </p>
      <p className="titleme">Price: ${stock.volume_weighted_avg_price}</p>
      <p>Open Price: ${stock.open_price}</p>
      <p>High Price: ${stock.high_price}</p>
      <p>Low Price: ${stock.low_price}</p>
      <p>Volume: {stock.volume}</p>
      </div>
      {/* <div className="portfolio-balance">
        <p className="titleme">Portfolio Balance: ${selectedPortfolio ? selectedPortfolio.balance.toFixed(2) : "N/A"}</p>
      </div> */}

<div className="buy">
        <p className="titleme">Buy order for {stock.name}</p>
        <p className="titleme">Price: ${stock.volume_weighted_avg_price}</p>
        <input
          type="number"
          value={buyQuantity}
          onChange={handleBuyQuantityChange}
          min="1"
          className="quantity-input"
        />
        <p className="total-cost">
          Total Cost: ${buyTotalValue.toFixed(2)} 
        </p>
        <button onClick={handleBuyStock} className="buy-button">Buy</button>
        {purchaseError && (
          <div>
            <p className="error-message">{purchaseError}</p>
            <button onClick={navigatePort} className="select-portfolio-button">
              Select Portfolio
            </button>
          </div>
        )}
        <div className="portfolio-balance">
        <p className="portbal">Portfolio Balance: ${selectedPortfolio ? selectedPortfolio.balance.toFixed(2) : "N/A"}</p>
        {/* {selectedPortfolio && (
          <p>
            Quantity owned: {getOwnedStockQuantity()} 
          </p>
        )} */}
      </div>
      </div>

      <div className="sell">
        <p className="titleme">Sell order for {stock.name}</p>
        <p className="titleme">Price: ${stock.volume_weighted_avg_price}</p>
        <input
          type="number"
          value={sellQuantity}
          onChange={handleSellQuantityChange}
          min="1"
          className="quantity-input"
        />
        <p className="total-cost">
          Total Value: ${sellTotalValue.toFixed(2)} 
        </p>
        <button onClick={handleSellStock} className="sell-button">Sell</button>
        {sellError && (
          <div>
            <p className="error-message">{sellError}</p>
            <button onClick={navigatePort} className="select-portfolio-button">
              Select Portfolio
            </button>
          </div>
        )}
        <div className="portfolio-balance">
        {/* <p className="portbal">Portfolio Balance: ${selectedPortfolio ? selectedPortfolio.balance.toFixed(2) : "N/A"}</p> */}
        {selectedPortfolio && (
          <p className="portbal">
            Quantity owned: {getOwnedStockQuantity()} 
          </p>
        )}
      </div>
      </div>
    </div>
  );
}

export default StockDetails;
