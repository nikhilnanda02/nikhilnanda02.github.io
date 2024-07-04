let receiveDataFunc;

window.onload = () => {
   

    $("#initiateMorphoFingerPrintScanner").click($.proxy(function (event) {


        // if ($('#password').val() == '') {
        //     tempHTML = "<label class='errorLabel error-alert error-alert-login' >Password cannot be blank</label>";
        //     $('#password').after(tempHTML);
        // }

        // if ($('#username').val() != '') {



           
                // try {
                //     var json={};
                //     json.username=$('#username').val();

                //    window.webkit.messageHandlers.callbackHandler.postMessage(JSON.stringify(json));
                // } catch(err) {
                //     console.log('The native context does not exist yet');
                // }    
                var invokeThirdPartyServiceOptions = {};
                invokeThirdPartyServiceOptions.method = "MORPHO_FINGERPRINT";
                invokeThirdPartyServiceOptions.intentAction = "in.gov.uidai.rdservice.fp.CAPTURE";
                invokeThirdPartyServiceOptions.packageToOpen = "com.idemia.l1rdservice";
                invokeThirdPartyServiceOptions.PID_OPTIONS = "<PidOptions ver=\"1.0\"><Opts env=\"PP\" fCount=\"1\" fType=\"2\" iCount=\"0\" iType=\"\" pCount=\"0\" pType=\"\" format=\"0\" pidVer=\"2.0\" timeout=\"20000\" wadh=\"E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=\" posh=\"UNKNOWN\"/><Demo></Demo><CustOpts><Param name=\"\" value=\"\" /></CustOpts></PidOptions>";
                NEMF.invokeThirdPartyService(invokeThirdPartyServiceOptions);
            // var data = NEMF.invokeThirdPartyService($('#username').val());
            // var nativeCallbackHandler = function(params){
            //     console.log("recieved params ", params);
            // }
            // $('#password').val(data);
            // $('#loginDiv').hide();
            // $('#dashboardDiv').show();
            // $('#welcomeMessage').append($('#username').val());
        // }
    }));

    receiveDataFunc = (msg)=>{
        $(".morphoResult").text('');
        $(".morphoResult").text(msg);
    };
    // function receiveData(msg){
    //     alert(msg);
    //     $('#password').val(msg);

    // }

}
function function2(msg){
    alert(msg);
} 