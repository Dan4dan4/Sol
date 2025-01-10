import { useSelector } from 'react-redux';
import './LandingPage.css';
// import SignupFormPage from '../SignupFormPage/SignupFormPage';
import { useNavigate } from 'react-router';



function LandingPage() {
    const navigate = useNavigate()
    const session = useSelector((state) => state.session.user)

    const getstarted = () => {
        navigate('/signup')
        
    }
    return (
        <div className='landing-container'>
            <h1>Trading made easy</h1>
            <h2>Sol Commission-free trading</h2>
            {!session && (
                <button onClick={getstarted} className='getstarted'>Get started</button>
            )}
        </div>
        
   );
}


export default LandingPage;