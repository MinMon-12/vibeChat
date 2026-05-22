const DarkModeButton = ({darkMode, setDarkMode}) => {
  
    const toggleTheme = () => {
        document.documentElement.classList.toggle("darkMode");
        setDarkMode(!darkMode);
    };

    return (
        <button onClick={toggleTheme}>
            {darkMode?<img className="w-[30px] h-[30px] self-center" src="/assets/dark_mode.png" alt="light-mode"></img>:<img className="w-[30px] h-[30px] self-center" src="/assets/light_mode.png" alt="dark-mode"></img>}
        </button>
    );
}

export default DarkModeButton;
