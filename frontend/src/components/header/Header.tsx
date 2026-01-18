import { Link, useLocation } from "react-router-dom";
import Search from "./Search";
import { useAuth } from "../../hooks/useAuth";
import { baseUrl } from "../../utils/baseUrl";
import Avatar from "../Avatar";

const Header = () => {
  const user = useAuth()?.user;
  const location = useLocation();

  return (
    <div className="fixed bg-white  z-30 rounded-b-2xl w-full h-20 flex justify-between items-center px-6 md:px-16">
      {/* LOGO */}
      <div className="flex-1">
        <Link
          to={"/home"}
          className="text-xl md:text-3xl gap-2.5 font-bold text-gray-800 hover:text-gray-900 transition-colors duration-200 flex items-center"
        >
          <span
            className="p-1.5 px-3 md:px-4 bg-linear-to-r from-cyan-500 to-blue-500 text-white rounded-lg 
            shadow-sm hover:shadow transition-all duration-300 transform hover:scale-105"
          >
            E
          </span>

          <span
            className="p-1.5 px-2.5 md:px-3 bg-linear-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg 
            shadow-sm hover:shadow transition-all duration-300 transform hover:scale-105"
          >
            Q
          </span>
        </Link>
      </div>

      {/* SEARCH BAR */}
      {user && (
        <div className="flex-1 flex justify-center">
          <Search />
        </div>
      )}

      {/* USER SECTION */}
      <div className="flex-1 flex justify-end">
        {user ? (
       (
            <Link to={"/profile"}>
              <div className="flex items-center gap-3">
                <Avatar user={user} size="lg" />
                <div className="">
                  <div className="text-sm font-medium text-gray-700">
                    {user.username.toUpperCase() || user.email?.split("@")[0]}
                  </div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>
            </Link>
          )
        ) : (
          <Link
            to={`${baseUrl}/auth/google`}
            className="flex items-center gap-2.5 px-4 py-2.5  border border-gray-200 
            rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-300 group"
          >
            <div className="w-5 h-5">
              <img
                src="./google-icon-logo-png-transparent.png"
                alt="google"
                className="w-full h-full"
              />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              Sign in with google
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
