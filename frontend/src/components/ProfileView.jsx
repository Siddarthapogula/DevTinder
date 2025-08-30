import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASEURL } from "../utils/constants";
import UserCard from "./UserCard";

const ProfileView = () => {
  const userId = window.location.pathname.split("/")[3];
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  if (!userId) {
    return <div>error</div>;
  }
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(BASEURL + `/profile/${userId}`, {
        withCredentials: true,
      });
      setUser(data?.data);
    } catch (e) {
      setError(e.response.data.message);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return(<div className=" flex justify-center">{user && <UserCard previewOnly={true} user={user} />}</div>)
};

export default ProfileView;
