import { Link } from "react-router-dom";
import "./homepage.css";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";


const Homepage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");


  return (
    
    <div className="homepage">
      
      <img src="/orbital.png" alt="" className="orbital" />
      <div className="left">
        <h1>AI CHATBOT</h1>
        <h2>Unleash your creativity and boost your productivity</h2>
        <h3>
          Unlock limitless ideas and work smarter by combining creativity with focused, high-impact productivity every day.
        </h3>
        <Link to="/dashboard">Let's GO</Link>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="" className="bot" />
          <div className="chat">
            <img
              src={
                typingStatus === "human1"
                  ? "/human1.jpeg"
                  : typingStatus === "human2"
                  ? "/human2.jpeg"
                  : "bot.png"
              }
              alt=""
            />
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
              "Human : We make food specially for Mice",
2000,
() => {
  setTypingStatus("bot");
},
"Bot : We create food specifically for Mice",
2000,
() => {
  setTypingStatus("human2");
},
"Human2 : We make food specially for Guinea Pigs",
2000,
() => {
  setTypingStatus("bot");
},
"Bot : We create food specifically for Guinea Pigs",
                2000,
                () => {
                  setTypingStatus("human1");
                },
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        <img src="/logo.png" alt="" />
        <div className="links">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;