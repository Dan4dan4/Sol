import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import sol from '../../../images/sol3.png'

function Navigation() {
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
        {/* <NavLink to="/portfolio/" className="stocks-link">Portfolio</NavLink> */}
        <li className="dropdown">
          <ProfileButton />
        </li>
      </li>
    </ul>
  );
}

export default Navigation;
