var document_version = '4446';
var document_release_version = '1.5.10.2';
/**
 *	@fileoverview  document.js contains routines for document
 *	@author vishant gautam
 *  @modified	14/06/2018	vishant gautam   for bug #5210
 *                        class modified:
 *														document
 *                        Ref: OpAll-Mobile-MS-02, OpAll-Mobile-CR-02
 *  @modified    07/01/2019   Komal Walia    for bug(OD bugzilla) #81601
 *                                           Function Modified:
 *                                           documentLoadErrorHandler
 *                                           PDFDocument.getPage
 *                                           Ref: OpAll-Mobile-MS-03, OpAll-Mobile-CR-03
 *  @modified    19/03/2019   Komal Walia    for bug 5361
 *                                           Function Added:
 *                                            extractTransformations
 *                                            getTransformations
 *                                            applyTransformation
 *                                            applyCurrentTransformation
 *                                            matrixMultiply
 *                                           Function modified: for bug 5362
 *                                            ImageDecoded
 *                                           Ref: OpAll-Mobile-MS-04, OpAll-Mobile-CR-04
 *  @modified    04/04/2019   Komal Walia    for Bug 5387
 *                                           Function Modified:
 *                                            documentLoadErrorHandler
 *                                           Ref: OpAll-Mobile-MS-05, OpAll-Mobile-CR-05
 * @modified     22/04/2019   Komal Walia    for Bug 5393
 *                                           Class modified:
 *                                            PDFDocument
 *                                           Ref: OpAll-Mobile-MS-06, OpAll-Mobile-CR-06
 * @modified     03/05/2019   Komal Walia    for Bug 5395
 *                                           Class modified:
 *                                            PDFDocument
 *                                           Ref: OpAll-Mobile-MS-07, OpAll-Mobile-CR-07
 */
if(typeof(OPALL) === 'undefined'){
    (typeof window !== 'undefined' ? window : this).OPALL = {};
}

OPALL.docType = {PDF:1,IMAGE:2};

OPALL.CSS_UNITS = 96.0 / 72.0;
OPALL.device = '';

var RenderingStates = {
  INITIAL: 0,
  RUNNING: 1,
  PAUSED: 2,
  FINISHED: 3
};

var FindStates = {
  FIND_FOUND: 0,
  FIND_NOTFOUND: 1,
  FIND_WRAPPED: 2,
  FIND_PENDING: 3
};

var ImageKind = {
  GRAYSCALE_1BPP: 1,
  RGB_24BPP: 2,
  RGBA_32BPP: 3
};

var OPALL_INTENT_TYPE = {
 IMAGE : 'Image',
 STAMP : 'stamp',
 PRINT : 'print'
}


if(typeof(PDFJS) === 'undefined'){
    (typeof window !== 'undefined' ? window : this).PDFJS = {};
}

PDFJS.disableWorker = true;


