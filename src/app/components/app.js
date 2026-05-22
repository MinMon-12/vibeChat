//App (or Home) Component - surrounding architecture of the page
import React from "react";
import Conversation from "./conversation";
import NavBar from "./navbar";
import '../globals.css'
import { useState } from "react";

const App = ({className,lastLogin,username,logout}) => {
    const [darkMode, setDarkMode] = useState(false);
    return(
    <div className={className}>
        <NavBar className="navBar" username={username} logout={logout} lastLogin={lastLogin} darkMode={darkMode} setDarkMode={setDarkMode}></NavBar>
        <Conversation darkMode={darkMode}/>
    </div>)
};



export default App;