"use client";
import {useEffect, useRef, useState} from "react";
type ChatAPI = {
  call: (method: string) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off?: (event: string, callback: (data: any) => void) => void;
};
declare global {interface Window {LiveChatWidget?: ChatAPI}}

// Preserve the installed provider/conversation UI; show only its launcher until
// the visitor requests the message field. No account-wide widget setting changes.
export default function ChatLauncher() {
  const [ready,setReady]=useState(false),[open,setOpen]=useState(false);
  const control=useRef<ChatAPI | undefined>(undefined);
  useEffect(()=>{
    document.documentElement.dataset.chatOpen=String(open);
    return ()=>{delete document.documentElement.dataset.chatOpen;};
  },[open]);
  useEffect(()=>{
    let cleanup=()=>{},attached=false;
    const observer=new MutationObserver(()=>attach());
    function attach(){
      const api=window.LiveChatWidget;if(attached||!api?.on||!api.call)return;
      attached=true;control.current=api;observer.disconnect();
      const visibility=(data:{visibility?:string})=>{
        if(data.visibility==='maximized')setOpen(true);
        else {setOpen(false);if(data.visibility==='minimized')api.call('hide');}
      };
      const initialized=(data:any)=>{
        setReady(true);document.documentElement.dataset.chatLauncher='ready';
        const active=['chatting','queued'].includes(data?.customerData?.status);
        if(active&&data?.state?.visibility==='maximized')setOpen(true);
        else {api.call('hide_greeting');api.call('hide');setOpen(false);}
      };
      api.on('visibility_changed',visibility);api.on('ready',initialized);
      cleanup=()=>{api.off?.('visibility_changed',visibility);api.off?.('ready',initialized);};
    }
    observer.observe(document.documentElement,{childList:true,subtree:true});attach();
    return ()=>{observer.disconnect();cleanup();};
  },[]);
  if(!ready||open)return null;
  return <button type="button" className="site-chat-launcher" aria-label="Open chat" aria-haspopup="dialog" onClick={()=>{
    try{control.current?.call('maximize');setOpen(true);}catch{setOpen(false);}
  }}>
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h14a1 1 0 011 1v11a1 1 0 01-1 1h-7l-5 4v-4H5a1 1 0 01-1-1V5a1 1 0 011-1Z"/></svg>
  </button>;
}
