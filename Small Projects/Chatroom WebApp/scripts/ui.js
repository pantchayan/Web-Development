// render chat templates to the DOM
// clear the list of chats  (when the room changes)


class chatUI{
    constructor(list){
        this.list = list;
    }
    clear(){
        this.list.innerHTML = ``;
    }
    render(data){
        //data ==> chat object
        const when = dateFns.distanceInWordsToNow(
            data.created_at.toDate(),
            { addSuffix:true }
          );
        const html = `
            <li class="list-group-item">
                <span class="username">${data.username}</span>
                <span class="message">${data.message}</span>
                <div class="time">${when}</div>
            </li>
        `;  

        console.log("I am inside render");
        this.list.innerHTML += html;
    }
}