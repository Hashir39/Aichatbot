import { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data }) => {
  const [messages, setMessages] = useState([]);
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const endRef = useRef(null);
  const formRef = useRef(null);

  const chat = model.startChat({
    history:
      data?.history?.map(({ role, parts }) => ({
        role,
        parts: [{ text: parts[0].text }],
      })) || [],
    generationConfig: {
      // Optional config
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      const lastBotMessage = messages
        .filter((m) => m.type === "bot")
        .slice(-1)[0]?.text;

      const lastUserMessage = messages
        .filter((m) => m.type === "user")
        .slice(-1)[0]?.text;

      return fetch(`http://localhost:3000/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: lastUserMessage || undefined,
          answer: lastBotMessage || undefined,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", data._id] }).then(() => {
        formRef.current.reset();
        setImg({
          isLoading: false,
          error: "",
          dbData: {},
          aiData: {},
        });
      });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const add = async (text, isInitial) => {
    if (!isInitial) {
      setMessages((prev) => [...prev, { type: "user", text }]);
    }

    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );

      let accumulatedText = "";
      for await (const chunk of result.stream) {
        accumulatedText += chunk.text();
      }

      setMessages((prev) => [...prev, { type: "bot", text: accumulatedText }]);
      mutation.mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    e.target.reset();
    add(text, false);
  };

  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, img.dbData]);

  return (
    <>
      {img.isLoading && <div className="">Loading...</div>}

      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint="https://ik.imagekit.io/6x57n8we3"
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}

      {messages.map((msg, idx) => (
        <div key={idx} className={`message ${msg.type}`}>
          <Markdown>{msg.text}</Markdown>
          
        </div>
      ))}

      <div className="endChat" ref={endRef}></div>

      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="Ask anything..." />
        <button>
          <img src="/arrow.png" alt="Send" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
