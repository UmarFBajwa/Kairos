var uid = null;
var contactLessService = tetra.service({ // Instantiate service
  namespace: 'ingenico.device.contactless',
  service: 'local.device.contactless0'
});

function domManipulation(){
  var validating = document.querySelectorAll('.validating')[0]
  validating.classList.add("ghost")
  var validated = document.querySelectorAll('.validated')[0]
  validated.classList.remove("ghost")

  var assembly = document.querySelectorAll('.assembly')[0]
  assembly.classList.add("ghost")

  var check = document.querySelectorAll('.check-mark')[0]
  check.classList.remove("ghost")
}

function resetDom(){
  var validating = document.querySelectorAll('.validating')[0]
  validating.classList.remove("ghost")
  var validated = document.querySelectorAll('.validated')[0]
  validated.classList.add("ghost")

  var assembly = document.querySelectorAll('.assembly')[0]
  assembly.classList.remove("ghost")

  var check = document.querySelectorAll('.check-mark')[0]
  check.classList.add("ghost")
}

function checkServer(){
  var request = new XMLHttpRequest();
  // request.open('GET', 'https://psiclops.io/', true);
  request.open('GET', 'https://psiclops.io?uid='+uid, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var resp = JSON.parse(request.responseText);
      console.log("Success: ", resp.value)

      setTimeout(domManipulation , 4000)
      
    } else {
      // We reached our target server, but it returned an error
      console.log("Onload Error: ", request)
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
      console.log("Error: ", request)
  };

  request.send();
}

function getCardInformations() {
  contactLessService
    .reset() // Reset service
    .call('GetUid', {requestDelay: 0}) // Call GetUid method
    .success(function (r) {
      console.log("getCardInformations: ",r);
      uid = r['uid'];
      return 
    })
    // .then(function(r){
    //   console.log("getCardInformations: ",r);
    // })
}

function logResponse(r){
  console.log(r)
}

function detectContact() { 
  console.log('Please tap your card');
  contactLessService
  .reset() // Reset service
    .call('GetDetectionResult', {requestDelay: 0}) // Call GetDetectionResult 
    .success(function (r) {
      console.log("Card detected");
      return getCardInformations(); // Get card informations after swiped 
    })
    .error(function (e) {
      detectContact(); // Polling contactless
    });
}


function pollContactLess(){
  contactLessService
  .reset() // Reset service
  .disconnect() // Disconnect from service
  .connect() // Connect to service
  .close() // Close service
  .open() // Open service
  .on('ClessDetectedEvent', function (r) { // Listen to ClessDetectedEvent
    console.log('Card detected');
    console.log('Detected: ', r);
    return getCardInformations();
  })
    .call('StartDetection', {data: {timeout: 10000}}) // Call start detection method
    .then(function (r) {
      console.log('Please approach your card: ', r); 
    }, function (e) {
      console.log("Error in startDetection: ", e)
    });
}

var service = tetra.startEnd()
.on('SE_START',function(tlv,properties) {
  if(properties.isShortMode) {
    //do very short process
    this.sendResponse();
    return;
  }
  //can do long treatment
  else {
    // do the call to get the uid
    //uid = ...;
    // console.log("TLV: ", tlv)

    pollContactLess();
    // and then send the response
    this.sendResponse();
  }
})
.on('SE_END',function(tlv,properties) {
  if(properties.isShortMode) {
    //do very short process
    this.sendResponse();
    return;
  }
  //can do long treatment
  else {
    // console.log("TLV: ", tlv)
    console.log("UID: ", uid)
    checkServer()
    tetra.weblet.show();
  }
});

document.body.addEventListener('click',function() {
  service.sendResponse();
  tetra.weblet.hide();
});
