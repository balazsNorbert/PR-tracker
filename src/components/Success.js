import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Success = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [isTrial, setIsTrial] = useState(false);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await axios.get(`${apiURL}/pricing/check-subscription?session_id=${sessionId}`);
        setIsTrial(response.data.isTrial);
      } catch (error) {
        console.error("Error checking subscription: ", error);
      }
    };
    if (sessionId) {
      checkSubscription();
    }
  }, [sessionId, apiURL]);

  return (
    <div className="flex items-center justify-center min-h-screen text-center">
      <div className="flex flex-col gap-4 bg-white rounded-xl p-6 max-w-sm mx-5">
      {isTrial ? (
        <>
          <h1 className="text-3xl font-bold text-teal-600">Your Free Trial Has Started!</h1>
          <p className="text-lg text-gray-700">Enjoy 14 days of full access. No payment was taken.</p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-green-600">Payment successful! Subscription Activated!</h1>
          <p className="text-lg text-gray-700">Thank you for subscribing! You now have full access</p>
        </>
      )}
      <Link to="/profile" className="bg-teal-600 hover:bg-teal-700 transition duration-300 rounded-lg px-6 py-2">
        Go to your profile
      </Link>
      </div>
    </div>
  )
}

export default Success;