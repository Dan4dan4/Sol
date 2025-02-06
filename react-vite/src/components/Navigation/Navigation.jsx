import { NavLink , useNavigate} from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import sol from '../../../images/sol3.png'
import { clearSelectedPortfolio } from "../../redux/portfolio";
import { useDispatch , useSelector} from "react-redux";

function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.session.user);


  const goToPortfolio = () => {
    if (user && user.id) {
      dispatch(clearSelectedPortfolio()); 
      navigate(`/portfolio/${user.id}`);
    } else {
      console.error("User not logged");
      navigate("/login");
    }
  };

  return (
    <ul className="navbar">
      <li className="webname">
        <NavLink to="/">
        <img src={sol} className="logo"/>
        Sol
        </NavLink>
      </li>

      <li className="nav-links">
        <NavLink to="/stocks" className="stocks-link">Stocks</NavLink>
        {user && user.id ? (
          <NavLink 
            to={`/portfolio/${user.id}`} 
            className="stocks-link" 
            onClick={goToPortfolio}
          >
            Portfolio
          </NavLink>
        ) : (
          <NavLink to="/login" className="stocks-link">
            Portfolio
          </NavLink>
        )}
        </li>
        <li className="dropdown">
          <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
