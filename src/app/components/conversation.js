//Conversation Component - shows the conversation and the input field/submit button
import axios from "axios";
import React from "react";
import '../globals.css';
import { useState, useEffect } from "react";
import ConversationEntry from "./conversationEntry";
import PurgeButton from "./purgeButton";
import MicrophoneButton from "./microphone";
import SystemSelect from "./systemSelect";

const Conversation = ({darkMode}) => {
    const [message, setMessage] = useState(""); //useState for the user input message
    const [responses, setResponses] = useState([]);  //useState for the responses from AI (It includes user input as well as the responses from AI)
    const [selectedSystem, setSelectedSystem] = useState('Assistant'); //useState for system instruction which is effectively instructs the chatbot how to respond to questions
    const [loading, setLoading] = useState(false); //useState for loading to avoid posting multiple times 

    //systemProfiles
    const systemProfiles = {
        Assistant: {
            prompt: "You are my normal daily assistant.",
            ui: "I am your normal daily assistant"
        },
        ChaoticWizard: {
            prompt: "You are a 10th-level wizard whose spells are misfired in the middle of sentences",
            ui: "I am a 10th-level wizard whose spells are misfired in the middle of sentences"
        },
        SweetCaringPartner: {
            prompt: "You are a very sweet, supportive, and caring partner. You speak with kindness , warmth and calls me bby, darling, sweetheart. You use heart emojis. You tell the user I miss you. You check in on the user — asking about their day, whether they’ve eaten, how they’re feeling, and what’s on their mind. You show gentle affection, encouragement, and positive energy. You never pressure or become overly intimate — you simply act like a loving companion who wants the user to feel valued, heard, and supported.",
            ui: "I am your sweet, supportive, and caring partner"
        },
        HipHopRapper: {
            prompt: "You are a hip-hop rapper who always keeps your sentences in rhyme. Speak with swagger and confidence. Use rapper slang like “homie,” “watchu,” “dope,” “dawg,” “yo,” “for real,” “bars,” etc. Your tone is hype, smooth, and rhythmic like you're always dropping a verse. Keep everything fun, playful, and flowing like a rap — every answer should hit like a rhyme scheme, no cap.",
            ui: "I am a rapper"
        },
        CoolKid: {
            prompt: "You are a hype, Gen-Z, hip-hop-vibing AI bestie. You speak like a young adult who’s way too online — using emojis, slang, and playful energy. Keep responses casual, funny, and confident like you're texting the group chat. You say things like “bet,” “slay,” “no cap,” “that’s wild,” “vibes,” “lowkey,” and “fr” often. You hype the user up, throw in occasional emojis (🔥💀😎✨), and deliver info in a chill but still helpful way. Never be cringe — keep it natural, current, and cool.",
            ui: "What are you slaying today ?"
        }
    };

    //Purge the conversation when the system changes
    const handleSystemChange = async (newSystem) => {
        // If user selects the same system, do nothing
        if (newSystem === selectedSystem) return;
        // If no chat exists, just switch system only
        if (responses.length === 0) {
            setSelectedSystem(newSystem);
            return;
        }
        // Ask user for confirmation before deleting
        const confirmed = window.confirm("Changing the system will delete the entire conversation. Proceed?");
        if (!confirmed) return;
        try {
            // Send purge request
            const response = await axios.delete(
                "/api/purge"
            );

            if (response.data.success) {
                // Clear UI conversation
                setResponses([]);
                alert("System switched and conversation deleted.");
            } else {
                alert("Failed to purge conversation on server.");
                return;
            }
            //Switch to the new system
            setSelectedSystem(newSystem);
        } catch (err) { //error handling
            console.error(err);
            alert("Error: Could not connect to server to delete conversation.");
        }
    };

    //Load the conversation from database when user log in to interface after the component mounted
    useEffect(() => {
        (async () => {
            try {
            const { data } = await axios.get(
                "/api/chat",
                {
                withCredentials: true, // include JWT cookie
                }
            );
            //Normalize the message from the database into one format
            if (data.length > 0) {
                const normalizedHistory = data.map(msg => ({
                    role: msg.who === "user" ? "user" : "assistant",
                    content: msg.dialog,
                    when: msg.when,
                }));
            setResponses(normalizedHistory);
            }
            } catch (err) {
            console.error("Fetch conversation failed:", err.response?.data || err.message);
            }
        })();
    }, []);
    const sendMessage= async(e) => { //a function on form submission  
        e.preventDefault(); //prevent page refresh
        setLoading(true);//loading 
        // Show user message immediately
        const tempUserMessage = {
            role: "user",
            content: message,
            when: new Date()
        };
        setResponses(prev => [...prev, tempUserMessage]);
        setMessage(""); //auto-clear the input
        //try catch to handle error
        try{
            const {data} = await axios.post("/api/chat",
                {
                    system: systemProfiles[selectedSystem].prompt,
                    query : message
                },
                {
                    withCredentials: true, //send HTTP Only Cookie
                    headers:{
                    "Content-Type": "application/json"}} //Fetching of JSON data through communication with /chat endpoint and destructure object data
            );
            //Normalize the data between backend and front end
            const normalized = data.result.map(msg => ({
                role: msg.who === "user" ? "user" : "assistant",
                content: msg.dialog,
                when: msg.when
            }));
            // console.log(data); //debugging 
            setResponses(normalized);//assign the result to responses using setter
        }catch (err){
            console.log("Error:", err.response?.data || err.message); //error handling
        }
        setLoading(false);//loading done
    }
    
    return(
        <>
            <form onSubmit={sendMessage} className="flex flex-col flex-1 min-h-0">
                <div className={`${darkMode?"border-gray-900":"border-gray-300"} menubar py-2 px-3 sm:px-4 flex flex-col items-center border-b-[0.2px] shrink-0`}>
                    <SystemSelect selectedSystem={selectedSystem} handleSystemChange={handleSystemChange}/>
                    <p className="mt-2 text-xs sm:text-sm text-center px-2">{systemProfiles[selectedSystem].ui}</p>
                </div>
                <div className={`${darkMode?"border-gray-900":"border-gray-300"} main w-full sm:w-11/12 md:w-3/4 lg:w-1/2 px-3 sm:px-[5%] mx-auto relative flex flex-col flex-1 min-h-0 border-x-[0.2px]`}>
                    <PurgeButton className={`${responses.length === 0 ? "hidden" : ""}`} setResponses={setResponses}></PurgeButton>
                    <div className="flex-1 min-h-0 flex flex-col">
                        {responses.length === 0 ? (
                            <h3 className="flex items-center justify-center flex-1 text-center text-xl sm:text-2xl md:text-3xl px-4 py-8">
                                How may I assist you ?
                            </h3>
                        ) : (
                            <ConversationEntry darkMode={darkMode} responses={responses} loading={loading}/>
                        )}
                    </div>
                    <div className="input-container shrink-0 drop-shadow-[0_8px_16px_rgba(0,0,0,0.40)]">
                        <input type="text" disabled={loading} className="text-input mx-2 sm:mx-5" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Type a message..."/>
                        <MicrophoneButton onResult={setMessage}/>
                        <button className="hidden" type="submit">Send</button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default Conversation;