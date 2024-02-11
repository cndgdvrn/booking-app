import { Link } from "react-router-dom";
import { useAppContext } from "../hooks/useAppContext";
import Signout from "./Signout";

const Header = () => {
  const context = useAppContext();

  return (
    <div className="bg-blue-800 px-60 pt-4 pb-6 text-white space-y-8">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-3xl">
          MernHolidays.com
        </Link>
        {context?.isLoggedIn ? (
          <div className="space-x-4">
            <Link className="" to="">
              My Bookings
            </Link>
            <Link to="">My Hotels</Link>
            <Signout />
          </div>
        ) : (
          <Link to="/signin" className="text-blue-800 bg-white rounded-md px-3 py-2 font-bold">
            Sign In
          </Link>
        )}
      </div>
      <div>
        <h1 className="text-5xl">Find your next stay</h1>
        <p>Search low price on hotels for your dream vacation...</p>
      </div>
    </div>
  );
};

export default Header;
