import React from 'react'
import { useEffect , useState } from 'react'
import { useDispatch , useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { savePaymentMethod,saveShippingAddress } from '../../redux/features/cart/cartSlice'
import ProgressSteps from '../../components/ProgressSteps'
const Shipping = () => {
    const cart = useSelector((state) => state.cart)
    const {shippingAddress} =cart;
    const [paymentMethod , setPaymentMethod] = useState('COD');
    const [address , setAddress ] = useState(shippingAddress.address || '')
    const [country, setCountry ] = useState(shippingAddress.country || '')
    const [postalCode, setPostalCode ] = useState(shippingAddress.postalCode || '')
    const [city , setCity ] = useState(shippingAddress.city || '')

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() =>{
        if(!shippingAddress.address){
            navigate('/shipping');
        }
    },[navigate , shippingAddress])

    const submitHandlers = (e) =>{
        e.preventDefault();

        dispatch(saveShippingAddress({address , city , postalCode , country}));
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    }

  return (
    <div className='container mx-auto mt-10'>
        {/* <ProgressSteps step 1 step 2 /> */}
        <ProgressSteps  step1 step2 />
        <div className=" mt-[10rem] flex justify-around items-center flex-wrap" >
            <form onSubmit={submitHandlers} className='w-[40rem]'>
                <h1 className="text-2xl font-semibold mb-4">Shipping</h1>
                <div className="mb-4">
                    <label htmlFor="" className="block  mb-2">Address</label>
                    <input type="text" className='w-full p-2 border rounded' placeholder='Enter Your Address' value={address} required onChange={(e) => setAddress(e.target.value)} />
                    
                </div>
                <div className="mb-4">
                    <label htmlFor="" className="block  mb-2">City</label>
                    <input type="text" className='w-full p-2 border rounded' placeholder='Enter Your City Name' value={city} required onChange={(e) => setCity(e.target.value)} />
                    
                </div>
                <div className="mb-4">
                    <label htmlFor="" className="block  mb-2">Postal Code</label>
                    <input type="text" className='w-full p-2 border rounded' placeholder='Enter Your Postal Code' value={postalCode} required onChange={(e) => setPostalCode(e.target.value)} />
                    
                </div>
                <div className="mb-4">
                    <label htmlFor="" className="block  mb-2">Country</label>
                    <input type="text" className='w-full p-2 border rounded' placeholder='Enter Your Country Name' value={country} required onChange={(e) => setCountry(e.target.value)} />
                    
                </div>
                <div className="mb-4">
                <label htmlFor="" className="block text-gray-800">Select Payment Method</label>
                <div className="mt-2">
                    <label htmlFor="" className='inline-flex items-center'>
                        <input type="radio" className='form-radio text-pink-500' name='paymentMethod' value='COD' checked={paymentMethod === 'COD'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span className="ml-2">Cash On Delivery</span>
                    </label>
                </div>
                </div>
                <button className="bg-pink-500 text-white px-4 py-2 rounded-full text-lg w-full" type='submit'>
                    Continue
                </button>
            </form>
        </div>
    </div>
  )
}

export default Shipping