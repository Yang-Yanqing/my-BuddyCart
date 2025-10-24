const createCircularBuffer=(capacity)=>{
    const buf=[];
    return{
    push: (item) => { buf.push(item); if (buf.length > capacity) buf.shift(); },
    toArray: () => buf.slice(),
    clear: () => {buf.length = 0;}
    }
}

class ChatRoom{
    constructor(id){
        this.id=id;
        this.members=new Map();
        this.showcase=null;
        this.messages=createCircularBuffer(200)
    }
   addMember(socketId,user){this.members.set(socketId,user)}
   addMessage(msg){this.messages.push(msg)}
   clearIfEmpty(){if(this.members.size===0)this.destroy();}
   destroy() {this.members.clear();
    this.showcase = null;
    this.messages.clear();
    }
   removeMember(socketId){this.members.delete(socketId)}
}

const rooms=new Map();
const ensureRoom=(id)=>{
    if (!rooms.has(id)) rooms.set(id, new ChatRoom(id));
    return rooms.get(id);
}


const sanitize=(text)=>{
    return String(text || "").replace(/[<>]/g, s => (s === "<" ? "&lt;" : "&gt;")).slice(0, 500);
}

module.exports = { rooms, ensureRoom, sanitize };