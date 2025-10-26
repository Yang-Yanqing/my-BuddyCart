import {useState} from "react";

const ChatInput=({onSend,disabled=false,maxLen=500})=>{
    const [input,setInput]=useState("");
    const onChange=(e)=>{
    setInput(e.target.value.slice(0,maxLen));}

const submit=()=>{
    const text=input.trim();
    if(!text||disabled)return;
    onSend?.(text);
    setInput(""); 
}

const onKeyDown=(e)=>{
    if(e.nativeEvent.isComposing)return;
    if(e.key==="Enter"&&e.ctrlKey){
        e.preventDefault();
        submit();}
}

const onSubmit=(e)=>{
   e.preventDefault();
    submit();
}

    return(
     <main>
      
     <form className="chatInputForm" onSubmit={onSubmit}>
     <p>
        <textarea 
     name="chatInput" value={input} 
     onChange={onChange}
     onKeyDown={onKeyDown} 
     disabled={disabled}
     placeholder="Type a message here...(Enter to send, Shift+Enter for newline)"
     rows={3}
        />
     </p>
     
     <button type="submit" disabled={disabled || !input.trim()}>Send</button>
     </form>
     </main>
    )

}

export default ChatInput;