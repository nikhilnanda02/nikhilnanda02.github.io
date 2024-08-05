var document_version = '4514';
var document_release_version = '1.5.10.2';
/**
 *	@fileoverview  viewer.js contains routines for viewer 
 *	@author vishant gautam
 *  @modified	18/08/2017	vishant gautam
 *                        Function modified: for bug #5000, #5001
 *                          ViewerEventControllerClosure
 *                          touchStart
 *                          touchMove
 *                        Ref: OpAll-Mobile-MS-01, OpAll-Mobile-CR-01
 *  @modified	14/06/2018	vishant gautam   for bug #5210
 *												Class modified:
 *															ViewerEventController
 *															Viewer
 *                        Ref: OpAll-Mobile-MS-02, OpAll-Mobile-CR-02
 *  @modified    03/01/2019   Komal Walia    for bug(OD bugzilla) #81601
 *                                           Object Added:
 *                                              OPALL.DOC_STATUS
 *                                           Function Modified:
 *                                              Viewer.displayPage
 *                                              hanldeDocumentLoadError
 *                                           for bug(OD bugzilla) #14600
 *                                           Function Modified:
 *                                              Viewer constructor
 *                                              ResizeViewer
 *                                           for bug(OD bugzilla) #14601
 *                                           Object Added:
 *                                              OPALL.CONSTANTS
 *                                              Function Modified:
 *                                              pageCallback
 *                                           Function Added:
 *                                              DrawExtractZone
 *                                              DeleteAllZone
 *                                           Ref: OpAll-Mobile-MS-03, OpAll-Mobile-CR-03
 *  @modified    19/03/2019   Komal Walia    for bug # 5361,5345,5349 5362 and 5372
 *                                           Function Modified:
 *                                              Viewer.pageCallback
 *                                              Viewer.displayPage
 *                                              Viewer.DrawExtractZone
 *                                              OpAll_Initialize
 *                                              OPALL.CanvasUtil
 *                                            Object modified for bug 5362 and 5372
 *                                              OPALL.DOC_STATUS
 *                                           Ref: OpAll-Mobile-MS-04, OpAll-Mobile-CR-04
 *  @modified    04/04/2019   Komal Walia    for bug #5387
 *                                           Function Modified:
 *                                              Viewer.displayPage
 *                                              hanldeDocumentLoadError
 *                                           Object Modified:
 *                                              OPALL.DOC_STATUS
 *                                           Ref: OpAll-Mobile-MS-05, OpAll-Mobile-CR-05
 *  @modified    22/04/2019   Komal Walia    for bug 5393
 *                                           Function Modified:
 *                                            Viewer
 *                                            Viewer.documentCallback
 *                                            Viewer.loadPage
 *                                            Viewer.pageCallback
 *                                            Viewer.nextPage
 *                                            Viewer.lastPage
 *                                            callback
 *                                           Ref: OpAll-Mobile-MS-06, OpAll-Mobile-CR-06
 * @modified     03/05/2019   Komal Walia    for Bug 5395
 *                                           Function Modified:
 *                                            Viewer
 *                                            touchMove
 *                                            touchStart
 *                                            displayPage
 *                                            pageCallback
 *                                           Ref: OpAll-Mobile-MS-07, OpAll-Mobile-CR-07
 * @modified    27/05/2019   Komal Walia     for bug 5397
 *                                           Function Modified:
 *                                            Viewer.pageCallback
 *                                            Viewer.DrawExtractZone
 *                                           for bug 15460
 *                                           Function Modified:
 *                                            hanldeDocumentLoadError
 *                                            displayPage
 *                                           Ref: OpAll-Mobile-MS-08, OpAll-Mobile-CR-08
 */
