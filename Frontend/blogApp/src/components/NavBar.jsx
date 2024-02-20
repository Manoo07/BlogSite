import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../public/vitamin.png';
const NavBar = () => {
  return (
    <nav className="bg-blue-500 p-4 text-white">
        <div className="container flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          <div className='flex gap-1'>
          <img src={logoImage} alt="Logo" className="h-8 w-auto" />
          <div className='text-neutral-200'>log Sphere</div>
          </div>
        </Link>
            <ul className="flex space-x-4">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/post">Post</Link></li>
            <li><Link to="/user">User</Link></li>
            <li><Link to="/sign-in">Logout</Link></li>
            </ul>
        </div>
    </nav>
  );
};

export default NavBar;
