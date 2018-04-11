
$('#close').click(function(){
  parent.postMessage({msg:'close'}, "*");
})

function sendtoframe(e){
  $.each(e, function(key,value){
    $('#alertmatches').append(value[1]+': '+value[0]+'<br />')
  })
}

window.addEventListener("message", function(e) {
  sendtoframe(e.data)
})
