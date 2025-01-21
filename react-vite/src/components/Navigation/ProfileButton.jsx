import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from 'react-icons/fa';
import { thunkLogout, thunkLogin } from "../../redux/session";
// import OpenModalMenuItem from "./OpenModalMenuItem";
// import LoginFormModal from "../LoginFormModal";
// import SignupFormModal from "../SignupFormModal";
import "./ProfileButton.css";
import { useNavigate } from "react-router";
import { clearSelectedPortfolio } from "../../redux/portfolio";

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();
  const navigate = useNavigate()

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
    navigate('/')
  };

  const goToLogin = () => {
    navigate("/login");
    closeMenu();
  };

  const goToSignup = () => {
    navigate("/signup");  
    closeMenu();
  };

  const goToProfile = () => {
    dispatch(clearSelectedPortfolio)
    navigate(`/portfolio/${user.id}`);
    closeMenu();
  };

  const demoLogin = (e) => {
      e.preventDefault();
      dispatch(thunkLogin({email: "demo@aa.io", password: "password"}));
      closeMenu();
    }

  return (
    <>
      <button onClick={toggleMenu}>
        <FaUserCircle />
      </button>
      {showMenu && (
        <ul className={"profile-dropdown"} ref={ulRef}>
          {user ? (
            <>
              <li>{user.username}</li>
              <li>{user.email}</li>
              <li>
                <button onClick={goToProfile}>Profile</button>
              </li>
              <li>
                <button onClick={logout}>Log Out</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button onClick={goToLogin}>Log In</button>
              </li>
              <li>
                <button onClick={goToSignup}>Sign Up</button>
              </li>
              <li className="demo">
                <button onClick={demoLogin}>Demo User</button>
              </li>
            </>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
