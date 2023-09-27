async function showUser(){
    let id =window.location.href.split('?id=')
    let response = await fetch('/api/users/'+id,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
    })
    if(response.ok){    
        let res = await response.json()
        console.log(res)
        $('#email').val(res.email)
        $('#address').val(res.place||'')
    }
}