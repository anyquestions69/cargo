async function showUser(){
    let id =window.location.href.split('?id=')[1]
    let response = await fetch('/api/orders/'+id,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
    })
    if(response.ok){    
        let res = await response.json()
        console.log(res)
        $('#status').val(res.points[res.status].status)
    }
}
showUser()
$('#addForm').on('submit', async (e)=>{
    e.preventDefault()
    let id =window.location.href.split('?id=')[1]
    let response  = await fetch('/api/orders/status/'+id,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body:JSON.stringify({status:$('#status').val()})
        })
    
})
$('#moveForward').on('submit', async (e)=>{
    e.preventDefault()
    let id =window.location.href.split('?id=')[1]
    let response = await fetch('/api/orders/next/'+id,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
    })
    if(response.ok){    
        window.location.href="/admin"    
    }
})