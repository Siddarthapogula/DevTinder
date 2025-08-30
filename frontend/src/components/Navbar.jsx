import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addUser, removeUser } from "../utils/userSlice";
import {removeFeed} from '../utils/feedSlice'
import axios from "axios";
import { BASEURL } from "../utils/constants";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(BASEURL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(data.data));
      navigate("/");
    } catch (e) {
      navigate("/login");
    }
  };
  useEffect(() => {
    fetchUser();
    if (window.location.pathname == "/" && !user) {
      navigate("/login");
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${BASEURL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removeFeed())
      navigate("/login");
    } catch (e) {}
  };
  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1" onClick={() => navigate("/")}>
        <a className="btn btn-ghost text-xl">DevTinder</a>
      </div>
      {user ? (
        <div className="px-5 flex items-center gap-5">
          <div>Welcome, {user.firstName}</div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div>
                {!user.photoUrl && (
                  <div className="text-[12px] rounded-full">Add Profile</div>
                )}
                {user.photoUrl && (
                  <img
                    alt="Profile"
                    src={user.photoUrl}
                    className="w-10 rounded-full"
                  />
                )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link className="text-[15px]" to="/profile">
                  Profile
                </Link>
              </li>
              <li>
                <Link className="text-[15px]" to="/connections">
                  Connections
                </Link>
              </li>
              <li>
                <Link className="text-[15px]" to="/requests">
                  Requests
                </Link>
              </li>
              <li>
                <a className="text-[15px]" onClick={handleLogout}>
                  LogOut
                </a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost"
          onClick={() => navigate("/login")}
        >
          {" "}
          Login
        </div>
      )}
    </div>
  );
};
export default Navbar;
