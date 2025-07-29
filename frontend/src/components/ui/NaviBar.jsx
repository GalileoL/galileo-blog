import { useState } from "react";
import { IKImage } from "..";
import { Link } from "react-router-dom";
import {
  SignInButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";

const NaviBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full h-16 md:h-20 flex justify-between items-center">
      {/* logo */}
      <Link to="/" className="flex items-center gap-4 text-2xl font-bold">
        <IKImage src="/logo.png" alt="logo" className="w-8 h-8" />
        <span className="">lamalogo</span>
      </Link>

      {/* mobile menu */}
      <div className="md:hidden">
        {/* mobile button */}
        <div
          className="text-4xl font-bold cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "X" : "☰"}
        </div>
        {/* mobile link list */}
        <div
          className={`w-full font-medium gap-8 text-lg h-screen flex flex-col items-center justify-center absolute top-16 
                transition-all 
                ${isOpen ? "right-0" : "-right-full"}
            `}
        >
          <Link to="/">Home</Link>
          <Link to="/">Trending</Link>
          <Link to="/">Most Popular</Link>
          <Link to="/">About</Link>
          <Link to="/">
            <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
              Login 👋
            </button>
          </Link>
        </div>
      </div>
      {/* desktop menu */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
        <Link to="/">Home</Link>
        <Link to="/">Trending</Link>
        <Link to="/">Most Popular</Link>
        <Link to="/">About</Link>
        <SignedOut>
          <Link to="/login">
            <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
              Login 👋
            </button>
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default NaviBar;
