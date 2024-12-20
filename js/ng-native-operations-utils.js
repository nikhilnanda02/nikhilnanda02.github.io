/**
 * --------------------------------------------------------------------------------------------------
 *                             NEWGEN SOFTWARE TECHNOLOGIES LIMITED
 *
 * Product                : NEMF 6.1
 * Application            : NEMF-Client
 * Module                 : Client
 * File                   : NGInvokeNativeMethod.js
 * Author                 : Sumit Mishra
 * Date(DD/MM/YYYY)       : 12/07/2024
 * Purpose                : This file contains operations to invoke native methods from js
 *
 * Functions Defined      :
 *
 * EXPORTED FUNCTIONS
 *
 * LOCAL FUNCTIONS
 * 1. getMorphoFingerprint
 * 2. invokeNativeMethod
 * 3. detectOperatingSystem
 * 4. isValid
 *
 * Change History
 * Date:                        Name:                      Comment:
 * --------------------------------------------------------------------------------------------------
 * 12/07/2024                   Sumit Mishra               Created for JIRA ID:- NEMF-7545
 * --------------------------------------------------------------------------------------------------
 */


try {

    if (typeof (ngclientframework) == 'undefined')
        ngclientframework = {};
    if (typeof (ngclientframework.NativeOperations) == 'undefined')
        ngclientframework.NativeOperations = {

            successCallbackOfJS: null,
            errorCallbackOfJS: null,

            /**
			 * 
			 * @method detectOperatingSystem
			 * @param method
             * @param successCallback
             * @param errorCallback
			 */
            getMorphoFingerprint: function (request, successCallback, errorCallback) {
                const method = "MORPHO_FINGERPRINT";
                const { intentAction, packageToOpen, PID_OPTIONS } = request;
        
                if (intentAction && packageToOpen && PID_OPTIONS) {
                    this.invokeNativeMethod(method, request, successCallback, errorCallback);
                } else {
                    const missingField = 
                        !intentAction ? "IntentAction" :
                        !packageToOpen ? "PackageToOpen" :
                        "PID_OPTIONS";
        
                    errorCallback(`${missingField} not available`);
                }
            },

 /**
			 * 
			 * @method openDocScanCameral̥
			 * @param method
             * @param successCallback
             * @param errorCallback
			 */
 openDocScanCamera: function (cameraOptions, successCallback, errorCallback) {
    const method = "OPEN_DOCSCAN";
  

    if (cameraOptions) {
        this.invokeNativeMethod(method, cameraOptions, successCallback, errorCallback);
    } else {
        // const missingField = 
        //     !intentAction ? "IntentAction" :
        //     !packageToOpen ? "PackageToOpen" :
        //     "PID_OPTIONS";

        errorCallback(`configuration not available`);
    }
},




            /**
			 * 
			 * @method detectOperatingSystem
			 * @param method
             * @param request
             * @param successCallback
             * @param errorCallback
			 */
            invokeNativeMethod: function (method, request, successCallback, errorCallback) {

                if (!this.isValid(successCallback)) {
                    return errorCallback("Callback is not available");
                }

                if (!this.isValid(errorCallback)) {
                    return errorCallback("Callback is not available");
                }

                if (!this.isValid(method)) {
                    return errorCallback("Method is not available");
                }

                if (!this.isValid(request)) {
                    return errorCallback("Request is not available");
                }

                request.method = method;
                const jsonRequest = JSON.stringify(request);
                const getOS = this.detectOperatingSystem().toLowerCase();

                this.successCallbackOfJS = successCallback;
                this.errorCallbackOfJS = errorCallback;

                if (getOS === "android") {
                    NEMFNativeExecutor.postMessage(jsonRequest);
                } else if (getOS === "ios") {
                    window.webkit.messageHandlers.NEMFNativeExecutor.postMessage(jsonRequest);
                } else {
                    errorCallback("Unknown device type");
                }

            },

            /**
			 * This method checks the operating system of the device and return it as string.
			 * 
			 * @method detectOperatingSystem
			 * @param
			 * @return {String} Returns operating system of device as string. 
			 */
            detectOperatingSystem: function() {
                const ua = navigator.userAgent;
        
                if (/android/i.test(ua)) {
                    return 'Android';
                }
        
                if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
                    return 'iOS';
                }
        
                if (/Win/i.test(ua)) {
                    return 'Windows';
                }
        
                if (/Mac/i.test(ua) && !/iPhone|iPad|iPod/.test(ua)) {
                    return 'MacOS';
                }
        
                if (/Linux/i.test(ua) && !/Android|Mobile/.test(ua)) {
                    return 'Linux';
                }
                return 'Unknown';
            },

            /**
			 * This method is used to validate the value with respect to undefined, null and empty.
			 * 
			 * @method isValid
			 * @param value which need to be validated
			 * @return  Returns true for valid and false for invalid. 
			 */
            isValid: function(value) {
                return value !== undefined && value !== null && value !== '';

            },

            /**
			 * This method sends the native successcallback to js.
			 * 
			 * @method errorCallbackFromNative
			 * @param response callback value
			 * @return  Returns the js callback. 
			 */
            successCallbackFromNative: function(response){
                this.successCallbackOfJS(response);
            },

            /**
			 * This method sends the native errorcallback to js.
			 * 
			 * @method errorCallbackFromNative
			 * @param response callback value
			 * @return  Returns the js callback. 
			 */
            errorCallbackFromNative: function(response){
                this.errorCallbackOfJS(response);
            }

        }

} catch (error) {
    this.errorCallbackOfJS("Something went wrong!");
}
NGNativeOperations = ngclientframework.NativeOperations;

