import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PortfolioPage.css'

function PortfolioPage() {
    const { user_id } = useParams(); 
    const [portfolios, setPortfolios] = useState([]);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const response = await fetch(`/api/portfolio/${user_id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPortfolios(data.portfolios || []);
                } else {
                    console.error('Error fetching portfolio:', response.status);
                }
            } catch (error) {
                console.error('Error fetching portfolio data:', error);
            }
        };

        fetchPortfolio();
    }, [user_id]);

    return (
        <div className='portfolio'>
            <h1>Portfolios</h1>
            {portfolios.length === 0 ? (
                <p>No portfolios available.</p>
            ) : (
                <ul>
                    {portfolios.map((portfolio) => (
                        <li key={portfolio.id}>
                            <h3>Portfolio ID: {portfolio.id}</h3>
                            <p>Balance ${portfolio.balance}</p>
                            <p>Created At: {new Date(portfolio.created_at).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PortfolioPage;
