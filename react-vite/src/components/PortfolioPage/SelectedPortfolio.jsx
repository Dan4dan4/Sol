import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import './SelectedPortfolio.css'

function SelectedPortfolio(){
    const {user_id, portfolio_id} = useParams()
    const [portfolio , setPortfolio] = useState(null)
    const navigate = useNavigate()
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPortfolioDetails = async () => {
            try {
                const response = await fetch(`/api/portfolio/${user_id}/${portfolio_id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPortfolio(data.Portfolio);
                } else {
                    console.error('Error fetching portfolio:', response.status);
                }
            } catch (error) {
                console.error('Error fetching portfolio data:', error);
            }
        };

        fetchPortfolioDetails();
    }, [user_id, portfolio_id]);

    const deleteport = async () => {
        try {
            const response = await fetch(`/api/portfolio/${user_id}/${portfolio_id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                navigate(`/portfolio/${user_id}`);
            } else {
                const data = await response.json();
                setError(data.error || "An error occurred while deleting the portfolio.");
            }
        } catch (error) {
            console.error('Error deleting portfolio:', error);
            setError("An error occurred while deleting the portfolio.");
        }
    };


    return(
        <div>
            <h1>Portfolio Details</h1>
            { portfolio && (
                <div className="port-card">
                <h2>Portfolio ID: {portfolio.id}</h2>
                <p>Balance: ${portfolio.balance}</p>
                <p>Created At: {new Date(portfolio.created_at).toLocaleString()}</p>
                <h3>Stocks:</h3>
                    {portfolio.stocks && portfolio.stocks.length > 0 ? (
                        <ul>
                            {portfolio.stocks.map((stock, index) => (
                                <li key={index} className="stock-item">
                                    <p><strong>Name:</strong> {stock.name}</p>
                                    <p><strong>Price:</strong> ${stock.price}</p>
                                    <p><strong>Purchase Price:</strong> ${stock.purchase_price}</p>
                                    <p><strong>Quantity:</strong> {stock.quantity}</p>
                                    <p><strong>Date Purchased:</strong> {new Date(stock.date_purchased).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No stocks available in this portfolio.</p>
                    )}
                    <button onClick={deleteport} className="delete">
                        Delete Portfolio
                    </button>
                    {error && <p className="error-message">{error}</p>}
            </div>
            )}
            <div>
                <button>Trade
                </button>
            </div>
        </div>
    )
}


export default SelectedPortfolio;