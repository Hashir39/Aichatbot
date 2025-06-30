import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./dashboard.css";
import { useAuth } from "@clerk/clerk-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react"

const Dashboard = () => {
  const queryClient = useQueryClient();
const [text, setText] = useState("");
const { getToken } = useAuth();


  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (text) => {
       const token = await getToken();
     return fetch(`http://localhost:3000/api/chats`,{
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    mutation.mutate(text);
    e.target.reset();
  };
  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="" />
          <h1>AI CHATBOT</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="" />
            <span>New Chat? </span>
          </div>
          <div className="option">
            <img src="/image.png" alt="" />
            <span>Create Images</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="" />
            <span>Improve my Code</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
        
          <input type="text" name="text" placeholder="Ask me anything..."   onChange={(e) => setText(e.target.value)}/>
          <button type="submit">
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;