var mozL10n = document.mozL10n || document.webL10n;
(function(){
/**
*   Document Factory to instantiate Document of particular type.
*   e.g. PDF document or other type of document.
*   @class
*/
OPALL.DocumentFactory = (function DocumentFactoryClousre(){
function DocumentFactory(){

}

DocumentFactory.prototype = {
    getDocumentObject : function(parameters, callback){
        switch(parameters.type){
            case OPALL.docType.PDF:
                return new PDFDocument(parameters, callback);
                break;
            default:
                return "InValid Document Type";
        }
    },
};

return DocumentFactory;
})();

/**
*   Document Factory to instantiate Document of particular type.
*   e.g. PDF document or other type of document.
*   @class
*/
var Page = (function PageClousre(){
    function Page(){
        this.savedImage = '';
        this.height = ' ';
        this.width = '';
        this.Xdpi = '';
        this.Ydpi = '';
        this.pageScale= 1;
        this.pageIndex = '';
        this.pageLoaded = false;
    }
    
    Page.prototype = {
        destroy: function(){
					this.savedImage = undefined;
        },
    };
    
    return Page;
})();

/**
 * Document Loading error callback
 * @modified   07/01/2019    Komal Walia  for bug #81601(in OD bugzilla)
 * @modified   04/04/2019    Komal Walia  for bug #5387
 */
function documentLoadErrorHandler(err){
    //added by Komal Walia on 07/01/2019 for bug id:81601(in OD bugzilla)
	//Added by Komal Walia on 04/04/2019 for Bug 5387.for showing error message if any returned
    // by product while fetching document (servlet response)
	if(err){
        var errObj = null;
		if (err.name == "InvalidPDFException") {
			var str = PDFJS.urlFetchedData;
            errObj = copyObj(OPALL.DOC_STATUS.ERROR_FETCHING_URL);
			if (typeof PDFJS.urlFetchedData !== 'string' && typeof PDFJS.urlFetchedData !== 'undefined') {
                var strBuf = new Uint8Array(PDFJS.urlFetchedData);
                str = '';
                for (var i=0; i<strBuf.byteLength; i++) {
                    str += String.fromCharCode(strBuf[i]);
                }
                errObj.value = str;
			} else {
                errObj = copyObj(OPALL.DOC_STATUS.INVALID_DOC_TYPE_OR_CORRUPT_DOC_DATA);
            }
			PDFJS.urlFetchedData = undefined;
			OPALL.VIEWER.hanldeDocumentLoadError(errObj);
		}else if (err.message && (err.message.indexOf("need either .data") != -1)) {
			OPALL.VIEWER.hanldeDocumentLoadError(OPALL.DOC_STATUS.IMAGE_SOURCE_EMPTY_ERR_MSG);
		}else if (err.message && ((err.message.indexOf("stream must have data") != -1) || err.name.indexOf('MissingPDF') >=0 )){
			OPALL.VIEWER.hanldeDocumentLoadError(OPALL.DOC_STATUS.No_DATA_FROM_SERVER);
		}else if(err.message && err.message.indexOf('password') != -1) {
            errObj = copyObj(OPALL.DOC_STATUS.ERROR_DOC_NULL_PASSWORD);
            errObj.value = err.message;
			OPALL.VIEWER.hanldeDocumentLoadError(errObj);
		}
		else{
		 OPALL.VIEWER.hanldeDocumentLoadError(OPALL.DOC_STATUS.INVALID_DOC_TYPE_OR_CORRUPT_DOC_DATA);
		}
	}
	else{
		 OPALL.VIEWER.hanldeDocumentLoadError(OPALL.DOC_STATUS.INVALID_DOC_TYPE_OR_CORRUPT_DOC_DATA);
	}
}

PDFJS.ImageDecodedCallback = ImageDecoded;

/**
*   PDF Document class.
*   @class
*   @param {Object} parameters contains either data or url of the document,
*   and the type of document either "PDF" or other type, and the first Page to 
*   display on loading the document.
*   @param {Callback} Callback which will be called when the document is loaded.
*		@modified		14/06/2018		vishant gautam  for bug #5210
*   @modified   07/01/2019    Komal Walia  for bug #81601(in OD bugzilla)
*   @modified   19/04/2019    Komal Walia  for bug #5393
*   @modified   05/03/2019    Komal Walia  for bug #5395
*/

var PDFDocument = (function PDFDocumentClousre(){
    
    function PDFDocument(parameters, documentLoadedCallback){
        this.Pages = [];
        var pdfDataRangeTransport;
        var passwordNeeded;
       //var getDocumentProgress;
        this.numPages = null;
        var self = this;						   
        this.lastPageRetrievedIndex  = -1;
        parameters.password = "";
        parameters.startPage = parameters.startPage || 1;
        PDFJS.getDocument(parameters, pdfDataRangeTransport, passwordNeeded,
                                       getDocumentProgress,OPALL_INTENT_TYPE.IMAGE).then(function getDocumentCallback(pdfDocument) {
                                       
                      self.document = pdfDocument;
                      //Logging Comments
                      //console.log("**************** GT = " + (Date.now()- startTime) + "*******************");
                        self.documentLoaded = true;
                        self.numPages = pdfDocument.numPages;
                        //Added by Komal Walia on 19/04/2019 for bug 5393
                        //Modified by Komal Walia for 02/05/2019 for bug 5395
                        if(-1 === OPALL.VIEWER.numberOfPages)
                        {
                          OPALL.VIEWER.numberOfPages = pdfDocument.numPages
                        }                        
                        //Added by Vishant Gautam on 19/04/2019 for bug 5393
                        documentLoadedCallback(self);
                //      self.openPage(self.lastPageRetrievedIndex);
                                                       
        }, documentLoadErrorHandler);
    }
    
    
    function getDocumentProgress(){
    
    }
    
    PDFDocument.prototype = {
        /**
				*		function getPage to extract page from pdf
        *   @param {number} pageNo which is to be extracted from the PDF.
        *   @param {callback} getPageCallback is called when the page is extracted from the PDF.
				*		@modified		14/06/2018		vishant gautam  for bug #5210
        *   @modified   07/01/2019    Komal Walia  for bug #81601(in OD bugzilla)
        */
        getPage: function(pageNo, getPageCallback){
					if(pageNo < 1 || pageNo > this.numPages){
						console.log(" Invalid page Number " + pageNo);
						throw(Error(" Invalid page Number " + pageNo));
						return;
					}

					if(this.lastPageRetrievedIndex > 0 && this.lastPageRetrievedIndex < this.numPages){
						if (this.Pages[this.lastPageRetrievedIndex]){
							this.Pages[this.lastPageRetrievedIndex].savedImage = null;
							this.lastReterievedPage.destroy();
						}
					}
					// modification/addition by vishant for vector pdf display bug #5210
					this.imgCount = 0;
					this.isImagePDF = true;
					this.pageRendered = false;
					this.pageLoaded = false;
					this.textLoaded = false;
					this.lastPageRetrievedIndex = pageNo;
					var self = this;
					
					var invCanvas = document.createElement("canvas");
					var PagePromise = self.document.getPage(pageNo);
					
					PagePromise.then(function(pdfPage) {
						if(!self.Pages[pageNo]){
							self.Pages[pageNo] = new Page();
						}
						OPALL.imageDecodedCallback = getPageCallback;
						self.lastReterievedPage = pdfPage;
						var viewport = pdfPage.getViewport(1.0);
						var pageInfo = {};                            
						pageInfo.width  =  invCanvas.width  =  pdfPage.getViewport(1.0).width; 
						pageInfo.height =  invCanvas.height =  pdfPage.getViewport(1.0).height;
						
						var ctx = invCanvas.getContext("2d");
						var renderContext = {
																 canvasContext: ctx,
																 viewport: viewport,
																 intent: 'display'
																};

						var textPromise = pdfPage.getTextContent();
						textPromise.then(function (text) {
							self.textLoaded = true;
							if (0 !== text.items.length) {
								self.isImagePDF = false;
							}			
							
							if (true === PDFJS.Image.sMask) {
								self.isImagePDF = false;
							}
							
							if (self.pageRendered && !self.pageLoaded){
								if (!self.isImagePDF) {
									self.setImageInfo(pageNo, invCanvas);
								} 
								
								OPALL.imageDecodedCallback(pageNo);
							}
						}, function(error){
								console.error('error in text extraction promise');
						});

						pdfPage.render(renderContext).then(function() {
							if (true === PDFJS.Image.sMask) {
								self.isImagePDF = false;
							}
							if (self.imgCount!== 1){
								self.isImagePDF = false;
							}
							self.pageRendered = true;
							if (self.textLoaded && !self.pageLoaded){
								if (!self.isImagePDF) {
									self.setImageInfo(pageNo, invCanvas);
								}
								
								OPALL.imageDecodedCallback(pageNo);
							}
						}, function(error) {
								//    VIEWER_MANAGER.alertbox(OPALL_ERR_MESSAGE.PageRenderErrorMsg);
								alert("error in render page" + error.message + "\n" + error.stack);
								console.log(error.message + "\n" + error.stack);
								});
					}, function() {
                            //added by Komal Walia on 07/01/2019 for bug id:81601(in OD bugzilla)
                            OPALL.VIEWER.hanldeDocumentLoadError(OPALL.DOC_STATUS.ERROR_IN_GETTING_PAGE);
					});
        },
        /**
		*	function getRenderedPage to get page rendered at input scale
        *   @param {number} pageNo to be rendered.
		*   @param {number} scale at which pdf page is to be rendered.
        *   @param {callback} rendercallback, called once rendering is done.
		*	@modified		14/06/2018		vishant gautam  for bug #5210
        */
				getRenderedPage: function (pageNo, scale, rendercallback) {
					var invCanvas = document.createElement("canvas");
					var self = this;
					var PagePromise = self.document.getPage(pageNo);
					PagePromise.then(function (pdfPage) {
						var zoom = OPALL.CSS_UNITS*scale;
						var viewport = pdfPage.getViewport(zoom);
						invCanvas.width = pdfPage.getViewport(zoom).width;
						invCanvas.height = pdfPage.getViewport(zoom).height;
						if (invCanvas.width * invCanvas.height > OPALL.MaxImageSize) {
							rendercallback(null);
						} else {
							var ctx = invCanvas.getContext("2d");
							var renderContext = {
								canvasContext : ctx,
								viewport : viewport,
								intent : 'display'
							};

							pdfPage.render(renderContext).then(function () {
								rendercallback(invCanvas);
							}, function (error) {
								rendercallback(null);
								console.error('error while rendering page');
							});
						}
			    }, function(error){
							console.error('error in getpage (getRenderedPage)');
							rendercallback(null);
					});
				},
        /**
				*		function updatePageCanvas to update page canvas and associated properties
        *   @param {number} pageNo 
        *   @param {object} canvas of the page
        */
				upatePageCanvas: function(pageNo, canvas) {
					this.Pages[pageNo].height = canvas.height;
					this.Pages[pageNo].width = canvas.width;
					this.Pages[pageNo].pageScale = (VIEWER_MANAGER.maxWidth - 4)/canvas.width;
					this.Pages[pageNo].savedImage = canvas;
				},
        /**
        *   @param {number} pageNo 
        *   @param {object} pageInfo containing info of the pageNo like
        *   Xdpi, Ydpi, height, width.
        */
        setImageInfo: function (pageNo, canvas){
          this.Pages[pageNo].Xdpi = (canvas.width*72)/this.getOriginalWidth();
          this.Pages[pageNo].Ydpi = (canvas.height*72)/this.getOriginalHeight();
          this.upatePageCanvas(pageNo, canvas);
        },
        
        /**
        *   @return {number} original width of last retrieved page.
        */
        getOriginalWidth: function (){
          return this.lastReterievedPage.getViewport(1.0).width;
        },
        
        /**
        *   @return {number} original height of last retrieved page.
        */
        getOriginalHeight: function ()	{
          return this.lastReterievedPage.getViewport(1.0).height;
        },
        
        /**
        * function extractTransformations for extraction of transformations
        *  from PageProxy(PDFJS object)
        * @param {object} pageProxy PDFJS page object
        * @return {object} transform object containing transformations(rotate,flip, isImagePdf)
        * @author  05/03/2019  vishant gautam (added by komal walia for bug #5361, souce opall desktop)
        */
        extractTransformations : function (pageProxy) {
        var opList = pageProxy.intentStates.display.operatorList;
          var transform = {
          rotate : 0,
          hFlip : false,
          vFlip : false,
          isImagePDF : true
        };
        var point = [1, 2, 1];
        var bFirstCtm = true;
        for (var i = 0; i < opList.fnArray.length; i++) {
          if (12 === opList.fnArray[i]) { //12: transform operator PDFJS
           var mat = copyObj(opList.argsArray[i]);
            //handling done for hflip,vflip, and rotation multiple of 90
            var cond1 = (0 === mat[0] && 0 === mat[3]);
            var cond2 = (0 === mat[1] && 0 === mat[2]);
            // check for rotation of multiple of 90,270
            var cond3 = ((mat[1] === -mat[2]) && (1 === Math.abs(mat[1]) || 0 === mat[1]));
            if (bFirstCtm) { //handling of  b>1 && c>1 only for first ctm
              cond3 = cond3 || (Math.abs(mat[1]) > 1.0 && Math.abs(mat[2]) > 1.0);
            }
            bFirstCtm = false;
            mat[0] = (0 === mat[0] ? 0 : mat[0] > 0 ? 1 : -1);
            mat[1] = (0 === mat[1] ? 0 : mat[1] > 0 ? 1 : -1);
            mat[2] = (0 === mat[2] ? 0 : mat[2] > 0 ? 1 : -1);
            mat[3] = (0 === mat[3] ? 0 : mat[3] > 0 ? 1 : -1);
            mat[4] = mat[5] = 0;
            if ((cond1 && mat[1] !== mat[2] && cond3) || cond2) {
              point = this.matrixMultiply(mat, point);
            } else {
              transform.isImagePDF = false;
              break;
            }
          }
        }
      
        var obj = this.getTransformations(point);
        transform.rotate = obj.rotate;
        transform.hFlip = obj.hFlip;
        transform.vFlip = obj.vFlip;
        return transform;
      },

      /**
      * function getTransformations to get current transformations
      * @param {object} point currentVector from where transformation is to be extracted
      * @author  05/03/2019  vishant gautam (added by komal walia for bug #5361, souce opall desktop)
      */
      getTransformations : function(point) {
        var transformations = {
          rotate : 0,
          hFlip : false,
          vFlip : false
        };
        //modification start by vishant gautam on 30/05/2017 for bug #4907
        //var str = this.currentVector.toString();//commented  
        var str = point.toString(); //addition
        //modifications ends here
        switch (str) {
          case '1,2,1':
            break;
          case '1,-2,1':
            transformations.vFlip = true;
            break;
          case '-1,2,1':
            transformations.hFlip = true;
            break;
          case '-1,-2,1':
            transformations.rotate = 180;
            break;
          case '2,1,1':
            transformations.rotate = 90;
            transformations.hFlip = true;
            break;
          case '2,-1,1':
            transformations.rotate = 90;
            break;
          case '-2,1,1':
            transformations.rotate = 270;
            break;
          case '-2,-1,1':
            transformations.rotate = 90;
            transformations.vFlip = true;
            break;
        }
        return transformations;
      },
      
      /**
      * function applyTransformation for applying tranformation on input canvas
      * @param {object} transformation to be applied on canvas
      * @param {object} canvas on which tranformations is to be applied
      * @author  05/03/2019  vishant gautam (added by komal walia for bug #5361, souce opall desktop)
      */
     applyTransformation : function (transform, canvas) {
        if (transform.hFlip) {
          OPALL.CanvasUtil.horizontalFlip(canvas);
        }
        if (transform.vFlip) {
          OPALL.CanvasUtil.verticalFlip(canvas);
        }
        if (0 !== transform.rotate) {
          OPALL.CanvasUtil.rotate(canvas, transform.rotate);
        }
      },

      /**
      * function applyCurrentTransformation for applying current tranformation on input canvas
      * @param {object} canvas on which current transformations is to be applied
      * @author  05/03/2019  vishant gautam for bug #5361
      */
      applyCurrentTransformation : function (canvas) {
        //modification start by vishant gautam on 30/05/2017 for bug #4907
        var transform = this.getTransformations(this.currentVector);
        this.applyTransformation(transform, canvas);
        //modifications ends here
      },

      /* @author  05/03/2019  vishant gautam for bug #5361
      */
      matrixMultiply : function(p,q) {
        return [
          p[0]*q[0] + p[2]*q[1] + p[4]*q[2],
          p[1]*q[0] + p[3]*q[1] + p[5]*q[2],
          q[2]
        ]
      },
    };
    
    function ErrorCallBack(error){
        console.log(error);
    }
    
    return PDFDocument;
})();

/**
*		@modified		14/06/2018		vishant gautam  for bug #5210
*       @modified       19/03/2019      Komal Walia     for bug # 5362
*/
function ImageDecoded(viewer, opallParam){
 //Logging Comments	
 //console.log("Image Decoded = " + (Date.now()- startTime));
 var doc = OPALL.VIEWER.document;
 if(opallParam == OPALL_INTENT_TYPE.IMAGE && PDFJS.Image && doc.isImagePDF && (PDFJS.Image.isJBIG2 !== true)){
	// viewer.PdfManger.setImageInfo();
		doc.imgCount++;
		if(doc.imgCount >= 2){
			doc.isImagePDF = false;
			doc.pageLoaded = false;
			return;
		}
    if(PDFJS.Image.width * PDFJS.Image.height <= OPALL.MaxImageSize){
			var invCanvas = document.createElement("canvas");
			 var invCtx    = invCanvas.getContext("2d"); 
			 invCanvas.width  = PDFJS.Image.width;
			 invCanvas.height = PDFJS.Image.height;
			 
			 if (PDFJS.Image.jpegImage){
					invCtx.drawImage(PDFJS.Image.jpegImage,0,0,PDFJS.Image.width,PDFJS.Image.height,0,0,invCanvas.width,invCanvas.height);
			 } else {
					putBinaryImageData(invCtx, PDFJS.Image);
			}
			
			doc.setImageInfo(doc.lastPageRetrievedIndex, invCanvas);
			if (doc.textLoaded && doc.isImagePDF){
				doc.pageLoaded = true;
				OPALL.imageDecodedCallback(doc.lastPageRetrievedIndex);
			}
		}  else {
			doc.pageLoaded = true;
            //Added by Komal Walia on 19/03/2019 for bug 5362 and 5372
            OPALL.VIEWER.handlePageLoadError(OPALL.DOC_STATUS.DOC_SIZE_EXCEED_MAX_PIXELS_LIMIT.value + "(" + (PDFJS.Image.width * PDFJS.Image.height/1000000).toFixed(2) + " MP)" );
		}
  }
}

var Uint32ArrayView = (function Uint32ArrayViewClosure() {

  function Uint32ArrayView(buffer, length) {
    this.buffer = buffer;
    this.byteLength = buffer.length;
    this.length = length === undefined ? (this.byteLength >> 2) : length;
    ensureUint32ArrayViewProps(this.length);
  }
  Uint32ArrayView.prototype = Object.create(null);

  var uint32ArrayViewSetters = 0;
  function createUint32ArrayProp(index) {
    return {
      get: function () {
        var buffer = this.buffer, offset = index << 2;
        return (buffer[offset] | (buffer[offset + 1] << 8) |
          (buffer[offset + 2] << 16) | (buffer[offset + 3] << 24)) >>> 0;
      },
      set: function (value) {
        var buffer = this.buffer, offset = index << 2;
        buffer[offset] = value & 255;
        buffer[offset + 1] = (value >> 8) & 255;
        buffer[offset + 2] = (value >> 16) & 255;
        buffer[offset + 3] = (value >>> 24) & 255;
      }
    };
  }

  function ensureUint32ArrayViewProps(length) {
    while (uint32ArrayViewSetters < length) {
      Object.defineProperty(Uint32ArrayView.prototype,
        uint32ArrayViewSetters,
        createUint32ArrayProp(uint32ArrayViewSetters));
      uint32ArrayViewSetters++;
    }
  }

  return Uint32ArrayView;
})();

function putBinaryImageData(ctx, imgData) {
    if (typeof ImageData !== 'undefined' && imgData instanceof ImageData) {
      ctx.putImageData(imgData, 0, 0);
      return;
    }

    // Put the image data to the canvas in chunks, rather than putting the
    // whole image at once.  This saves JS memory, because the ImageData object
    // is smaller. It also possibly saves C++ memory within the implementation
    // of putImageData(). (E.g. in Firefox we make two short-lived copies of
    // the data passed to putImageData()). |n| shouldn't be too small, however,
    // because too many putImageData() calls will slow things down.
    //
    // Note: as written, if the last chunk is partial, the putImageData() call
    // will (conceptually) put pixels past the bounds of the canvas.  But
    // that's ok; any such pixels are ignored.

    var height = imgData.height, width = imgData.width;
    var fullChunkHeight = 16;
    var fracChunks = height / fullChunkHeight;
    var fullChunks = Math.floor(fracChunks);
    var totalChunks = Math.ceil(fracChunks);
    var partialChunkHeight = height - fullChunks * fullChunkHeight;

    var chunkImgData = ctx.createImageData(width, fullChunkHeight);
    var srcPos = 0, destPos;
    var src = imgData.data;
    var dest = chunkImgData.data;
    var i, j, thisChunkHeight, elemsInThisChunk;

    // There are multiple forms in which the pixel data can be passed, and
    // imgData.kind tells us which one this is.
    if (imgData.kind === ImageKind.GRAYSCALE_1BPP) {
      // Grayscale, 1 bit per pixel (i.e. black-and-white).
      var srcLength = src.byteLength;
      var dest32 = PDFJS.hasCanvasTypedArrays ? new Uint32Array(dest.buffer) :
        new Uint32ArrayView(dest);
      var dest32DataLength = dest32.length;
      var fullSrcDiff = (width + 7) >> 3;
      var white = 0xFFFFFFFF;
      var black = (PDFJS.isLittleEndian || !PDFJS.hasCanvasTypedArrays) ?
        0xFF000000 : 0x000000FF;
      for (i = 0; i < totalChunks; i++) {
        thisChunkHeight =
          (i < fullChunks) ? fullChunkHeight : partialChunkHeight;
        destPos = 0;
        for (j = 0; j < thisChunkHeight; j++) {
          var srcDiff = srcLength - srcPos;
          var k = 0;
          var kEnd = (srcDiff > fullSrcDiff) ? width : srcDiff * 8 - 7;
          var kEndUnrolled = kEnd & ~7;
          var mask = 0;
          var srcByte = 0;
          for (; k < kEndUnrolled; k += 8) {
            srcByte = src[srcPos++];
            dest32[destPos++] = (srcByte & 128) ? white : black;
            dest32[destPos++] = (srcByte & 64) ? white : black;
            dest32[destPos++] = (srcByte & 32) ? white : black;
            dest32[destPos++] = (srcByte & 16) ? white : black;
            dest32[destPos++] = (srcByte & 8) ? white : black;
            dest32[destPos++] = (srcByte & 4) ? white : black;
            dest32[destPos++] = (srcByte & 2) ? white : black;
            dest32[destPos++] = (srcByte & 1) ? white : black;
          }
          for (; k < kEnd; k++) {
             if (mask === 0) {
               srcByte = src[srcPos++];
               mask = 128;
             }

            dest32[destPos++] = (srcByte & mask) ? white : black;
            mask >>= 1;
          }
        }
        // We ran out of input. Make all remaining pixels transparent.
        while (destPos < dest32DataLength) {
          dest32[destPos++] = 0;
        }

        ctx.putImageData(chunkImgData, 0, i * fullChunkHeight);
      }
    } else if (imgData.kind === ImageKind.RGBA_32BPP) {
      // RGBA, 32-bits per pixel.

      j = 0;
      elemsInThisChunk = width * fullChunkHeight * 4;
      for (i = 0; i < fullChunks; i++) {
        dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
        srcPos += elemsInThisChunk;

        ctx.putImageData(chunkImgData, 0, j);
        j += fullChunkHeight;
      }
      if (i < totalChunks) {
        elemsInThisChunk = width * partialChunkHeight * 4;
        dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
        ctx.putImageData(chunkImgData, 0, j);
      }

    } else if (imgData.kind === ImageKind.RGB_24BPP) {
      // RGB, 24-bits per pixel.
      thisChunkHeight = fullChunkHeight;
      elemsInThisChunk = width * thisChunkHeight;
      for (i = 0; i < totalChunks; i++) {
        if (i >= fullChunks) {
          thisChunkHeight =partialChunkHeight;
          elemsInThisChunk = width * thisChunkHeight;
        }

        destPos = 0;
        for (j = elemsInThisChunk; j--;) {
          dest[destPos++] = src[srcPos++];
          dest[destPos++] = src[srcPos++];
          dest[destPos++] = src[srcPos++];
          dest[destPos++] = 255;
        }
        ctx.putImageData(chunkImgData, 0, i * fullChunkHeight);
      }
    } else {
      error('bad image kind: ' + imgData.kind);
    }
}
})();


