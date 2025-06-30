import NewPrompt from "../../components/newPrompt/NewPrompt";
import "./chatpage.css";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";
import { useAuth } from "@clerk/clerk-react";
import './chatpage.css'

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();
  const { getToken } = useAuth();

  
const { isPending, error, data } = useQuery({
  queryKey: ["chat", chatId],
  queryFn: async () => {
    const token = await getToken(); // Get Clerk session token

    const res = await fetch(`http://localhost:3000/api/chats/${chatId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
  },
});

  console.log(data);

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {isPending
            ? "Loading..."
            : error
            ? "Something went wrong!"
            : data?.history?.map((message, i) => (
                <>
                
                  {message.img && (
                    <IKImage
                      urlEndpoint="https://ik.imagekit.io/6x57n8we3"
                      path={message.img}
                      height="300"
                      width="400"
                      transformation={[{ height: 300, width: 400 }]}
                      loading="lazy"
                      lqip={{ active: true, quality: 20 }}
                    />
                  )}
                  <div
                    className={
                      message.role === "user" ? "message user" : "message"
                    }
                    key={i}
                  >
                    <Markdown>{message.parts[0].text}</Markdown>
                  </div>
                </>
              ))}

          {data && <NewPrompt data={data}/>}
          <NewPrompt/>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;