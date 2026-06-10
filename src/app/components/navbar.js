import formatDateOrTime from "../utils/formatDateOrTime";
import DarkModeButton from "./darkmodebutton";
import { useDispatch } from "react-redux";

const NavBar = ({username,logout,lastLogin,darkMode,setDarkMode}) =>{ 
    const dispatch = useDispatch();
    return(
    <div className={`${darkMode?"border-gray-900":"border-gray-300"} px-4 sm:px-6 lg:px-10 flex flex-row items-center justify-between gap-2 border-b-[0.2px]`}>
        <div className="min-w-0 shrink">
            <p className="text-base sm:text-xl truncate">{username}</p>
            <button className="text-red-500 text-xs" onClick={()=>dispatch(logout)}>Logout</button> 
        </div>
        <p className="hidden md:block self-center text-center text-xs shrink-0">Last Login: {formatDateOrTime(lastLogin)}</p>
        <div className="shrink-0">
            <DarkModeButton darkMode={darkMode} setDarkMode={setDarkMode}/>
        </div>
    </div>
);
}

export default NavBar;