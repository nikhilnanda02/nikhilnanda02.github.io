let receiveDataFunc;

window.onload = () => {
   

    $("#loginBtn").click($.proxy(function (event) {

        if ($('#username').val() == '') {
            tempHTML = "<label  class='errorLabel error-alert error-alert-login'>Username cannot be blank</label>";
            $('#username').after(tempHTML);
        }


        // if ($('#password').val() == '') {
        //     tempHTML = "<label class='errorLabel error-alert error-alert-login' >Password cannot be blank</label>";
        //     $('#password').after(tempHTML);
        // }

        if ($('#username').val() != '') {



           
                // try {
                //     var json={};
                //     json.username=$('#username').val();

                //    window.webkit.messageHandlers.callbackHandler.postMessage(JSON.stringify(json));
                // } catch(err) {
                //     console.log('The native context does not exist yet');
                // }    

            var data = NEMF.invokeThirdPartyService($('#username').val());
            $('#password').val(data);
            // $('#loginDiv').hide();
            // $('#dashboardDiv').show();
            // $('#welcomeMessage').append($('#username').val());
        }
    }));

    receiveDataFunc = (msg)=>{
        alert(msg);
        $('#password').val(msg);
    };
    // function receiveData(msg){
    //     alert(msg);
    //     $('#password').val(msg);

    // }

}
function function2(msg){
    alert(msg);
} 