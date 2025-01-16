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
    // const [error, setError] = useState('');
    const [createError, setCreateError] = useState('');  
    const [editError, setEditError] = useState('');
    // const [userBalance, setUserBalance] = useState(null);
    const dispatch = useDispatch()
    const [editPortfolioId, setEditPortfolioId] = useState(null); 
    const [editBalance, setEditBalance] = useState('');


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

    const portclick =(portfolio_id) => {
        navigate(`/portfolio/${user_id}/${portfolio_id}`)
  
    }

    const newPort = async () => {
        if (newBalance === "" || isNaN(newBalance) || parseFloat(newBalance) <= 0) {
            setCreateError("Please enter a valid number.");
            return;
        }
        if (parseFloat(newBalance) > userBalance) {
            setCreateError("Balance exceeds account balance, please enter a valid number");
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
                    setCreateError('')
                } else {
                    console.error('Error creating portfolio:', response.status);
                }
            } catch (error) {
                console.error('Error fetching portfolio data:', error);
            }
            }
    
    const updatePortfolio = async () => {
        if (editBalance === "" || isNaN(editBalance) || parseFloat(editBalance) <= 0) {
            setEditError("Please enter a valid balance.");
            return;
        }

        const portfolioToUpdate = portfolios.find(p => p.id === editPortfolioId);
        if (!portfolioToUpdate) {
            setEditError("Portfolio not found.");
            return;
        }

        const maxAllowedBalance = userBalance + portfolioToUpdate.balance;
        if (parseFloat(editBalance) > maxAllowedBalance) {
            setEditError("Balance exceeds account balance, please enter a valid number.");
            return;
        }


        try {
            const response = await fetch(`/api/portfolio/${user_id}/${editPortfolioId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ balance: parseFloat(editBalance) }),
            });

            if (response.ok) {
                const updatedPortfolio = await response.json();
                setPortfolios((prevPortfolios) =>
                    prevPortfolios.map((portfolio) =>
                        portfolio.id === updatedPortfolio.id ? updatedPortfolio : portfolio
                    )
                );
                setEditBalance('');
                setEditPortfolioId(null);
                setEditError('')
            } else {
                console.error('Error updating portfolio:', response.status);
            }
        } catch (error) {
            console.error('Error updating portfolio:', error);
        }
    };

            
    return (
        <div className='portfolio'>
            <h1> Account Balance: ${userBalance}</h1>
            {/* <p className="account-balance">
                Account Balance: ${userBalance}
            </p> */}
            {/* <h2>hell</h2> */}
            {portfolios.length === 0 ? (
                <p>No portfolios available.</p>
            ) : (
                <ul><h1>Portfolios</h1>
                    {portfolios.map((portfolio) => (
                        <li className= "nvm" key={portfolio.id}  onClick={(e) => {
                            if (e.target.tagName !== 'BUTTON') {
                                portclick(portfolio.id);
                            }
                        }}
                    >
                            <h3>Portfolio ID: {portfolio.id}</h3>
                            <p>Balance ${portfolio.balance}</p>
                            <p>Created At: {new Date(portfolio.created_at).toLocaleString()}</p>
                            <button onClick={() => {
                                setEditPortfolioId(portfolio.id);
                                setEditBalance(portfolio.balance);
                            }}>
                                Edit Portfolio
                            </button>
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
                {createError && <p className="error-message">{createError}</p>}
                <button onClick={newPort} disabled={newBalance === "" || isNaN(newBalance) || parseFloat(newBalance) <= 0}>Create Portfolio
                </button>
            </div>

            {editPortfolioId && (
                <div className="edit-portfolio">
                    <h2>Enter New Balance</h2>
                    <input
                        type="number"
                        value={editBalance}
                        onChange={(e) => setEditBalance(e.target.value)}
                        placeholder="New balance"
                    />
                    {editError && <p className="error-message">{editError}</p>}
                    <button onClick={updatePortfolio}>Update Portfolio</button>
                    <button onClick={() => setEditPortfolioId(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default PortfolioPage;
