import { createContext, useState } from "react";

const defaultUser = {
  user_id: 1,
  username: "patterbear",
  email: "benjamin.mcgregor@muralmap.com",
  avatar_url:
    "https://res.cloudinary.com/drfu0sqz0/image/upload/v1727948466/benjamin_gucjit.jpg",
  name: "Benjamin McGregor",
};

export const UserContext = createContext<any>({
  loggedInUser: defaultUser,
  setLoggedInUser: () => {},
});

export const UserProvider = ({ children }: { children: any }) => {
  const [loggedInUser, setLoggedInUser] = useState(defaultUser);

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </UserContext.Provider>
  );
};
