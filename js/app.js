var uid = null;
var contactLessService = tetra.service({ // Instantiate service
  namespace: 'ingenico.device.contactless',
  service: 'local.device.contactless0'
});

function checkServer(){
  var request = new XMLHttpRequest();
  request.open('GET', 'https://psiclops.io/', true);
  // request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  // request.send(data);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var resp = JSON.parse(request.responseText);
      console.log("Success: ", resp.value)
      var validating = document.querySelectorAll('.assembly')[0]
      validating.classList.add("ghost")
      // document.querySelectorAll('.validating')[0].style.display = "none";
      var validated = document.querySelectorAll('.validated')[0]
      validated.classList.remove("ghost")
      // document.querySelectorAll('.validated')[0].style.display = "block";

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
      checkServer();
      return
    })
    .close()
    .disconnect();
}

function logResponse(r){
  console.log(r)
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


  pollContactLess();

