var document_version = '4514';
var document_release_version = '1.5.10.2';
/**
*   File :  OpAllWrapper.js 
*   Interface file containing the external api.
*   This file is to be used for integration of OpAll Mobile without NEMP.
*  @modified    08/02/2019   Komal Walia    for bug(OD bugzilla) #81601
*                                           Function Modified:
*                                           OpAllWrapper.showDocument
*                                           for bug(OD bugzilla) #14600
*                                           Function Modified:
*                                           OpAllWrapper.setParameters
*                                           Class Modified:
*                                           OpAllWrapper
*                                           for bug(OD bugzilla) #14601
*                                           Function Modified:
*                                           OpAllWrapper.showDocument
*                                           Ref: OpAll-Mobile-MS-03, OpAll-Mobile-CR-03
* @modified     22/04/2019   Komal Walia    for bug 5393
*                                           Class Modified:
*                                            OpAllWrapper
*                                           Function Modified:
*                                            OpAllWrapper.setParameters
*                                           Ref: OpAll-Mobile-MS-06, OpAll-Mobile-CR-06
* @modified     03/05/2019   Komal Walia    for Bug 5395
*                                           Function Modified:
*                                            OpAllWrapper.setParameters
*                                           Ref: OpAll-Mobile-MS-07, OpAll-Mobile-CR-07
* @modified    27/05/2019    Komal Walia    for bug 15460(OD bugzilla)
*                                           Function modified:
*                                            OpAllWrapper.showDocument
*                                           Ref: OpAll-Mobile-MS-08, OpAll-Mobile-CR-08
*/

if(typeof(OPALL) === 'undefined'){
    (typeof window !== 'undefined' ? window : this).OPALL = {};
}

/**
*   OpAll Viewer class used by clients to load OpAll and show documents.
*   @class
*   @param {object} OpAllParam containing default setting and parameters for the viewer like
*   default zoom %, annotation display, default view angle.
*   Modified  Komal Walia  Bug ID : 14600(OD Bugzilla)
*   Modified   19/04/2019    Komal Walia  for bug #5393
*/
function OpAllWrapper(){
    this.data = '';
    this.url = '';
    this.settings = {
      angle:0,
      zoomFactor:1.0,
      annotationDisplay:false,
      width:0,//Added by Komal Walia on 08/02/2019 for Bug id : 14600(OD Bugzilla)
      height:0,//Added by Komal Walia on 08/02/2019 for Bug id : 14600(OD Bugzilla)
      serverSupportMultipage:true,//Added by Komal Walia on 19/04/2019 for Bug ID : 5393
      numberOfPages:-1,
    };
    this.imageInfo = {};
    this.opall = null;
}

/**
*   @function 
*   for setting the default parameters like angle, zoomFactor, annotationDisplay
*   Modified  Komal Walia  Bug ID : 14600(OD Bugzilla)
*   Modified   19/04/2019    Komal Walia  for bug #5393
*   Modified   03/05/2019    Komal Walia  for bug #5395
*/
OpAllWrapper.prototype.setParameters = function(parameters){
  if(typeof(parameters) === 'undefined' || null === parameters){
    this.settings.angle=0;
    this.settings.zoomFactor=1.0;
    this.settings.annotationDisplay=false;
    //Added by Komal Walia on 19/04/2019 for Bug ID : 5393
    this.settings.serverSupportMultipage=true;
    this.settings.numberOfPages=-1;
  }
  else{
    if(parameters.angle)
      this.settings.angle = parameters.angle;
    if(parameters.zoomFactor)
      this.settings.zoomFactor = parameters.zoomFactor;
    if(parameters.annotationDisplay)
      this.settings.annotationDisplay = parameters.annotationDisplay;
    //Added by Komal Walia on 08/02/2019 for Bug id : 14600(OD Bugzilla)
    if(parameters.width)
      this.settings.width = parseInt(parameters.width, 10);
    if(parameters.height)
      this.settings.height = parseInt(parameters.height, 10);
    //Added by Komal Walia on 19/04/2019 for Bug ID : 5393
    //Modified by Komal Walia on 02/05/2019 for bug 5395
    this.settings.serverSupportMultipage = OPALL.CanvasUtil.toBoolean(parameters.serverSupportMultipage,true);
    if (parameters.numberOfPages){
      this.settings.numberOfPages = parseInt(parameters.numberOfPages);
      if (isNaN(this.settings.numberOfPages)) {
        console.error('invalid value of numberOfPages, ' + parameters.numberOfPages);
        this.settings.numberOfPages = -1;
      } 
    }
  }

 
  this.opall = new OPALL.Viewer(this.settings);

}


/**
*   @param {object} attachment object containing either data or url of the document.
*   @param {number} page to be shown by default when the document is loaded.
*   @param {boolean} isThumbEnabled specifies if thumbnails are enabled or not.
*   @Modified Komal Walia 24/12/2018    Bug # 81601(OD Bugzilla)
*   @Modified Komal Walia 08/02/2019    Bug ID : 14601(OD Bugzilla)
*   @Modified Komal Walia 27/05/2019    Bug ID : 15460(OD Bugzilla)
*/
OpAllWrapper.prototype.showDocument = function(attachment, pageNumber, isThumbEnabled, showDocumentCallback){
  try
  {
    if(typeof(attachment) === 'undefined' || null === attachment){
      throw (Error("Attachment is missing."));
    }
    
    if(typeof(attachment.data) !== 'undefined' && null !== attachment.data){
      this.imageInfo.data = attachment.data;
    }
    else if(typeof(attachment.url) !== 'undefined' && null !== attachment.url){
      this.imageInfo.url = attachment.url;
    }
    else{
      throw(Error("Image Url/data is missing in the attachment."));
    }
    
    if(typeof(pageNumber) === 'undefined' || null === pageNumber){
      throw(Error("Page number is missing."));
    }
    this.imageInfo.password = attachment.password;
    this.imageInfo.type = OPALL.docType.PDF;		
    this.settings.page = pageNumber;
    this.imageInfo.getData = attachment.getData;
    this.opall.currentPageIndex = pageNumber;
    //Added by Komal Walia on 08/02/2019 for Bug id : 14601(OD Bugzilla)
    this.opall.pageDisplayCallback = typeof(attachment.pageCallback) === 'function' ? attachment.pageCallback : null;
    //added by Komal Walia on 24/12/2018 for bug id:81601(in OD bugzilla)
    this.opall.showDocumentCallback = typeof(showDocumentCallback) === 'function' ? showDocumentCallback : null;
    //added by Komal Walia on 27/05/2019 for bug id: 15460(OD Bugzilla)
    this.opall.documentLoaded = false;
    this.opall.showDocument(this.imageInfo, this.opall.documentCallback);
  }
  catch(error)
  {
    alert(error);
  }
}

/**
*   @param {number} pageNo to be displayed.
*/
OpAllWrapper.prototype.goToPage = function(pageNumber) {
  try{
    if(typeof(this.opall) === 'undefined' || null === this.opall){
      throw(Error("OpAll view is not loaded."));
    }
    if(typeof(pageNumber) === 'undefined' || null === pageNumber){
      throw(Error("Page number is missing."));
    }
    
    this.opall.loadPage(pageNumber, this.opall.pageCallback);
  }
  catch(err){
    alert(err);
  }
}