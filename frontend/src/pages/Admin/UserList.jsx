import React from "react";
import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useUpdateUserMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../redux/api/userApiSlice";
import Message from "../../components/Message";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  // For get users
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  // For delete Users
  const [deleteUser] = useDeleteUserMutation();
  // For Update Users
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  // deleteFunction
  const deleteHandler = async(id) =>{
    if(window.confirm('Are You want to Delete?')){
      try {
        await deleteUser(id);
        toast.success('User Deleted sucessfully')
      } catch (error) {
        toast.error(error?.data?.message || error.message)
      }
    }
  }
  
  useEffect(() => {
  refetch();
}, [refetch , deleteHandler]);

// Update Functions
  const ToggleEdit = (id , username,email)=>{
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email)
  }

  const updateHandler = async(id) =>{
    try {
      await updateUser({
        userId:id,
        username: editableUserName,
        email: editableUserEmail
      })
      setEditableUserId(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error.message)
    }
  }

  return (
    <div className="p-4   ">
      <h1 className="text-3xl font-bold mb-6 text-center">UserList</h1>
      <AdminMenu/>
      {isLoading ? (
        <Loader />
      ) : (
          error ? (
          // Safely check for error properties
          <Message variant='danger'>
            {error?.data?.message || error?.message || 'An error occurred while fetching the user list'}
          </Message>
        )
        :
        <div className="flex flex-col md:flex-row">
          {/* Admin Table */}
          <table className="w-full md:w-4/5 mx-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">NAME</th>
                <th className="px-4 py-2 text-left">EMAIL</th>
                <th className="px-4 py-2 text-left">ADMIN</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-2">{user._id}</td>
                  {/* For Name */}
                  <td className="px-4 py-2">
                    {editableUserId === user._id ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={editableUserName}
                          onChange={(e) => setEditableUserName(e.target.value)}
                          className="w-full p-2 border rounded-lg"
                        />
                        <button
                          onClick={() => updateHandler(user._id)}
                          className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {user.username}{" "}
                        <button
                          onClick={() =>
                            ToggleEdit(user._id, user.username, user.email)
                          }
                        >
                          <FaEdit className="ml-[1rem]" />
                        </button>
                      </div>
                    )}
                  </td>
                  {/* For Email */}
                  <td className="px-4 py-2">
                    {editableUserId === user._id ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={editableUserEmail}
                          onChange={(e) => setEditableUserEmail(e.target.value)}
                          className="w-full p-2 border rounded-lg"
                        />
                        <button
                          onClick={() => updateHandler(user._id)}
                          className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <p>{user.email}</p>{" "}
                        <button
                          onClick={() =>
                            ToggleEdit(user._id, user.username, user.email)
                          }
                        >
                          <FaEdit className="ml-4" />
                        </button>
                      </div>
                    )}
                  </td>
                  {/* For Admin */}
                  <td className="px-4 py-2">
                    {
                      user.isAdmin ? (
                        <FaCheck style={{color:'green'}} />
                      ):
                      (
                        <FaTimes style={{color:'red'}} />
                      )
                    }
                  </td>
                  <td className="px-4 py-2">
                    {!user.isAdmin && (
                      <div className="flex">
                        <button
                        onClick={() => deleteHandler(user._id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          <FaTrash/>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