if(typeof(OPALL) === 'undefined'){
    (typeof window !== 'undefined' ? window : this).OPALL = {};
}
var VIEWER_MANAGER = {};
(function(){
/**
*   OpAll Viewer the main viewer object of OPALL.
*   @class
*/

//Added by Komal Walia on 08/02/2019 for Bug id : 14601(OD Bugzilla)
OPALL.CONSTANTS = {
  EXT_ZONE_SOLID_RECT : 1,
  EXT_ZONE_HIGHLIGHT : 2,
  EXT_ZONE_OPAQUE : 3,
  EXT_ZONE_MAXIMUM_SCROLL : 2,
  EXT_ZONE_CENTER_SCROLL : 1,
  FAILURE : -1
};

//added by Komal Walia on 03/01/2019 for bug id:81601(in OD bugzilla)
OPALL.DOC_STATUS = {
  SUCCESS : {
      "id" : 1,
      "value" : "SUCCESS"
  },
  INVALID_DOC_TYPE_OR_CORRUPT_DOC_DATA :{
      "id" : -2001,
      "value" :"Invalid Document type or corrupt document data"
  },
  ERROR_IN_GETTING_PAGE :{
      "id" : -2002,
      "value" : "Error while getting page from input file"
  },
  //Added by Komal Walia on 19/03/2019 for bug 5362 and 5372
  DOC_SIZE_EXCEED_MAX_PIXELS_LIMIT :{
      "id" : -2003,
      "value" : "Number of pixels of document page (height * width) being displayed is exceeding 10 MP limit "
  },
  //Added by Komal Walia on 04/04/2019 for Bug 5387
  IMAGE_SOURCE_EMPTY_ERR_MSG :{
      "id" : -2004,
      "value" : "Image source is empty"
  },
  No_DATA_FROM_SERVER:{
      "id" : -2005,
      "value" : "No document data received from server"
  },
  ERROR_DOC_NULL_PASSWORD:{
      "id" : -2006,
      "value" : "Password is null"
  },
  ERROR_FETCHING_URL:{
      "id" : -2007,
      "value" : "Error in fetching URL"
  },
};

OPALL.Viewer = (function ViewerClousre(){
    var selfref = null;
    function Viewer(OpAllParam){
      this.document = null;
      this.currentPageIndex = 1;
      this.displayedPage = -1;
      this.requestedPage = -1;//Added by Komal Walia on 19/04/2019 for Bug ID : 5393
      this.param = OpAllParam;
      this.annotationDisplay = OpAllParam.annotationDisplay ? OpAllParam.annotationDisplay : false;
      this.Angle = OpAllParam.angle ? OpAllParam.angle : 0;
      this.ZoomFactor = OpAllParam.zoomFactor ? OpAllParam.zoomFactor : 1.0;
      //Added by Komal Walia on 08/02/2019 for Bug id : 14600(OD Bugzilla)
      this.width = OpAllParam.width? OpAllParam.width : 0;
      this.height = OpAllParam.height? OpAllParam.height : 0;
      //Added by Komal Walia on 19/04/2019 for Bug ID : 5393
      //Modified by Komal Walia on 02/05/2019 for bug 5395.
      this.serverSupportMultipage = OPALL.CanvasUtil.toBoolean(OpAllParam.serverSupportMultipage, true);
      this.numberOfPages = OpAllParam.numberOfPages ? OpAllParam.numberOfPages: -1;
      this.documentLoaded = false; // Added by Komal Walia for bug 15460(OD Bugzilla) on 27/05/2019
      this.previousZoomFactor = 1;
      this.ScreenDPI = 96;
      this.imageCanvas = document.getElementById('imageCanvas');
      this.AnnotationCanvas = document.getElementById('annotCanvas');
      this.viewArea = document.getElementById('viewArea');
      this.isScanResolution = false;
      this.docFactory = new OPALL.DocumentFactory();
      OPALL.VIEWER = selfref = this;
      this.UI = InitUI('OpAll');
      this.eventControler = new ViewerEventController();
      this.eventControler.viewer = this;
    //  this.eventControler.registerElement(this.AnnotationCanvas);
      this.eventControler.registerElement(this.imageCanvas);
      this.eventControler.registerElement(this.viewArea);
      OpAll_Initialize();
      this.AnnotationManager = new AnnotationHolder(this);
      this.CurrentUserName = 'opall';
      this.zoomScale = 1;// Added by Komal Walia for bug 5395 on 07/05/2019
    }

    Viewer.prototype = {
      /**
      *   @param {Object} parameters contains either data or url of the document,
      *   and the type of document either "PDF" or other type, and the first Page to 
      *   display on loading the document.
      *   @param {function} callback which is called when the document is loaded.
      *   @ modified  Vishant Gautam bug # 5393
      */
      showDocument: function(parameters, docCallback){
        try{
          if((this.annotationDisplay === true) && (typeof parameters.getData != 'function')){  //Added by Vishant gautam on 1.1.2016 for data type check the data
            alert('Failed to load Annotation as parameter getData is not a function.');
            throw(Error('Failed to load Annotation as parameter getData is not a function.'));
          }
          else{
            this.getData = parameters.getData;
          }
  
          //Added by Vishant Gautam on 5.1.2016 for handling rotation on annotation display on
          this.Angle = (this.Angle % 360);
          if(this.annotationDisplay === true && this.Angle !== 0 ){
            alert("Document is rotated. Annotations, in case present, will not be visible.");
            this.annotationDisplay = false;
          }
  
          var self = this;
          showLoadBar();
          //Modified by Vishant Gautam for bug id 5393 on 23/04/2019
          if (this.serverSupportMultipage && parameters.url) {
            this.getData(this.currentPageIndex, 3, function(type, pageNo, obj) {
              obj.type = OPALL.docType.PDF;
              self.document = self.docFactory.getDocumentObject(obj, docCallback);
            });
          } else {
            this.document = this.docFactory.getDocumentObject(parameters, docCallback);
          }
        }
        catch(err){
          hideLoadBar();
          console.log(err);
        }
      },
      /**
      *   Document load callback which is called when the document is loaded.
      *   Modified   19/04/2019    Vishnat Gautam  for bug #5393
      */
      documentCallback: function(){
        try{
          //modified by Vishant Gautam on 19/04/2019 for Bug ID : 5393
          if (OPALL.VIEWER.serverSupportMultipage){
            OPALL.VIEWER.loadPage(1, OPALL.VIEWER.pageCallback);
          } else {
            OPALL.VIEWER.loadPage(OPALL.VIEWER.currentPageIndex, OPALL.VIEWER.pageCallback);
          }
           
        }
        catch(err){
            console.log(err);
        }
      },
      /**
      *   @param {Number} pageNo specify which page to extract and decode from
      *   document. 
      *   @param {function} callback which is called when the page is extracted.
      *   Modified   19/04/2019    Vishnat Gautam  for bug #5393
      */
      loadPage: function(pageNo, pageCallback){
        if(pageNo === this.requestedPage){
          return;
        }
        //Added by Vishant Gautam on 19/04/2019 for Bug ID : 5393
        this.requestedPage = pageNo;
        showLoadBar();
        var self = this;
        if (this.annotationDisplay == true) {
          this.AnnotationManager.clear();
          document.getElementById('imageCanvas').style.visibility = 'hidden';
        }
        setTimeout(function(){
          try
          {
            self.setAnnotationDisplay(self.annotationDisplay);
            self.AnnotationManager.annotationList = [];
            self.AnnotationManager.imageStampList = [];
            self.AnnotationManager.stampImageObjectList = [];
            self.AnnotationManager.isFirstDisplay = true;
            self.AnnotationManager.waitforannotation = false;
            stampDataLoaded = false;
            if(self.annotationDisplay == true){
              self.getData(pageNo, 1, callback);
                 // self.loadAnnotation(pageNo, self.annotationCallback);
            }//Added by Vishant Gautam on 19/04/2019 for Bug ID : 5393
            else{
              if (self.serverSupportMultipage && -1 != self.displayedPage) {
                self.getData(pageNo, 3, callback);
              } else {
                self.document.getPage(pageNo, pageCallback);
              }
            } 
          }
          catch(err)
          {
            hideLoadBar();
            alert(err.message);
          }
        }, 50);
        
      },
      /**
      *   Page load callback which is called when the page is extracted from the document.
      *		@modified		18/06/2018	vishant gautam for bug #5210
      *   @modified    08/02/2019    Komal Walia    bug id #14601(OD bugzilla)
      *   @modified    05/03/2019    Komal Walia    bug id # 5361
      *   Modified   19/04/2019    Vishnat Gautam  for bug #5393
      *   @modified   07/05/2019    Komal Walia    for bug 5395
      *   @modified   27/05/2019    Komal Walia    for bug 5397
      */
      pageCallback: function(pageNo){
        //  var currentPageData = OPALL.VIEWER.document.Pages[pageNo].
        var self = OPALL.VIEWER;
        //modified by Vishant Gautam on 19/04/2019 for Bug ID : 5393
        self.currentPageIndex = self.requestedPage;
        // self.setZoomAndAngle();
        // Added by Komal Walia on 05/03/2019 for bug id 5361
        if (self.document.isImagePDF) {
          var pageProxy = self.document.lastReterievedPage;
          var transform = self.document.extractTransformations(pageProxy);
          if (transform.isImagePDF) {
              var savedCanvas = self.document.Pages[pageNo].savedImage;
              self.document.applyTransformation(transform, savedCanvas);
              OPALL.CanvasUtil.rotate(savedCanvas, pageProxy.pageInfo.rotate); //Page rotation tag in pdf
              self.document.upatePageCanvas(pageNo, savedCanvas);
              //self.viewArea.scrollLeft = 0;
              //self.viewArea.scrollTop = 0;
              self.displayPage(pageNo, self.ZoomFactor, self.Angle);
              //Added by Komal Walia on 08/02/2019 for Bug id : 14601(OD Bugzilla)
              if(self.pageDisplayCallback){
                //Modified by Komal Walia for bug 5397 on 08/05/2019
                  self.pageDisplayCallback(self.currentPageIndex);
              }
              //Added by Komal Walia on 08/02/2019 for Bug id : 14601(OD Bugzilla)
              if (self.extractZoneParams) {
                  self.AnnotationManager.drawExtractZone(self.extractZoneParams[0], self.extractZoneParams[1], self.extractZoneParams[2], self.extractZoneParams[3], self.extractZoneParams[4], self.extractZoneParams[5], self.extractZoneParams[6], self.extractZoneParams[7], self.extractZoneParams[8], self.extractZoneParams[9], self.extractZoneParams[10]);//Added by vishant passed imageHideColor parameter
                  //this.viewer.AnnotationManager.drawImmediate();
                  //this.SetRectDisplayPosition(this.extractZoneParams[1], this.extractZoneParams[2], this.extractZoneParams[3], this.extractZoneParams[4], 1, 0, 0, 0, 0);
                  self.extractZoneParams = undefined;
              }
          }
          else {
            self.document.isImagePDF = false;
          }
          pageProxy.destroy();
        }
        if (!self.document.isImagePDF) {
        // Modified by Komal Walia on 05/03/2019 for bug id 5361
          var pScale = (VIEWER_MANAGER.maxWidth - 4)/self.document.getOriginalWidth();
          self.document.getRenderedPage(pageNo, pScale/OPALL.CSS_UNITS, function(canvas) {
            if (canvas) {
              self.document.upatePageCanvas(pageNo, canvas);
            }
            //added by Komal Walia on 07/05/2019 for bug 5395
            self.document.Pages[pageNo].minScale = pScale/OPALL.CSS_UNITS;
            self.displayPage(pageNo, self.ZoomFactor, self.Angle);
            //Added by Komal Walia on 08/02/2019 for Bug id : 14601(OD Bugzilla)                            
            if(self.pageDisplayCallback){
              //Modified by Komal Walia for bug 5397 on 08/05/2019
              self.pageDisplayCallback(self.currentPageIndex);
            }
            //Added by Komal Walia on 08/02/2019 for Bug id : 14601(OD Bugzilla)
            if (self.extractZoneParams) {
              self.AnnotationManager.drawExtractZone(self.extractZoneParams[0], self.extractZoneParams[1], self.extractZoneParams[2], self.extractZoneParams[3], self.extractZoneParams[4], self.extractZoneParams[5], self.extractZoneParams[6], self.extractZoneParams[7], self.extractZoneParams[8], self.extractZoneParams[9], self.extractZoneParams[10]);//Added by vishant passed imageHideColor parameter 
              //this.viewer.AnnotationManager.drawImmediate();
              //this.SetRectDisplayPosition(this.extractZoneParams[1], this.extractZoneParams[2], this.extractZoneParams[3], this.extractZoneParams[4], 1, 0, 0, 0, 0);
              self.extractZoneParams = undefined;
            }
          });
        }
      },
      /**
      *
      */
      annotationCallback: function(data, pageNo){
        try{
          this.AnnotationManager.AnnotationDataLoaded(data, pageNo);
          //this.document.getPage(pageNo, this.pageCallback);
          if (this.serverSupportMultipage && -1 != this.displayedPage) {
            this.getData(pageNo, 3, callback);
          } else {
            this.document.getPage(pageNo, this.pageCallback);
          }
        }
        catch(err){
          this.handlePageLoadError(err);  
        }
      },
      /**
      *   @param {number} pageNo to display. 
      *   @param {float} ZoomFactor for the current Page to Display.
      *   1.0 for 100%, 2.0 for 200%
      *   @param {number}  Angle at which current page is to be displayed.
      *		@modified 18/06/2018 for bug #5210
      *   Modified    Komal Walia    26/12/2018    Bug # 81601(OD Bugzilla)
      *   Modified    Komal Walia    19/03/2019    Bug # 5345 , 5372 and Bug # 5362
      *   Modified    Komal Walia    04/04/2019    Bug # 5387
      *   Modified    Komal Walia    07/05/2019    Bug # 5396 and 5395
      *   Modified    Komal Walia    27/05/2019    Bug # 15460(OD bugzilla)
      */
      displayPage: function(pageNo, ZoomFactor, Angle){
        try {
          var annotCanvas = this.AnnotationCanvas;
          var imageCanvas = this.imageCanvas;
          var ctx = imageCanvas.getContext("2d");
          Angle %= 360;
          var self = this;
          
          this.resizeStarted = false; //added by vishant gautam for pinch zoom
        //  document.getElementById('imageCanvas').style.visibility = 'hidden';
          var page = this.document.Pages[pageNo];
          // canvas.width = page.width;
          // canvas.height = page.height;
          // ctx.drawImage(page.savedImage,0,0,page.width,page.height);
          // ctx.restore();
      //    document.getElementById('PageDisplayed').textContent = pageNo;
          var scaleX = ZoomFactor * page.pageScale;
          var scaleY = ZoomFactor * page.pageScale;
          if (!this.document.isImagePDF) {
            scaleX = scaleY = 1;
            //modified by Komal Walia on 07/05/2019 for bug 5395.
            this.zoomScale = page.width / (this.document.getOriginalWidth() * OPALL.CSS_UNITS);
          } else {
            this.zoomScale = ZoomFactor * page.pageScale;
          }
          
          var scaledWidth  = parseInt(scaleX * page.width);
          var scaledHeight = parseInt(scaleY * page.height);
          
          if(scaledWidth*scaledHeight <= OPALL.MaxImageSize){   //Zoom Limit
              var drawWidth = page.width;
              var drawHeight = page.height;
              var drawCanvas = page.savedImage;
              //this.ZoomFactor = ZoomFactor;
          //    var ctx = this.imageCanvas.getContext("2d");
              ctx.save();
              ctx.scale(scaleX,scaleY);
              var startX = 0;
              var startY = 0;
              var steps = Math.ceil(Math.log(page.savedImage.width / scaledWidth) / Math.log(2));
            
              if(PDFJS.Image.kind == ImageKind.GRAYSCALE_1BPP && ZoomFactor > 1.0){
                  steps = 0;
              }
              if(this.isScanResolution  == true){
                  steps = 1;
                  scaleX = 1;
                  scaleY = 1;
                  scaledWidth = page.savedImage.width;
                  scaledHeight = page.savedImage.height;
                  this.isScanResolution  = false;
              }
          
              this.AnnotationManager.scaleX = scaleX;
              this.AnnotationManager.scaleY = scaleY;
              this.AnnotationManager.zoomFactor = ZoomFactor;
              //this.AnnotationManager.DrawScaledAnnotation()
              //this.AnnotationManager.ResizeAnnotation(page.width, page.height, scaledWidth, scaledHeight);
              if(steps > 1){
                  var offScreen = document.createElement('canvas');
                  var offScreenCtx = offScreen.getContext('2d');
                  offScreen.width = page.savedImage.width * 0.5;
                  offScreen.height = page.savedImage.height * 0.5;
                  offScreenCtx.drawImage(page.savedImage, 0, 0, offScreen.width, offScreen.height);
                  var nTimes = 1;
                  for(var p = 3; p <= steps; p++){
                      offScreenCtx.drawImage(offScreen, 0, 0, offScreen.width*0.5, offScreen.height*0.5);
                      nTimes = nTimes * 0.5;
                  }
                  drawWidth = offScreen.width*nTimes;
                  drawHeight = offScreen.height*nTimes;
                  drawCanvas = offScreen;
              }
              
              if (Angle == 0 || Angle==360){
                  imageCanvas.width = annotCanvas.width = scaledWidth;
                  imageCanvas.height = annotCanvas.height = scaledHeight;
                  
                  ctx.drawImage(drawCanvas, 0, 0, drawWidth, drawHeight, startX, startY, imageCanvas.width , imageCanvas.height);
              }
              else if (Angle == 90){
                  imageCanvas.height = annotCanvas.height = scaledWidth;
                  imageCanvas.width = annotCanvas.width = scaledHeight;
                  ctx.rotate(90*Math.PI/180);
                  startX = 0;
                  startY = -imageCanvas.width;
                  ctx.drawImage(drawCanvas, 0, 0, drawWidth, drawHeight, startX, startY, imageCanvas.height, imageCanvas.width);
              }
              else if (Angle == 180){
                  imageCanvas.width = annotCanvas.width = scaledWidth;
                  imageCanvas.height = annotCanvas.height = scaledHeight;
                  ctx.rotate(180*Math.PI/180);
                  startX = -(imageCanvas.width);
                  startY = -(imageCanvas.height);
                  ctx.drawImage(drawCanvas, 0, 0, drawWidth, drawHeight, startX, startY, imageCanvas.width, imageCanvas.height);
              }
              else if (Angle == 270){
                  imageCanvas.height = annotCanvas.height = scaledWidth;
                  imageCanvas.width = annotCanvas.width = scaledHeight;		
                  ctx.rotate(270*Math.PI/180);
                  startX = -(imageCanvas.height);
                  startY = 0;
                  ctx.drawImage(drawCanvas, 0, 0, drawWidth, drawHeight, startX, startY, imageCanvas.height, imageCanvas.width);
              }
              //Added by Komal Walia on 02/05/2019 for bug 5396.
              this.AnnotationManager.scaleForDrawing = (parseInt(document.getElementById('imageCanvas').width)*page.Xdpi)/(page.width*96.0); 
            //  this.AnnotationManager.draw();
              if(this.AnnotationManager.imageStampList.length<=0 || stampDataLoaded){
                this.AnnotationManager.DrawScaledAnnotation(annotCanvas, this.AnnotationManager.annotationList, ZoomFactor * page.pageScale, ZoomFactor * page.pageScale);
                document.getElementById('imageCanvas').style.visibility = 'visible';
                hideLoadBar();
              }
              
        
              ctx.restore();
              this.ZoomFactor = ZoomFactor;
              this.Angle = Angle;
              this.displayedPage = pageNo;
              
              hideControls();
              showControls();
              var self = this;
              //added by Komal Walia on 24/12/2018 for bug id:81601(in OD bugzilla)                
                if(this.showDocumentCallback){
                  //modified by Komal Walia on 05/03/2019 for bug id : 5345
                  //modified by Komal Walia on 04/04/2019 for Bug 5387
                  this.showDocumentCallback(OPALL.DOC_STATUS.SUCCESS);
                  this.showDocumentCallback = null;
                }
                 // Added by Komal Walia for bug 15460(OD Bugzilla) on 27/05/2019
                this.documentLoaded = true;
             // setTimeout(function(){
             // this.AnnotationManager.draw(); 
             // }, 500);
                 //Logging Comments
                //console.log("Image Displayed:" + (Date.now()-startTime) + "\n");
              //  this.ImageResizeAndRotateSucessHandler();
          }
          else{
            //  alert("Image Size too large to be painted.");
              //Added by Komal Walia on 19/03/2019 for bug 5362 and 5372
              OPALL.VIEWER.handlePageLoadError(OPALL.DOC_STATUS.DOC_SIZE_EXCEED_MAX_PIXELS_LIMIT.value + "(" + (scaledWidth*scaledHeight/1000000).toFixed(2) + " MP)" );
          }
        } catch (err){
          OPALL.VIEWER.handlePageLoadError("Error in displaying image");
        }
      },
      /**
      *   @function loadAnnotation
      *   load the annotation
      *   @param {number} pageNo for which annotation is to loaded.
      *   @param {callback} function to be called when annotation data is loaded.
      */
      loadAnnotation: function(pageNo, pageCallback){
        //this.param.getData(pageNo, 'ANNOTINI', this.annotationCallback);
        this.AnnotationManager.LoadAnnotation(this.param.URL_Annotation, pageNo);
     //   this.AnnotationManager.LoadStampAnnotationINI(this.param.URL_StampINIPath, pageNo);
      },
      /**
      *   @function nextPage
      *   show Next Page.
      *   Modified   19/04/2019    Komal Walia  for bug #5393
      */
      nextPage: function(){
        //modified by Komal Walia on 19/04/2019 for Bug ID : 5393
        if(this.currentPageIndex != OPALL.VIEWER.numberOfPages){
          this.loadPage(this.currentPageIndex+1, this.pageCallback);
        }
      },
      /**
      *   @function previousPage
      *   show previous Page.
      */
      previousPage: function(){
        if(this.currentPageIndex != 1){
          this.loadPage(this.currentPageIndex-1, this.pageCallback);
        }
      },
      /**
      *   @function first page
      *   show first Page of the document.
      */
      firstPage: function(){
        this.loadPage(1, this.pageCallback); 
      },
      /**
      *   @function lastPage
      *   show last Page of the document.
      *   Modified   19/04/2019    Komal Walia  for bug #5393
      */
      lastPage: function(){
        this.loadPage(OPALL.VIEWER.numberOfPages, this.pageCallback);
      },
      /**
      *   @function setAnnotationDisplay
      *   @param {boolean} bool sets the visibility of annotation canvas
      */
      setAnnotationDisplay: function(bool){
          if(true === bool){
              this.AnnotationCanvas.style.visibility = 'visible';
          }
          else{
              this.AnnotationCanvas.style.visibility = 'hidden';
          }
      },
      setZoomAndAngle: function(zoom, angle){
      
      },
      /**
      *   @function handlePageLoadError 
      *   hide load Bar if any error occurs during page load and shows the error in 
      *   alert
      */
      handlePageLoadError: function(error){
        hideLoadBar();
        alert(error);
      },
      /**
      *   @function handleDocumentLoadError 
      *   hide load Bar if any error occurs document load and shows the error in 
      *   alert
      *   Modified    Komal Walia    24/12/2018    Bug # 81601(OD Bugzilla)
      *   Modified    Komal Walia    04/04/2019    Bug # 5387
      *   Modified    Komal Walia    27/05/2019    Bug # 15460(OD Bugzilla)
      */
      hanldeDocumentLoadError: function(error){
        hideLoadBar();
          //added by Komal Walia on 24/12/2018 for bug id:81601(in OD bugzilla)
          if (this.showDocumentCallback){
            //modified by Komal Walia on 04/04/2019 for Bug 5387
            this.showDocumentCallback(error);
            this.showDocumentCallback = null;
            // Added by Komal Walia for bug 15460(OD Bugzilla) on 27/05/2019
            if(false === this.documentLoaded){
              document.getElementById('viewArea').style.pointerEvents = "none";
              document.getElementById('imageCanvas').style.pointerEvents = "none";
              document.getElementById('annotCanvas').style.pointerEvents = "none";
              document.getElementById('pageNavgSlider').style.pointerEvents = "none";
              document.getElementById('pageNavgBar').style.pointerEvents = "none";
            }
            else{
              OPALL.VIEWER.loadPage(OPALL.VIEWER.currentPageIndex, OPALL.VIEWER.pageCallback);
            }
          }else{
            // Added by Komal Walia for bug 15460(OD Bugzilla) on 27/05/2019
            if(false === this.documentLoaded){
              document.getElementById('viewArea').style.pointerEvents = "none";
              document.getElementById('imageCanvas').style.pointerEvents = "none";
              document.getElementById('annotCanvas').style.pointerEvents = "none";
              document.getElementById('pageNavgSlider').style.pointerEvents = "none";
              document.getElementById('pageNavgBar').style.pointerEvents = "none";
              document.getElementById('pagediv').style.pointerEvents = "none";
            }
            else{
              OPALL.VIEWER.loadPage(OPALL.VIEWER.currentPageIndex, OPALL.VIEWER.pageCallback);
            }
            alert(error.value);
          }
      },
      getRequestedPageURL : function (page_number, url) {
        var sParam = "PageNo";
        if (url !== '' && url !== undefined) {
          var urlLowerCase = url.toLowerCase();
          var startIndex = urlLowerCase.indexOf(sParam.toLowerCase());
          var prefix = url.substring(0, startIndex) + url.substring(startIndex, startIndex + sParam.length);
          var restString = url.substring(startIndex + sParam.length);

          prefix = prefix + restString.split("=")[0] + "=";
          var suffix = "";
          var startPosition = restString.indexOf("&");
          if (startPosition != -1)
            suffix = restString.substring(startPosition);
          prefix = prefix + page_number;
          return (prefix + suffix);
        } else {
          return '';
        }
      },
      /**
      *   @function 
      *   DrawExtractZone function is used to draw extract zone on the image/document. 
      *   Parameters: 
          It works in two mode single parameter or multiple parameter. 
          Below is the param description, If Multiple parameters are passed separately:
          1.  zoneType - Type of Extract Zone - Permissible values are the following defined constants:
              EXT_ZONE_SOLID_RECT = 1 
              EXT_ZONE_HIGHLIGHT = 2
              EXT_ZONE_OPAQUE = 3
          2.  x1 - The x-coordinate of top-left corner of the zone
          3.  y1 - The y-coordinate of top-left corner of the zone
          4.  x2 - The x-coordinate of bottom-right corner of the zone
          5.  y2 - The y-coordinate of bottom-right corner of the zone
          6.  zoneColor - Color of extract zone.
              The color will be a 32-bit integer value which should be constructed by a combination of 4 
              Bytes as:
              1st Byte [MSB] 	= 0 (always)
              2nd Byte		 = Red Component [0-255]
              3rd Byte 		= Green Component [0-255]
              4th Byte [LSB] 	= Blue Component [0-255]
              Examples:
               Red Color -> 00000000 11111111 00000000 00000000 -> 16711680
               Green Color -> 00000000 00000000 11111111 00000000 -> 65280
               Blue Color -> 00000000 00000000 00000000 11111111 -> 255
              Other Colors can be constructed by mixing RGB components accordingly.
          7.  thickness - The thickness of the extract zone. Permissible values are integer values between 1 and 5 pixels.
          8.  isMutable - Specifying whether the extract zone is mutable i.e. it can be selected, moved or resized. Permissible values are true and false. If isMutable = true then zone can be moved, selected and resized otherwise not.
                           Not Implemented yet... passed as false.
          9.  isDarkBackground - Specifying whether extract zone with dark background is to be drawn. If this parameter is true then image behind zone will get inverted with zoneType = EXT_ZONE_HIGHLIGHT.
                                 Not Implemented yet... passed as false.
          10. strPartitionInfo – not implemented yet. Set its value to NULL
          11. pageNo - The page number on which the extract zone is to be drawn.
          12. bOnlyZone- This is used to cover the whole document area except the zone area with the specified color value [value in Hex, for Eg #ff0000 for Red color or in string Eg “red”].
                         Not Implemented yet...
              If single parameter is passed, it is passed as a JSON object

      *   @Author  Komal Walia  Bug ID : 14601(OD Bugzilla)
      *   @Modified by Komal Walia Bug ID : 5349 on 05/03/2019
      *   @Modified by Komal Walia Bug ID : 5397  on 27/05/2019
      */
      DrawExtractZone : function (zoneType, x1, y1, x2, y2, zoneColor, thickness, isMutable, isDarkBackground, strPartitionInfo, pageNo, imageHideColor) {
        try
        {
          var zoneObj = (1 === arguments.length ? JSON.parse(zoneType) : false);
          if (zoneObj) {
            zoneType = zoneObj.zoneType;
            x1 = zoneObj.x1;
            x2 = zoneObj.x2;
            y1 = zoneObj.y1;
            y2 = zoneObj.y2;
            zoneColor = zoneObj.zoneColor;
            thickness = zoneObj.thickness;
            isMutable = zoneObj.isMutable;
            isDarkBackground = zoneObj.isDarkBackground;
            strPartitionInfo = zoneObj.strPartitionInfo;
            pageNo = zoneObj.pageNo;
            imageHideColor = zoneObj.imageHideColor;
          }
          pageNo = parseInt(pageNo, 10);
          if (zoneType != OPALL.CONSTANTS.EXT_ZONE_SOLID_RECT && zoneType != OPALL.CONSTANTS.EXT_ZONE_HIGHLIGHT && zoneType != OPALL.CONSTANTS.EXT_ZONE_OPAQUE) {
            throw(Error("zoneType is not correct."));
          }
          x1 = parseInt(x1, 10);
          x2 = parseInt(x2, 10);
          y1 = parseInt(y1, 10);
          y2 = parseInt(y2, 10);
          if (x2 < x1 || y2 < y1) {
            throw(Error("Coordinates are not correct."));
          }
          if (x1 < 0 || y1 < 0 || x2 < 0 || y2 < 0) {
            throw(Error("Coordinates are not correct."));
          }
          var page = this.document.Pages[this.displayedPage];
          if (x1 > page.width || y1 > page.height) {
            throw(Error("Coordinates are not correct."));
          }
          //draw maximum possible zone
          if (x2 > page.width) {
            x2 = page.width;
          }
          if (y2 > page.height) {
            y2 = page.height;
          }
          if (zoneColor < 0) {
            throw(Error("zoneColor is not correct."));
          }
          if (thickness < 1) {
            throw(Error("thickness is not correct."));
          }
          var ret;
          //Added by Komal Walia for bug 5397 on 08/05/2019
          if (isNaN(pageNo) || this.currentPageIndex === pageNo) {
            ret = this.AnnotationManager.drawExtractZone(zoneType, x1, y1, x2, y2, zoneColor, thickness, isMutable, isDarkBackground, strPartitionInfo, imageHideColor);
            //self.AnnotationManager.drawImmediate();
            //this.SetRectDisplayPosition(x1, y1, x2, y2, 1, 0, 0, 0, 0);
            return ret;
          }

          //CloseZoomLens();
         this.extractZoneParams = [zoneType, x1, y1, x2, y2, zoneColor, thickness, isMutable, isDarkBackground, strPartitionInfo, imageHideColor];
         this.loadPage(pageNo, this.pageCallback);
        }
        catch(error)
        {
          console.error('error occured in drawExtractZone : ' + error);
          return 0;//Added by Komal Walia on 05/03/2019 for bug id 5349
        }
      },
      /**
      *   @function 
      *   deleteAllZone function is used to delete all zones. 
      *   Parameters:None
      *   @Author  Komal Walia  Bug ID : 14601(OD Bugzilla)
      **/
      deleteAllZone : function () {
        try
         {
         var length = this.AnnotationManager.zoneList.length;
         if (length <= 0){
           throw(Error("length is not correct."));
        }
         return (this.AnnotationManager.deleteAllExtractZones());
         }
       catch(error)
        {
           console.error('error occured in deleteAllZone : ' + error);
        }
      }
    };
    
    return Viewer;
})();



//  Function for getting device width and adjusting the opall accordingly
window.addEventListener('resize', function webViewerResize(evt) {
    ResizeViewer();
});

function SetViewerPosition(left, top, width, height) {
    //Getting all the components for which the dimensions are to be set
    var wrapper = document.getElementById("viewArea");
    var annotationToolBar = document.getElementById("AnnotationToolbar");
    var transformationToolBar = document.getElementById("TransformationToolbar");
    var annotationcanvas = document.getElementById("annotCanvas");
    var scrollBarWidth = 20;
    

    annotationToolBar.style.top = VIEWER_MANAGER.topPadding + "px";
    annotationToolBar.style.height = VIEWER_MANAGER.viewerHeight + "px";
    transformationToolBar.style.width = width + VIEWER_MANAGER.pinAnnotbar + 4 + "px";
    annotationcanvas.style.top = "0px";
    annotationcanvas.style.left = "0px";
    //Setting the dimensions of the Wrapper
    wrapper.style.top = top + "px";
    wrapper.style.left = left + "px";
    wrapper.style.width = width + "px";
    wrapper.style.height = height + "px";
    
    // wrapper.style.width = 500 + "px";
    // wrapper.style.height =  500 + "px";
};
var count = 0;

/**
*   @function 
*   ResizeViewer function will be called whenever the browser fires the resize 
*   event on.
*   Modified  Komal Walia  Bug ID : 14600(OD Bugzilla)
*/
function ResizeViewer(offset){
    if(document.getElementById('OpAll')){
        var maxWidth = VIEWER_MANAGER.maxWidth = window.innerWidth || document.body.clientWidth;
        var maxHeight = VIEWER_MANAGER.maxHeight = window.innerHeight || document.body.clientHeight;
    //Added by Komal Walia on 08/02/2019 for Bug id : 14600(OD Bugzilla)
    if (OPALL.VIEWER.width != 0){
      maxWidth = VIEWER_MANAGER.maxWidth = OPALL.VIEWER.width;
    }
    //Added by Komal Walia on 08/02/2019 for Bug id : 14600(OD Bugzilla)   
    if (OPALL.VIEWER.height != 0) {
     maxHeight =  VIEWER_MANAGER.maxHeight = OPALL.VIEWER.height;
    }
    var wrapper = document.getElementById("viewArea"); 
    var pageNavgSlider = document.getElementById('pageNavgSlider');
    var pageNavgBar = document.getElementById('pageNavgBar');
    
    VIEWER_MANAGER.leftPadding = 2;
    VIEWER_MANAGER.rightPadding = 2;
    VIEWER_MANAGER.bottomPadding = 2;
    if(VIEWER_MANAGER.bpinTransfrombar){
        VIEWER_MANAGER.pinTransfrombar = parseInt(window.getComputedStyle(document.getElementById("TransformationToolbar")).getPropertyValue("height")) + 7;
    }
    else{
        VIEWER_MANAGER.pinTransfrombar = 0;
    }
    if(VIEWER_MANAGER.bpinAnnotbar){
        VIEWER_MANAGER.pinAnnotbar = parseInt(window.getComputedStyle(document.getElementById("AnnotationToolbar")).getPropertyValue("width")) + 5;
    }
    else{
        VIEWER_MANAGER.pinAnnotbar = 0;
    }
    
    VIEWER_MANAGER.topPadding = 2 + VIEWER_MANAGER.pinTransfrombar;
    VIEWER_MANAGER.viewerWidth = maxWidth - VIEWER_MANAGER.leftPadding - VIEWER_MANAGER.rightPadding - VIEWER_MANAGER.pinAnnotbar; 

    if (offset){
      VIEWER_MANAGER.viewerWidth += offset ;
    }
       
    VIEWER_MANAGER.viewerHeight = maxHeight - VIEWER_MANAGER.topPadding - VIEWER_MANAGER.bottomPadding;


    
    pageNavgSlider.max = maxWidth - 80 - VIEWER_MANAGER.leftPadding - VIEWER_MANAGER.rightPadding;
    pageNavgSlider.style.width = maxWidth - VIEWER_MANAGER.leftPadding - VIEWER_MANAGER.rightPadding - 40 + "px";
   //     document.getElementById('pageCount').style.left = maxWidth - 300 + "px";
    pageNavgBar.style.width =  maxWidth + "px";
        pageNavgBar.style.top = VIEWER_MANAGER.viewerHeight - 46 + "px";
    SetViewerPosition(VIEWER_MANAGER.viewerLeft, VIEWER_MANAGER.viewerTop, VIEWER_MANAGER.viewerWidth, VIEWER_MANAGER.viewerHeight);
    }
};

/**
* This function is called when page is loaded first time. This is the entry point function.
* @Modified by Komal Walia  06/03/2019 bug 5362
*/

 function OpAll_Initialize(){
	var viewerArea = document.getElementById('viewArea');
    viewArea.style.display = "none";

    canvas = document.getElementById("imageCanvas");
    canvas2 = document.getElementById("annotCanvas");

    VIEWER_MANAGER.pinAnnotbar = 0;
    VIEWER_MANAGER.pinTransfrombar = 0;    
    VIEWER_MANAGER.bpinAnnotbar = false;
    VIEWER_MANAGER.bpinTransfrombar = false;

    OPALL.MaxImageSize = 10000000;//Added by Komal Walia on 06/03/2019 for bug 5362
    if(navigator.userAgent.match(/Android/)){
    	OPALL.device = 'Android';
    	OPALL.MaxImageSize = 10000000; // 10 Mega Pixel
    }
    else if(navigator.userAgent.match(/iPad/) || navigator.userAgent.match(/iPhone/)){
    	OPALL.device = 'iPad';
    	OPALL.MaxImageSize = 5244100;//(2290 * 2290) 5 Mega Pixel
        //Added by Komal Walia on 06/03/2019 for bug 5362
        var versionOS = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        if(versionOS[1] >= 12){
            OPALL.MaxImageSize = 10000000; // 10 Mega Pixel
        }
    }
  

    ResizeViewer();
    viewArea.style.display = "block";

   // PageInitialization();

}; 

/**
*   @clousre
*   clousre for viewer event controller
*   @modified  24/08/2017 vishant gautam for bug #5000, #5001
*   @modified  14/06/2018 vishant gautam for bug #5210
*/
var ViewerEventController = (function ViewerEventControllerClosure(){
    var self;
    var touchState = {};
    touchState.swipe = false;
    touchState.move = false;
    var pinchZoomTime = 0; //addition by vishant gautam on 24/08/2017 for bug #5000
    var pinchZoomTimeOutId = 0; //addition by vishant gautam on 24/08/2017 for bug #5000
/**
*   @function
*   Related to Page Navigation Slider
*   this function will be called when user navigate to some specific page using
*   page navigation slider
*   @modified  23/04/2019 Vishant Gautam bug 5393 
*/
    function pageShow(){
			var pageN = document.getElementById('pageNavgSlider');
			var numPages = OPALL.VIEWER.numberOfPages;//Modified by Vishant Gautam on 23/04/2019 for bug id 5393.
			OPALL.VIEWER.loadPage((Math.floor((pageN.value*numPages)/(parseInt(pageN.max) + 1))) + 1,OPALL.VIEWER.pageCallback);
			timeId = setTimeout(hideControls, 4000);
    }

/**
*   @function
*   Related to Page Navigation Slider
*   this function is called when user start moving the thumb on page navigation slider
*   it will show the page Number as per the page Navigation thumb location and it will also
*   clear the timer for auto hide of controls
*/
    function scrollStart(){
			var pagediv = document.getElementById('pagediv');
			var pageNavgBar = document.getElementById('pageNavgBar');
			var pageN = document.getElementById('pageNavgSlider');
			pagediv.style.display = "block";
			pagediv.style.left = parseInt(pageN.value) + 5 + "px";
			pagediv.style.top = parseInt(window.getComputedStyle(pageNavgBar).getPropertyValue("top")) - 35 + "px";
      clearTimeout(timeId);
    };

/**
*   @function
*   Related to Page Navigation Slider
*   this function is called when user moves the thumb on the page navigation slider to adjust
*   the location of page number div and its content accordingly
*   @modified  23/04/2019 Vishant Gautam bug 5393 
*/
    function scrollMove(){
			var pagediv = document.getElementById('pagediv');
			var pageN = document.getElementById('pageNavgSlider');
			var numPages = OPALL.VIEWER.numberOfPages;//Modified by Vishant Gautam on 23/04/2019 for bug id 5393.
			pagediv.innerHTML = (Math.floor((pageN.value*numPages)/(parseInt(pageN.max)+1)) + 1) + "/" +  numPages;
			pagediv.style.left =  parseInt(pageN.value) + 5 + "px";
    }

/**
*   @class
*   Main viewer event controller class for handling all the events
*   on the view area, annotation Canvas and image canvas
*   also registers the default events for page Navigation slider
*		@modified		14/06/2018		vishant gautam for bug #5210
*															Function modified: touchMove
*/
    function ViewerEventController(){
        self = this;
        this.viewer = OPALL.VIEWER;
        this.focusObject = null;
        this.viewArea = document.getElementById("viewArea");
        this.init();
    }

    ViewerEventController.prototype = {
        /**
        *   @function
        *   initializes events for various controls
        */
        init : function(){
            var pageNavgSlider = this.viewer.UI['pageNavgSlider'];
            pageNavgSlider.addEventListener('touchstart', function(e){scrollStart();}, true);
            pageNavgSlider.addEventListener('input', function(e){scrollMove();}, true);
            pageNavgSlider.addEventListener('change', function(e){scrollMove();}, true);
            pageNavgSlider.addEventListener('touchmove', function(e){scrollMove();}, true);
            pageNavgSlider.addEventListener('touchend', function(e){pageShow();}, true);
        },
        /**
        *   @function
        *   this function is used for registering events on viewArea, imageCanvas, annotation Canvas
        */
        registerElement : function(element){
            element.addEventListener('touchstart', function(e){self.touchStart(e);}, false);
            element.addEventListener('touchmove', function(e){self.touchMove(e);}, false);
            element.addEventListener('touchend', function(e){self.touchEnd(e);}, false);
            element.addEventListener('touchcancel', function(e){self.touchEnd(e);}, false);
        },
        /**
        *   @function
        *   @param {event} dom event
        *   this function is called whenever user touch on viewArea, imageCanvas, annotation Canvas
        *   also calculate the initial distance for Zoom lens if multi touch is there
        *   @modified  24/08/2017 vishant gautam for bug #5000
        *   @modified  07/05/2019 Komal Walia for bug #5395
        */
        touchStart : function(e){
					//e.preventDefault();
          e.stopPropagation();
          var viewArea = this.viewArea;
          //modified by Komal Walia on 07/05/2019 for bug 5395.
          if(0 == parseInt(viewArea.scrollLeft) || ((parseInt(viewArea.scrollLeft) + parseInt(viewArea.style.width)) == this.viewArea.scrollWidth)){
              touchState.swipe = true;
          }

          var annotCanvas = this.viewer.AnnotationCanvas;
          //modifications by vishant gautam on 24/08/2017 for bug #5000
          var x1,y1,x2,y2;
          if (e.touches.length == 1) {
            x1 = e.touches[0].pageX;
            y1 = e.touches[0].pageY;
          } else if (e.touches.length == 2) {
            touchState.touch = false;
            //console.error('touchstart two events');
            pinchZoomTime = Date.now();
            clearTimeout(pinchZoomTimeOutId);
            pinchZoomTimeOutId = setTimeout(function(){
              pinchZoomTime = 0;
            }, 1000);

            x1 = e.touches[0].pageX;
            x2 = e.touches[1].pageX;
            y1 = e.touches[0].pageY;
            y2 = e.touches[1].pageY;
            this.initialCoords = [{'x':x1,'y':y1}, {'x':x2,'y':y2}];
            this.initialDistance = Math.sqrt(((y1 - y2) * (y1 - y2)) + ((x1 - x2) * (x1 - x2)));
          }
          //modifications ends here
          if(e.touches.length > 1){
            touchState.swipe = false;
          }
          //modified by Komal Walia on 07/05/2019 for bug 5395.
          if (OPALL.VIEWER.document.isImagePDF) {
            this.initialPinchZoom = OPALL.VIEWER.ZoomFactor * 100;
          } else {
            this.initialPinchZoom = OPALL.VIEWER.zoomScale * 100;
          }
          touchState.startTime = new Date().getTime();  checkIfDoubleTap(e, touchState); /*e.preventDefault();*/ touchState.lastTouchTime = touchState.startTime; touchState.temp = 0;

          touchState.start = getMouse(e);
          // if(annotCanvas.style.visibility == 'visible'){

          // }
        },
        /**
        *   @function
        *   @param {event} dom event
        *   this is function is called when user perform touch move on the viewArea, imageCanvas, annotation Canvas
        *   if 2 touches are there then it calculates the zoom % and call the display page accordingly
        *   in case of single touch it drags the image
        *   @modified  24/08/2017 vishant gautam for bug #5000, #5001
        *   @modified  14/06/2018 vishant gautam for bug #5210
        *   @modified  07/05/2019 Komal Walia for bug #5395
        */
        touchMove : function(e){
					//e.preventDefault();
          e.stopPropagation();

          //var zoomSpeed = 0.5;
          if(e.touches.length == 2){
            var x1 = e.touches[0].pageX;
            var x2 = e.touches[1].pageX;
            var y1 = e.touches[0].pageY;
            var y2 = e.touches[1].pageY;

            this.currentDistance = Math.sqrt( ((y1-y2) * (y1-y2)) + ((x1-x2) * (x1-x2)) );
            touchState.touch = false;
          }else{
            touchState.move = true;
          }

          //modifications by vishant gautam on 24/08/2017 for bug #5000, #5001
          if(e.touches.length == 2){
            var zoomRatio = this.currentDistance / this.initialDistance;
             // if(zoomRatio > 1){
            // zoomRatio = 1 + ((zoomRatio - 1) * zoomSpeed);

           // }
           // else{
            // zoomRatio = 1 - ((1 - zoomRatio) * zoomSpeed);
           // }

            var newZoomPercentage =  this.initialPinchZoom * zoomRatio;
            var viewer = OPALL.VIEWER;
            var curPageIndex = viewer.currentPageIndex;
             //Added by Komal Walia on 07/05/2019 for bug 5395.
               if(viewer.serverSupportMultipage){
                curPageIndex = 1;
              }
            var minScale = viewer.document.Pages[curPageIndex].minScale * 100;
            if(!viewer.document.isImagePDF){
               newZoomPercentage = (newZoomPercentage < minScale ? minScale : newZoomPercentage );
            }else{
            newZoomPercentage = (newZoomPercentage < 100 ? 100 : newZoomPercentage );
            }
            var currentZoomFactor = viewer.document.isImagePDF ? viewer.ZoomFactor : viewer.zoomScale;
            if(parseInt(Math.abs(currentZoomFactor - (newZoomPercentage / 100.0))*100) > 10){
              //Added by Komal Walia on 02/05/2019 for bug 5395.
              
              newZoomPercentage /= 100.0;
              var focusX = (this.initialCoords[0].x + this.initialCoords[1].x) / 2;
              var focusY = (this.initialCoords[0].y + this.initialCoords[1].y) / 2;
              focusX *= (newZoomPercentage - currentZoomFactor);
              focusY *= (newZoomPercentage - currentZoomFactor);
             
              //addition by vishant gautam on 24/08/2017 for bug #5002              
              var page = viewer.document.Pages[curPageIndex];
              var scaleX = newZoomPercentage * (page.pageScale);
              var scaleY = newZoomPercentage * (page.pageScale);

              var scaledWidth  = parseInt(scaleX * page.width);
              var scaledHeight = parseInt(scaleY * page.height);
							//modification by vishant gautam for vector pdf #5210
              if(scaledWidth*scaledHeight <= OPALL.MaxImageSize && !viewer.resizeStarted){ //addition ends here
								viewer.resizeStarted = true;
                if (!viewer.document.isImagePDF) {
                  viewer.document.getRenderedPage(curPageIndex, newZoomPercentage, function(canvas){
                if (canvas && (canvas.width*canvas.height < OPALL.MaxImageSize)) {
                  var pagescale = page.pageScale;
                  viewer.document.upatePageCanvas(curPageIndex, canvas);
                  page.pageScale = pagescale;
                  viewer.displayPage(curPageIndex, newZoomPercentage, viewer.Angle);
                  //Added by Komal Walia on 07/05/2019 for bug 5395.
                  viewer.zoomScale = newZoomPercentage;
                } else {
                  viewer.resizeStarted = false;
                }
                }); 
                return;
                } else {
                  viewer.displayPage(curPageIndex, newZoomPercentage, viewer.Angle);
                }
                var viewArea = this.viewArea;
                viewArea.scrollTop = focusY + parseInt(viewArea.scrollTop);
                viewArea.scrollLeft = focusX + parseInt(viewArea.scrollLeft);
                pinchZoomTime = Date.now();
                clearTimeout(pinchZoomTimeOutId);
                pinchZoomTimeOutId = setTimeout(function(){
                  pinchZoomTime = 0;
                }, 1000);
              }
              //viewer.ZoomFactor = newZoomPercentage;
            }
          }

          if(0 === pinchZoomTime){
            var mouse = getMouse(e);
            var deltaX = touchState.start.x - mouse.x;
            var deltaY = touchState.start.y - mouse.y;
            var viewArea = this.viewArea;
            viewArea.scrollTop = (deltaY + parseInt(viewArea.scrollTop));
            viewArea.scrollLeft = (deltaX + parseInt(viewArea.scrollLeft));
          }
          //modifications ends here
        },
        /**
        *   @function
        *   @param  {event} a dom event
        *   this function is called when the user touch end event of imageCanvas, annotCanvas, viewArea
        *   is called, this function also checks for swipe operation and perform if required
        */
        touchEnd : function(e){
					//e.preventDefault();
          e.stopPropagation();
          touchState.end = getMouse(e);
          if(!touchState.move && (Math.abs(touchState.start.x - touchState.end.x) < 10)){
              showControls();
          }
					
          var xdiff = touchState.start.x - touchState.end.x;
          var ydiff = Math.abs(touchState.start.y - touchState.end.y);
          var swipeSlope = 1;
          var swipeDiff = VIEWER_MANAGER.maxWidth * 0.20;
          if(touchState.swipe && touchState.move && Math.abs(ydiff/xdiff) < swipeSlope){
              if( xdiff > swipeDiff ){
                  OPALL.VIEWER.nextPage();
              }else if(xdiff < -swipeDiff){
                  OPALL.VIEWER.previousPage();
              }
          }

          touchState.finalPoint = getMouse(e);
          touchState.xmove = false;


          touchState.endTime = new Date().getTime();

          if(touchState.touch && (Math.abs(touchState.finalPoint.x - touchState.initialPoint.x) <= 5)){
              showControls();
          }else{
             touchState.touch = false;
          }
          touchState.temp = 0;

          touchState.swipe = false;
          touchState.move = false;
        },
    };

    return ViewerEventController;
})();

function attachEventListener(id, event, funct, isCapture){
    if(id  && event  && typeof (funct) != 'function' ){
        document.getElementById(id).addEventListener(event, funct(e), isCapture ? isCapture : false);
    }
}
    
    

/**
*   @function getMouse to get the coordinates of mouse with respect to screen for a event 
*   @params {event} a dom event.
*/
function getMouse(e) {
    var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
   
    //if (OPALL.touchDevice) {
    var touches = event.changedTouches;
    e = touches[0];
    //}
    
    var viewArea = document.getElementById('viewArea');
    offsetX += parseInt(viewArea.scrollLeft);
    offsetY += parseInt(viewArea.scrollTop);

    mx = e.pageX + offsetX - VIEWER_MANAGER.leftPadding;
    my = e.pageY + offsetY - VIEWER_MANAGER.topPadding;


    // We return a simple javascript object (a hash) with x and y defined
    return { x: mx, y: my };
}

/**
*   @variables 
*   for storing the state of controls visibility like auto hide after 4 sec.
*/
var state = 0;
var timeId;

/**
*   @function
*   to hide all the shown controls also clear the timeout set by showControls
*   
*/
function hideControls(){
    state = 0;
    clearTimeout(timeId);
    
    var transformBar = OPALL.VIEWER.UI['TransformationToolbar'];
    var annotbar = OPALL.VIEWER.UI['AnnotationToolbar'];
    var pageNavgBar = OPALL.VIEWER.UI['pageNavgBar'];
    var pageNoDiv = OPALL.VIEWER.UI['pagediv'];
    if(pageNoDiv)
    	pageNoDiv.style.display = "none";
    if(pageNavgBar)
    	pageNavgBar.style.display = "none";
}

/**
*   @function
*   to show all the controls also set the timer for calling hideControls after some time (4 sec)
*   @modified  23/04/2019 Vishant Gautam bug 5393 
*/
function showControls(){
    if(state == 0){
        state = 1;
    }else{
        hideControls();
        return;
    }
    var currentPage = OPALL.VIEWER.currentPageIndex;
    //Modified by Vishant Gautam on 23/04/2019 for bug id 5393.
    var numPages = OPALL.VIEWER.numberOfPages;
    var dom = OPALL.VIEWER.UI;
    var transformBar = dom['TransformationToolbar'];
    var annotbar = dom['AnnotationToolbar'];
    var pageNavgBar = dom['pageNavgBar'];
    var pageNavgSlider = dom['pageNavgSlider'];
    var pageNoDiv = dom['pagediv'];
    if(1 === OPALL.VIEWER.numberOfPages){//Modified by Vishant Gautam on 23/04/2019 for bug id 5393.
        pageNoDiv.style.bottom = 35 + "px";
        pageNoDiv.style.left = 0 + "px";
    }else{
    pageNavgBar.style.display = "block";
    pageNoDiv.style.top = parseInt(window.getComputedStyle(pageNavgBar).getPropertyValue("top")) - 35 + "px";
    pageNavgSlider.value = Math.floor((currentPage*pageNavgSlider.max)/numPages);
    pageNoDiv.style.left = parseInt(pageNavgSlider.value) + 5 + "px";
    }
   
    pageNoDiv.innerHTML = currentPage + "/" +  numPages;
    pageNoDiv.style.display = "block";
    timeId = setTimeout(hideControls, 4000);
}


/**
*   @function 
*   for showing the load bar during page Navigation and document loading
*/
function showLoadBar(){
    var dialog = OPALL.VIEWER.UI['modalLoadBar'];
    var loadDiv = OPALL.VIEWER.UI['loadDiv'];
    var loadSpinner = OPALL.VIEWER.UI['spinnerDiv'];
    loadSpinner.classList.add('lodingSpinner');
    loadDiv.style.marginTop = parseInt((VIEWER_MANAGER.maxHeight-50)/2) + "px";
    loadDiv.style.marginLeft = parseInt((VIEWER_MANAGER.maxWidth-150)/2) + "px";
    dialog.style.opacity = 1;
    dialog.style.pointerEvents = "auto";
}

/**
* exposed showLoadBar so that it can be called from any other file.
*/
OPALL.showLoadBar = showLoadBar;
/**
*   @function 
*   for hiding the load bar after page Navigation and document loading.
*/
function hideLoadBar(){
    var dialog = OPALL.VIEWER.UI['modalLoadBar'];
    var loadSpinner = OPALL.VIEWER.UI['spinnerDiv'];
    dialog.style.opacity = 0;
    dialog.style.pointerEvents = "none";
    loadSpinner.classList.remove('lodingSpinner');
}

/**
* exposed hideLoadBar so that it can be called from any other file.
*/
OPALL.hideLoadBar = hideLoadBar;

function checkIfDoubleTap(e,touchState){
	var mouse = getMouse(e);
	 var touchStartX =mouse.x;
	 var touchStartY = mouse.y;
	 if((touchStartX <= touchState.lastTouchMouseX-10) || (touchStartX >= touchState.lastTouchMouseX+10)){
		 touchState.isTouchMoved = true;
		}
	    if((touchStartY <= touchState.lastTouchMouseY-10) || (touchStartY >= touchState.lastTouchMouseY+10)){
		 touchState.isTouchMoved = true;
		}
	 
	if((touchState.startTime -touchState.lastTouchTime) > 0 && (touchState.startTime - touchState.lastTouchTime) < 600 && (touchState.isTouchMoved == false)){
	touchState.DoubleClickEvent(e,touchState);
	}
	else{
	     
	}
}

/**
*   @function
*   @param {string} id of the parent object
*   for caching all the references of children of given element
*   @return {object} containing the id and reference map of parent object
*/

function InitUI(id){
    if(id === undefined || id === ''){
        return;
    }
    var ref = document.getElementById(id);
    var stack = [];
    stack.push({"id":id,"ref":ref});
    var UI = [];
    while(stack.length){
        var top = stack.pop();
        UI[top.id] = top.ref;
       
        for(var i=0;i<top.ref.childElementCount;i++){ 
            id = top.ref.children[i].id;
            if("" !== id){
                ref = top.ref.children[i];
                stack.push({"id":id,"ref":ref});
            }
        }
    }
 //   console.log("Length = " + UI.length);
    return UI;
}


})();

