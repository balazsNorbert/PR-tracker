import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkTokenExpiration } from "../redux/authSlice";

const TokenChecker = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkTokenExpiration());

    const interval = setInterval(() => {
      dispatch(checkTokenExpiration());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
};

export default TokenChecker;