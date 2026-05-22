const Login = ({user,setUserName,setUserPassword,userName,userPassword,login}) => (
    <div className='flex items-center justify-center min-h-screen bg-cover bg-center login-box'>
        <div className='bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-sm border border-white/30'> 
        <p className='text-2xl font-bold text-center text-blue-500 drop-shadow-xl'>WELCOME</p>
        <p className='text-sm font-semibold mb-6 text-center text-blue-500 text-black drop-shadow-xl'>Please login to continue</p>
            <input type='text' onChange={ (e) => { setUserName(e.target.value); } } placeholder='Enter username' value={userName} 
            className='w-full px-4 py-2 mb-3 bg-white/70 border border-white/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder-gray-600 text-black'/>
            <input type='password' onChange={ (e) => { setUserPassword(e.target.value); } } placeholder='Enter password' value={userPassword}
            className='w-full px-4 py-2 mb-5 bg-white/70 border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-600 text-black'/>
            <button className='w-full py-2 items-center bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 shadow-md' onClick={login}>Login</button>
        </div>
    </div>
);

export default Login;