import axios from 'axios';
import { useEffect } from 'react';
import { BASEURL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import UserCard from './UserCard';
import { addFeed } from '../utils/feedSlice';
import { useState } from 'react';

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const getFeed = async () => {
    try {
      const { data } = await axios.get(BASEURL + '/user/feed', {
        withCredentials: true,
      });
      dispatch(addFeed(data.data));
    } catch (e) {
      setError(e.response.data.message);
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };
  useEffect(() => {
    getFeed();
  }, []);
  return feed && feed.length > 0 ? (
    <div className=" flex justify-center">
      <div className="carousel rounded-box w-86">
        {feed &&
          feed.map((user) => {
            return (
              <div className="carousel-item w-full p-2">
                <UserCard user={user} />
              </div>
            );
          })}
      </div>
    </div>
  ) : (
    <div className=" text-xl  text-center m-[2rem]">
      You have a request connection with every user in this platform! hahaha😂😂
    </div>
  );
};

export default Feed;
