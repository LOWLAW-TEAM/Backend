function login(){
    const userID = document.getElementById('login-id').value;
    const userPW = document.getElementById('login-pw').value;


    if (userID.value == '' || userPW.value==''){
        alert("아이디 비밀번호 모두 입력해주세요.")
    }else{
        fetch('/login/',{
            method:'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify({
                email:userID,
                password:userPW
            })
        })
        .then(response=>{
            if(response.status == 200){
                return response.json();
            }
            else if(response.status==401){
                alert("잘못된 아이디 혹은 비밀번호를 입력하셨습니다.");
            }else{
                throw new Error('에러 발생');
            }
        }).catch((error)=>console.log(error))
        .then((data)=>{
            if(data.message=='로그인 성공'){
                localStorage.setItem('access_token',data.access_token);
                localStorage.setItem('expired_in',data.expired_in);
                alert("로그인 성공!");
                window.location.href = '{% static "html/home.html" %}';
            }
        })
    }

}