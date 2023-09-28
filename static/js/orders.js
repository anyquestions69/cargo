async function show(){

let response = await fetch('/api/orders/',{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
})
if(response.ok){    
  let res = await response.json()

  let role = await fetch('/api/users/checkRole', {method:'PUT'})
  if( role.ok){
  let rtext= await role.text()
  
  if(rtext=='admin'){
    
    for(let r of res){
        console.log(r.status)
    $('#orderList').append(`
    <a href="/order?id=${r.trackId}" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
    <img src="https://github.com/twbs.png" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0">
    <div class="d-flex gap-2 w-100 justify-content-between">
      <div>
        <h6 class="mb-0">${r.trackId}</h6>
        <p class="mb-0 opacity-75">${r.points[parseInt(r.status)].place||r.receiver.place}</p>
      </div>
      <small class="opacity-50 text-nowrap">${r.points[parseInt(r.status)].status||'Доставлено'}</small>
    </div>
  </a>
    `)
    }
  }else{
    for(let r of res){
      console.log(r.status)
      $('#orderList').append(`
      <a href="/manager-order?id=${r.trackId}" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
      <img src="https://github.com/twbs.png" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0">
      <div class="d-flex gap-2 w-100 justify-content-between">
        <div>
          <h6 class="mb-0">${r.trackId}</h6>
          <p class="mb-0 opacity-75">${r.points[parseInt(r.status)].place||r.receiver.place}</p>
        </div>
        <small class="opacity-50 text-nowrap">${r.points[parseInt(r.status)].status||'Доставлено'}</small>
      </div>
    </a>
      `)
   }
  }
}
}
}

show()