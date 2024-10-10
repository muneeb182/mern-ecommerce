import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { setCredientials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import { useProfileMutation } from "../../redux/api/userApiSlice";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confrimPassword, setConfrimPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUsername(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.username, userInfo.email]);

  const dispatch = useDispatch();

  const submitHandlers = async(e) =>{
    e.preventDefault();
    if(password !== confrimPassword){
        toast.error('Password Does not match')
    }
    else{
        try {
          const res = await updateProfile({_id:userInfo._id,username,email,password}).unwrap();
          dispatch(setCredientials({...res}));
          toast.success('Profile Updated Successfully')
        } catch (error) {
            toast.error(error?.data?.message || error.message);
            
        }
    }
  }

  return (
    <div className="container mx-auto p-4 mt-[10rem]">
      <div className="flex justify-center align-center md:flex md:space-x-4">
        <div className="md:w-1/3">
          <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
          <form onSubmit={submitHandlers}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-black"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="form-input p-4  rounded w-full"
                placeholder="Enter Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="my-[2rem]">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-input p-4  rounded w-full"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="my-[2rem]">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-input p-4  rounded w-full"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="my-[2rem]">
              <label
                htmlFor="confrim"
                className="block text-sm font-medium text-black"
              >
                Confrim Password
              </label>
              <input
                type="password"
                id="confrim"
                className="form-input p-4 rounded w-full"
                placeholder="Enter Your Confrim Password"
                value={confrimPassword}
                onChange={(e) => setConfrimPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-between">
                <button type="submit" className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600" >Update Profile</button>
                <Link to='/user-orders' className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700" >
                My Orders
                </Link>
            </div>
          </form>
        </div>
        {loadingUpdateProfile && <Loader/>}
      </div>
    </div>
  );
};

export default Profile;
