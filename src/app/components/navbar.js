import formatDateOrTime from "../utils/formatDateOrTime";
import DarkModeButton from "./darkmodebutton";
import { useDispatch } from "react-redux";

const NavBar = ({username,logout,lastLogin,darkMode,setDarkMode}) =>{ 
    const dispatch = useDispatch();
    return(
    <div className={`${darkMode?"border-gray-900":"border-gray-300"} px-10 flex flex-row justify-between border-b-[0.2px]`}>
        <div>
            <p className="text-xl">{username}</p>
            <button className="text-red-500 text-xs" onClick={()=>dispatch(logout)}>Logout</button> 
        </div>
        <p className="self-center w-64 text-center me-5 text-xs"> Last Login: {formatDateOrTime(lastLogin)}</p>
        <DarkModeButton darkMode={darkMode} setDarkMode={setDarkMode}/>
    </div>
);
}

export default NavBar;