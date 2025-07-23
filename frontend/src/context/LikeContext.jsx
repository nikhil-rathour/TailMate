import { createContext, useContext, useState } from "react";

const LikeContext = createContext();

export function UseLike() {
  return useContext(LikeContext);
}

export function LikeProvider({ children }) {
  const [likes, setLikes] = useState([]);

  const addLikes = (like) => {
    setLikes([...likes, like]);
    console.log("likes", likes);
  };

  const removeLikes = (id) => {
    setLikes(likes.filter((like) => like.postId._id === id));
  };

  const value = {
    addLikes,
    removeLikes,
    setLikes,
    likes
  };

  return <LikeContext.Provider value={value}>{children}</LikeContext.Provider>;
}
