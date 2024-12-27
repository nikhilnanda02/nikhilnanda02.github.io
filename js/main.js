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
        NEMF.invokeThirdPartyService(JSON.stringify(invokeThirdPartyServiceOptions));
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



    $("#openCamera").click($.proxy(function (event) {

        var cameraConfig = {};

       cameraConfig.imageWidth = 1296;
        cameraConfig.imageHeight = 2304;
        cameraConfig.quality = 90;
		cameraConfig.doPerspectiveCorrection = false;

         NGNativeOperations.openDocScanCamera(cameraConfig, function (result) { 
		console.log("result",result.fileData); 
		  var fullBase64Image  = "data:image/jpeg;base64," + result.fileData;
		
		 //$("#image").attr("src", fullBase64Image);
		 
		

      $("#image").on("load", function () {
        // Original dimensions of the image
        const originalWidth = this.naturalWidth;
        const originalHeight = this.naturalHeight;

        // Desired width (for example, 300px)
        const desiredWidth = 300;

        // Maintain aspect ratio
        const aspectRatio = originalHeight / originalWidth;
        const desiredHeight = desiredWidth * aspectRatio;

        // Set width and height
        $(this).attr("width", desiredWidth);
        $(this).attr("height", desiredHeight);
      });

      // Set the src to load the image
      $("#image").attr("src", fullBase64Image);
    
		 
		 
		}, function (error) { alert(error) });

    }));



    receiveDataFunc = (msg) => {
        $(".morphoResult").text('');
        $(".morphoResult").text(JSON.stringify(msg));
    };
    // function receiveData(msg){
    //     alert(msg);
    //     $('#password').val(msg);

    // }

}
function function2(msg) {
    alert(msg);
} 