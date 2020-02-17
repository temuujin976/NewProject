$('.tab').each(function() {
     $(this).on('click',function(e){
          e.preventDefault();
          $(this).parent().children('.tab').removeClass('active');
          $(this).addClass('active');
     });
});
