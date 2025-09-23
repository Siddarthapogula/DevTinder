import { useState } from 'react';
import { BASEURL } from '../utils/constants';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../utils/userSlice';
const Login = () => {
  const [emailId, setEmailId] = useState('@gmail.com');
  const [password, setPassword] = useState('12345678');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginButtonClick = async () => {
    try {
      const { data } = await axios.post(
        `${BASEURL}/login`,
        {
          emailId,
          password,
        },
        { withCredentials: true },
      );
      dispatch(addUser(data.data));
      navigate('/');
      return;
    } catch (e) {
      setError(e.response.data.message);
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };
  return (
    <div className=" flex justify-center items-center h-[90vh] bg-base-100">
      <div className="card card-border rounded-md bg-base-300 w-96">
        <div className="card-body">
          {error && (
            <div role="alert" className="alert alert-error">
              <span>{error}</span>
            </div>
          )}
          <h2 className="card-title justify-center">Login</h2>
          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email</legend>
              <input
                type="text"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                className="input"
                placeholder="example.com"
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="password"
              />
            </fieldset>
          </div>
          <div className="card-actions justify-center">
            <button
              onClick={loginButtonClick}
              className="btn btn-primary rounded-md"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