/*   Modified   19/04/2019  Vishant Gautam  for bug #5393*/
function callback(pageNo, type, attachment){
  pageNo = parseInt(pageNo, 10);
  type = parseInt(type, 10);
  if(pageNo < 1 ){
    console.log(" Invalid page Number in get Data Callback, pageNo: " + pageNo);
    OPALL.VIEWER.handlePageLoadError(" Error while loading Annotation data, pageNo:" + pageNo);
    //handle page load error
    return;
  }
  //modified by Vishant Gautam on 19/04/2019 for Bug ID : 5393
   if(type != 1 && type != 2 && 3 != type){
    console.log(" Invalid type in get Data Callback, type: " + type);
     OPALL.VIEWER.handlePageLoadError(" Error while parsing Annotation data, type: " + type);
    //handle page load error
    return;
  }
  //modified by Vishant Gautam on 19/04/2019 for Bug ID : 5393  
  switch(type){
    case 1:
        if(typeof(attachment.data) !== 'undefined' && null !== attachment.data){
          OPALL.VIEWER.annotationCallback(attachment.data, pageNo);
        }
        else if(typeof(attachment.url) !== 'undefined' && null !== attachment.url){
          OPALL.VIEWER.AnnotationManager.LoadAnnotation(attachment.url, pageNo);
        }
        break;
    case 2:
      OPALL.VIEWER.AnnotationManager.DrawImageStamps(OPALL.VIEWER.AnnotationManager.imageStampList,0, attachment);
      break;
    case 3:
      attachment.type = OPALL.docType.PDF;
      OPALL.VIEWER.document = OPALL.VIEWER.docFactory.getDocumentObject(attachment, function(doc){
        doc.getPage(1, function(pageNo){
          OPALL.VIEWER.pageCallback(pageNo);
        });
      });
    default:
      break;
  }
}

