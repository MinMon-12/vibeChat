//App (or Home) Component - surrounding architecture of the page
import React from "react";
import Conversation from "./conversation";
import NavBar from "./navbar";
import '../globals.css'
import { useState } from "react";

const App = ({className,lastLogin,username,logout}) => {
    const [darkMode, setDarkMode] = useState(false);
    return(
    <div className={`${className ?? ""} flex flex-col h-[100dvh] overflow-hidden`}>
        <NavBar className="navBar shrink-0" username={username} logout={logout} lastLogin={lastLogin} darkMode={darkMode} setDarkMode={setDarkMode}></NavBar>
        <Conversation darkMode={darkMode}/>
    </div>)
};



export default App;