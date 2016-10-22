$(document).ready(function(){
  $( "button" ).on("mousedown", function() {
    tetra
      .service({
        service:  'local.transaction.engine',
        namespace: 'ingenico.transaction'
      })
      .reset()
      .connect()
      .call('ManageTransaction',{
        hide:true,
        data: {
          transaction: {
            currency: {
              code: 'EUR',
              numCode: 978,
              minorUnit: 2,
              minorUnitSeparator: ",",
              thousandSeparator: "",
              position: "CURRENCY_BEFORE_AMOUNT",
              symbol: "&euro;"
            },
            value: "300", //300 =3€           

            transactionType: "Payment"
          },
        }
      })
      .success(function (e) {


        $( "body, button" ).toggleClass( "success" );
        $('button').html('<img src="img/checked.png"/> Buy another ');

      })
      .error(function (e) {

        $( "body, button" ).toggleClass( "error" );
        $('button').html('<img src="img/error.png"/> Payment failed, touch to retry ');

        console.log('ERROR: ' + e.response.transactionDetails);
      })
      .disconnect()
  });
})
