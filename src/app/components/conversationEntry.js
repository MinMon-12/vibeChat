//ConversationEntry Component - shows dialog boxes for messages of the conversation
import React,{useEffect, useRef } from "react"; //useRef is a React hook that create a persistent reference to a DOM element or a value without causing re-renders.
import formatDateOrTime from "../utils/formatDateOrTime";
import '../globals.css'

const ConversationEntry = ({responses,loading}) => {
    const scrollRef = useRef(null);
    useEffect(() => {
        // Scroll to bottom when responses changes
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight, 
                behavior: "smooth" //smooth scrolling
            });
        }
    }, [responses]); // Runs every time a new message arrives
    return(
    <div ref={scrollRef} className="flex flex-col px-[3%] flex-1 min-h-0 overflow-y-auto">
        {responses.map((item,index)=>(
            <React.Fragment key={index}>
                <div className={`${item.role === "system" ? "hidden" : "px-4 py-2 my-1 rounded-2xl shadow break-words"}  
                                    ${item.role === "user"
                                    ? "bg-blue-600 text-white rounded-br-none text-right self-end max-w-[75%]"
                                    : "bg-[var(--message-box-color)] rounded-bl-none text-left self-start"
                                }`}>
                    {item.content}
                </div>
                <p className={`${item.role === "system" ? "hidden" : "text-xs"} ${item.role === "user" ? "text-right self-end" : "text-left self-start"}`}>{formatDateOrTime(item.when)}</p>
            </React.Fragment>
        ))}
        {loading?
        <div className="loadingContainer bg-[var(--message-box-color)] px-4 py-2 my-1 rounded-2xl rounded-bl-none">
            <svg fill="hsla(0, 0%, 37%, 1.00)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4" cy="12" r="3"><animate id="spinner_qFRN" begin="0;spinner_OcgL.end+0.25s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33"/></circle>
            <circle cx="12" cy="12" r="3"><animate begin="spinner_qFRN.begin+0.1s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33"/></circle>
            <circle cx="20" cy="12" r="3"><animate id="spinner_OcgL" begin="spinner_qFRN.begin+0.2s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33"/></circle></svg>
        </div>:<></>}
    </div>
    )
};


export default ConversationEntry;