import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASEURL } from '../utils/constants';

const RequestComponent = ({ user, reqId }) => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleAcceptClick = async () => {
    try {
      const { data } = await axios.post(
        BASEURL + `/request/review/accepted/${reqId}`,
        {},
        { withCredentials: true },
      );
      setStatus('accepted');
    } catch (e) {
      setError(e.response.data.message);
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };
  const handleRejectClick = async () => {
    try {
      const { data } = await axios.post(
        BASEURL + `/request/review/rejected/${reqId}`,
        {},
        { withCredentials: true },
      );
      setStatus('rejected');
      console.log(data);
    } catch (e) {
      setError(e.response.data.message);
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };
  return (
    <div className="card card-sm w-86 bg-base-100 shadow-sm flex justify-center">
      <div className="card-body flex flex-row items-center justify-between">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <img alt="Profile" src={user.photoUrl} className="w-8 rounded-full" />
        </div>
        <h1 className="card-title text-lg">
          {user.firstName + ' ' + user.lastName}
        </h1>

        <div className="flex flex-row justify-center gap-3">
          <div className="card-actions">
            {!status && (
              <button
                onClick={handleAcceptClick}
                className="btn btn-xs btn-success"
              >
                Accept
              </button>
            )}
          </div>
          <div className=" card-actions">
            {!status && (
              <button
                onClick={handleRejectClick}
                className="btn btn-xs btn-warning"
              >
                Reject
              </button>
            )}
          </div>
          <div className=" card-actions">
            {status && (
              <button
                onClick={handleRejectClick}
                className="btn btn-xs btn-neutral"
              >
                {status}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Requests = () => {
  const [requests, setRequests] = useState(null);
  const [error, setError] = useState(null);
  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(BASEURL + '/requests/received', {
        withCredentials: true,
      });
      setRequests(data?.data);
    } catch (e) {
      setError(e.response.data.message);
    }
  };
  console.log(requests);
  useEffect(() => {
    fetchRequests();
  }, []);
  return (
    <div className="w-full flex flex-col items-center">
      {requests && requests.length > 0 ? (
        <div className="w-full max-w-4xl">
          {/* Heading */}
          <h1 className="text-2xl font-bold mb-6 text-center">
            requests{' '}
            <span className="text-base text-base-content/70">
              ({requests.length})
            </span>
          </h1>

          <div className="flex flex-col items-center overflow-scroll p-2">
            {requests.map((req) => (
              <RequestComponent
                key={req._id}
                reqId={req._id}
                user={req.fromUserId}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-base-content/70 mt-10">
          <p className="text-lg font-medium">No requests yet</p>
          <p className="text-sm">
            When someone requests with you, they’ll appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Requests;
