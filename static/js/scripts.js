$('#trackForm').on('submit', (e)=>{
    e.preventDefault()
    let str = $('#trackId').val()
    let trackId = filter(str)
    console.log(trackId)
    $('#orderNumber').html(trackId)
    $('#submitSuccessMessage').removeClass('d-none')
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#submitSuccessMessage").offset().top
    }, 2000);

})

 function filter(str){

    return str.replace(/[^\d]/g, '');
}