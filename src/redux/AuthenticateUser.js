import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { setUser, logout } from './user-slice';
import App from '../app/components/app'; //surronding architecture of the page
import Login from '../app/components/login';
  
const AuthenticateUser = ( { user, setUser, logout } ) => {
  const [userName, setUserName ]          = React.useState('');
  const [userPassword, setUserPassword ]  = React.useState('');
  const [lastLogin, setLastLogin ]  = React.useState('');

  const login = async () => {
    const user_query = { user_name: userName, user_password: userPassword };

    const {data} = await axios.post('/api/authenticate', user_query);
    if (data.authenticated === true) {
      setUser( data.account );
      setLastLogin(data.account.lastlogin);
      console.log(lastLogin);
    } else {
      setUserName('');
      setUserPassword('');
    }
  }

  return (
    <>
    { !user ? 
        <Login user={user} setUserName={setUserName} setUserPassword={setUserPassword} userName={userName} userPassword={userPassword} login={login} />
        : 
        <>
          
          <App username={userName} logout={logout} lastLogin={lastLogin} />
        </>
    }
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

export default connect(mapStateToProps, { setUser, logout })(AuthenticateUser);