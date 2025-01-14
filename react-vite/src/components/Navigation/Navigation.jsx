import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <ul className="navbar">
      <li className="webname">
        <NavLink to="/">Sol</NavLink>
      </li>

      <li className="dropdown">
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
