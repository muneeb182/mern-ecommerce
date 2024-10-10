import React from 'react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa'
const AdminMenu = () => {
    const [isMenuOpen , setIsMenuOpen] = useState(false);

    const toggleMunu = () =>{
        setIsMenuOpen(!isMenuOpen)
    }
  return (
    <>
        <button className={`${isMenuOpen ? 'top-2 right-2' : 'top-5 right-7'} p-2 fixed border rounded-lg`} onClick={toggleMunu} >
            {isMenuOpen ?(
                <FaTimes color='black' />
            ):
            (
                <>
                <div className='w-6 h-0.5 bg-gray-500 my-1'></div>
                <div className='w-6 h-0.5 bg-gray-500 my-1'></div>
                <div className='w-6 h-0.5 bg-gray-500 my-1'></div>


                </>
            )
            }
        </button>

        {isMenuOpen && (
            <section className='p-4 fixed right-7 top-5 '>
                <ul className="list-none mt-2 border px-2 py-2 rounded-lg">
                <li>
                        <NavLink className='list-item py-2 px-3 block mb-5 hover:bg-gray-100 '
                        to='/admin/dashboard' style={({isActive}) =>({
                            color: isActive ? 'gray' :'black'
                        })}
                        >
                          Admin Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className='list-item py-2 px-3 block mb-5 hover:bg-gray-100 '
                        to='/admin/categoryList' style={({isActive}) =>({
                            color: isActive ? 'gray' :'black'
                        })}
                        >
                          Create Category   
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className='list-item py-2 px-3 block mb-5 hover:bg-gray-100 '
                        to='/admin/productlist' style={({isActive}) =>({
                            color: isActive ? 'gray' :'black'
                        })}
                        >
                            Create Product 
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className='list-item py-2 px-3 block mb-5 hover:bg-gray-100 '
                        to='/admin/allproducts' style={({isActive}) =>({
                            color: isActive ? 'gray' :'black'
                        })}
                        >
                          All Products
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className='list-item py-2 px-3 block mb-5 hover:bg-gray-100 '
                        to='/admin/userlist' style={({isActive}) =>({
                            color: isActive ? 'gray' :'black'
                        })}
                        >
                            Manage Users
                      </NavLink>
                    </li>
                    <li>
                        <NavLink className='list-item py-2 px-3 block mb-5 hover:bg-gray-100 '
                        to='/admin/orderlist' style={({isActive}) =>({
                            color: isActive ? 'gray' :'black'
                        })}
                        >
                          Manage Orders
                        </NavLink>
                    </li>
                </ul>
            </section>
        )}
    </>
  )
}

export default AdminMenu