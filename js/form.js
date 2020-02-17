$('.dropdown_toggle').each(function() {
     $(this).click(function(){
          $(this).closest('ul').find('.dropdown_content').slideUp();
          $(this).closest('ul').find('.dropdown_toggle').not(this).prop('checked',false);
          $checked = $(this).is(':checked');
          $content = $(this).closest('li').find('.dropdown_content');
          $checked? $content.slideDown():$content.slideUp();
     })
});


$('input[type=number]').each(function() {
     var disabled = $(this).is(':disabled');
     var $this = $(this);
     $this.wrap('<div class=input-number></div>');
     $this.before('<button class=subtract></button>');
     $this.after('<button class=add></button>');
     var add = $(this).parent().find('.add');
     var sub = $(this).parent().find('.subtract');
     if (!disabled) {
          var val;
          add.click(function(){
               val = parseInt($this.val())
               $this.val(val+1)
          });
          sub.click(function(){
               val = parseInt($this.val())
               $this.val(val-1)
          })
     }else {
          $(this).parent('.input-number').attr('disabled',true);
     }
});


$('input[type=search]').each(function(){
     var disabled = $(this).is(':disabled');
     var $this = $(this);
     //$this.hide();
    $this.wrap('<div class="input-wrapper"></div>');
    $this.after('<i class="search"></i>');
});
$('select.default').each(function(){
     var disabled = $(this).is(':disabled');

    var $this = $(this), numberOfOptions = $(this).children('option').length;

    $this.addClass('select-hidden');
    $this.wrap('<div class="select"></div>');
    $this.after('<div class="select-styled"></div>');

    var $styledSelect = $this.next('div.select-styled');
    $styledSelect.text($this.children('option').eq(0).text());

    var $list = $('<ul />', {
        'class': 'select-options'
    }).insertAfter($styledSelect);

    for (var i = 0; i < numberOfOptions; i++) {
        $('<li />', {
            text: $this.children('option').eq(i).text(),
            rel: $this.children('option').eq(i).val()
        }).appendTo($list);
    }

    var $listItems = $list.children('li');
    if (!disabled) {
         $styledSelect.click(function(e) {
             e.stopPropagation();
             $('div.select-styled.active').not(this).each(function(){
                 $(this).removeClass('active').next('ul.select-options').hide();
             });
             $(this).toggleClass('active').next('ul.select-options').toggle();
         });

         $listItems.click(function(e) {
             e.stopPropagation();
             $styledSelect.text($(this).text()).removeClass('active');
             $this.val($(this).attr('rel'));
             $list.hide();
             $styledSelect.addClass('selected')
         });
    }


    $(document).click(function() {
        $styledSelect.removeClass('active');
        $list.hide();
    });

});
$('select.image').each(function(){
     var disabled = $(this).is(':disabled');

    var $this = $(this), numberOfOptions = $(this).children('option').length;

    $this.addClass('select-hidden');
    $this.wrap('<div class="select"></div>');
    $this.after('<div class="select-styled"></div>');

    var $styledSelect = $this.next('div.select-styled');
    $styledSelect.text($this.children('option').eq(0).text());

    var $list = $('<ul />', {
        'class': 'select-options'
    }).insertAfter($styledSelect);

    for (var i = 1; i < numberOfOptions; i++) {
        $image = $this.children('option').eq(i).data('image');
        $title = $this.children('option').eq(i).data('title');
        $detail = $this.children('option').eq(i).data('detail');
        $rel = $this.children('option').eq(i).val();
       $('<li rel='+$rel+' class=with-image><div class=img-wrapper><img src='+$image+'></div><div class=option-wrap><p class=title>'+$title+'</p><p class=detail>'+$detail+'</p></div>').appendTo($list);
    }

    var $listItems = $list.children('li');
    if (!disabled) {
         $styledSelect.click(function(e) {
             e.stopPropagation();
             $('div.select-styled.active').not(this).each(function(){
                 $(this).removeClass('active').next('ul.select-options').hide();
             });
             $(this).toggleClass('active').next('ul.select-options').toggle();
         });
         $listItems.click(function(e) {
             e.stopPropagation();
             $styledSelect.text($(this).text()).removeClass('active');
             $this.val($(this).attr('rel'));
             $list.hide();
             $styledSelect.addClass('selected')
         });
    }


    $(document).click(function() {
        $styledSelect.removeClass('active');
        $list.hide();
    });

});


$('select').on('change',function(){
     console.log($(this).val());
})
