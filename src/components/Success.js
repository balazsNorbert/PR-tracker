import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className="flex items-center justify-center min-h-screen text-center">
      <div className="flex flex-col gap-4 bg-white rounded-xl p-6 max-w-sm mx-5">
        <div>
          <h1 className="text-3xl font-bold text-green-600">Payment successful! Subscription Activated!</h1>
          <p className="text-lg text-gray-700">Thank you for subscribing! You now have full access</p>
        </div>
        <Link to="/profile" className="bg-teal-600 hover:bg-teal-700 transition duration-300 rounded-lg px-6 py-2">
          Go to your profile
        </Link>
      </div>
    </div>
  )
}

export default Success;