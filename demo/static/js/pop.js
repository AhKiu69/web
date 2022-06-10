function pop_window(warning){
    pop_out_window = '<div id="pop_up"></div>'+
    "<img src='/static/img/limit.png' id='limit'>"
    $('body').prepend(pop_out_window)
    $('#pop_up').text(warning)
    $('#pop_up').fadeOut(2500);
    $('#limit').fadeOut(2500);
}