function getStampImage (url, id, imgAnnotationObj) {
	var parameters = {
		password : ""
	};
	parameters.url = url;
	var pdfDataRangeTransport;
	var passwordNeeded;
	var getDocumentProgress;

	PDFJS.getDocument(parameters, pdfDataRangeTransport,
		passwordNeeded, getDocumentProgress, OPALL_INTENT_TYPE.STAMP).then
	(
		function getDocumentCallback(pdfDocument) {
		stampImageDownloaded(pdfDocument, id, imgAnnotationObj);

	}, StampErrorCallBack);
};

var stampImageDownloaded = function (pdf, id, imgAnnotationObj) {

	var invCanvas = document.createElement("canvas");
	var invCtx = invCanvas.getContext("2d");
	var PagePromise = null;
	if (id == -1)
		PagePromise = pdf.getPage(imgAnnotationObj.filename);
	else
		PagePromise = pdf.getPage(1);
	PagePromise.then(function (pdfPage) {
		var viewport = pdfPage.getViewport(1.333 * OPALL.VIEWER.ZoomScale);
		invCanvas.width = pdfPage.getViewport(1.333 * OPALL.VIEWER.ZoomScale).width;
		invCanvas.height = pdfPage.getViewport(1.333 * OPALL.VIEWER.ZoomScale).height;
		var renderContext = {
			canvasContext : invCtx,
			viewport : viewport,
			intent : 'display'
		};

		pdfPage.render(renderContext).then(function () {
			var stampImage = document.createElement("img");
			stampImage.src = invCanvas.toDataURL();
		SetStampImage(stampImage, id, imgAnnotationObj);

		}, function (error) {
			alert("Error while decoding Stamp Image Document");
		});
	});
};

