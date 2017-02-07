var toastr = require('toastr');

$( "form" ).submit(function( e ) {

  e.preventDefault();

  var $form = $( this ),
    name    = $form.find( "input[name='name']" ).val(),
    email   = $form.find( "input[name='email']" ).val(),
    phone   = $form.find( "input[name='phone']" ).val(),
    message = $form.find( "textarea[name='message']" ).val(),
    // url     = $form.attr( "action" );
    url = "../mail.php";

  var data = {
    name: name
    
  };

  if(email) {
    data.email = email;
  }

  if(phone) {
    data.phone = phone;
  }

  if(message) {
    data.message = message;
  }


  var posting = $.post( url, data);

  posting
    .done(function() {
      toastr.success('Ваша заявка успешно отправленна');
      var inputClean = $form.find("input");
      inputClean.val('');
      })
    .fail(function() {
      console.log('test');
      var inputClean = $form.find("input");
      inputClean.val('');
      toastr.error('Ошибка отправки');
    })
    .always(function() {
      $.magnificPopup.close();
  });
});
