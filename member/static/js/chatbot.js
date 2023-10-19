const textarea = document.getElementById("message_input");
const sendbtn = document.getElementById('message_btn')
textarea.addEventListener("input", function() {
    this.style.height = "auto";

    const lineHeight = parseFloat(getComputedStyle(this).lineHeight);
    const minRows = 3;

    const scrollHeight = this.scrollHeight;
    const maxScrollHeight = minRows * lineHeight;

    if (scrollHeight >= maxScrollHeight) {
        this.style.overflowY = "auto";
    } else {
        this.style.height = scrollHeight + "px";
    }
});

textarea.style.height = "auto";
sendbtn.addEventListener("click",()=>{
    addMessage_user(textarea.value);
    submit(textarea.value);
    textarea.value = '';
    textarea.rows = '1';
})
textarea.addEventListener("keydown",(e)=>{
    if(e.keyCode == '13'){
        if(!e.shiftKey){
            addMessage_user(textarea.value);
            submit(textarea.value);
            textarea.value = '';
            textarea.rows = '1';
        }
    }
})
function submit(message){
    fetch('/chatbot',{
        method:'POST',
        header:{
            'Content-Type' : 'application/json'
        },
        body:JSON.stringify({
            user_input:textarea.value
        })
    })
    .then(response=>{
        if(response.status==200){
            return response.json();
        }
    }).catch((error)=>console.log(error))
    .then((data)=>{
        addMessage_com(data.data)
    })

}


function addMessage_user(message){
    var container = document.getElementById('message_container');
    var user_message = document.createElement('div');
    user_message.classList.add('user_message');

    var ask = document.createElement('p');
    ask.textContent = message;

    user_message.appendChild(ask);
    container.appendChild(user_message);

}
function addMessage_com(data){
    var container = documnet.getElementById('message_container');
    var com_message = documnet.createElement('div');
    com_message.classList.add('com_message');

    var answer = document.createElement('p');
    answer.textContent = data.best_answer;

    com_message.appendChild(answer);
    if(data.legal_info.law != ''){
        var com_btn = document.createElement('button');
        com_btn.textContent = "참고 법령 - "+data.legal_info.law+"에 대해 확인하기";
        com_btn.classList.add('com_btn');
        com_message.appendChild(com_btn);
    }
    if(data.legal_info.prec != ''){
        var com_btn = document.createElement('button');
        com_btn.textContent = "참고 판례 - "+data.legal_info.law+"에 대해 확인하기";
        com_btn.classList.add('com_btn');
        com_message.appendChild(com_btn);
    }
    container.appendChild(com_message)
}
function addMessage_com_law(data){
    var container = documnet.getElementById('message_container');
    var com_message = documnet.createElement('div');
    com_message.classList.add('com_message');

    var answer = document.createElement('p');
    answer.textContent = data.law_content;

    com_message.appendChild(answer);
    container.appendChild(com_message)
}
function addMessage_com_prec(data){
    console.log(data);
    var container = document.getElementById('message_container');
    var com_message = document.createElement('div');
    var text_container = document.createElement("div");
    com_message.classList.add('com_message');
    
    for(const key in data){
        var text = document.createElement("p");
        text.innerHTML = '<span class="prec_bold">' + key + '</span> ' + '<span class="prec_thin">' + data[key] + '</span>';
        com_message.appendChild(text)
    };
    container.appendChild(com_message);
}
function checkLaw(data){
    var asklaw = data.textContent;
    asklaw = asklaw.replace("참고 법령 - ",'')
    asklaw = asklaw.replace("에 대해 확인하기")

    fetch('/chatbot/law',{
        method:'POST',
        header:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            law : asklaw
        })
    })
    .then(response=>{
        if(response.status==200){
            return response.json();        
        }
    }).catch((error)=>console.log(error))
    .then((data)=>{
        addMessage_com_law(data.law)
    })
}
function checkPrec(data){
    var askprec = data.textContent;
    askprec = prec.replace("참고 판례 - ",'')
    askprec = prec.replace("에 대해 확인하기",'')

    fetch('/chatbot/prec',{
        method:'POST',
        header:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            prec : askprec
        })
    })
    .then(response=>{
        if(response.status==200){
            return response.json();        
        }
    }).catch((error)=>console.log(error))
    .then((data)=>{
        addMessage_com_prec(data)
    })
}