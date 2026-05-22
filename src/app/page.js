"use client"
import { Provider } from 'react-redux'
import store from '../redux/store'
import AuthenticateUser from '../redux/AuthenticateUser'


export default function Home() {
  return (
    <Provider store={store}>
      <AuthenticateUser />
    </Provider>
  )
}