//Added by Komal Walia on 07/03/2019 for Bug ID 5361
OPALL.CanvasUtil = (function(){
	function convertToBlackAndWhite(imgData, width, height) {
		var temp;
		var index = 0;
		var histogram = [];
		var grayValue,tmp;
		for (var i = 0; i < 256; i++) {
			histogram[i] = 0;
		}
		//Create histogram of the image and calculate grayValues array.
		var wBytes = width * 4;
		for (var i = 0; i < height; i++) {
			tmp = i * wBytes;
			for (var j = 0; j < wBytes; j = j + 4) {
				grayValue = Math.round(((21 * imgData.data[tmp + j]) + (72 * imgData.data[tmp + j + 1]) + (7 * imgData.data[tmp + j + 2])) / 100);
				histogram[grayValue]++;
			}
		}
		var globalThreshold = getThresholdValue(histogram, (height * width));
		for (var i = 0; i < height; i++) {
			tmp = i * wBytes;
			for (var j = 0; j < wBytes; j = j + 4) {
				var grayValue = ((imgData.data[tmp + j] + imgData.data[tmp + j + 1] + imgData.data[tmp + j + 2]) / 3);
				imgData.data[tmp + j] = imgData.data[tmp + j + 1] = imgData.data[tmp + j + 2] = (grayValue < globalThreshold) ? 0 : 255;
			}
		}
		return imgData;
	};
	function getThresholdValue(histogram, totallength) {
		var sum = 0;
		var threshold = 0;
		for (var t = 0; t < 256; t++) {
			sum += t * histogram[t];
		}
		var sumB = 0;
		var wB = 0;
		var wF = 0;
		var varMax = 0;
		threshold = 0;
		for (var histIndex = 0; histIndex < 256; histIndex++) {
			wB += histogram[histIndex];
			// calculate Weight Background
			if (wB == 0) {
				continue;
			}
			// Calculate Weight Foreground
			wF = totallength - wB;
			if (wF == 0) {
				break;
			}
			sumB += (histIndex * histogram[histIndex]);
			// Mean Background
			var mB = sumB / wB;
			// Mean Foreground
			var mF = (sum - sumB) / wF;
			// Calculate Between Class Variance
			var varBetween = wB * wF * (mB - mF) * (mB - mF);
			// Check if new maximum found,Class with maximum between class
			// variance have
			// minimum within class variance
			// http://www.labbookpages.co.uk/software/imgProc/otsuThreshold.html
			if (varBetween > varMax) {
				varMax = varBetween;
				threshold = histIndex;
			}
		}
		return threshold;
	};


	function getStdDeviations(angle, imgData, width, height, factor){
		var stdDeviations = 0;
		var blackProfile = [];
		var whiteProfile = [];
		var sumOfBlackDeviations = 0;
		var blackMean = 0;

		var angle_radians = (angle / 180 * Math.PI);
		var m_dSin = Math.sin(angle_radians);
		var m_dCos = Math.cos(angle_radians);
		var wBytes = width*4;
		var tmp1,t2;
		var i,j,newY,dataByte,rem;
		rem = width % 4;
		rem = rem * 4;
		outer : //Calculating black and white profiles per row.
	
		for (var i = 0; i < height; i += factor) {
			t2 = i / factor;
			blackProfile[t2] = 0;
			whiteProfile[t2] = 0;
			tmp1 = (i * m_dCos);
			for (var j = 0; j < wBytes; j = j + 4) {
				var newY = Math.round(tmp1 - (j / 4 * m_dSin));
				var dataByte = imgData.data[newY * wBytes + j];
				if (dataByte == 0) {
					blackProfile[t2]++;
				}else if(dataByte == 255){
					whiteProfile[t2]++;
				}	
			}
		}
		// if(VIEWER_MANAGER.isImageNegated == true){
				// blackProfile = whiteProfile;
			// }
		//	console.log('time in getSkew = ' + (Date.now()-st));
		//calculating mean of white and black profiles below:
		var hf = Math.round(height / factor);
		for (var i = 0; i < hf; i++) {
			blackMean += blackProfile[i];
			//whiteMean += whiteProfile[i];
		}

		blackMean /= hf;

		for (var i = 0; i < hf; ++i) {
			sumOfBlackDeviations += (Math.abs(blackMean - blackProfile[i]) * Math.abs(blackMean - blackProfile[i]));
		}
		stdDeviations = sumOfBlackDeviations / hf;
		//console.log("deviation = " + stdDeviations);
		return stdDeviations;
	};


	var CanvasUtil = {
	/**
	* This function is used to flip a given canvas horizontally.
	*/
		horizontalFlip : function (inCanvas){
			var tmpCanvas = CanvasUtil.clone(inCanvas);
			var invCtx = inCanvas.getContext("2d");
			invCtx.save();
			invCtx.clearRect(0,0,inCanvas.width,inCanvas.height);
			invCtx.scale(-1, 1);
			invCtx.drawImage(tmpCanvas, -inCanvas.width, 0, inCanvas.width, inCanvas.height);
			invCtx.restore();
			invCtx.setTransform(1,0,0,1,0,0);
			return inCanvas;  
		},

	/**
	* This function is used to flip a given canvas vertically.
	*/
		verticalFlip : function(inCanvas){
			var tmpCanvas = CanvasUtil.clone(inCanvas);
			var invCtx = inCanvas.getContext("2d");
			invCtx.save();
			invCtx.clearRect(0,0,inCanvas.width,inCanvas.height);
			invCtx.scale(1, -1);
			invCtx.drawImage(tmpCanvas, 0, -inCanvas.height, inCanvas.width, inCanvas.height);
			invCtx.restore();
			invCtx.setTransform(1,0,0,1,0,0);
			return inCanvas; 
		},

	/**
	* This function is used to create copy of input canvas
	*/
		clone : function(inCanvas){
			var tmpCanvas = document.createElement('canvas');
			var tmpCtx = tmpCanvas.getContext('2d');
			tmpCanvas.width = inCanvas.width;
			tmpCanvas.height = inCanvas.height;
			tmpCtx.drawImage(inCanvas, 0, 0);
			return tmpCanvas;
		},

	/**
	* This function is used to  Invert the image
	*    
	* @author        02/12/2013    Gaurav Dixit
	*/
		invert : function(inCanvas) {
			var invCtx = inCanvas.getContext("2d");
			var imgData = invCtx.getImageData(0, 0, inCanvas.width, inCanvas.height);
			var length = imgData.data.length;
			var rem = length % 4;
			var i;
			//Modified by vishant for optimizations (loop unrolling)
			for (i = 0; i < rem; i++) {
				imgData.data[i] = 255 - imgData.data[i];
				imgData.data[i + 1] = 255 - imgData.data[i + 1];
				imgData.data[i + 2] = 255 - imgData.data[i + 2];
				imgData.data[i + 3] = 255;	
			}

			for ( ; i < length; i += 16) {
				imgData.data[i] = 255 - imgData.data[i];
				imgData.data[i + 1] = 255 - imgData.data[i + 1];
				imgData.data[i + 2] = 255 - imgData.data[i + 2];
				imgData.data[i + 3] = 255;

				imgData.data[i + 4] = 255 - imgData.data[i + 4];
				imgData.data[i + 5] = 255 - imgData.data[i + 5];
				imgData.data[i + 6] = 255 - imgData.data[i + 6];
				imgData.data[i + 7] = 255;
	
				imgData.data[i + 8] = 255 - imgData.data[i + 8];
				imgData.data[i + 9] = 255 - imgData.data[i + 9];
				imgData.data[i + 10] = 255 - imgData.data[i + 10];
				imgData.data[i + 11] = 255;
			
				imgData.data[i + 12] = 255 - imgData.data[i + 12];
				imgData.data[i + 13] = 255 - imgData.data[i + 13];
				imgData.data[i + 14] = 255 - imgData.data[i + 14];
				imgData.data[i + 15] = 255;
			}
			invCtx.putImageData(imgData, 0, 0);
			return inCanvas;
		},
	/**
	* This function is used to rotate canvas
	*/
		rotate : function(inCanvas, angle){
		//  return CanvasUtil.customRotate(inCanvas, angle);
			angle = angle > 0 ? angle : (angle + 360);
			angle = angle % 360;
		
			var fX = [0,0,0,0];
			var fY = [0,0,0,0];
			var fSine = Math.sin(angle * Math.PI/180);
			var fCosine = Math.cos(angle * Math.PI/180);
			
			if(0 == angle){
				return inCanvas;
			}
			
			var width = inCanvas.width;
			var height = inCanvas.height;
			
			fX[1] = width*fCosine;
			fX[2] = width*fCosine - height*fSine;
			fX[3] = -height*fSine;
			fY[1] = width*fSine;
			fY[2] = width*fSine + height*fCosine;
			fY[3] = height*fCosine;
			
			var fMinX = Math.min(0, Math.min(fX[1], Math.min(fX[2], fX[3]))); 
			var fMinY = Math.min(0, Math.min(fY[1], Math.min(fY[2], fY[3]))); 
			var fMaxX = Math.max(0, Math.max(fX[1], Math.max(fX[2], fX[3]))); 
			var fMaxY = Math.max(0, Math.max(fY[1] ,Math.max(fY[2], fY[3]))); 

			var iNewWidth = Math.ceil(Math.abs(fMaxX)-fMinX); 
			var iNewHeight = Math.ceil(Math.abs(fMaxY)-fMinY);
			
			var tmpCanvas = CanvasUtil.clone(inCanvas);
			var inCtx = inCanvas.getContext("2d");
			inCtx.save();
			inCanvas.width = iNewWidth;
			inCanvas.height = iNewHeight;
			
			//added checks to avoid 
			if(90 === angle || 270 === angle ){
				inCanvas.width = height;
				inCanvas.height = width;
			}
			
			if(180 ===  angle){
				inCanvas.width = width;
				inCanvas.height = height;
			}
			
			// filling extra pixels with white in case of width*height of orginal input canvas is changed
			if(angle % 90){
				inCtx.fillStyle = '#FFFFFF';
				inCtx.fillRect(0,0,inCanvas.width,inCanvas.height);
			}
			inCtx.setTransform(fCosine,fSine,-fSine,fCosine,0,0);
			inCtx.drawImage(tmpCanvas,-fMinX*fCosine-fMinY*fSine,fMinX*fSine-fMinY*fCosine);
			inCtx.restore();
			inCtx.setTransform(1,0,0,1,0,0);
			return inCanvas;  
		},
		
	/* 
		Aditya Kamra : Changes in AutoDeskew for latest approach 
	*/
		getSkewAngle : function(inpCanvas){
			var width = inpCanvas.width;
			var height = inpCanvas.height;
			var aspectRatio = width/height;
			var angleToRotate = 0;
			var maxDimension = 1000;
			var inpCtx = inpCanvas.getContext("2d");
			var inCanvas = document.createElement('canvas');
			if(height > maxDimension || width > maxDimension){
				if(height >= width){
					inCanvas.height = maxDimension;
					inCanvas.width = maxDimension*aspectRatio;
				}else{
					inCanvas.width = maxDimension;
					inCanvas.height = maxDimension/aspectRatio;
				}
			}
			var invCtx = inCanvas.getContext('2d');
			invCtx.drawImage(inpCanvas, 0, 0, width, height, 0,0, inCanvas.width, inCanvas.height);
			
			var imgData = invCtx.getImageData(0, 0, inCanvas.width, inCanvas.height);
			if (PDFJS.ImageDetails.bpp != ImageKind.GRAYSCALE_1BPP)
				 imgData = convertToBlackAndWhite(imgData, inCanvas.width, inCanvas.height);
			var stdDeviation = getStdDeviations(0, imgData, inCanvas.width,  inCanvas.height, 1);	
			//var rotatedCanvas = VIEWER_MANAGER.getRotatedImage(inCanvas, 90);
			var rotatedCanvas = CanvasUtil.clone(inCanvas);
			var rotatedCanvas = CanvasUtil.rotate(rotatedCanvas, 90);
			var rotatedCtx = rotatedCanvas.getContext("2d");
			var rotatedImgData = rotatedCtx.getImageData(0, 0, rotatedCanvas.width, rotatedCanvas.height);
			if (PDFJS.ImageDetails.bpp != ImageKind.GRAYSCALE_1BPP)
				 rotatedImgData = convertToBlackAndWhite(rotatedImgData, rotatedCanvas.width, rotatedCanvas.height);
			var stdDeviationRotated = getStdDeviations(0, rotatedImgData, rotatedCanvas.width, rotatedCanvas.height, 1);
			if(stdDeviationRotated > stdDeviation){
				angleToRotate = CanvasUtil.detectSkewAngle(rotatedImgData, rotatedCanvas.width, rotatedCanvas.height);
			}
			else{
				angleToRotate = CanvasUtil.detectSkewAngle(imgData, inCanvas.width, inCanvas.height);
			}
			//console.log(angleToRotate);
		//  getSkewAngle.angleToRotate = angleToRotate;
			return angleToRotate;
		},
		
		detectSkewAngle : function(imgData, width, height) {
			var angle;
			var blackSkewAngle = 0;
			var whiteSkewAngle = 0;
			var minAngle = -10
			var maxAngle = 10;
			var largestBlackStdDeviation = 0;
			var largestWhiteStdDeviation = 0;
			var blackStdDeviation = 0;
			var whiteStdDeviation = 0;
			var avgSkewAngle;
			var stdDeviations = 0;
			if (!CanvasUtil.detectSkewAngle.DeskewMode)
				CanvasUtil.detectSkewAngle.DeskewMode = "FINE";

			if (CanvasUtil.detectSkewAngle.DeskewMode === "FINE") {
				for (angle = minAngle; angle <= maxAngle; ++angle) {
					stdDeviations = getStdDeviations(angle, imgData, width, height, 2);
					blackStdDeviation = stdDeviations;
					// store the max profile
					if (blackStdDeviation > largestBlackStdDeviation) {
						largestBlackStdDeviation = blackStdDeviation;
						blackSkewAngle = angle;
					}
				}
				CanvasUtil.detectSkewAngle.DeskewMode = "SUPERFINE";
			} else if (CanvasUtil.detectSkewAngle.DeskewMode === "SUPERFINE") {
				for (angle = blackSkewAngle - 2; angle <= blackSkewAngle + 2; angle += 0.5) {
					stdDeviations = getStdDeviations(angle, imgData, width, height, 1);
					blackStdDeviation = stdDeviations;
					// store the max profile
					if (blackStdDeviation > largestBlackStdDeviation) {
						largestBlackStdDeviation = blackStdDeviation;
						blackSkewAngle = angle;
					}
				}
				CanvasUtil.detectSkewAngle.DeskewMode = "FINE";
			}
			return blackSkewAngle;
		
		},
    //Added by Komal Walia on 02/05/2019 for bug 5395.
    toBoolean : function(value, defaultValue){
        if(typeof value == 'string'){
        value = value.toLowerCase();
        }
        if(defaultValue){
            if(value === false || value === "false"){
                return false;
            }else{
                return true;
            }
        }else{
            if(value === true || value === "true"){
                return true;
            }else{
                return false;
            }
        }
    },
	};
	
	return CanvasUtil;
})();