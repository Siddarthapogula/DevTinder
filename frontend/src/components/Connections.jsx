import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASEURL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const ConnectionComponent = ({ user }) => {
  const navigate = useNavigate()
  return (
    <div onClick={()=>navigate(`/profile/view/${user._id}`)}  className="card w-full max-w-sm bg-base-100 shadow-sm border  rounded-lg hover:shadow-md transition ">
      <div className="card-body flex flex-row items-center cursor-pointer gap-4 p-3">
        <div className="avatar">
          <div className="w-12 rounded-full">
            <img alt="Profile" src={user.photoUrl} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-sm truncate">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-xs text-base-content/70 truncate">
            {user.about}
          </p>
          <div className="flex flex-wrap gap-1 mt-1">
            {user.skills && user.skills.slice(0, 2).map((skill, idx) => (
              <span
                key={idx}
                className="badge badge-outline badge-xs text-[10px]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
            ⋮
          </div>
          <ul className="menu menu-md dropdown-content bg-base-100 shadow rounded-box w-28">
            <li><a>Message</a></li>
            <li><a>Remove</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};


const Connections = () => {
  const [connections, setConnections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchConnections = async () => {
    try {
      const { data } = await axios.get(BASEURL + "/user/connections", {
        withCredentials: true,
      });
      setConnections(data.data);
    } catch (e) {
      setError(e.response.data.message);
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };
  useEffect(() => {
    fetchConnections();
  }, []);
  return (
    <div className="w-full flex flex-col items-center">
      {connections && connections.length > 0 ? (
        <div className="w-full max-w-4xl">
          {/* Heading */}
          <h1 className="text-2xl font-bold mb-6 text-center">
            Connections{" "}
            <span className="text-base text-base-content/70">
              ({connections.length})
            </span>
          </h1>

          {/* Connections Grid */}
          <div className="flex flex-col items-center overflow-scroll p-2 gap-2">
            {connections.map((user) => (
              <ConnectionComponent key={user._id} user={user} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-base-content/70 mt-10">
          <p className="text-lg font-medium">No connections yet</p>
          <p className="text-sm">
            When someone connects with you, they’ll appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Connections;