function StampErrorCallBack(error) {
	//VIEWER_MANAGER.HandleStampLoadError(error);
  OPALL.hideLoadBar();
  alert("Error while downloading stamp file");
}

var SetStampImage = function (image, id, imgAnnotationObj) {
  var self = OPALL.VIEWER;
  var stampImg_obj;
	// if (imgAnnotationObj !== null && id == -1) {
		// imgAnnotationObj.image.onload = function () {
			
			
			// if(id == (self.AnnotationManager.imageStampList.length-1)){
				// self.AnnotationManager.valid = false;
				// stampDataLoaded = true;
				// self.AnnotationManager.DrawScaledAnnotation(self.AnnotationCanvas, self.AnnotationManager.annotationList, self.AnnotationManager.scaleX, self.AnnotationManager.scaleY);								
			// }
				// //self.AnnotationManager.draw();
		// };
		// imgAnnotationObj.image.src = image.src;
	// } else
		if (imgAnnotationObj !== null && id != -1) {
		stampImg_obj = new StampImageObj();
		stampImg_obj.id = id;
		stampImg_obj.image = image;
		stampImg_obj.reference = 1;
		//self = this;
		//imgAnnotationObj.image.onload = function () {
			//imgAnnotationObj.w = image.width;
			//imgAnnotationObj.h = image.height;
			imgAnnotationObj.image = image;
			self.AnnotationManager.stampImageObjectList[id - 1] = stampImg_obj;
//			self.AnnotationManager.annotationList.push(imgAnnotationObj);
			if(id == (self.AnnotationManager.imageStampList.length-1)){
				self.AnnotationManager.valid = false;
				stampDataLoaded = true;
				self.AnnotationManager.DrawScaledAnnotation(self.AnnotationCanvas, self.AnnotationManager.annotationList, self.AnnotationManager.scaleX, self.AnnotationManager.scaleY);								
				setTimeout( function() {
          OPALL.hideLoadBar();
					document.getElementById('imageCanvas').style.visibility = 'visible'; 
					}, 30);
			//}
			
		};
		//imgAnnotationObj.image.src = image.src;
	} else {
		stampImg_obj = new StampImageObj();
		stampImg_obj.id = id;
		stampImg_obj.image = image;
		stampImg_obj.reference = 1;
		self.AnnotationManager.stampImageObjectList[id - 1] = stampImg_obj;
		//this.AnnotationManager.SetStampDrawMode(id,"IMAGE");
	}
};

