import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import User from './components/User'
import UpdateComponent from './components/UpdateComponent';
import PostCard from './components/PostCard';
import { UserProvider } from './components/UserContext';
import './index.css';

function App() {
  return (
    <UserProvider>
      <Router>
      <Routes>
        <Route path="/" element={<WithNavBar element={<HeroSection />} />} />
        <Route path="/post" element={<WithNavBar element={<PostCard />} />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/user" element={<WithNavBar element={<User />} />} />
        <Route path="/update-blog" element={<WithNavBar element={<UpdateComponent />} />} />
      </Routes>
    </Router>
    </UserProvider>
    
  );
}

const WithNavBar = ({ element }) => (
  <div>
    <NavBar />
    {element}
  </div>
);

export default App;
