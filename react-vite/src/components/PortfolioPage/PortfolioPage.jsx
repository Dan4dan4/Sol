import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import { thunkAuthenticate } from '../../redux/session';
import './PortfolioPage.css'

function PortfolioPage() {
    const { user_id } = useParams(); 
    const [portfolios, setPortfolios] = useState([]);
    // const [selectedPortfolio, setSelectedPortfolio] = useState(null);
    const navigate = useNavigate()
    const [newBalance, setNewBalance] = useState('');
    const [error, setError] = useState('');
    // const [userBalance, setUserBalance] = useState(null);
    const dispatch = useDispatch()


    const user = useSelector(state => state.session.user);
    const userBalance = user ? user.account_balance : null;

    useEffect(() => {
        dispatch(thunkAuthenticate());
    }, [dispatch])


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

    //doesnt work
    // useEffect(() => {
    //     fetch('/auth/', {
    //         method: 'GET',
    //         headers: { 'Content-Type': 'application/json' },
    //         credentials: 'include',
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         if (data.user) {
    //             if (data.user && data.account_balance !== undefined) {
    //                 setUserBalance(data.account_balance); } 
    //         } else {
    //             setUserBalance(null);
    //         }
    //     })
    //     .catch(error => console.error('Error fetching user account data:', error));
    // }, []);
    

    const portclick =(portfolio_id) => {
        navigate(`/portfolio/${user_id}/${portfolio_id}`)
  
    }

    const newPort = async () => {
        if (newBalance === "" || isNaN(newBalance) || parseFloat(newBalance) <= 0) {
            setError("Please enter a valid number.");
            return;
        }
        if (parseFloat(newBalance) > userBalance) {
            setError("Balance exceeds account balance, please enter a valid number");
            return;
        }

        try {
            const response = await fetch (`/api/portfolio/${user_id}`, {
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({balance: parseFloat(newBalance)
                })
            })

                if(response.ok) {
                    const data = await response.json()
                    setPortfolios(allports => [...allports, data])
                    setNewBalance('')
                } else {
                    console.error('Error creating portfolio:', response.status);
                }
            } catch (error) {
                console.error('Error fetching portfolio data:', error);
            }
            }
        
    

    return (
        <div className='portfolio'>
            <h1>Portfolios</h1>
            <p>Account Balance: ${userBalance}</p>
            {portfolios.length === 0 ? (
                <p>No portfolios available.</p>
            ) : (
                <ul>
                    {portfolios.map((portfolio) => (
                        <li className= "nvm" key={portfolio.id} onClick={() => portclick(portfolio.id)}>
                            <h3>Portfolio ID: {portfolio.id}</h3>
                            <p>Balance ${portfolio.balance}</p>
                            <p>Created At: {new Date(portfolio.created_at).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
            <div className="create-portfolio">
                <h2>Create a New Portfolio</h2>
                <input 
                    type="number" 
                    placeholder="Enter balance" 
                    value={newBalance} 
                    onChange={(e) => setNewBalance(e.target.value)} 
                />
                {error && <p className="error-message">{error}</p>}
                <button onClick={newPort} disabled={newBalance === "" || isNaN(newBalance) || parseFloat(newBalance) <= 0}>Create Portfolio
                </button>
            </div>
        </div>
    );
}

export default PortfolioPage;
