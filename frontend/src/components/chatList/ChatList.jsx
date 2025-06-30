import { Link } from "react-router-dom";
import "./chatList.css";
import { useQuery} from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react"; //
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";


const ChatList = () => {
  const listRef = useRef();

  useEffect(() => {
  const savedScroll = sessionStorage.getItem("chatScroll");
  if (listRef.current && savedScroll) {
    listRef.current.scrollTop = parseInt(savedScroll);
  }

  return () => {
    if (listRef.current) {
      sessionStorage.setItem("chatScroll", listRef.current.scrollTop);
    }
  };
}, []);
    const { getToken } = useAuth(); // 👈 get the token
   
  const fetchChats = async () => {
    const token = await getToken(); // 👈 retrieve Clerk session token

    const res = await fetch(`http://localhost:3000/api/userchats`, {
      headers: {
        Authorization: `Bearer ${token}`, // 👈 send token in Authorization header
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user chats");
    }

    return res.json();
  };

  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: fetchChats,
  });

    return (
        <div className="chatList" ref={listRef}>
            <span className="title">DASHBOARD</span>
            <Link to="/dashboard">Create a new Chat</Link>
            <Link to="/">Explore AI CHATBOT</Link>
            <Link to="/">Contact</Link>
            <hr />
            <span className="title">HISTORY</span>
            <div className="list">
                {isPending
                    ? "Loading..."
                    : error
                        ? "Something went wrong!"
                        : data?.map((chat) => (
                            <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
                                {chat.title}
                            </Link>
                        ))}
            </div>
            <hr />
            <div className="upgrade">
                <img src="/logo.png" alt="" />
                <div className="texts">
                    <span>Upgrade to AI CHATBOT Pro</span>
                    <span>Get unlimited access to all features</span>
                </div>
            </div>
        </div>
    )
}

export default ChatList