window.onload = () => {
    'use strict';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js');
    }


    $("#loginBtn").click($.proxy(function (event) {
        if ($('#username').val() == '') {
            tempHTML = "<label  class='errorLabel error-alert error-alert-login'>Username cannot be blank</label>";
            $('#username').after(tempHTML);
        }


        if ($('#password').val() == '') {
            tempHTML = "<label class='errorLabel error-alert error-alert-login' >Password cannot be blank</label>";
            $('#password').after(tempHTML);
        }

        if ($('#username').val() != '' && $('#password').val() != '') {
            $('#loginDiv').hide();
            $('#dashboardDiv').show();
            $('#welcomeMessage').append($('#username').val());
        }
    }));


}
