import { createContext, useContext, useState } from 'react';
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(1); // Initial value

  const updateUser = (newUserId) => {
    setUserId(newUserId);
  };

  return (
    <UserContext.Provider value={{ userId, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
