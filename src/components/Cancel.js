import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { logout } from '../redux/authSlice';

const Cancel = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-3 items-center justify-center min-h-screen text-center">
      <div className="flex flex-col gap-4 bg-white rounded-xl p-6 max-w-sm mx-5">
        <h1 className="text-3xl font-bold text-red-600">Payment Canceled!</h1>
        <p className="text-lg text-gray-700">It looks like you canceled the payment. You can try again anytime.</p>
        <Link to="/login" className="bg-gray-600 hover:bg-gray-700 transition duration-300 rounded-lg px-6 py-2">Login</Link>
      </div>
    </div>
  )
}

export default Cancel;