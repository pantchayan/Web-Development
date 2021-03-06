// adding new chat documents 
// setting up real time chat listeners 
// updating username
// updating room 
 
// =======================================================================================================

// CLASS METHODOLOGY 

class chatRoom{
    constructor(room, username){
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }

    async addChat(message){
        // this function adds a chat document into the chats collection
        const now = new Date();

        const chat = {
            message: message,
            room: this.room,
            username: this.username,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        };

        const response = await this.chats.add(chat);
        return response;
    }

    getChats(callback){
        // Unsubscribe function returned from realtime listener

        this.unsub = this.chats
        .where('room','==',this.room)
        .orderBy('created_at')
        .onSnapshot(snapshot=>{
            // console.log(snapshot.docChanges());
            snapshot.docChanges().forEach(change => {
                if(change.type==='added' ){
                    // console.log(change.doc.id);
                    callback(change.doc.data(),change.doc.id,1);
                }
                else if(change.type === 'removed'){
                    callback(change.doc.data(),change.doc.id,2);
                }
            });
        })
    }

    updateName(username){
        this.username = username;
        localStorage.setItem('username', username);
    }

    updateRoom(room){
        this.room = room;
        console.log("room Updated");
        if(this.unsub) 
        {
            this.unsub();
        }
    }
}



// let cr = new chatRoom("general","Chayan");

// console.log(cr);


// cr.addChat("Fancy a game of chess?")
//     .then(resolve=>{
//         console.log("Chat added");
//     }).catch(err=>{
//         console.log(err);
//     })


// cr.getChat();


// cr.updateRoom("gaming");
