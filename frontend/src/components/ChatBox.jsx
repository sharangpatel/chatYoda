import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";
import toast from "react-hot-toast";

const ChatBox = () => {

  const containerRef = useRef(null);

  const {selectedChat,theme,user,axios,token,setUser} = useAppContext()
  const [messages,setMessages] = useState([])
  const [loading,setLoading] = useState(false)

  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('text')
  const [isPublished,setIsPublished] = useState(false)

  const onSubmit = async(e) => {
    try {
      e.preventDefault()
      if(!user) return toast('Login to send message')
        setLoading(true)
        const promptCopy = prompt
        setPrompt('')
        setMessages(prev => [...prev, {role:'user', content:prompt, timestamp:Date.now(), isImage: false}])
        const {data} = await axios.post(`/api/message/${mode}`,{chatId:selectedChat._id, prompt, isPublished}, {headers:{Authorization:token}})

        if(data.success){
          setMessages(prev => [...prev, data.reply])
          //decrease credits
          if(mode === 'image'){
            setUser(prev => ({...prev, credits: prev.credits - 2}))
          }else{
            setUser(prev => ({...prev, credits: prev.credits - 1}))
          }
        }else{
          toast.error(data.message)
          setPrompt(promptCopy)
        }
    } catch (error) {
      toast.error(error.message)
    }finally{
      setPrompt('')
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTo({
        top:containerRef.current.scrollHeight,
        behaviour:"smooth"
      })
    }
  },[messages])

  useEffect(()=>{
    if(selectedChat){
      setMessages(selectedChat.messages)
    }
  },[selectedChat])

  return (
  <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
    {/* chat messages */}
    <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
      {messages.length === 0 && (
      <div className="h-full flex flex-col items-center justify-center gap-2 text-primary"> 
        <img src={theme=== 'dark'?assets.chatYoda1 : assets.chatYoda1}/>
        <p className="mt-5 text-3xl sm:text-5xl text-center text-gray-500 dark:text-white">Ask me anything!</p>
      </div> 
      )}
      {messages.map((message,index)=><Message key={index} message={message}/>)}

      {/* Three dots loading animation after the user prompt */}
      {
        loading && <div className="loader flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
        </div>   
      }

    </div>

    {/*Checkbox for the image when user wants to publish it on community page*/}
    {mode === 'image' && (
      <label className="inline-flex items-center gap-2 mt-3 text-sm mx-auto ">
        <p className="pb-2 mb-2 text-s ">Publish generated image to community</p>
        <input type="checkbox" className="cursor-pointer mb-3 pb-2" checked={isPublished} onChange={(e)=>setIsPublished(e.target.checked)}/>
      </label>
    )}

    {/* prompt input  */}
    <form onSubmit={onSubmit} className="bg-primary/20 dark:bg-[#150528] border border-primary dark:border-[#80609f] rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center">
      <select onChange={(e)=>setMode(e.target.value)} className="text-sm pl-3 pr-2 outline-none" value={mode}>
        <option className="dark:bg-purple-900" value="text">Text</option>
        <option className="dark:bg-purple-900" value="image">Image</option>
      </select>
      <input onChange={(e)=>setPrompt(e.target.value)} type="text" placeholder="Type your prompt here..." className="flex-1 w-full text-sm outline-none" value={prompt } required/>
      <button disabled={loading}>
        <img src={loading ? assets.stop_icon : assets.send_icon} alt="" className="cursor-pointer w-8"/>
      </button>
    </form>

  </div>
  )
};

export default ChatBox;

