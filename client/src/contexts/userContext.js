import { createContext, useContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";

const UserContext = createContext();
function useValue() {
  const value = useContext(UserContext);
  return value;
}

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setUser(userInfo);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logOutHandler }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, useValue };
export default UserProvider;
