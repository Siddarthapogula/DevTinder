import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASEURL } from '../utils/constants';
import axios from 'axios';
import { addUser } from '../utils/userSlice';
import UserCard from './UserCard';

const EditProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const { _id } = user;
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [age, setAge] = useState(user?.age || '');
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || '');
  const [about, setAbout] = useState(user?.about || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(false);
  const handleEditClick = async () => {
    try {
      const { data } = await axios.patch(
        `${BASEURL}/profile/edit`,
        {
          userId: _id,
          firstName,
          lastName,
          age,
          photoUrl,
          about,
        },
        { withCredentials: true },
      );
      dispatch(addUser(data.data));
      setToast(true);
      setTimeout(() => {
        setToast(false);
      }, 2000);
    } catch (e) {
      setError(e.response.data.message);
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };
  if (!user) {
    return (
      <div className=" flex  justify-center screen-h">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }
  return (
    <div className=" flex flex-col items-center">
      {error && (
        <div role="alert" className="w-72 alert alert-error">
          <span>{error}</span>
        </div>
      )}
      {toast && (
        <div className="alert alert-success w-72">
          <span>Profile Updated Successfully</span>
        </div>
      )}
      <div className="flex flex-row justify-center gap-5 items-center">
        <div className=" flex justify-center mt-5 bg-base-100">
          <div className="card card-border rounded-md bg-base-300 w-96">
            <div className="card-body">
              <h2 className="card-title justify-center">Edit Profile</h2>
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">FirstName</legend>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input"
                    placeholder="firstName"
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">LastName</legend>
                  <input
                    type="input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input"
                    placeholder="LastName"
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">PhotoUrl</legend>
                  <input
                    type="input"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="input"
                    placeholder="PhotoUrl"
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Age</legend>
                  <input
                    type="input"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="input"
                    placeholder="Age"
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Gender</legend>
                  <input
                    type="input"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="input"
                    placeholder="Gender"
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">About</legend>
                  <input
                    type="input"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="input"
                    placeholder="About"
                  />
                </fieldset>
              </div>
              <div className="card-actions justify-center">
                <button
                  onClick={handleEditClick}
                  className="btn btn-primary rounded-md"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <UserCard user={user} preview={true} />
      </div>
    </div>
  );
};

export default EditProfile;
