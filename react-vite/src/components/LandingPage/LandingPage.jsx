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
            <li>Trading made easy</li>
            <li>Sol Commission-free trading</li>
            {!session && (
                <button onClick={getstarted} className='getstarted'>Get started</button>
            )}
        </div>
        
   );
}


export default LandingPage;