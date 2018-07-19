$(document).ready(function(e){
  "use strict";
  var alert;
  var target = e.target;
  $('.delete-article').on('click', function(e){
    const id = target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/articles/'+id,
      success: function(response){
        alert('Deleting Article');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
