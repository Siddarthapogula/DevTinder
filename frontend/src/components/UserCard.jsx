import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { BASEURL } from "../utils/constants";

const UserCard = ({ user, preview, previewOnly }) => {
  const loggedUser = useSelector((store) => store.user);
  const [send, setSend] = useState(null);
  const [error, setError] = useState(null);
  const handleInterestedClick = async () => {
    const fromUserId = loggedUser._id;
    const toUserId = user._id;
    try {
      const { data } = await axios.post(
        BASEURL + `/request/send/interested/${toUserId}`,
        {},
        { withCredentials: true }
      );
      setSend("Interested");
    } catch (e) {
      setError(e.response.data.message);
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };
  const handleIgnoredlick = async () => {
    const fromUserId = loggedUser._id;
    const toUserId = user._id;
    try {
      const { data } = await axios.post(
        BASEURL + `/request/send/ignored/${toUserId}`,
        {},
        { withCredentials: true }
      );
      setSend("Ignored");
    } catch (e) {
      setError(e.response.data.message);
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };
  return (
    <div className="card bg-base-300 w-96 shadow-sm">
      <figure>
        <img
          className=" w-96 h-96 object-cover"
          src={user.photoUrl}
          alt="Shoes"
        />
      </figure>
      <div className="card-body flex gap-2">
        <h2 className="card-title">{user.firstName + " " + user.lastName}</h2>
        <span>{user.age + " " + user.gender}</span>
        {user.skills.length > 0 && (
          <div>
            <h3 className="font-medium">Skills:</h3>
            <div className="flex gap-2">
              {user.skills.map((skill, index) => (
                <span key={index} className="">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {user.about && <p>{user.about}</p>}
        <div className="card-actions justify-center">
          {!send && !previewOnly && !preview && (
            <button onClick={handleInterestedClick} className="btn btn-primary">
              Interested
            </button>
          )}
          {!send  && !previewOnly && !preview && (
            <button onClick={handleIgnoredlick} className="btn btn-primary">
              Ignore
            </button>
          )}
          {send && (
            <button className="btn btn-primary">
              {send}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
