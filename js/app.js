var uid = null;
var service = tetra.startEnd()
// .on('SE_START',function(tlv,properties) {
//   if(properties.isShortMode) {
//     //do very short process
//     this.sendResponse();
//     return;
//   }
//   //can do long treatment
//   else {
//     // do the call to get the uid
//     //uid = ...;
//     console.log("TLV: ", tlv)
//     console.log("Properties: ", properties)
//     // and then send the response
//     this.sendResponse();
//   }
// })
.on('SE_END',function(tlv,properties) {
  if(properties.isShortMode) {
    //do very short process
    this.sendResponse();
    return;
  }
  //can do long treatment
  else {
    tetra.weblet.show();
  }
});

document.body.addEventListener('click',function() {
  service.sendResponse();
  tetra.weblet.hide();
});
