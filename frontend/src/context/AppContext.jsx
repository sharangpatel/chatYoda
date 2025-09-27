
import {createContext,useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import  {dummyUserData,dummyChats } from '../assets/assets'

const AppContext = createContext()

export const AppContextProvider = ({children})=> {

    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const [chats,setchats] = useState([]);
    const [selectedChat,setSelectedChat] = useState(null);
    const [theme,setTheme] = useState(localStorage.getItem('theme') || 'dark');

    const fetchUser = async()=>{
        setUser(dummyUserData)
    }

    const fetchUserChats = async()=>{
        setchats(dummyChats)
        setSelectedChat(dummyChats[0])
    }

    useEffect(()=>{
        if(theme === 'dark'){
            document.documentElement.classList.add('dark')
        }else{
            document.documentElement.classList.remove('dark')
        }
    },[theme])

    useEffect(()=>{
        if(user){
            fetchUserChats()
        }else{
            setchats([])
            setSelectedChat(null)
        }
    },[user])

    useEffect(()=>{
        fetchUser()
    },[])

    const value = {
        navigate,user,setUser,chats,setchats,selectedChat,setSelectedChat,theme,setTheme
        }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = ()=> useContext(AppContext)