var getStampDocument = function (imageStampList, index, attachment) {
//	var stampURL = OPALL.VIEWER.getRequestedPageURL(OPALL.VIEWER.currentPageIndex, OPALL.VIEWER.param.URL_ImageStampFile);
  var stampURL = OPALL.VIEWER.param.URL_ImageStampFile;
	var parameters = {
		password : ""
	};
  if(typeof(attachment.data) !== 'undefined' && null !== attachment.data){
    parameters.data = attachment.data;
  }
  else if(typeof(attachment.url) !== 'undefined' && null !== attachment.url){
    parameters.url = attachment.url;
  }
  
	var pdfDataRangeTransport;
	var passwordNeeded;
	var getDocumentProgress;
	var self = OPALL;
	PDFJS.getDocument(parameters, pdfDataRangeTransport,
		passwordNeeded, getDocumentProgress, OPALL_INTENT_TYPE.STAMP).then(
		function getDocumentCallback(pdfDocument) {
		stampPDFDocument = pdfDocument;
		getStampPDFImage(imageStampList, index);
		// self.stampImages = [];
		// var maxStampPages = PDFdocument.numPages;
		// self.RenderStampPages(PDFdocument, 1, maxStampPages);
	}, StampErrorCallBack);
};

var getStampPDFImage = function (imgStampList, index) {
	if (index >= imgStampList.length) {
		return;
	}
	var self = OPALL.VIEWER;
	if (stampPDFDocument === null) {
		console.log("Error in loading image stamp pdf");
		return;
	}
	var pdf = stampPDFDocument;
	var invCanvas = document.createElement("canvas");
	var invCtx = invCanvas.getContext("2d");
	var PagePromise = null;
	PagePromise = pdf.getPage(imgStampList[index].filename);

	PagePromise.then(function (pdfPage) {
		var viewport = pdfPage.getViewport(1.333333 * self.ZoomFactor);
		invCanvas.width = pdfPage.getViewport(1.333333 * self.ZoomFactor).width;
		invCanvas.height = pdfPage.getViewport(1.333333 * self.ZoomFactor).height;
		
		var renderContext = { 
			canvasContext : invCtx,
			viewport : viewport,
			intent : 'display'
		};

		pdfPage.render(renderContext).then(function () {

			var stampImage = document.createElement("img");
		//	stampImage.onload = function () {
				SetStampImage(invCanvas, index, imgStampList[index]);
				getStampPDFImage(imgStampList, ++index);
		//	};
		//	stampImage.src = invCanvas.toDataURL();

		}, function (error) {
			alert('Error in rendering Stamp Image');
		});
	}, StampErrorCallBack);
};

function Clone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
 
    var temp = obj.constructor(); // give temp the original obj's constructor
    for (var key in obj) {
        temp[key] = Clone(obj[key]);
    }
 
    return temp;
}

function copyObj(a){
	  var b = {};
	  for(key in a){
	    b[key] = a[key];
	  }
	  return b;
	}
