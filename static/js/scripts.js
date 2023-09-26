$('#trackForm').on('submit', async (e)=>{
    e.preventDefault()
    $('#submitErrorMessage').addClass('d-none')
    let str = $('#trackId').val()
    let trackId = filter(str)
    console.log(trackId)
    let response = await fetch('/api/orders/'+trackId,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
    })
    if(response.ok){    
        let order = await response.json()
    
        $('#orderNumber').html(order.trackId)
        $('#senderName').text(order.sender.name)
        $('#addressFrom').text(order.sender.place)
        $('#receiverName').text(order.receiver.name)
        $('#addressWhere').text(order.receiver.place)
        $('#routeTable').empty()
        let dateStart=new Date(order.createdAt)
        let day = dateStart.getDate();
        let month = dateStart.getMonth();
        let year = dateStart.getFullYear();
        $('#routeTable').append(`
        <tr>
            <td>${day}.${month}.${year}</td>
            <td>Заказ создан</td>
            <td>${order.sender.place}</td>
         </tr>
        `)
        for(let p of order.points){
            $('#routeTable').append(`
            <tr>
                <td>${p.date||''}</td>
                <td>${p.status||''}</td>
                <td>${p.place}</td>
             </tr>
            `)
        }
        $('#routeTable').append(`
        <tr>
            <td></td>
            <td></td>
            <td>${order.receiver.place}</td>
         </tr>
        `)
        $('#submitSuccessMessage').removeClass('d-none')
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#submitSuccessMessage").offset().top
        }, 2000);
    }else{
        $('#submitErrorMessage').removeClass('d-none')
    }
    
})

 function filter(str){

    return str.replace(/[^\d]/g, '');
}