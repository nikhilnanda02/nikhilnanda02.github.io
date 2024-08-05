var document_version = '4446';
var document_release_version = '1.5.10.2';
/*
#@c
Class    : AnnotationHolder
This is the class that manages the annotation and display annotation to the annotation canvas of the Viewer Manager.
 *  @modified    03/01/2019   Komal Walia    for bug(OD bugzilla) #14601
 *                                            Function Modified:
 *                                            AnnotationHolder.DrawScaledAnnotation
 *                                            AnnotationHolder.deleteAllExtractZones
 *                                            AnnotationHolder.drawExtractZone
 *                                           Ref: OpAll-Mobile-MS-03, OpAll-Mobile-CR-03
#@e
*/		
function AnnotationHolder(viewerManager) {
    this.angle = 0;
    this.zoom = 1;
    this.viewer = viewerManager;
    //this.canvas = this.viewer.imageCanvas;
    //AnnotationCanvas
    this.canvas = this.viewer.AnnotationCanvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ctx = this.canvas.getContext('2d');
    this.change = false;
    this.xDrag = 0;
    this.yDrag = 0;
    this.annotationMoved = false;
    this.annotationResized = false;
	this.imageDragState = false;
	this.drawingNewAnnotation = false;
	this.touchDevice = false;
	this.bDateStamp = true;
    this.textStampSelectionList = [];
    this.imgStampSelectionList = [];
    this.stampImageObjectList = [];
    this.selectedTxtStampID = -1;
    this.selectedImgStampID = -1;
    this.controlPressed = false;
    // This complicates things a little but but fixes mouse co-ordinate problems
    // when there's a border or padding. See getMouse for more detail
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
    if (document.defaultView && document.defaultView.getComputedStyle) {
        this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingLeft'], 10) || 0;
        this.stylePaddingTop = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingTop'], 10) || 0;
        this.styleBorderLeft = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderLeftWidth'], 10) || 0;
        this.styleBorderTop = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderTopWidth'], 10) || 0;
    }
    // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
    // They will mess up mouse coordinates and this fixes that
    var html = document.body.parentNode;
    this.htmlTop = html.offsetTop;
    this.htmlLeft = html.offsetLeft;

    this.valid = false; // when set to false, the canvas will redraw everything
    this.annotationList = [];
    this.zoneList = [];   	// the collection of things to be drawn
    this.dragging = false; // Keep track of when we are dragging
    // the current selected object. In the future we could turn this into an array for multiple selection
    this.selection = [];
    this.selectionIndex = [];

    this.dragoffx = []; // See mousedown and mousemove events for explanation
    this.dragoffy = [];

    //For Saving the re-sizing factor for annotation
    this.defaultResizeWidth = 0;
    this.defaultResizeHeight = 0;

	

    //For Drawing mode
    
    this.currentDraw = [];     // Keeps track of current element being drawn
    this.currentIndex = 0;
    var myState = this;
    this.annotationType = null;     //Keeps track of which annotation is to be drawn
    this.m_fillColor = {'LNE':'#FF0000', 'DLNE':'#FF0000', 'LALNE':'#FF0000', 'TALNE':'#FF0000', 'DALNE':'#FF0000', 'BOX':'#FF0000',
                        'FRECT':'#00AA00', 'ELLI':'#FF0000', 'FELLI':'#00AA00', 'HLT':'#FFFF00', 'WIPOUT':'#000000', 'FRH':'#0000AA',
                        'FREETXT':'#0000AA', 'STICKYNOTE':'#0000AA', 'ATTACHNOTE':'#000000', 'DZONE':'#FF26E2', 'TXTSTAMP':'#0000AA',
                        'IMGSTAMP':'#0000AA', 'HLINK':'#0000AA','EZONE':'#FF26E2'
                       } ;
    this.penColor =    {'LNE':'#FF0000', 'DLNE':'#FF0000', 'LALNE':'#FF0000', 'TALNE':'#FF0000', 'DALNE':'#FF0000', 'BOX':'#FF0000',
                        'FRECT':'#00AA00', 'ELLI':'#FF0000', 'FELLI':'#00AA00', 'HLT':'#FFFF00', 'WIPOUT':'#000000', 'FRH':'#0000AA',
                        'FREETXT':'#0000AA', 'STICKYNOTE':'#0000AA', 'ATTACHNOTE':'#000000', 'DZONE':'#FF26E2', 'TXTSTAMP':'#0000AA',
                        'IMGSTAMP':'#0000AA','HLINK':'#0000AA','EZONE':'#FF26E2'
                       };  
    //this.m_nLineThickness = 0;
    this.penThickness = {'LNE': 3, 'DLNE': 3, 'LALNE': 3, 'TALNE': 3, 'DALNE': 3, 'BOX': 3,
            'FRECT': 3, 'ELLI': 3, 'FELLI': 3, 'HLT': 3, 'WIPOUT': 3, 'FRH': 3,
            'FREETXT': 3, 'STICKYNOTE': 3, 'ATTACHNOTE': 3, 'DZONE': 1, 'TXTSTAMP': 3,
            'IMGSTAMP': 3,'HLINK': 3, 'EZONE': 1
           };
    this.canvas.addEventListener('selectstart', function (e) { e.preventDefault(); return false; }, false);

	this.mouseX =0;  // for keeping mouse events
	this.mouseY =0;
	this.startTime = 0;
	this.tapholdtime =0;
	this.isTouchMoved = false;
	this.lastTouchTime =0;
	this.lastTouchMouseX =0;
	this.lastTouchMouseY = 0;
	//Adding the variables for maintaining the Hyperlink values.
	this.hyperLinkDisplayText = "";
	this.hyperLinkURL = "";
	this.isFirstDisplay = true;
	this.waitforannotation = false;



    // Detect touch support
    var touchSupport = 'ontouchend' in document;
    // Ignore browsers without touch support
    if (touchSupport) {
        //Added the events for touch screen devices.
        this.touchDevice = true;
         this.canvas.addEventListener('touchstart', function (e) {myState.startTime = new Date().getTime();  myState.checkIfDoubleTap(e, myState); e.preventDefault(); myState.lastTouchTime = myState.startTime;}, false);
        this.canvas.addEventListener('touchmove', function (e) { e.preventDefault(); myState.DragEvent(e, myState); }, false);
          this.canvas.addEventListener('touchend', function (e) {e.preventDefault();myState.tapholdtime=(new Date().getTime() - myState.startTime); 
	    if(myState.tapholdtime >=1000){
	   myState.tapHoldEvent(e,myState);
	}myState.UpEvent(e, myState);}, false);

    }
    // Up, down, and move are for dragging
    this.canvas.addEventListener('mousedown', function (e) { myState.DownEvent(e, myState); }, true);
    this.canvas.addEventListener('mousemove', function (e) { myState.DragEvent(e, myState); }, true);
    this.canvas.addEventListener('mouseup', function (e) { myState.UpEvent(e, myState); }, true);
    this.canvas.addEventListener('dblclick', function (e) { myState.DoubleClickEvent(e, myState); }, true);
	document.addEventListener('keydown', function (e) { myState.keyDownEvent(e, myState); }, true);
	document.addEventListener('keyup', function (e) { myState.keyUpEvent(e, myState); }, true);

	// this.viewer.ImageCanvas.addEventListener('mousedown', function (e) { myState.DownEvent(e, myState); }, false);
	// this.viewer.ImageCanvas.addEventListener('mousemove', function (e) { myState.DragEvent(e, myState); }, false);
	// this.viewer.ImageCanvas.addEventListener('mouseup', function (e) { myState.UpEvent(e, myState); }, false);
	// this.viewer.ImageCanvas.addEventListener('dblclick', function (e) { myState.DoubleClickEvent(e, myState); }, false);
	
	
	//this.canvas.addEventListener('click', function (e) { document.getElementById("bothCanvas").focus(); }, true);
	//document.getElementById("bothCanvas").addEventListener('keydown', function (e) { myState.keyDownEvent(e, myState); }, false);
	

	
    // **** Options! ****
    this.selectionColor = '#CC0000';
    this.selectionWidth = 2;
    this.interval = 30;
    this.trailing_arrow_shape = [
		[12, 6],
		[2, 0],
        [12, -6]
	];
    // To draw leading arrow
    this.leading_arrow_shape = [
		[-12, 6],
		[2, 0],
        [-12, -6]
	];
    this.enumColors = { dvBlack: 0, dvBlue: 1, dvGreen: 2, dvLightGreen: 3,
        dvBrown: 4, dvCyan: 5, dvLightBlue: 6,
        dvLightPastelGreen: 7, dvLightCyan: 8, dvRed: 9,
        dvMagenta: 10, dvOrange: 11, dvLightMagenta: 12,
        dvLightYellow: 13, dvYellow: 14, dvWhite: 15, dvNoColor: 16
    };
    this.modes = { AnnotationEdit:0 , AnnotationDraw:1, FreeTextDraw:2, FreeTextEdit:3,AttachNoteDraw:4,AttachNoteEdit:5,FreeHandCreate:6,FreeHandDraw:7};
   // setInterval(function () { myState.draw(); }, myState.interval);    
    this.mode = this.modes.AnnotationEdit;     // Keeps track if in drawing mode or edit mode
    this.FreeTextAreaManager = null;
    this.dblClick = false;
    this.defaultGroupName = "Default";
    this.currentGroupName = "Default";
    this.userID = "aaaaaa";
    this.totalGroups = 0;
    this.groupList=[];
    this.bfirst=true;
	this.AttachNoteImage = new Image;
   // this.AttachNoteImage.src = "../images/Note.gif";
    this.AttachNoteImage.id = "attachImgID";
    this.fontSize = {'FRH': 15,
            'FREETXT': 15, 'STICKYNOTE': 15, 'ATTACHNOTE': 15, 'TXTSTAMP': 15,
            'IMGSTAMP': 15, 'HLINK': 15 } ;
	this.fontname = {'FRH': 'Arial',
            'FREETXT': 'Arial', 'STICKYNOTE': 'Arial', 'ATTACHNOTE': 'Arial', 'TXTSTAMP': 'Arial',
            'IMGSTAMP': 'Arial', 'HLINK': 'Arial' } ;
	this.underline = {'FRH': 0,
            'FREETXT': 0, 'STICKYNOTE': 0, 'ATTACHNOTE': 0, 'TXTSTAMP': 0,
            'IMGSTAMP': 0, 'HLINK': 0 } ;
	this.StrikeOut = {'FRH': 0,
            'FREETXT': 0, 'STICKYNOTE': 0, 'ATTACHNOTE': 0, 'TXTSTAMP': 0,
            'IMGSTAMP': 0, 'HLINK': 0 } ;
	this.fontStyle = {'FRH': 0,
            'FREETXT': 0, 'STICKYNOTE': 0, 'ATTACHNOTE': 0, 'TXTSTAMP': 0,
            'IMGSTAMP': 0, 'HLINK': 0 } ;
  this.annotListArray = [];
	this.clipBoardList = [];
	this.isAnnotationOnClipBoard = false;
    this.bShowUserNameWithAnnotation = false;
    this.attachNoteUI = {
          div: document.getElementById('attachNote'),
          titleBar: document.getElementById('attachNoteTitle'),
          titleText: document.getElementById('attachnoteText'),
          textArea: document.getElementById('textAreaID'),
          okButton: document.getElementById('attchNoteokID'),
          cancelButton: document.getElementById('attachNotecancelID'),
          closebutton: document.getElementById('attachNoteClose')
      };
    this.bDynamicText = true;
    this.bUserName = false;
    this.bDateTime = false;
	this.stickyNoteBackColor = "#ffff00";
	this.freeTextAreaID="";	
	this.imageStampList=[];
	this.attachNotePosition={left:0,top:0};
    this.firstAnnotationLoad = false;
};




/*
#@c
Class    : StampImageObj
This is the class that is used to create stamp image objects for imagestamp annotation.
@author        12/06/2014    Pooja Kamra
#@e
*/  
function StampImageObj() {
    this.id = -1;
    this.reference = -1;
    this.image = null;
};
/*
#@c
Class    : TextStampObj
This is the class that is used to create text stamp objects for textstamp annotation.
@author        12/06/2014    Pooja Kamra
#@e
*/
function TextStampObj() {
    this.id = null;
    this.title = null;
    this.text = null;
    this.fontName = null;
    this.fontSize = null;
    this.color = null;
    this.bold = null;
    this.italic = null;
    this.underline = null;
    this.strikeOut = null;
};
/*
#@c
Class    : ImageStampObj
This is the class that is used to create image stamp objects for imagestamp annotation.
@author        12/06/2014    Pooja Kamra
#@e
*/
function ImageStampObj() {
    this.id = null;
    this.filename = null;
    this.title = null;  
};
/*
#@c
Class    : AnnotationBaseProperties
This is the class that is used to create annotation object to set base properties for all annotations.
@author        12/06/2014    Pooja Kamra
#@e
*/
function AnnotationBaseProperties(){
	this.x1 = 0;
	this.y1=0;
	this.x2=0;
	this.y2=0;
	this.color =0;
	this.timeorder = 0;
	this.mouse_sensitivity = null;
	this.ann_grp_id =null;
	this.userid =null;
	this.rights =null;
}
function Group(index,groupID){
this.name=groupID;
this.index=index;
this.rights="VM";
}

 
/*
#@c
Class    : AnnotationHolder
Function : addShape(shape)
Arguments:
        1)shape:annotation which needs to add to list

Description:
This function is used to add the new Annotation

@author        02/12/2013    Aditya Kamra
#@e
*/  
AnnotationHolder.prototype.addShape = function (shape) {
    this.annotationList.push(shape);
    this.valid = false;
};

/*
#@c
Class    : AnnotationHolder
Function : clear()
Arguments: None

Description:
This function is used to clear the annotations

@author        02/12/2013    Aditya Kamra
#@e
*/
AnnotationHolder.prototype.clear = function () {
    this.ctx.save();
    this.ctx.moveTo(0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
};

/*
#@c
Class    : AnnotationHolder
Function : draw()
Arguments: None

Description:
This function is used to draw the annotations.While this function is called as often as the INTERVAL variable demands,
It only ever does something if the canvas gets invalidated by our code

@author        02/12/2013    Aditya Kamra
#@e
*/
AnnotationHolder.prototype.draw = function () {
    // if our state is invalid, redraw and validate!
    if (!this.valid) {
        var ctx = this.ctx;
        var annotationList = this.annotationList;
        this.clear();
		
        // ** Add stuff you want drawn in the background all the time here **

        // draw all shapes
        var l = annotationList.length;
        for (var i = 0; i < l; i++) {
            var annotationObj = annotationList[i];
            // We can skip the drawing of elements that have moved off the screen:
            if (annotationObj.x > this.canvas.width || annotationObj.y > this.canvas.height ||
          annotationObj.x + annotationObj.w < 0 || annotationObj.y + annotationObj.h < 0) continue;
          annotationList[i].draw(ctx);
          this.waitforannotation = true;
        }
        if (this.bShowUserNameWithAnnotation) {
            ctx.fillStyle = "Black";
            ctx.font = "12px Times New Roman";
            for (var index = 0; index < annotationList.length; index++) {
                var annotObj = annotationList[index];
                var strDateTime = this.SetDateTimeFormat(annotObj.timeorder, this.viewer.DateTimeFormat);
                if (annotObj.type == "LNE" || annotObj.type == "DLNE" || annotObj.type == "TALNE" || annotObj.type == "LALNE" || annotObj.type == "DALNE") {
                    ctx.fillText(annotObj.userid, annotObj.endX+2, annotObj.endY+2);
                    ctx.fillText(strDateTime,annotObj.endX + 2, annotObj.endY + 15); //15 means fontsize and 3 additional pixels
                }
                else {
                    ctx.fillText(annotObj.userid, annotObj.x + annotObj.w+2, annotObj.y + annotObj.h+2);
                    ctx.fillText(strDateTime, annotObj.x + annotObj.w+2, annotObj.y + annotObj.h + 15);//15 means fontsize and 3 additional pixels
                }
            }
        }
        // draw selection
        // right now this is just a stroke along the edge of the selected Shape
        if (this.selection.length != 0) {
            ctx.strokeStyle = this.selectionColor;
            ctx.lineWidth = this.selectionWidth;
            for(var i = 0; i < this.selection.length; i++){
            	var mySel = this.selection[i];
                mySel.select(ctx);
                this.selected = mySel[0];
            }
            
        }
		
		if (this.isFirstDisplay && this.waitforannotation)
		{
			 document.getElementById('imageCanvas').display = 'block';
			 
			 //By Avinash Kumar for Bug #4195
			  if( VIEWER_MANAGER.zoomLens!=null)
			 {
                
				var scaleX = VIEWER_MANAGER.ZoomFactor * (VIEWER_MANAGER.ScreenDPI/VIEWER_MANAGER.ImageInfo.Xdpi);
				var scaleY = VIEWER_MANAGER.ZoomFactor * (VIEWER_MANAGER.ScreenDPI/VIEWER_MANAGER.ImageInfo.Ydpi);
				var scaledWidth  = scaleX * this.viewer.PdfManager.savedImage.width;
				var scaledHeight = scaleY * this.viewer.PdfManager.savedImage.height;
				VIEWER_MANAGER.zoomLens.SetFocusArea((scaleX+scaledWidth)/2,(scaleY+scaledHeight)/2);
		     }
		//	 TOOLKIT.callbackIsImageDisplayed(this.viewer.CurrentPage);
			 this.isFirstDisplay = false;
			 if (VIEWER_MANAGER.FastNavState === 1)
				if (VIEWER_MANAGER.CurrentPage != VIEWER_MANAGER.tempPage)
				{
					VIEWER_MANAGER.FastNavState = 0;
					this.viewer.ShowPage(VIEWER_MANAGER.tempPage);
				}
             this.valid = false;
		}
        else{

        // ** Add stuff you want drawn on top all the time here **

            this.valid = true;
        }
    }
};

/*
#@c
Class    : AnnotationHolder
Function : SetDrawMode()
Arguments: None

Description:
This function is used to set draw mode

@author        02/12/2013    Aditya Kamra
#@e
*/
AnnotationHolder.prototype.SetDrawMode = function () {    
    this.mode = this.modes.AnnotationDraw;
};

/*
#@c
Class    : AnnotationHolder
Function : getMouse(e)
Arguments: None

Description:
This function is used to get the current mouse coordinates. It Creates an object with x and y defined, set to the mouse position relative to the state's canvas
If you wanna be super-correct this can be tricky, we have to worry about padding and borders

@author   25/11/2013    Aditya Kamra
#@e
*/
AnnotationHolder.prototype.getMouse = function (event) {
    var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
    //Corrected the support for Touch device. 
	/* For Bug:4158 */
    if (this.touchDevice && event.changedTouches) {
        var touches = event.changedTouches;
        event = touches[0];
    }

    offsetX += parseInt(this.viewer.viewArea.scrollLeft, 10);
    offsetY += parseInt(this.viewer.viewArea.scrollTop, 10);

    mx = event.pageX + offsetX - this.viewer.viewerLeft;
    my = event.pageY + offsetY - this.viewer.viewerTop;


    // We return a simple javascript object (a hash) with x and y defined
    return { x: mx, y: my };
};

/*
#@c
Class    : AnnotationHolder
Function : ResizeAnnotation(oldWidth, oldHeight, newWidth, newHeight)
Arguements :
             1) oldWidth  - Width of displayed image before re-size operation   
             2) oldHeight - Height of displayed image before re-size operation
             3) newWidth  - Width of displayed image after re-size operation     
             4) newHeight - Height of displayed image after re-size operation     

Description:
This method is called to resize the annotataion.

author   25/11/2013    Pooja Kamra    Created
#@e
*/
AnnotationHolder.prototype.ResizeAnnotation = function (oldWidth, oldHeight, newWidth, newHeight) {
    var widthZoomPer = 0.0;
    var heightZoomPer = 0.0;
    oldWidth = oldWidth === 0 ? newWidth : oldWidth;
    oldHeight = oldHeight === 0 ? newHeight : oldHeight;
    widthZoomPer = (newWidth * 100) / oldWidth;
    heightZoomPer = (newHeight * 100) / oldHeight;
    var annotationList = this.annotationList;
    var len = annotationList.length;
    for (var i = 0; i < len; i++) {
        //var shape = annotationList[i];
        annotationList[i].Resize(this.viewer.ZoomFactor, widthZoomPer/100, this.viewer.ZoomFactor, heightZoomPer/100);
    }
    this.valid = false;
};

/*
#@c
Class    : AnnotationHolder
Function : GetAnnotationColor(Color)
Arguments:
            Color: Decimal value of color

Description:
This function is used to get the Annotation Color in hex format appended with '#'

author        12/12/2013    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.GetAnnotationColor = function (Color,formatRGB) {
    var HexVal = this.ConvertToHexadecimal(Color);
    if(formatRGB){
       return ("#" + HexVal);
    }
    HexVal = HexVal.slice(-2) + HexVal.slice(2,4) + HexVal.slice(0,2);
    return ("#" + HexVal);
};

/*
#@c
Class    : AnnotationHolder
Function : SetAnnotationPenColor(newColor)
Arguments:
            newColor: value within Range 0 to 15 to set the color of annotation

Desription:
This function is used to set the Annotation Color

author        12/12/2013    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.SetAnnotationPenColor = function (newColor) {
	
    if (this.annotationType == "WIPOUT" && (newColor != "#000000" && newColor != "#FFFFFF")) {
        alert(OPALL_ERR_MESSAGE.WipeOutColorErrorMsg);
    }
    this.penColor["HLT"]		= newColor;
    this.penColor["LNE"]		= newColor;
    this.penColor["BOX"]		= newColor;
    this.penColor["FRECT"]		= newColor;
    this.penColor["FRH"]		= newColor;
    this.penColor["HLT"]		= newColor;
    this.penColor["DLNE"]		= newColor;
    this.penColor["LALNE"]		= newColor;
    this.penColor["TALNE"]		= newColor;
    this.penColor["DALNE"]		= newColor;
    this.penColor["ELLI"]		= newColor;
    this.penColor["FELLI"]		= newColor;
    //this.penColor["DZONE"]		= newColor;
    if(newColor == "#000000" || newColor == "#FFFFFF")
		this.penColor["WIPOUT"]		= newColor;
	else
		this.penColor["WIPOUT"]		= "#000000";
    this.penColor["TXTSTAMP"]	= newColor;    
    this.penColor["IMGSTAMP"]	= newColor;
    this.penColor["FREETXT"]	= newColor;
    this.penColor["STICKYNOTE"]	= newColor;
    this.penColor["ATTACHNOTE"]	= newColor;
    this.penColor["HLINK"]		= newColor;
    this.valid = false;
};


AnnotationHolder.prototype.SetDefaultColorForThisAnnotationType = function(annotationType, newColor){
	this.penColor[annotationType] = newColor;
	this.valid = false;
};

/*
#@c
Class    : AnnotationHolder
Function : SetAnnotationThickness(newThickness)
Arguments:
            newThickness: value within Range 1 to 5 to set the thickness of annotation

Description:
This function is used to set the Annotation thickness

@author        12/12/2013    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.SetAnnotationThickness = function (newThickness) {
    if (newThickness < 1) {
        console.log("Invalid value for - PenThickness Parameter ");
    	newThickness = 1;
    }
    else if(newThickness > 5){
        console.log("Invalid value for - PenThickness Parameter ");
    	newThickness = 5;
    }

    this.penThickness["HLT"]		= newThickness;
    this.penThickness["LNE"]		= newThickness;
    this.penThickness["BOX"]		= newThickness;
    this.penThickness["FRECT"]		= newThickness;
    this.penThickness["FRH"]		= newThickness;
    this.penThickness["HLT"]		= newThickness;
    this.penThickness["DLNE"]		= newThickness;
    this.penThickness["LALNE"]		= newThickness;
    this.penThickness["TALNE"]		= newThickness;
    this.penThickness["DALNE"]		= newThickness;
    this.penThickness["ELLI"]		= newThickness;
    this.penThickness["FELLI"]		= newThickness;
    this.penThickness["DZONE"]		= this.viewer.DynamicZoneThickness;
    this.penThickness["WIPOUT"]		= newThickness;
    this.penThickness["TXTSTAMP"]	= newThickness;
    this.penThickness["IMGSTAMP"]	= newThickness;
    this.penThickness["FREETXT"]	= newThickness;
    this.penThickness["STICKYNOTE"]	= newThickness;
    this.penThickness["ATTACHNOTE"]	= newThickness;
    this.penThickness["HLINK"]		= newThickness;
	this.penThickness["EZONE"]		= this.viewer.DynamicZoneThickness;
	this.valid = false;
};


/*
#@c
Class    : AnnotationHolder
Function : SetThicknessForSingleType(annotationType, newThickness)
Arguments:
			annotationType: type for which thickness is to be set.
            newThickness: value within Range 1 to 5 to set the thickness of annotation

Description:
This function is used to set the default Annotation thickness for a particular type of annotation.

@author        11/11/2014   Gaurav Dixit
#@e
*/
AnnotationHolder.prototype.SetThicknessForSingleType = function (annotationType, newThickness) {
    if (newThickness < 1) {
        console.log("Invalid value for - PenThickness Parameter ");
    	newThickness = 1;
    }
    else if(newThickness > 5){
        console.log("Invalid value for - PenThickness Parameter ");
    	newThickness = 5;
    }

    this.penThickness[annotationType]	= newThickness;
    this.valid = false;
};




/*
#@c
Class    : AnnotationHolder
Function : SetFillColor(nNewValue)
Arguments:
            nNewValue:value within Range 0 to 15 to set filled color of annotation(e.g. filled Rect, filled Ellipse)

Description:
This function is used to set the Annotation fill Color

@author        12/12/2013    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.SetFillColor = function (newColor) {
	if (this.annotationType == "WIPOUT" && (newColor != "#000000" && newColor != "#FFFFFF")) {
        alert(OPALL_ERR_MESSAGE.WipeOutColorErrorMsg);
    }
    this.m_fillColor["HLT"]			= newColor;
    this.m_fillColor["LNE"]			= newColor;
    this.m_fillColor["BOX"]			= newColor;
    this.m_fillColor["FRECT"]		= newColor;
    this.m_fillColor["FRH"]			= newColor;
    this.m_fillColor["HLT"]			= newColor;
    this.m_fillColor["DLNE"]		= newColor;
    this.m_fillColor["LALNE"]		= newColor;
    this.m_fillColor["TALNE"]		= newColor;
    this.m_fillColor["DALNE"]		= newColor;
    this.m_fillColor["ELLI"]		= newColor;
    this.m_fillColor["FELLI"]		= newColor;
    //this.m_fillColor["DZONE"]		= newColor;
    if(newColor=="#000000" || newColor=="#FFFFFF")
		this.m_fillColor["WIPOUT"]		= newColor;
	else
		this.m_fillColor["WIPOUT"]		= "#000000";
    this.m_fillColor["TXTSTAMP"]	= newColor;
    this.m_fillColor["IMGSTAMP"]	= newColor;
    this.m_fillColor["FREETXT"]		= newColor;
    this.m_fillColor["STICKYNOTE"]	= newColor;
    this.m_fillColor["ATTACHNOTE"]	= newColor;
    this.m_fillColor["HLINK"]		= newColor;
    this.valid = false;
};

AnnotationHolder.prototype.SetFillColorForSingleType = function (annotationType, newColor) {
    this.m_fillColor[annotationType]	= newColor;
    this.valid = false;
};

AnnotationHolder.prototype.SetStickyNoteFillColor = function (nNewValue) {
    this.stickyNoteBackColor = nNewValue;
};



/*
#@c
Class    : AnnotationHolder
Function : getColor(nNewValue)
Arguments:
            nNewValue:value within Range 0 to 15 to set color of annotation

Description:
This is private function which is used internally to set the Annotation Color

@author        12/12/2013    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.getColor = function (nNewValue) {

    var value = 0;
    if (nNewValue < this.enumColors.dvBlack || nNewValue > this.enumColors.dvWhite) {
        alert(OPALL_ERR_MESSAGE.WipeOutColorErrorMsg);
        return;
    }
    switch (nNewValue) {
        case 0:
            value = this.PALETTERGB(0, 0, 0);
            break;
        case 1:
            value = this.PALETTERGB(0, 0, 170);
            break;
        case 2:
            value = this.PALETTERGB(0, 170, 0);
            break;
        case 3:
            value = this.PALETTERGB(0, 255, 0);
            break;
        case 4:
            value = this.PALETTERGB(170, 0, 0);
            break;
        case 5:
            value = this.PALETTERGB(170, 255, 255);
            break;
            case6:
            value = this.PALETTERGB(213, 213, 255);
            break;
        case 7:
            value = this.PALETTERGB(213, 255, 213);
            break;
        case 8:
            value = this.PALETTERGB(213, 255, 255);
            break;
        case 9:
            value = this.PALETTERGB(255, 0, 0);
            break;
        case 10:
            value = this.PALETTERGB(255, 128, 255);
            break;
        case 11:
            value = this.PALETTERGB(255, 170, 85);
            break;
        case 12:
            value = this.PALETTERGB(255, 213, 255);
            break;
        case 13:
            value = this.PALETTERGB(255, 255, 213);
            break;
        case 14:
            value = this.PALETTERGB(255, 255, 0);
            break;
        case 15:
            value = this.PALETTERGB(255, 255, 255);
            break;
        default:
            value = this.PALETTERGB(0, 0, 170);
            break;
    }
    return value;
};

/*
#@c
Class    : AnnotationHolder
Function : getAnnotationDateTime()
Arguments: None

Description:
This function is used to get the time when Annotation is drawn

@author        12/12/2013    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.getAnnotationDateTime = function () {
    var strArrayDateTime = [];
    var strTOrder = "";
    var d = new Date();
    strArrayDateTime[0] = d.getFullYear();
    strArrayDateTime[1] = d.getMonth()+1;
    strArrayDateTime[2] = d.getDate();
    strArrayDateTime[3] = d.getHours();
    strArrayDateTime[4] = d.getMinutes();
    strArrayDateTime[5] = d.getSeconds();
    for (var i = 0; i < strArrayDateTime.length; i++)
        strTOrder += strArrayDateTime[i] + ",";
    strTOrder = strTOrder.substring(0, strTOrder.length - 1);
    return strTOrder;
};

/*
#@c
Class    : AnnotationHolder
Function : IsShowDateStamp()
Arguments: None

Description:
This function is used to specify whether date stamp should be displayed in the text stamp list or not

@author        30/01/2014    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.IsShowDateStamp = function () {
    var datestamp = prompt("Show date stamp or not(1/0)?", "0");
    if (datestamp != null) {
        if (datestamp == 1 || datestamp == true)
            this.bDateStamp = true;
        else
            this.bDateStamp = false;
    }
    this.valid = false;
};



/*
#@c
Class    : AnnotationHolder
Function : PALETTERGB(r,g,b)
Arguments: 
            1) r: Red Component
            2) g: green Component
            3) b: blue Component

Description:
This function is used to merge red, green and blue componet values of color

@author        02/12/2013    Aditya Kamra
#@e
*/

AnnotationHolder.prototype.PALETTERGB = function (r, g, b) {
    return (0x02000000 | ((r) | ((g) << 8) | ((b) << 16)));
};


AnnotationHolder.prototype.finalizeFreeText = function(){
	if(this.mode == this.modes.FreeTextDraw && this.freeTextAreaID.style.visibility == 'visible'){
	this.freeTextAreaID.style.visibility = "hidden";
        var textArray = this.FreeTextAreaManager.GetContent();
        this.mode = this.modes.AnnotationEdit;
        this.freeTextAreaID.value = "";
        if (textArray) {			    
            var currentdrawing = GetAnnotationObject(this.viewer, this.annotationType, parseInt(this.FreeTextAreaManager.xcanvas), parseInt(this.FreeTextAreaManager.ycanvas), parseInt(this.freeTextAreaID.style.width), parseInt(this.freeTextAreaID.style.height), this.penColor[this.annotationType],
            this.penThickness[this.annotationType], "VM", this.userID, this.currentGroupName, this.stickyNoteBackColor, this.getAnnotationDateTime());
            this.change = true;
            this.annotationList.push(currentdrawing);
            this.drawingNewAnnotation = true;
            this.annotationType = null;
            this.dragging = false;
            var l = this.annotationList.length;
            this.currentDraw = this.annotationList[l - 1];
             this.SetCurrentFreeTextProperties(this.currentDraw,this.FreeTextAreaManager);				
             this.currentDraw.lines = textArray;
             this.currentDraw.width = parseInt(this.freeTextAreaID.style.width);				
             this.valid = this.currentDraw.NoRedrawOnCreation;
        }
	}
};


/*
#@c
Class    : AnnotationHolder
Function : DownEvent(e, myState)
Arguments:
            1)e      :Event to perform
            2)myState:reference of Annotation Canvas State holder

Description:
The framework calls this function when the mouse cursor moves and on touct(for touch screen devices)

@author   25/11/2013    Aditya Kamra
#@e
*/
AnnotationHolder.prototype.DownEvent = function (e, myState) {	
	window.focus();
	this.annotationResized = false;
	this.annotationMoved = false;
    this.imageDragState = false;
	this.dblClick=false;
    if (myState.mode != myState.modes.AnnotationDraw) {
         this.drawingNewAnnotation = false;
    }
	this.isTouchMoved =  false;	
	var mouse = myState.getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;
	myState.mouseX = mx;
	myState.mouseY = my;

    this.xDrag = mx;
    this.yDrag = my;
	myState.dragoffx = [];
	myState.dragoffy = [];
	
	e.preventDefault();
//	setDefaultContextMenu();
	//$( "#contextMenu" ).hide();
//	hideContextMenu();		//Amber Beriwal on 22/12/2014 [Bug: 4250]
	
 	    
    //Check for Edit Mode    
    var mode = myState.mode;
	var rightClick = (e.which ==  3);
	// if(bDialogOpen == true && dialogOpened[dialogOpened.length - 1] != "#ZoomLens")	//Amber Beriwal on 09/12/2014 [Bug: 4125]
	// {
		// return;
	// }
    if (mode == myState.modes.AnnotationEdit) {
	   
        var l = myState.annotationList.length;
        for (var i = l - 1; i >= 0; i--) {
            if (((myState.annotationList[i].type == "EZONE" || myState.annotationList[i].rights == "VM" || myState.annotationList[i].rights == "M") && (myState.viewer.AnnotationOption == 0))) {
                if (myState.annotationList[i].contains(mx, my)) {
                    this.change = true;
                    var mySel = myState.annotationList[i];
					//Code for click on Hyperlink : Aditya 
					var mySel = myState.annotationList[i];
					
					var isSelectionAlreadyPresent = false;
					if(mySel.type=="EZONE"){ //11.02.2015
						this.selectionIndex=[];
						this.selection=[];
					}
					
					var indexToDeselect;
					for(var j = 0; j < myState.selectionIndex.length; j++){
						if(i == this.selectionIndex[j]){
							isSelectionAlreadyPresent = true;
							indexToDeselect = j;
							break;
						}
					}
					
					if(this.controlPressed){
						if(!isSelectionAlreadyPresent){
							myState.selection.push(mySel);
							myState.selectionIndex.push(i);
						}
						else{
							myState.selection.splice(indexToDeselect, 1);
							this.selectionIndex.splice(indexToDeselect, 1);
						}
						if (mySel.type == "EZONE")
					        mySel.CheckContainsForPartitions(mx,my,true);
						
					}					
					//else if(this.selection.length < 2 && this.selection[0] != mySel){
					else{
					     if (mySel.type == "EZONE"){//11.02.2015
							mySel.selectedPartitionIndex=[];
					        mySel.CheckContainsForPartitions(mx,my);
							}
						 if(!isSelectionAlreadyPresent){
						 	this.selection = [];
							this.selectionIndex = [];
							myState.selection[0] = mySel;
							myState.selectionIndex[0] = i;
						}
					}
                    // Keep track of where in the object we clicked
                    for(var j = 0; j < this.selection.length; j++){
                    	myState.dragoffx[j] = mx - this.selection[j].x;
                        myState.dragoffy[j] = my - this.selection[j].y;
                    }
                    myState.dragging = true;
					//setProperties(myState.annotationList[i]);
					//added on 07/08/2014
					if (myState.annotationList[i].isResize(mx, my)) {
					this.canvas.style.cursor = "se-resize";
					myState.mode = myState.modes.AnnotationDraw;
					myState.currentDraw = mySel;
					myState.currentIndex = i;
					}
					else{
					this.canvas.style.cursor = "move";
					myState.mode == myState.modes.AnnotationEdit;
					}
                    //till here
					
					
                    
					setPropertiesForContextMenu(myState.annotationList[i]);
					hideDialog("#annotationPropertiesDialog");	//Amber Beriwal on 09/12/2014 [Bug: 4125]
					//$('#annotationPropertiesDialog').hide();

					
                    
                    myState.valid = false;
                    return;
                }
			  else{
				
				  //$( "#contextMenu" ).hide();
				hideContextMenu();		//Amber Beriwal on 22/12/2014 [Bug: 4250]
				}
            }
        }
		
		this.imageDragState = true;
		if(!this.controlPressed){
			this.selection = [];
			this.selectionIndex = [];
			this.valid = false;
	    }
    }
    else if (mode == myState.modes.AnnotationDraw) {
        this.selection = [];
		this.selectionIndex = [];
        if (this.annotationType != null) {
            var currentdrawing = GetAnnotationObject(this.viewer, this.annotationType, mx, my, 20, 30, this.penColor[this.annotationType],
            this.penThickness[this.annotationType], "VM", this.userID, this.currentGroupName, this.m_fillColor[this.annotationType], this.getAnnotationDateTime());
            this.change = true;
            myState.annotationList.push(currentdrawing);
            this.drawingNewAnnotation = true;
            myState.annotationType = null;
            myState.dragging = true;
            var l = myState.annotationList.length;
            myState.currentDraw = myState.annotationList[l - 1];
            myState.currentDraw.thickness = parseInt(myState.currentDraw.thicknessLevel * this.viewer.ZoomFactor);
            if (myState.currentDraw.thickness == 0)
                myState.currentDraw.thickness = 1;
			//11.02.2015
			if(myState.currentDraw.type=="EZONE"){//when new zone is drawn
				myState.zoneList.push(currentdrawing);
				myState.currentDraw.id= this.zoneList.length;
			}
            myState.valid = myState.currentDraw.NoRedrawOnCreation;
        }
        document.getElementById('imageStampHover').style.display = 'none';
        document.getElementById('textStampHover').style.display = 'none';
        return;
    }
    else if (mode == myState.modes.FreeTextDraw) {
		this.canvas.style.cursor = "default";
        if (this.freeTextAreaID.style.visibility == "hidden") {
            this.FreeTextAreaManager = null;
            this.FreeTextAreaManager = new FreeTextAreaHolder(this.viewer, this.freeTextAreaID);
			this.FreeTextAreaManager.SetFontSize(Math.abs(this.fontSize[this.annotationType]));
			this.FreeTextAreaManager.SetFontStyle (this.fontStyle[this.annotationType]);
			this.FreeTextAreaManager.SetUnderline(this.underline[this.annotationType]);
			this.FreeTextAreaManager.SetStrikeThrough(this.StrikeOut[this.annotationType]);
			this.FreeTextAreaManager.SetFontName(this.fontname[this.annotationType]);
			this.FreeTextAreaManager.SetFontColor(this.penColor[this.annotationType]);
			
            this.FreeTextAreaManager.SetPosition(e.pageX, e.pageY, mx, my);
			this.FreeTextAreaManager.SetBackColor(this.stickyNoteBackColor);
			
            this.drawingNewAnnotation = true;
        }
        else {
            this.freeTextAreaID.style.visibility = "hidden";
            var textArray = this.FreeTextAreaManager.GetContent();
            myState.mode = myState.modes.AnnotationEdit;
            this.freeTextAreaID.value = "";
            if (textArray) {			    
                var currentdrawing = GetAnnotationObject(this.viewer, this.annotationType, parseInt(this.FreeTextAreaManager.xcanvas), parseInt(this.FreeTextAreaManager.ycanvas), parseInt(this.freeTextAreaID.style.width), parseInt(this.freeTextAreaID.style.height), this.penColor[this.annotationType],
                this.penThickness[this.annotationType], "VM", this.userID, this.currentGroupName, this.stickyNoteBackColor, this.getAnnotationDateTime());
                this.change = true;
                myState.annotationList.push(currentdrawing);
                this.drawingNewAnnotation = true;
                myState.annotationType = null;
                myState.dragging = false;
                var l = myState.annotationList.length;
                myState.currentDraw = myState.annotationList[l - 1];
                 this.SetCurrentFreeTextProperties(myState.currentDraw,this.FreeTextAreaManager);				
                myState.currentDraw.lines = textArray;
				myState.currentDraw.width = parseInt(this.freeTextAreaID.style.width);				
                myState.valid = myState.currentDraw.NoRedrawOnCreation;
            }
        }
    }
	else if (mode == myState.modes.FreeTextEdit) {
        this.freeTextAreaID.style.visibility = "hidden";
        var textArray = this.FreeTextAreaManager.GetContent();
        myState.mode = myState.modes.AnnotationEdit;
        this.freeTextAreaID.value = "";       
    }
    else if (mode == myState.modes.AttachNoteDraw) {
        // this.canvas.style.cursor = "default";
        // var absPoint = myState.findAbsoluteMouseCoOrdinates(mx,my);
		// myState.SetAttachNotePostition(absPoint);        
        // //this.attachNoteUI.div.style.visibility = "visible";	//Amber Beriwal on 09/12/2014 [Bug: 4125]
		// //showDialog("#attachNote");                
        // $(this.attachNoteUI.div).draggable({containment: 'parent'});            
        // this.attachNoteUI.textArea.value = "";
        // this.attachNoteUI.div.focus();
        // this.attachNoteUI.textArea.focus();
        // //document.getElementById('textAreaID').focus();
		
    }
    else if (mode == myState.modes.FreeHandCreate) {
        this.selection = [];
		this.selectionIndex = [];
        if (this.annotationType != null) {
            var currentdrawing = GetAnnotationObject(this.viewer, this.annotationType, mx, my, 20, 30, this.penColor[this.annotationType],
            this.penThickness[this.annotationType], "VM", this.userID, this.currentGroupName, this.m_fillColor[this.annotationType], this.getAnnotationDateTime());
            this.change = true;
            this.mode = myState.modes.FreeHandDraw;
            myState.annotationList.push(currentdrawing);
            this.drawingNewAnnotation = true;
            myState.dragging = true;
            var l = myState.annotationList.length;
            myState.currentDraw = myState.annotationList[l - 1];
            myState.currentDraw.thickness = parseInt(myState.currentDraw.thicknessLevel * myState.viewer.ZoomFactor);
            if (myState.currentDraw.thickness < 1){
            	myState.currentDraw.thickness = 1;
            }
            else if(myState.currentDraw.thickness > 5){
            	myState.currentDraw.thickness = 5;
            }    
            myState.currentDraw.firstDraw = true;
            // myState.currentDraw.groupid = this.currentGroupName;
            myState.valid = myState.currentDraw.NoRedrawOnCreation;
            this.bfirst = false;
        }
    }
    else if (mode == myState.modes.FreeHandDraw) {
        myState.currentDraw.resetLastPoint(mx, my);
        myState.dragging = true;
    }
    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it

    if (myState.selection.length != 0) {
		
        myState.selection = [];
        myState.selectionIndex = [];
        myState.valid = false; // Need to clear the old selection border
    }
		if(rightClick){ 
					//hide menu list on right click
					// $("#file_menu_list").hide();
					// $("#edit_menu_list").hide();
					// $("#zoom_menu_list").hide();
					// $("#transform_menu_list").hide();
					// $("#annotate_menu_list").hide();
					// $("#help_menu_list").hide();					
	                // setDefaultContextMenu();
					mouse = myState.getMouse(e);
	         
					var rightmx = mouse.x;
					var rightmy = mouse.y;
					// $("#contextMenu").css({top: rightmy, left: rightmx, position:'absolute'});
					// $( "#Menu" ).menu();
					//line is commented to not to show context menu on down event. context menu will be visiblle on upevent only
					//$( "#contextMenu" ).show();
					//break;
					}
};

/*
#@c
Class    : AnnotationHolder
Function : DragEvent(e, myState)
Arguments:
            1)e      :Event to perform
            2)myState:reference of Annotation Canvas State holder

Description:
The framework calls this function when the mouse cursor moves and on touct(for touch screen devices)

@author   25/11/2013    Aditya Kamra
#@e
*/
AnnotationHolder.prototype.DragEvent = function (e, myState) {
	var mouse = myState.getMouse(e);

	if ((this.selection.length == 1)) {
		
		var mySel = this.selection[0];
		if (((mySel.type == "EZONE" || mySel.rights == "VM" || mySel.rights == "M") && (myState.viewer.AnnotationOption == 0))) {
					if(mySel.isResize(mouse.x, mouse.y)){
						this.canvas.style.cursor = "se-resize";
					}
					else if(myState.selection[0].contains(mouse.x, mouse.y)){
						this.canvas.style.cursor = "move";
					}
					else{
						this.canvas.style.cursor = "default";
					}
		};
	}
	
	if((mouse.x <= myState.mouseX-10) || (mouse.x >= myState.mouseX+10)){	
		myState.isTouchMoved = true;
	}
    if((mouse.y <= myState.mouseY-10) || ( mouse.y >= myState.mouseY+10)){
	 myState.isTouchMoved = true;
	}
	//if statement is added to stop movement of image on right click
	if(e.which !=  3) {
    if (myState.dragging) {
        var mode = myState.mode;
        if (mode == myState.modes.AnnotationEdit) {

        	for(var i =0; i < this.selection.length; i++){
        		if ((myState.selection[i].type == "ATTACHNOTE") ||  (myState.selection[i].type == "HLINK")){	//Nikhil Barar [Bug: 4076]
                    myState.selection[i].ClearText();
                }
        	}
            
            myState.ctx.fillRect(mouse.x, mouse.y, 2, 1);
            // We don't want to drag the object by its top-left corner, we want to drag it
            // from where we clicked. Thats why we saved the offset and use it here
			
			//By Avinash Kumar for Bug# :4205
			var posArray=[];
			
			var index = 0;
			var minX = -1,
			    minY = -1, 
				maxX = -1, 
				maxY = -1;
			
			 for(var i =0; i < this.selection.length; i++){
			  this.selection[i];
			  var X = myState.selection[i].x + (mouse.x - this.mouseX);
              var Y = myState.selection[i].y + (mouse.y - this.mouseY);
			  switch(this.selection[i].type){
				case "LNE":
				case "DLNE":
				case "LALNE":
				case "TALNE":
				case "DALNE":
				        
						
						var diffX = X-this.selection[i].x,
						    diffY = Y-this.selection[i].y;
						posArray[index] = [X,Y ];
						index++;
					
						posArray[index] = [this.selection[i].endX+diffX, this.selection[i].endY+diffY];
						index++;
						break;
				    
				case "HLT":
				case "BOX":
				case "FRECT":
				case "ELLI":
				case "FELLI":
				case "WIPOUT":
				case "TXTSTAMP":
				case "IMGSTAMP":
				case "STICKYNOTE":
				case "ATTACHNOTE":
				case "FREETXT":
				case "DZONE":
						
						posArray[index] = [X, Y];
						index++;
						
						posArray[index] = [(X+this.selection[i].w), (Y+this.selection[i].h)];
						index++;
						break;
			  
			    case "FRH":
				        
						var diffX = X-this.selection[i].x,
						    diffY = Y-this.selection[i].y;
						posArray[index] = [(this.selection[i].minX+diffX), (this.selection[i].minY+diffY)];
						index++;
						
						posArray[index] = [(this.selection[i].maxX+diffX), (this.selection[i].maxY+diffY)];
						index++;
						break;
				case "HLINK":
				       
						posArray[index] = [X, Y-this.selection[i].h];
						index++;
					  
						posArray[index] = [(X+this.selection[i].w), (Y+(this.selection[i].h/2))];
						index++;
						break;
				case "EZONE":
						
						posArray[index] = [X, Y];
						index++;
						
						posArray[index] = [(X+this.selection[i].w), (Y+this.selection[i].h)];
						index++;
						break;	
			  
			  }
			
			 }
			 
			for(var i =0; i < posArray.length; i++){
			    if(maxX<posArray[i][0] || maxX==-1){
					maxX = posArray[i][0];
				}
				if(maxY<posArray[i][1] || maxY==-1){
					maxY = posArray[i][1];
				}
				if(minX>posArray[i][0] || minX==-1){
					minX = posArray[i][0];
				}
				if(minY>posArray[i][1] || minY==-1){
					minY = posArray[i][1];
				}
			}
			
			if(minX > 0 && maxX < this.viewer.ImageCanvas.width && minY > 0 && maxY < this.viewer.ImageCanvas.height){
				for(var i =0; i < this.selection.length; i++){
					if(mouse != undefined){
						var X = myState.selection[i].x + (mouse.x - this.mouseX);
						var Y = myState.selection[i].y + (mouse.y - this.mouseY);
	
						myState.selection[i].Drag(X, Y, myState.ctx);
					}
				}
            
				this.mouseX = mouse.x;
				this.mouseY = mouse.y;
				myState.valid = false; // Something's dragging so we must redraw
				this.annotationMoved = true;
			}
			else if(minX >0 && maxX < this.viewer.ImageCanvas.width){
				for(var i =0; i < this.selection.length; i++){
					if(mouse != undefined){
						 var X = myState.selection[i].x + (mouse.x - this.mouseX);
						 var Y = myState.selection[i].y + (mouse.y - this.mouseY);;
						
						myState.selection[i].Drag(X,myState.selection[i].y, myState.ctx);
					}
				}
            
				this.mouseX = mouse.x;
				this.mouseY = mouse.y;
				myState.valid = false; // Something's dragging so we must redraw
				this.annotationMoved = true;
			
			
			}
			else if(minY >0 && maxY < this.viewer.ImageCanvas.height){
				for(var i =0; i < this.selection.length; i++){
					if(mouse != undefined){
						 var X = myState.selection[i].x + (mouse.x - this.mouseX);
					       var Y = myState.selection[i].y + (mouse.y - this.mouseY);;
						
						myState.selection[i].Drag(myState.selection[i].x,Y, myState.ctx);
					}
				}
            
				this.mouseX = mouse.x;
				this.mouseY = mouse.y;
				myState.valid = false; // Something's dragging so we must redraw
				this.annotationMoved = true;
			
			
			}
			else{myState.valid = true;this.annotationMoved = false;}
        }
        else {
        		if(this.selection.length > 1){
        			this.selection = [];
        			this.selectionIndex = [];
        			this.selection[0] = myState.currentDraw;
            		this.selectionIndex[0] = myState.currentIndex;
        		}
    			myState.currentDraw.drawDrag(mouse.x, mouse.y, myState.ctx);
	            myState.valid = myState.currentDraw.NoRedrawOnCreation;
	            this.annotationResized = true;
            }
		
		return;
    }
    else {
	
        for (var i = 0; i < myState.annotationList.length; i++) 
		{
            if (myState.annotationList[i].type == "ATTACHNOTE"){
                if (myState.annotationList[i].contains(mouse.x, mouse.y) && (!myState.attachNoteUI || myState.attachNoteUI.div.style.display == "none" )){	//Amber Beriwal on 23/12/2014 [Bugs: 4033, 4190]
                    myState.annotationList[i].ShowToolTipText();
                    break;
                }
                else
                    myState.annotationList[i].ClearText();
            }
			//Nikhil Barar [Bug: 4076]
			if (myState.annotationList[i].type == "HLINK"){
				if (myState.annotationList[i].contains(mouse.x, mouse.y)){
					document.getElementById("annotCanvas").style.cursor = "pointer";
					if (!myState.attachNoteUI || myState.attachNoteUI.div.style.display == "none" )	//Amber Beriwal on 23/12/2014 [Bugs: 4033, 4190]
						myState.annotationList[i].ShowToolTipText();
					break;
				}
				else
				{
					if((mode != myState.modes.AnnotationDraw))
						document.getElementById("annotCanvas").style.cursor = "default";
					myState.annotationList[i].ClearText();
				}
			}
        }
    }
	if(this.imageDragState){
		var deltaX = myState.mouseX - mouse.x;
		var deltaY = myState.mouseY - mouse.y;
		this.viewer.viewArea.scrollTop = (deltaY + parseInt(this.viewer.viewArea.scrollTop));
		this.viewer.viewArea.scrollLeft = (deltaX + parseInt(this.viewer.viewArea.scrollLeft));
	}
}	
};

/*
#@c
Class    : AnnotationHolder
Function : UpEvent(e, myState)
Arguments:
1)e      :Event to perform
2)myState:reference of Annotation Canvas State holder

Description:
The framework calls this function when the user releases the left mouse button

@author   25/11/2013    Aditya Kamra
#@e
*/
AnnotationHolder.prototype.UpEvent = function (e, myState) {
	var mouse = myState.getMouse(e);
	var xBeforeResize = this.xDrag - this.dragoffx[0];
	var yBeforeResize = this.yDrag - this.dragoffy[0];
	
	this.xDrag = mouse.x - this.xDrag;
	this.yDrag = mouse.y - this.yDrag;
	
    myState.dragging = false;
    this.canvas.style.cursor = "default";
    
	// if(bDialogOpen == true && dialogOpened[dialogOpened.length - 1] != "#ZoomLens")	//Amber Beriwal on 09/12/2014 [Bug: 4125]
	// {
		// return;
	// }
	
    if(this.drawingNewAnnotation){
    	var operation;
    	var addedAnnotation = this.annotationList[this.annotationList.length-1];
    	if(addedAnnotation instanceof FreeHand){
    		operation = {operationType: OPERATION_TYPE.ADD_NEW_ANNOTATION, position: myState.annotationList.length, element: addedAnnotation};
    	}
		//11.02.2015
		//auto select zone after creation and return information of zone to calling application
		else if (addedAnnotation instanceof ExtractZone){
			addedAnnotation.select(this.ctx);
			this.selection[0] = addedAnnotation;
			this.selectionIndex[0] = this.annotationList.length-1;
			this.canvas.style.cursor = "move";
			this.mode == this.modes.AnnotationEdit;
			operation = {operationType: OPERATION_TYPE.ADD_NEW_ANNOTATION, position: myState.annotationList.length, element: jQuery.extend(true, {}, addedAnnotation)};
			this.returnZoneInfo(addedAnnotation,true);
		}
    	else{
    		operation = {operationType: OPERATION_TYPE.ADD_NEW_ANNOTATION, position: myState.annotationList.length, element: jQuery.extend(true, {}, addedAnnotation)};
    	}
    	
        myState.viewer.addToOperationsList(operation);
    }
    
    if (myState.mode == myState.modes.AnnotationDraw) {
        myState.mode = myState.modes.AnnotationEdit;
        if (myState.currentDraw != null)
            myState.UpdateAnnotations(myState.currentDraw);
        myState.currentDraw = null;
        myState.valid = true;
        
        if(this.annotationResized && !this.drawingNewAnnotation){
        	// Below method is used to insert this operation in undo list.
        	var element = this.annotationList[myState.selectionIndex[0]];
        	var initialWidth = element.w;
        	var initialHeight = element.h;
        	var xInitial = element.x;
        	var yInitial = element.y;
        	
            var operation ;
            if(element.type == "LNE" || element.type == "DLNE" || element.type == "LALNE" || element.type == "TALNE" || element.type == "DALNE"){
            	xInitial = element.x;
            	yInitial = element.y;
            	var endXInitial = element.endX - this.xDrag;
            	var endYInitial = element.endY - this.yDrag;
            	operation = {operationType: OPERATION_TYPE.RESIZE_ANNOTATION,elementIndex: myState.selectionIndex[0], 
            			x1Initial: xInitial, y1Initial: yInitial, x2Initial: endXInitial, y2Initial: endYInitial,
            			x1Final: element.x, y1Final: element.y, x2Final: element.endX, y2Final: element.endY};
     		}
            else{    // For all type of annotations other than LNE, DLNE, LALNE, TALNE, DALNE
            	
            	if(this.xDrag >= 0){
            		initialWidth = element.w - this.xDrag;
            	}
            	else if(this.xDrag < 0){

            		if(element.x == xBeforeResize){
        				initialWidth = (element.w - this.xDrag);
        			}
        			else{
            			xInitial = element.x + element.w;
            			initialWidth = -(element.w + this.xDrag);
            		}
            	}
            	
            	if(this.yDrag >= 0){
            		initialHeight = element.h - this.yDrag;
            	}
            	else if(this.yDrag < 0){
            		
        			if(element.y == yBeforeResize){
        				initialHeight = (element.h - this.yDrag);
        			}
        			else{
            			yInitial = element.y + element.h;
            			initialHeight = -(element.h + this.yDrag);
            		}
            	}
            	
            	operation = {operationType: OPERATION_TYPE.RESIZE_ANNOTATION, elementIndex: myState.selectionIndex[0],x1Initial: xInitial, y1Initial: yInitial, widthInitial: initialWidth, heightInitial: initialHeight,x1Final: element.x, y1Final: element.y, widthFinal: element.w, heightFinal: element.h};
            }
            myState.viewer.addToOperationsList(operation);
        }
    }
    else if (myState.mode == myState.modes.FreeHandDraw) {

        myState.currentDraw.refreshPointsCaptureList();
    }
    else if(this.annotationMoved){
    	//alert("This annotation moved");
				
    	var element = [];
    	var initialX1 = [];
    	var initialX2 = [];
    	var initialY1 = [];
    	var initialY2 = [];
    	var finalX1 = [];
    	var finalX2 = [];
    	var finalY1 = [];
    	var finalY2 = [];
    	var operation ;
    	
    	for(var i = 0; i < this.selection.length; i++){
    		element[i] = this.annotationList[myState.selectionIndex[i]];
        	
    		initialX1[i] = element[i].x - this.xDrag;
        	initialY1[i] = element[i].y - this.yDrag;
        	finalX1[i] = element[i].x;
        	finalY1[i] = element[i].y;
        	
        	if(element[i].type == "LNE" || element[i].type == "DLNE" || element[i].type == "LALNE" || element[i].type == "TALNE" || element[i].type == "DALNE"){
            	initialX2[i] = element[i].endX - this.xDrag;
            	initialY2[i] = element[i].endY - this.yDrag;
            	finalX2[i] = element[i].endX;
            	finalY2[i] = element[i].endY;
     		}
            else if(element[i].type=="EZONE"){
				var movedPartitions = [];
				for (var j = 0 ; j < this.annotationList[myState.selectionIndex[i]].partitions.length ; j++)
				{
					var movedPartition = jQuery.extend(false, {}, this.annotationList[myState.selectionIndex[i]].partitions[j]);
					movedPartition.zone = element[i];
					movedPartitions.push(movedPartition);				
				}
			element[i].partitions = movedPartitions;
			}
        	element[i] = jQuery.extend(false, {}, element[i]);
    	}
    	
    	operation = {operationType: OPERATION_TYPE.MOVE_ANNOTATION, elementList: element,
    			elementIndex: jQuery.extend(true, [], myState.selectionIndex), startX1: initialX1, startY1: initialY1, startX2: initialX2, startY2: initialY2,
    			endX1: finalX1, endY1: finalY1, endX2: finalX2, endY2: finalY2};
        
        myState.viewer.addToOperationsList(operation);
		//11.02.2015
		//return zone information after moving it
		if(this.selection.length==1 && this.selection[0].type=="EZONE"){
			this.returnZoneInfo(this.selection[0],false);//11.02.2015
			return;
		}
    }
    
    
    if(e.which ==  3){ 
    	 if (myState.selection.length == 1)
	     {	myState.viewer.setDialogBox(myState.selection[0]); }
		mouse = myState.getMouse(e);
		var rightmx = mouse.x;
		var rightmy = mouse.y;
    		 
		 var menu = myState.findAbsoluteMouseCoOrdinates(rightmx,rightmy);
	//	 $("#contextMenu").css({top: menu.y, left: menu.x, position:'absolute'});
	//	$( "#Menu" ).menu();
		//$( "#contextMenu" ).show();
	//	showContextMenu();	//Amber Beriwal on 19/12/2014	[Bug #4249]
		
	//	 $("#annotationPropertiesDialog").css({top: menu.y, left: menu.x, position:'absolute'});
		//break;
	}
    else {
		//11.02.2015
		//return zone information when it get selected
		if(this.drawingNewAnnotation==false && this.selection.length==1 && this.selection[0].type=="EZONE"){
			this.returnZoneInfo(this.selection[0],false);//11.02.2015
			//return;
		}
	}
	this.imageDragState = false;
	this.annotationMoved = false;
	myState.lastTouchMouseX = mouse.x;
	myState.lastTouchMouseY = mouse.y;
	
	
};



/*
#@c
Class    : AnnotationHolder
Access   : Private
Function : RotateAnnotation(angle, zoom)
Arguments:
            1)angle: angle at which rotation need to perform
            2)zoom: current zoom level to resize annotaion after rotation

Description:
This function is used to rotate the annotation at specified angle. Currently 90, 180, 270 and 360 are supported.

@author        25/11/2013    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.RotateAnnotation = function (angle, zoom) {
    this.annotationList = [];
	this.imageStampList=[];
    this.valid = false;
};
/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : LoadAnnotation(URL)
Arguments:
            1) URL: url of ini servlet to get annotation list.

Description:
This method is called to load annotation from ini

@author        12/11/2013    Anjali Singla 
#@e
**/
AnnotationHolder.prototype.LoadAnnotation = function(URL, pageNo) {
	try {
		if (URL != "") {

			this.clear();
			this.selection = [];
			this.selectionIndex = [];
			var self = this;
			var txtFile = new XMLHttpRequest();

            var splitURL = URL.split("?");
            txtFile.open("POST", splitURL[0], true);
            txtFile.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			txtFile.onreadystatechange = function() {
				if (txtFile.readyState === 4 ){
          if(txtFile.status === 200) {
            self.viewer.annotationCallback(txtFile.responseText, pageNo);
          }
          else{
            OPALL.VIEWER.handlePageLoadError("Error while getting annotation data.");
          }
					//self.AnnotationDataLoaded(txtFile.responseText);
				}
			};
            txtFile.send(splitURL[1]);
				// txtFile.send(null);
			}
	  else{
      this.waitforannotation = true;
		}
			

  }
  catch (err) {
    console.log("Error: " + err.message);
    OPALL.VIEWER.handlePageLoadError("Error while getting annotation data.");
	}

};
/*
#@c
Class    : AnnotationHolder
Access   : Private
Function : AnnotationDataLoaded(data)
Arguments:
            1)data:INI data retreived from ini servlet

Description:
This function is called when data gets retrieved from ini servlet. This function is used to parse ini data.

@author        19/05/2014    Pooja Kamra
#@e
 */
AnnotationHolder.prototype.AnnotationDataLoaded = function (data, pageNo) {
	this.annotationList=[];
	this.imageStampList=[];
     this.annotationList = this.ParseINIdataToAnnotations(data);
	for(var i=0;i<this.annotationList.length;i++)
	{
		if(this.annotationList[i].type=="IMGSTAMP")
		this.imageStampList.push(this.annotationList[i]);
	}
	 // if(this.imageStampList.length>0  && this.viewer.PdfManager.stampPDFDocument)
	 // this.DrawImageStamps(this.imageStampList);
    if(this.imageStampList.length>0){
        OPALL.VIEWER.getData(pageNo, 2, callback);
       
       // this.viewer.PdfManager.getStampDocument();
       // this.LoadImageStamps(this.imageStampList);
    }
   
    //   this.ShowAnnotation();
       
   
     // var bGroupExist=false;
    // if (this.groupList.length == 0)
        // this.SetDefaultGroupAndUser(this.viewer.CurrentUserName);
    // else
    	// {
    	// for(var i=0;i< this.groupList.length;i++)
    		// {
    		// if(this.viewer.CurrentUserName.toLowerCase()==this.groupList[i].name.toLowerCase())
    			// {
    			// this.currentGroupName=this.viewer.CurrentUserName;
				// this.userID=this.viewer.CurrentUserName;
    		// bGroupExist=true;
    		// break;
    			// }
    		// }
    	// if(bGroupExist==false){	
			// if(this.viewer.CurrentUserName==""){
				// this.currentGroupName=this.groupList[0].name;
			// }
			// else{
				// this.createAnnotationGroup(this.viewer.CurrentUserName);
				// this.defaultGroupName = this.viewer.CurrentUserName;
				// this.userID = this.viewer.CurrentUserName;
				// this.currentGroupName = this.defaultGroupName;   
				// //this.SetDefaultGroupAndUser(this.viewer.CurrentUserName);
			// }
			
    	// }    
	//}
	
	// // if (this.annotationList.length == 0)
		// // this.waitforannotation = true;
		
   
	
	// if (this.viewer.annotationDisplay == true) {		//Amber Beriwal on 16/02/2015 [Bug: 7072(OD-Bugzilla)]
		  // if(this.annotationList.length > 0)
		  // {
				// for(var i = 0 ; i < this.annotationList.length ; i++)
				// {
					// if(this.annotationList[i].rights == "VM")
					// {
						// // $( "#edit" ).removeClass("ui-state-disabled");
						// // $("#edit").css( "pointer-events", "auto" );
						// break;
					// }
				// }
		 // }
	// }

};

/*
#@c
Class    : AnnotationHolder
Access   : Private
Function : DrawAnnotation(annotationList,canvas,angle,zoom)
Arguments: 
            1)annotationList: List of all the annotation which needs to be drawn
            2)canvas: Canvas at which annnotation to be drawn
            3)zoom: zoom factor at which annotation to be displayed

Description:
This function is used to draw the specified annotations on given canvas at specified zoom level.

@author        19/05/2014    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.DrawAnnotation= function (ctx) {

  var l = this.annotationList.length;
        for (var i = 0; i < l; i++) {
            var annotationObj = this.annotationList[i];
            // We can skip the drawing of elements that have moved off the screen:
            if (annotationObj.x > this.canvas.width || annotationObj.y > this.canvas.height ||
          annotationObj.x + annotationObj.w < 0 || annotationObj.y + annotationObj.h < 0) continue;
            annotationObj.draw(ctx);
        }
 

};

/*
#@c
Class    : AnnotationHolder
Access   : Private
Function : ShowAnnotation()
Arguments: None

Description:
This function is used to display annotaion.

@author        19/05/2014    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.ShowAnnotation = function () {
    var zoomFactor = this.viewer.ZoomFactor;
    var previousZoomFactor = this.viewer.previousZoomFactor;
    if(this.firstAnnotationLoad  == true){
        previousZoomFactor = zoomFactor =  this.viewer.ImageInfo.Xdpi/this.viewer.ScreenDPI;
    }
    
    
    this.annotationList = this.SetAnnotationZoom(this.annotationList, zoomFactor, previousZoomFactor, zoomFactor, previousZoomFactor);
    this.annotationList = this.SetAnnotationAngle(this.annotationList, this.viewer.Angle);
    if(this.firstAnnotationLoad  == true){
      this.viewer.previousZoomFactor = this.viewer.ImageInfo.Xdpi/this.viewer.ScreenDPI;
      this.firstAnnotationLoad = false;
    }
    else{
      this.viewer.previousZoomFactor = this.viewer.ZoomFactor;
    }
    this.valid = false;

};

/*
#@c
Class    : AnnotationHolder
Access   : Private
Function : SetAnnotationAngle(annotationList,angle)
Arguments:
            1)annotationList: Annotation list which is to be drawn
            2)angle         : Angle at which annotation to be drawn

Description:
This function is used to set the angle of annotations.

@author        19/05/2014    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.SetAnnotationAngle = function (annotationList,angle) {
    return annotationList;

};

/*
#@c
Class    : AnnotationHolder
Access   : Private
Function : SetAnnotationZoom(annotationList, xCurrentZoomFactor, xPreviousZoomFactor, yCurrentZoomFactor, yPreviousZoomFactor)
Arguments:
            1)annotationList     : list of annotations
            2)xCurrentZoomFactor : Current zoom factor in x direction
            3)xPreviousZoomFactor: Previous zoom factor in x direction
            4)yCurrentZoomFactor : Current zoom factor in y direction
            5)yPreviousZoomFactor: Previous Zoom factor in y direction

Description:
This function is used to set zoom factor of annotation

@author        19/05/2014    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.SetAnnotationZoom = function (annotationList, xCurrentZoomFactor, xPreviousZoomFactor, yCurrentZoomFactor, yPreviousZoomFactor) {

    this.RestoreDefaultProp();
    for (var i = 0; i < annotationList.length; i++) {
        annotationList[i].Resize(xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor);
    }
    return annotationList;
};

AnnotationHolder.prototype.WriteGroupData = function (name) {
    var data = "";
	var totalAnnotationsInGroup = 0;
    var no_Of_Lines_Written = 0;
    var no_Of_Rectangles_Written = 0;
    var no_Of_Ellipses_Written = 0;
    var no_Of_HighLights_Written = 0;
    var no_Of_WipeOuts_Written = 0;
    var no_Of_Freetexts_Written = 0;
    var no_Of_StickyNotes_Written = 0;    
    var no_Of_Notes_Written = 0;
    var no_Of_Freehands_Written = 0;
    var no_Of_Hyperlinks_Written = 0;
    var no_Of_Stamps_Written = 0;
    for (var k = 0; k < this.annotationList.length; k++) {
        if ((this.annotationList[k].type != "EZONE") && (this.annotationList[k].groupid.toLowerCase() == name.toLowerCase())) {
            var type = this.annotationList[k].type;
			totalAnnotationsInGroup++;
            switch (type) {
                case "LNE":
                case "DLNE":
                case "LALNE":
                case "DALNE":	
                case "TALNE":
                    no_Of_Lines_Written++;
                    break;
                case "HLT":
                    no_Of_HighLights_Written++;
                    break;
                case "BOX":
                case "FRECT":
                    no_Of_Rectangles_Written++;
                    break;
                case "FRH":
                    no_Of_Freehands_Written++;
                    break;
                case "ELLI":
                case "FELLI":
                    no_Of_Ellipses_Written++;
                    break;
                case "WIPOUT":
                    no_Of_WipeOuts_Written++;
                    break;
                case "TXTSTAMP":
                case "IMGSTAMP":
                    no_Of_Stamps_Written++;
                    break;

                case "STICKYNOTE":
                    no_Of_StickyNotes_Written++;
                    break;

                case "ATTACHNOTE":
                    no_Of_Notes_Written++;
                    break;
				 case "FREETXT":
                    no_Of_Freetexts_Written++;
                    break;
            }
        }
    }
	if (totalAnnotationsInGroup != 0)
        data = data + "TotalAnnotations=" + totalAnnotationsInGroup + "\n";
    if (no_Of_Freehands_Written != 0)                                     // no of freehand annotation
        data = data + "NoOfFreehand=" + no_Of_Freehands_Written + "\n";

    if (no_Of_HighLights_Written != 0)                             // no of highlight annotation
        data = data + "NoOfHighLight=" + no_Of_HighLights_Written + "\n";

    if (no_Of_Lines_Written != 0)                                  // no of line annotation
        data = data + "NoOfLine=" + no_Of_Lines_Written + "\n";

    if (no_Of_Rectangles_Written != 0)                             // no of rectangle annotation
        data = data + "NoOfRectangle=" + no_Of_Rectangles_Written + "\n";

    if (no_Of_Ellipses_Written != 0)                             // no of rectangle annotation
        data = data + "NoOfEllipse=" + no_Of_Ellipses_Written + "\n";

    if (no_Of_WipeOuts_Written != 0)                             // no of rectangle annotation
        data = data + "NoOfWipeOut=" + no_Of_WipeOuts_Written + "\n";

    if (no_Of_Stamps_Written != 0)                             // no of rectangle annotation
        data = data + "NoOfStamp=" + no_Of_Stamps_Written + "\n";

    if (no_Of_Freetexts_Written != 0)                             // no of rectangle annotation
        data = data + "NoOfFreetext=" + no_Of_Freetexts_Written + "\n";

    if (no_Of_StickyNotes_Written != 0)                             // no of rectangle annotation
        data = data + "NoOfSNote=" + no_Of_StickyNotes_Written + "\n";

    if (no_Of_Notes_Written != 0)                             // no of rectangle annotation
        data = data + "NoOfNote=" + no_Of_Notes_Written + "\n";

    return data;
};
            
/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : WriteGroupAnnotation(name)
Arguments: 
			name: Name of annotation group

Description:
This function is used to get the annotation data specific to given group

@author        22/04/2014    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.WriteGroupAnnotation = function (name) {
    var line_objects = [];                  // list for holding line annotation objects
    var highlight_objects = [];            // list for holding highlightannotation objects
    var rectangle_objects = [];            // list for holding rectangle annotation objects
    var wipeout_objects = [];            // list for holding rectangle annotation objects
    var freehand_objects = [];              // list for holding freehand annotation objects
    var ellipse_objects = [];              // list for holding freehand annotation objects
    var stamp_objects = [];
    var freetext_objects = [];
    var stickyNote_objects = [];
    var attachNote_objects = [];
	var hyperlink_objects = [];
    var get_info;
    var data = [];
        for (var i = 0; i < this.annotationList.length; i++) {
        if ((this.annotationList[i].type != "EZONE") && (this.annotationList[i].groupid.toLowerCase() == name.toLowerCase()))
            if (this.annotationList[i].type == "LNE")           // if annnotation is of type "line"
            {
                get_info = this.annotationList[i].save();      // get the values of required properties
                line_objects.push(get_info);                       // add object to list

            }
            else if (this.annotationList[i].type == "HLT")    // if annnotation is of type "highlight"
            {
                get_info = this.annotationList[i].save();      // get the values of required properties
                highlight_objects.push(get_info);               // add object to list

            }
            else if (this.annotationList[i].type == "BOX")      // if annnotation is of type "box"
            {
                get_info = this.annotationList[i].save();      // get the values of required properties
                rectangle_objects.push(get_info);               // add object to list

            }
            else if (this.annotationList[i].type == "FRH")      // if annnotation is of type "freehand"
            {

                get_info = this.annotationList[i].save();       // get the values of required properties
                freehand_objects.push(get_info);                   // add object to list
            }
            else if (this.annotationList[i].type == "DLNE")           // if annnotation is of type "line"
            {
                get_info = this.annotationList[i].save();      // get the values of required properties
                line_objects.push(get_info);                       // add object to list

            }
            else if (this.annotationList[i].type == "LALNE")           // if annnotation is of type "line"
            {
                get_info = this.annotationList[i].save();      // get the values of required properties
                line_objects.push(get_info);                       // add object to list

            }
            else if (this.annotationList[i].type == "TALNE")           // if annnotation is of type "line"
            {
                get_info = this.annotationList[i].save();      // get the values of required properties
                line_objects.push(get_info);                       // add object to list

            }
            else if (this.annotationList[i].type == "DALNE")           // if annnotation is of type "line"
            {
                get_info = this.annotationList[i].save();      // get the values of required properties
                line_objects.push(get_info);                        // add object to list

            }
            else if (this.annotationList[i].type == "FRECT")           // if annnotation is of type "line"
            {
                get_info = this.annotationList[i].save();      // get the values of required properties
                rectangle_objects.push(get_info);                        // add object to list

            }
            else if (this.annotationList[i].type == "ELLI")           // if annnotation is of type "line"
            {
                get_info = this.annotationList[i].save();      // get the values of required properties
                ellipse_objects.push(get_info);                        // add object to list

            }
            else if (this.annotationList[i].type == "FELLI")           // if annnotation is of type "line"
            {
                get_info = this.annotationList[i].save();      // get the values of required properties
                ellipse_objects.push(get_info);                        // add object to list

            }

            else if (this.annotationList[i].type == "WIPOUT")           // if annnotation is of type "line"
            {
                get_info = this.annotationList[i].save();      // get the values of required properties
                wipeout_objects.push(get_info);                        // add object to list

            }
            else if (this.annotationList[i].type == "TXTSTAMP")           // if annnotation is of type "line"
            {
                get_info = this.annotationList[i].save();      // get the values of required properties
                stamp_objects.push(get_info);                        // add object to list
            }
            else if (this.annotationList[i].type == "IMGSTAMP")           // if annnotation is of type "line"
            {
                get_info = this.annotationList[i].save();      // get the values of required properties
                stamp_objects.push(get_info);                        // add object to list
            }
            else if (this.annotationList[i].type == "FREETXT")           // if annnotation is of type "line"
            {
                get_info = this.annotationList[i].save();      // get the values of required properties
                freetext_objects.push(get_info);                        // add object to list
            }
            else if (this.annotationList[i].type == "STICKYNOTE")           // if annnotation is of type "line"
            {
                get_info = this.annotationList[i].save();      // get the values of required properties
                stickyNote_objects.push(get_info);                        // add object to list
            }
            else if (this.annotationList[i].type == "ATTACHNOTE")           // if annnotation is of type "line"
            {
                get_info = this.annotationList[i].save();      // get the values of required properties
                attachNote_objects.push(get_info);                        // add object to list
            }
			else if (this.annotationList[i].type == "HLINK")           // if annnotation is of type "line"
            {
                get_info = this.annotationList[i].save();      // get the values of required properties
                hyperlink_objects.push(get_info);                        // add object to list
            }
        }                

            for (var y = 1; y <= rectangle_objects.length; y++)                // add information of all rectangle objects
            {
                data = data + "[" + name + "Rectangle" + y + "]" + "\n";
                data = data + rectangle_objects[y - 1];
            }
            for (var y = 1; y <= line_objects.length; y++) {
                data = data + "[" + name + "Line" + y + "]" + "\n";              // add information of all line objects
                data = data + line_objects[y - 1];
            }
            for (var y = 1; y <= freehand_objects.length; y++)                  // add information of all freehand objects
            {
                data = data + "[" + name + "Freehand" + y + "]" + "\n";
                data = data + freehand_objects[y - 1];
            }
            for (var y = 1; y <= highlight_objects.length; y++)                 // add information of all highlight objects
            {
                data = data + "[" + name + "Highlight" + y + "]" + "\n";
                data = data + highlight_objects[y - 1];
            }
            for (var y = 1; y <= ellipse_objects.length; y++)                 // add information of all highlight objects
            {
                data = data + "[" + name + "Ellipse" + y + "]" + "\n";
                data = data + ellipse_objects[y - 1];
            }
            for (var y = 1; y <= wipeout_objects.length; y++)                 // add information of all highlight objects
            {
                data = data + "[" + name + "WipeOut" + y + "]" + "\n";
                data = data + wipeout_objects[y - 1];
            }
            for (var y = 1; y <= stamp_objects.length; y++)                 // add information of all highlight objects
            {
                data = data + "[" + name + "Stamp" + y + "]" + "\n";
                data = data + stamp_objects[y - 1];
            }
            for (var y = 1; y <= freetext_objects.length; y++)                 // add information of all highlight objects
            {
                data = data + "[" + name + "FreeText" + y + "]" + "\n";
                data = data + freetext_objects[y - 1];
            }
            for (var y = 1; y <= stickyNote_objects.length; y++)                 // add information of all highlight objects
            {
                data = data + "[" + name + "StickyNote" + y + "]" + "\n";
                data = data + stickyNote_objects[y - 1];
            }
            for (var y = 1; y <= attachNote_objects.length; y++)                 // add information of all highlight objects
            {
                data = data + "[" + name + "Note" + y + "]" + "\n";
                data = data + attachNote_objects[y - 1];
            }
			for (var y = 1; y <= hyperlink_objects.length; y++)                 // add information of all highlight objects
            {
                data = data + "[" + name + "Hyperlink" + y + "]" + "\n";
                data = data + hyperlink_objects[y - 1];
            }
    return data;
};            
/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : saveAnnotation()
Arguments: None

Description:
This function is used to save the displayed annotation

@author        22/04/2014    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.saveAnnotation = function () {
    this.RestoreDefaultProp();
    if (this.change === true) {
        var length = this.groupList.length;
        var data = "[AnnotationGroupHeader]" + "\n";
        var totalgroups = 0;
        if (this.annotationList.length != 0) {
            for (var x = 1; x <= this.groupList.length; x++) {
                var Name = this.groupList[x - 1].name;
                for (var k = 0; k < this.annotationList.length; k++) {
                    if ((this.annotationList[k].type != "EZONE") && (this.annotationList[k].groupid.toLowerCase() == Name.toLowerCase())) {
                        totalgroups++;
                        break;
        }
                }
                if (totalgroups == x - 1) {
                    this.groupList.splice(x - 1, 1);
                    x = x - 1;
                }
            }
        }
        this.SetTotalGroups(totalgroups);
        data = data + "TotalGroups=" + totalgroups + "\n";
        if (this.annotationList.length != 0) {
            for (var x = 1; x <= this.groupList.length; x++) {
                var groupName = this.groupList[x - 1].name;
                var annotdata = this.WriteGroupData(groupName);
                if (annotdata != "") {
                    data = data + "[Group" + x + "]" + "\n";                        // group information
                    data = data + "Name=" + this.groupList[x - 1].name + "\n";
                    data = data + "LoginUserRights=" + this.groupList[x - 1].rights + "\n";
                    data = data + "AnnotationGroupIndex=" + 0 + "\n";
                    data = data + "[" + this.groupList[x - 1].name + "AnnotationHeader]" + "\n";
                    data += annotdata;
                    annotdata = this.WriteGroupAnnotation(groupName);
                    data += annotdata;
                }
                else {
                    this.groupList.splice(key, 1);
                    this.currentGroupName = this.defaultGroupName;
                    this.SetTotalGroups(this.groupList.length);
                }
            }
        }
        data = data.trim();
        this.WriteDataToFile(this.viewer.url_WriteAnnotation, data);        
        this.change = false;
    }
    else {
        //alert("not changed ");
        alert(OPALL_ERR_MESSAGE.AnnotationErrorMsg);
    }
};

/*
#@c
Class    : AnnotationHolder
Access   : Private
Function : WriteDataToFile(URL, INIData, strINIfile)
Arguments:
            1)URL: URL of servlet in which annotation list to be saved
            2)INIData:Data which to be saved in ini file         
            3)strINIfile:Path of ini file

Description:
This function is used to write the ini data in the specified ini file.

@author        22/04/2014    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.WriteDataToFile = function (URL, INIData) {
    
    var iniPath = this.viewer.getRequestedPageURL(this.viewer.CurrentPage, URL);    
    var INIReader = new XMLHttpRequest();
    INIReader.open("POST", iniPath, true);    
    INIReader.setRequestHeader("Content-type", "application/x-www-form-urlencoded");    
    INIReader.onreadystatechange = function () {//Call a function when the state changes.
        if (INIReader.readyState == 4 && INIReader.status == 200) {
            //alert("Annotation Saved");
            alert(OPALL_MESSAGE.SaveAnnotationMsg);
        }
    };
    INIReader.send(INIData);
};
/*
#@c
Class    : AnnotationHolder
Access   : Private
Function : rotateShape(shape, ang)
Arguments:
            1)shape:2 D arry to define shape of leading/trailing arrow
            2)ang: angle at which arrow need to draw

Description:
This function is used to draw arrow in arrow annotation.

@author        18/12/2013    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.rotateShape=function(shape, ang) {
    var rv = [];
    for (p in shape)
        rv.push(this.rotatePoint(ang, shape[p][0], shape[p][1]));
    return rv;
};

/*
#@c
Class    : AnnotationHolder
Access   : Private
Function : rotatePoint(ang, x, y)
Arguments:
            1)ang: angle at which arrow need to draw
            2)x: Arrow tip coordinate
            3)y: Arrow tip coordinate

Description:
This function is used to draw arrow in arrow annotation.

@author        18/12/2013    Pooja Kamra
#@e
*/
//function related to draw arrow in arrow annotation
AnnotationHolder.prototype.rotatePoint=function(ang, x, y) {
    return [
			(x * Math.cos(ang)) - (y * Math.sin(ang)),
			(x * Math.sin(ang)) + (y * Math.cos(ang))
		];
};


/*
#@c
Class    : AnnotationHolder
Access   : Private
Function : translateShape(ang, x, y)
Arguments:
        1)shape: angle at which arrow need to draw
        2)x: Arrow tip coordinate
        3)y: Arrow tip coordinate

Description:
This function is used to draw arrow in arrow annotation.

@author        18/12/2013    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.translateShape=function(shape, x, y) {
    var rv = [];
    for (p in shape)
        rv.push([shape[p][0] + x, shape[p][1] + y]);
    return rv;
};




/*
#@c
Class    : AnnotationHolder
Access   : Private
Function : drawFilledPolygon(ctx, shape, thickness, fill)
Arguments:
        1)ctx       : context of annotation canvas
        2)shape     : 2 D arry to define shape of leading/trailing arrow
        3)thickness : thickness of Arrow
        4)fill      : fill color of arrow

Description:
This function is used to draw arrow in arrow annotation.

@author        18/12/2013    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.drawFilledPolygon=function(ctx, shape, thickness, fill) {
    ctx.beginPath();
    ctx.strokeStyle = fill;
    ctx.moveTo(shape[0][0], shape[0][1]);
    for (p in shape)
        if (p > 0) ctx.lineTo(shape[p][0], shape[p][1]);
    ctx.lineWidth = thickness;
    ctx.stroke();
};



/*
#@c
Class    : AnnotationHolder
Access   : Private
Function : ConvertToDecimal(value)
Arguments:
        1)value       : hex value with "#" prefix
        2)shape     : 2 D arry to define shape of leading/trailing arrow
        3)thickness : thickness of Arrow
        4)fill      : fill color of arrow

Description:
This function is used to convert specified value in decimal format

@author        18/12/2013    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.ConvertToDecimal=function(value) {
    value = value.slice(-6);
    value = value.slice(-2) + value.slice(2,4) + value.slice(0,2);
    var rval = parseInt(value, 16);
    return rval;
};


/*
#@c
Class    : AnnotationHolder
Access   : Private
Function : ConvertToHexadecimal(value)
Arguments:
            1) value: decimal value

Description:
This function is used to convert given value in hexadecimal value.

@author        18/12/2013    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.ConvertToHexadecimal=function(value) {
    var hexVal = "000000" + Number(value).toString(16);
    return hexVal.slice(-6);
};


/*
#@c
Class    : AnnotationHolder
Access   : Private
Function : ParseStampINIdataToAnnotations(data)
Arguments:
            1)data: Data retreived from stamp ini file.

Description:
This method is used to read annoation information from stamp ini file and load stamp annotations to the image.

@author        01/03/2014    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.ParseStampINIdataToAnnotations = function (data) {
    var txtstamp_objects = [];
    var imgStamp_objects = [];
    var textStampCount = 0;
    var imgStampCount = 0;
	var servletURL= '' ;//this.viewer.stampServletURL.trim();	
    var stampObjects = this.ParseINIdata(data);
    for (var icount = 0; icount < Object.keys(stampObjects).length; icount++) {
        var key = Object.keys(stampObjects)[icount];
        if (key.match(/BmpStamp/gi) != null) {
            var imgstamp_obj = new ImageStampObj();
            imgstamp_obj.id = imgStampCount + 1;
            imgstamp_obj.filename = servletURL + stampObjects[key].FileName;
            imgstamp_obj.title = stampObjects[key].Title;
            imgStamp_objects[imgStampCount] = imgstamp_obj;
            imgStampCount++;
        }
        else if (key.match(/TextStamp/gi) != null) {
            var textstamp_object = new TextStampObj();
            textstamp_object.id = textStampCount + 1;
            textstamp_object.title = stampObjects[key].Title;
            textstamp_object.text = stampObjects[key].Text;
            textstamp_object.fontName = stampObjects[key].FontName;
            textstamp_object.fontSize = parseInt(stampObjects[key].Size);
            textstamp_object.color = stampObjects[key].Color;
            textstamp_object.bold = parseInt(stampObjects[key].Bold);
            textstamp_object.italic =parseInt(stampObjects[key].Italic);
            textstamp_object.underline =parseInt(stampObjects[key].Underline);
            textstamp_object.strikeOut =parseInt(stampObjects[key].StrikeOut);
            txtstamp_objects[textStampCount] = textstamp_object;
            textStampCount++;

        }
    }
    this.textStampSelectionList = txtstamp_objects;
    this.imgStampSelectionList = imgStamp_objects;
    this.stampImageObjectList.length = this.imgStampSelectionList.length;//set length of stamp image object list.
};

/*
#@c
Class    : AnnotationHolder
Access   : Private
Function : ParseINIdata(data)
Arguments:
1)data: Data retreived from stamp ini file.
Return: Annotation objects

Description:
This method is used to read annoation information from stamp ini file and return annotation objects.

@author        12/06/2014    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.ParseINIdata = function (data) {
    var regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };
    var value = {};
    var lines = data.split(/\r\n|\r|\n/);
    var section = null;

    for (var x = 0; x < lines.length; x++) {

        if (regex.comment.test(lines[x])) {
            return;
        } else if (regex.param.test(lines[x])) {
            var match = lines[x].match(regex.param);
            if (section) {
                value[section][match[1]] = match[2];
            } else {
                value[match[1]] = match[2];
            }
        } else if (regex.section.test(lines[x])) {
            var match = lines[x].match(regex.section);
            value[match[1]] = {};
            section = match[1];
        } else if (lines.length == 0 && section) {
            section = null;
        };
    }
    return value;
};



/*
#@c
Class    : AnnotationHolder
Access   : Private
Function : ParseINIdataToAnnotations(data)
Arguments:
        data: Data retreived from annotation ini file.

Description:
This method is used to read annoation information from annotation ini file and load annotations to the image.

@author        01/03/2014    Pooja Kamra
#@e
*/

AnnotationHolder.prototype.compare = function compare(a,b) {
  var timeArray1=a.timeorder.split(",");
  var timeArray2 = b.timeorder.split(",");
  var date1 = new Date(parseInt(timeArray1[0]),parseInt(timeArray1[1]),parseInt(timeArray1[2]),parseInt(timeArray1[3]),parseInt(timeArray1[4]),parseInt(timeArray1[5]),0); 
  var date2 = new Date(parseInt(timeArray2[0]),parseInt(timeArray2[1]),parseInt(timeArray2[2]),parseInt(timeArray2[3]),parseInt(timeArray2[4]),parseInt(timeArray2[5]),0);   
  var time1 = date1.getTime();
  var time2 = date2.getTime();
  if(time1>time2)
     return 1;
  else if(time1<time2)
     return -1;
  return 0;
}

AnnotationHolder.prototype.ParseINIdataToAnnotations = function (data, isPrint) {
    var annotationList = [];
    if(!isPrint)
    this.groupList = [];
    var annotationObjects = this.ParseINIdata(data);
    for (var icount = 0; icount < Object.keys(annotationObjects).length; icount++) {
    	var annotation_obj = null;
        var key = Object.keys(annotationObjects)[icount];
        var thickness = 1;
        if (key.match(/AnnotationGroupHeader/gi) != null) {
            var totalGroups = annotationObjects[key].TotalGroups;
            if(!isPrint){
            for (var i = 0; i < totalGroups; i++) {
                var group = "Group" + (i + 1);
                var groupObj = new Group(i, "");
                groupObj.name = annotationObjects[group].Name;
                groupObj.rights = annotationObjects[group].LoginUserRights;
                groupObj.index = annotationObjects[group].AnnotationGroupIndex;
                this.groupList[i] = groupObj;
            }
            this.SetTotalGroups(this.groupList.length);
        }
        }

        if (key.match(/Line/gi) != null) {
            var baseProperties = this.GetAnnotBaseProperties(annotationObjects[key]);
            thickness = annotationObjects[key].Thickness;
            var style = parseInt(annotationObjects[key].Style);
            var annotType = "";
            switch (style) {
                case 0:
                    annotType = "LNE";
                    break;
                case 1:
                    annotType = "DLNE";
                    break;
                case 2:
                    annotType = "LALNE";
                    break;
                case 3:
                    annotType = "TALNE";
                    break;
                case 4:
                    annotType = "DALNE";
                    break;
            }
            annotation_obj = GetAnnotationObject(this.viewer, annotType, baseProperties.x1, baseProperties.y1, baseProperties.x2, baseProperties.y2, this.GetAnnotationColor(baseProperties.color),
             thickness, baseProperties.rights, baseProperties.userid, baseProperties.groupid, 0, baseProperties.timeorder);  // get appropriate annotation object

            // set required properties of annotation object
            annotation_obj.endX = baseProperties.x2;
            annotation_obj.endY = baseProperties.y2;
            annotation_obj.diffX = baseProperties.x2 - baseProperties.x1;
            annotation_obj.diffY = baseProperties.y2 - baseProperties.y1;
        }
        else if (key.match(/Highlight/gi) != null) {
            var baseProperties = this.GetAnnotBaseProperties(annotationObjects[key]);
            annotation_obj = GetAnnotationObject(this.viewer, "HLT", baseProperties.x1, baseProperties.y1, baseProperties.x2 - baseProperties.x1, baseProperties.y2 - baseProperties.y1, this.GetAnnotationColor(baseProperties.color),
            thickness, baseProperties.rights, baseProperties.userid, baseProperties.groupid, 0,baseProperties.timeorder);  // get appropriate annotation object            
        }
        else if (key.match(/Rectangle/gi) != null) {
            var baseProperties = this.GetAnnotBaseProperties(annotationObjects[key]);
            thickness = parseInt(annotationObjects[key].Thickness);                 // Thickness
            var fillcolor = parseInt(annotationObjects[key].FillColor);           // Fillcolor of rectangle
            if (fillcolor == 4294967295) {
                annotType = "BOX";
            }
            else {
                annotType = "FRECT";
            }
             annotation_obj = GetAnnotationObject(this.viewer, annotType, baseProperties.x1, baseProperties.y1, baseProperties.x2 - baseProperties.x1, baseProperties.y2 - baseProperties.y1, this.GetAnnotationColor(baseProperties.color),
                thickness, baseProperties.rights, baseProperties.userid, baseProperties.groupid, this.GetAnnotationColor(fillcolor), baseProperties.timeorder);  // get appropriate annotation object                
        }
        else if (key.match(/Ellipse/gi) != null) {
            var baseProperties = this.GetAnnotBaseProperties(annotationObjects[key]);
            thickness = parseInt(annotationObjects[key].Thickness);                 // Thickness            
            var fillcolor = parseInt(annotationObjects[key].FillColor);
            if (fillcolor == 4294967295) {
                annotType = "ELLI";
            }
            else {
                annotType = "FELLI";
            }
            annotation_obj = GetAnnotationObject(this.viewer, annotType, baseProperties.x1, baseProperties.y1, baseProperties.x2 - baseProperties.x1, baseProperties.y2 - baseProperties.y1, this.GetAnnotationColor(baseProperties.color),
                thickness, baseProperties.rights, baseProperties.userid, baseProperties.groupid, this.GetAnnotationColor(fillcolor), baseProperties.timeorder);  // get appropriate annotation object                
        }
        else if (key.match(/WipeOut/gi) != null) {
            var baseProperties = this.GetAnnotBaseProperties(annotationObjects[key]);
            thickness = parseInt(annotationObjects[key].Thickness);                 // Thickness            
            var fillcolor = parseInt(annotationObjects[key].FillColor);
             annotation_obj = GetAnnotationObject(this.viewer, "WIPOUT", baseProperties.x1, baseProperties.y1, baseProperties.x2 - baseProperties.x1, baseProperties.y2 - baseProperties.y1, this.GetAnnotationColor(baseProperties.color),
            thickness, baseProperties.rights, baseProperties.userid, baseProperties.groupid, this.GetAnnotationColor(fillcolor), baseProperties.timeorder);  // get appropriate annotation object                       
        }
        else if (key.match(/Stamp/gi) != null) {
            var baseProperties = this.GetAnnotBaseProperties(annotationObjects[key]);
            var style = parseInt(annotationObjects[key].Type);
            if (style == 0) {
                var PageNo = parseInt(annotationObjects[key].FileName);               // page number of stamp image
            }
            else {
                var text = annotationObjects[key].Text;           // width of font
               // var height =parseInt(Math.abs(parseInt(annotationObjects[key].Height) * this.viewer.ZoomFactor)); // width of font
                var height =parseInt(Math.abs(parseInt(annotationObjects[key].Height))); // width of font
                var width = parseInt(annotationObjects[key].Width);           // width of font
                var escapement = parseInt(annotationObjects[key].Escapement);            // width of font
                var orientation = parseInt(annotationObjects[key].Orientation)// width of font
                var weight = parseInt(annotationObjects[key].Weight);           // width of font
                var italic = parseInt(annotationObjects[key].Italic);           // width of font
                var underline = parseInt(annotationObjects[key].Underlined);           // width of font
                var StrikeOut = parseInt(annotationObjects[key].StrikeOut);           // width of font
                var charSet = parseInt(annotationObjects[key].CharSet);           // width of font
                var outPrecision = parseInt(annotationObjects[key].OutPrecision);           // width of font
                var clipPrecision = parseInt(annotationObjects[key].ClipPrecision);           // width of font
                var quality = parseInt(annotationObjects[key].Quality);           // width of font
                var pitchAndFamily = parseInt(annotationObjects[key].PitchAndFamily);           // width of font
                var fontName = annotationObjects[key].FontName;           // width of font
                var textWidth = parseInt(annotationObjects[key].TextWidth);           // width of font
            }
            if (style == 1) {
                annotation_obj = GetAnnotationObject(this.viewer, "TXTSTAMP", baseProperties.x1, baseProperties.y1, baseProperties.x2 - baseProperties.x1, baseProperties.y2 - baseProperties.y1, this.GetAnnotationColor(baseProperties.color),
                thickness, baseProperties.rights, baseProperties.userid, baseProperties.groupid, 0, baseProperties.timeorder);  // get appropriate annotation object
                annotation_obj.text = text;
                annotation_obj.fontName = fontName;
                annotation_obj.fontSize = height;
                if (weight == 700)
                    annotation_obj.bold = 1;
                else
                    annotation_obj.bold = 0;
                if (italic == 255)
                    annotation_obj.italic = 1;
                else
                    annotation_obj.italic = 0;
                annotation_obj.underline = underline;
                annotation_obj.strikeOut = StrikeOut;
                annotation_obj.style = style;
                annotation_obj.firstDraw = false;
            }
            else {
                annotation_obj = GetAnnotationObject(this.viewer, "IMGSTAMP", baseProperties.x1, baseProperties.y1, baseProperties.x2 - baseProperties.x1, baseProperties.y2 - baseProperties.y1, this.GetAnnotationColor(baseProperties.color),
                thickness, baseProperties.rights, baseProperties.userid, baseProperties.groupid, 0, baseProperties.timeorder);  // get appropriate annotation object
                annotation_obj.filename = PageNo;
				annotation_obj.StampFileSource="STREAM";
            }

        }
        else if (key.match(/Freehand/gi) != null) {
            var baseProperties = this.GetAnnotBaseProperties(annotationObjects[key]);
            var thickness = annotationObjects[key].Thickness;                 // Thickness
            var style = parseInt(annotationObjects[key].Style);           // Style 
            var noofpoints = annotationObjects[key].NoofPoints;                         // no of points recorded
            var xpos = annotationObjects[key].XPos;                                 // x coordinate of all points
            var ypos = annotationObjects[key].YPos;                                  // y coordinate of all points             
            annotation_obj = GetAnnotationObject(this.viewer, "FRH", baseProperties.x1, baseProperties.y1, baseProperties.x2 - baseProperties.x1, baseProperties.y2 - baseProperties.y1, this.GetAnnotationColor(baseProperties.color),
            thickness, baseProperties.rights, baseProperties.userid, baseProperties.groupid, 0,baseProperties.timeorder);  // get appropriate annotation object
            annotation_obj.noofpoints = parseInt(noofpoints);

            var xArray = xpos.split("-1");
            var yArray = ypos.split("-1");
            var valuesX = [];
            var valuesY = [];
            for (var i = 0; i < xArray.length; i++) {
                if (xArray[i].length > 0) {
                    valuesX = xArray[i].split(",");
                    valuesY = yArray[i].split(",");
                    if (valuesX[0] == "")
                        valuesX = valuesX.splice(1, valuesX.length);
                    if (valuesY[0] == "")
                        valuesY = valuesY.splice(1, valuesY.length);
                    valuesX = valuesX.splice(0, valuesX.length - 1);
                    valuesY = valuesY.splice(0, valuesY.length - 1);

                    valuesX = valuesX.map(Number);
                    valuesY = valuesY.map(Number);                    

                    for (var j = 0; j < valuesX.length; j++) {
                     valuesX[j] = valuesX[j] - annotationObjects[key].X1;
                        valuesY[j] = valuesY[j] - annotationObjects[key].Y1;
                    }
                    annotation_obj.listArrayX.push(valuesX);
                    annotation_obj.listArrayY.push(valuesY);
                    annotation_obj.listPointCount.push(valuesX.length);
                }
            }
            var diffMaxXtoStartX = 0;
            var diffMinXtoStartX = 0;
            var diffMaxYtoStartY = 0;
            var diffMinYtoStartY = 0;
            for (var i = 0; i < annotation_obj.listArrayX.length; i++) {
                for (var j = 0; j < annotation_obj.listArrayX[i].length; j++) {

                    if (annotation_obj.listArrayX[i][j] > diffMaxXtoStartX)
                        diffMaxXtoStartX = annotation_obj.listArrayX[i][j];
                    if (annotation_obj.listArrayX[i][j] < diffMinXtoStartX)
                        diffMinXtoStartX = annotation_obj.listArrayX[i][j];
                    if (annotation_obj.listArrayY[i][j] > diffMaxYtoStartY)
                        diffMaxYtoStartY = annotation_obj.listArrayY[i][j];
                    if (annotation_obj.listArrayY[i][j] < diffMinYtoStartY)
                        diffMinYtoStartY = annotation_obj.listArrayY[i][j];
                }
            }
            annotation_obj.maxX = annotation_obj.x + diffMaxXtoStartX;
            annotation_obj.maxY = annotation_obj.y + diffMaxYtoStartY;
            annotation_obj.minX = annotation_obj.x + diffMinXtoStartX;
            annotation_obj.minY = annotation_obj.y + diffMinYtoStartY;
            annotation_obj.diffMaxXtoStartX = diffMaxXtoStartX;
            annotation_obj.diffMaxYtoStartY = diffMaxYtoStartY;
            annotation_obj.diffMinXtoStartX = diffMinXtoStartX;
            annotation_obj.diffMinYtoStartY = diffMinYtoStartY;
            annotation_obj.firstDraw = true;
        }
        else if (key.match(/Freetext/gi) != null) {
            var baseProperties = this.GetAnnotBaseProperties(annotationObjects[key]);
            var LinesOfText = parseInt(annotationObjects[key].LinesOfText);
            var textLines = [];
            for (var lineCount = 0; lineCount < LinesOfText; lineCount++) {
                var linenumber = "Line" + (lineCount + 1);
                textLines[lineCount] = annotationObjects[key][linenumber]; //.line[lineCount];
            }
        //  var height = Math.ceil(Math.abs(annotationObjects[key].Height) * (this.viewer.ZoomFactor)); // height of font
            var height = Math.ceil(Math.abs(annotationObjects[key].Height)); // height of font
            var width = parseInt(annotationObjects[key].Width);           // width of font
            var escapement = parseInt(annotationObjects[key].Escapement);            // escapment of font
            var orientation = parseInt(annotationObjects[key].Orientation)// orientation of font
            var weight = parseInt(annotationObjects[key].Weight);           // weight of font
            var italic = parseInt(annotationObjects[key].Italic);           // font italic or not
            var underline = parseInt(annotationObjects[key].Underlined);           // underline characterstic of font
            var StrikeOut = parseInt(annotationObjects[key].StrikeOut);           // Strikethrough characterstic of font
            var charSet = parseInt(annotationObjects[key].CharSet);           // CharSet of font
            var outPrecision = parseInt(annotationObjects[key].OutPrecision);           // OutPrecision
            var clipPrecision = parseInt(annotationObjects[key].ClipPrecision);           // clipPrecision
            var quality = parseInt(annotationObjects[key].Quality);           // quality of font
            var pitchAndFamily = parseInt(annotationObjects[key].PitchAndFamily);           // pitchAndFamily
            var fontName = annotationObjects[key].FontName;           // fontname
            var fontColor = annotationObjects[key].FontColor;           // fontColor
            var textWidth = parseInt(annotationObjects[key].TextWidth);           // textWidth

            annotation_obj = GetAnnotationObject(this.viewer, "FREETXT", baseProperties.x1, baseProperties.y1, baseProperties.x2 - baseProperties.x1, baseProperties.y2 - baseProperties.y1, this.GetAnnotationColor(fontColor),
            thickness, baseProperties.rights, baseProperties.userid, baseProperties.groupid, 0, baseProperties.timeorder);  // get appropriate annotation object
            annotation_obj.lines = textLines;
            annotation_obj.fontName = fontName;
            annotation_obj.fontSize = height;
            if (weight == 700)
                annotation_obj.bold = 1;
            else
                annotation_obj.bold = 0;
            if (italic == 255)
                annotation_obj.italic = 1;
            else
                annotation_obj.italic = 0;
            annotation_obj.underline = underline;
            annotation_obj.strikeOut = StrikeOut;
            if (annotation_obj.italic == 1 && annotation_obj.bold == 1)
                annotation_obj.font_style = 3;
            else if (annotation_obj.italic == 1 && annotation_obj.bold == 0)
                annotation_obj.font_style = 2;
            else if (annotation_obj.italic == 0 && annotation_obj.bold == 1)
                annotation_obj.font_style = 1;
            else
                annotation_obj.font_style = 0;

        }
        else if (key.match(/StickyNote/gi) != null) {
            var baseProperties = this.GetAnnotBaseProperties(annotationObjects[key]);
            var LinesOfText = parseInt(annotationObjects[key].LinesOfText);
            var textLines = [];
            for (var lineCount = 0; lineCount < LinesOfText; lineCount++) {
                var linenumber = "Line" + (lineCount + 1);
                textLines[lineCount] = annotationObjects[key][linenumber]; //.line[lineCount];
            }
        //    var height = parseInt(Math.abs(annotationObjects[key].Height)  *(this.viewer.ZoomFactor)); // height of font
            var height = parseInt(Math.abs(annotationObjects[key].Height)); // height of font
            var width = parseInt(annotationObjects[key].Width);           // width of font
            var escapement = parseInt(annotationObjects[key].Escapement);            // escapment of font
            var orientation = parseInt(annotationObjects[key].Orientation)// orientation of font
            var weight = parseInt(annotationObjects[key].Weight);           // weight of font
            var italic = parseInt(annotationObjects[key].Italic);           // font italic or not
            var underline = parseInt(annotationObjects[key].Underlined);           // underline characterstic of font
            var StrikeOut = parseInt(annotationObjects[key].StrikeOut);           // Strikethrough characterstic of font
            var charSet = parseInt(annotationObjects[key].CharSet);           // CharSet of font
            var outPrecision = parseInt(annotationObjects[key].OutPrecision);           // OutPrecision
            var clipPrecision = parseInt(annotationObjects[key].ClipPrecision);           // clipPrecision
            var quality = parseInt(annotationObjects[key].Quality);           // quality of font
            var pitchAndFamily = parseInt(annotationObjects[key].PitchAndFamily);           // pitchAndFamily
            var fontName = annotationObjects[key].FontName;           // fontname
            var fontColor = annotationObjects[key].FontColor;           // fontColor            

            annotation_obj = GetAnnotationObject(this.viewer, "STICKYNOTE", baseProperties.x1, baseProperties.y1, baseProperties.x2 - baseProperties.x1, baseProperties.y2 - baseProperties.y1, this.GetAnnotationColor(fontColor),
            thickness, baseProperties.rights, baseProperties.userid, baseProperties.groupid, this.GetAnnotationColor(baseProperties.color), baseProperties.timeorder);  // get appropriate annotation object
            annotation_obj.lines = textLines;
            annotation_obj.fontName = fontName;
            annotation_obj.fontSize = height;
            if (weight == 700)
                annotation_obj.bold = 1;
            else
                annotation_obj.bold = 0;
            if (italic == 255)
                annotation_obj.italic = 1;
            else
                annotation_obj.italic = 0;
            annotation_obj.underline = underline;
            annotation_obj.strikeOut = StrikeOut;
            if (annotation_obj.italic == 1 && annotation_obj.bold == 1)
                annotation_obj.font_style = 3;
            else if (annotation_obj.italic == 1 && annotation_obj.bold == 0)
                annotation_obj.font_style = 2;
            else if (annotation_obj.italic == 0 && annotation_obj.bold == 1)
                annotation_obj.font_style = 1;
            else
                annotation_obj.font_style = 0;
        }
        else if (key.match(/Note/gi) != null) {
            var baseProperties = this.GetAnnotBaseProperties(annotationObjects[key]);
            var LinesOfText = parseInt(annotationObjects[key].LinesOfText);
            var textLines = [];
            for (var lineCount = 0; lineCount < LinesOfText; lineCount++) {
                var linenumber = "Line" + (lineCount + 1);
                textLines[lineCount] = annotationObjects[key][linenumber]; //.line[lineCount];
            }
            //5th and 6th parameters are not being used in "AttachNote"
            annotation_obj = GetAnnotationObject(this.viewer, "ATTACHNOTE", baseProperties.x1, baseProperties.y1, baseProperties.x2, baseProperties.y2, this.GetAnnotationColor(baseProperties.color),
            thickness, baseProperties.rights, baseProperties.userid, baseProperties.groupid, 0, baseProperties.timeorder);  // get appropriate annotation object
            annotation_obj.lines = textLines;

            for (var lineCount = 0; lineCount < LinesOfText; lineCount++) {
                var linenumber = "Line" + (lineCount + 1);
                annotation_obj.text += annotationObjects[key][linenumber] + "\n"; //.line[lineCount];
        }
        }
		else if (key.match(/Hyperlink/gi) != null) {
            var baseProperties = this.GetAnnotBaseProperties(annotationObjects[key]);
        //    var height = parseInt(Math.abs(annotationObjects[key].Height) * (this.viewer.ZoomFactor)); // height of font
            var height = parseInt(Math.abs(annotationObjects[key].Height)); // height of font
            var width = parseInt(annotationObjects[key].Width);           // width of font
            var hyperlinkName = annotationObjects[key].HyperlinkName;
			var hyperlinkURL  = annotationObjects[key].HyperlinkURL;
			var escapement = parseInt(annotationObjects[key].Escapement);            // escapment of font
            var orientation = parseInt(annotationObjects[key].Orientation)// orientation of font
            var weight = parseInt(annotationObjects[key].Weight);           // weight of font
            var italic = parseInt(annotationObjects[key].Italic);           // font italic or not
            var underline = parseInt(annotationObjects[key].Underlined);           // underline characterstic of font
            var StrikeOut = parseInt(annotationObjects[key].StrikeOut);           // Strikethrough characterstic of font
            var charSet = parseInt(annotationObjects[key].CharSet);           // CharSet of font
            var outPrecision = parseInt(annotationObjects[key].OutPrecision);           // OutPrecision
            var clipPrecision = parseInt(annotationObjects[key].ClipPrecision);           // clipPrecision
            var quality = parseInt(annotationObjects[key].Quality);           // quality of font
            var pitchAndFamily = parseInt(annotationObjects[key].PitchAndFamily);           // pitchAndFamily
            var fontName = annotationObjects[key].FontName;           // fontname
            var fontColor = annotationObjects[key].FontColor;           // fontColor
            var textWidth = parseInt(annotationObjects[key].TextWidth);           // textWidth

            annotation_obj = GetAnnotationObject(this.viewer, "HLINK", baseProperties.x1, baseProperties.y1, baseProperties.x2 - baseProperties.x1, baseProperties.y2 - baseProperties.y1, this.GetAnnotationColor(baseProperties.color),
            thickness, baseProperties.rights, baseProperties.userid, baseProperties.groupid, 0, baseProperties.timeorder);  // get appropriate annotation object
            annotation_obj.lines = textLines;
            annotation_obj.fontName = fontName;
            annotation_obj.fontSize = height;
			annotation_obj.displayText = hyperlinkName;
			annotation_obj.linkId      = hyperlinkURL;
			
            if (weight == 700)
                annotation_obj.bold = 1;
            else
                annotation_obj.bold = 0;
            if (italic == 255)
                annotation_obj.italic = 1;
            else
                annotation_obj.italic = 0;
            annotation_obj.underline = underline;
            annotation_obj.strikeOut = StrikeOut;
            if (annotation_obj.italic == 1 && annotation_obj.bold == 1)
                annotation_obj.font_style = 3;
            else if (annotation_obj.italic == 1 && annotation_obj.bold == 0)
                annotation_obj.font_style = 2;
            else if (annotation_obj.italic == 0 && annotation_obj.bold == 1)
                annotation_obj.font_style = 1;
            else
                annotation_obj.font_style = 0;

        }
		
		
        if (annotation_obj != null) {
            annotationList.push(annotation_obj);                           // add object to annotation holder and draw it by making valid = false
        }
    }
	annotationList.sort(this.compare);
    return annotationList;
};



/*
#@c
Class    : AnnotationHolder
Access   : Private
Function : GetAnnotBaseProperties(AnnotObj)
Arguments:
        AnnotObj: Object of an annotation.

Description:
This method is used to get base properties of specified annotation object

@author        12/06/2014    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.GetAnnotBaseProperties = function (AnnotObj) {
    var annotProp = new AnnotationBaseProperties();
    annotProp.x1 = Math.ceil(parseInt(AnnotObj.X1));
    annotProp.y1 = Math.ceil(parseInt(AnnotObj.Y1));
    annotProp.x2 = Math.ceil(parseInt(AnnotObj.X2));
    annotProp.y2 = Math.ceil(parseInt(AnnotObj.Y2));
    annotProp.color = AnnotObj.Color;
    annotProp.timeorder = AnnotObj.TimeOrder;
    annotProp.mouse_sensitivity = AnnotObj.MouseSensitivity;
    annotProp.groupid = AnnotObj.AnnotationGroupID;
    annotProp.userid = AnnotObj.UserID;
    annotProp.rights = AnnotObj.Rights;
    return annotProp;
};




/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : undoCutAnnotation()
Arguments: None

Description:
This functin is used to undo the cut annotation operation.

@author        05/12/2013    Gaurav Dixit
#@e
*/
AnnotationHolder.prototype.SelectAllAnnotations = function () {
	if(this != null){
		this.selection = [];
		this.selectionIndex = [];
		for(var i = 0; i < this.annotationList.length; i++){
			if((!( (this.annotationList[i].type == "EZONE") && (this.annotationList[i].isMutable == false))) && (this.annotationList[i].rights != 'V')){	 //Amber Beriwal on 15/12/2014 [Bugs: 4198, 4199]
				//11.02.2015
				//select zone instead of partition when select All feature is used
				if(this.annotationList[i].type == "EZONE"){
					this.annotationList[i].selectedPartitionIndex=[];
					this.annotationList[i].bSelectAll=true;
				}
				this.selection.push(this.annotationList[i]);
				this.selectionIndex.push(i);
			}
			this.valid = false;
			//enableMenu(document.getElementById("edit"));//23.01.2015
		}
	}
	
};







AnnotationHolder.prototype.cutAnnotation = function (){
	if (this != null) {
	        this.clipBoardList =[];
	        if (this.mode == this.modes.AnnotationEdit) {
	            if (this.selection.length == 1) {
	                var key = this.selectionIndex[0];
	                var elementToCut = jQuery.extend(true, {}, this.annotationList[key]);
					this.clipBoardList.push(this.annotationList[key]);
	                this.annotationList.splice(key, 1);
					this.isAnnotationOnClipBoard = true;
	                this.selectionIndex = [];
	                this.selection = [];
	                this.valid = false;
	                this.change = true;
					//$( "#contextMenu" ).hide();
					hideContextMenu();		//Amber Beriwal on 22/12/2014 [Bug: 4250]
					var operation = {operationType: OPERATION_TYPE.CUT_ANNOTATION, position: key, element: elementToCut};
				    this.viewer.addToOperationsList(operation);
	            }
	        }
	       
	}
};


/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : undoCutAnnotation()
Arguments: None

Description:
This functin is used to undo the cut annotation operation.

@author        05/12/2013    Gaurav Dixit
#@e
*/
AnnotationHolder.prototype.undoCutAnnotation = function (operation){
	if (this != null) {
        var key = operation.position;
		var elementToInsert = operation.element;
        this.annotationList.splice(key, 0, elementToInsert);
		this.isAnnotationOnClipBoard = false;        
        this.valid = false;
        this.change = true;
		//$( "#contextMenu" ).hide();
		hideContextMenu();		//Amber Beriwal on 22/12/2014 [Bug: 4250]
	   
	}
};

/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : redoCutAnnotation()
Arguments: None

Description:
This functin is used to redo the cut annotation operation.

@author        05/12/2013    Gaurav Dixit
#@e
*/
AnnotationHolder.prototype.redoCutAnnotation = function (operation){
	if(this != null){
		var key = operation.position;
		var elementToInsert = operation.element;
		this.clipBoardList.push(elementToInsert);
        this.isAnnotationOnClipBoard = true;
        this.annotationList.splice(key, 1);        
        this.selection = [];
		this.selectionIndex = [];
        this.valid = false;
        this.change = true;
		//$( "#contextMenu" ).hide();
		hideContextMenu();		//Amber Beriwal on 22/12/2014 [Bug: 4250]
	}
	        
};


/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : DeleteAnnotation()
Arguments: None

Description:
This functin is used to delete the selected annotation.

@author        02/12/2013    Aditya Kamra
#@e
*/
AnnotationHolder.prototype.DeleteAnnotation = function () {
    if (this != null) {
        if (this.mode == this.modes.AnnotationEdit) {	
            if (this.selection.length != 0) {
            	
				if (this.selection[0].type == "EZONE")
				{
				  var selection = this.selection[0];
				  if (selection.selectedPartitionIndex.length > 0)
				  {
					this.deletePartition(selection);
				    // for (var index = 0; index < selection.selectedPartitionIndex.length; index++) {
	                // selection.partitions.splice(index,1);
	                // }
				    selection.selectedPartitionIndex = [];
					this.valid = false;
					return;
				  }
				  
				}
            	// Sorting the deletion list this is required to undo deletion properly, 
            	// because annotations may have been selected in any order.
            	for(var i = 0; i < this.selectionIndex.length; i++){
            		for(var j = 0; j < this.selectionIndex.length - i -1; j++)
            		if(this.selectionIndex[j] > this.selectionIndex[j+1]){
            			var temp = this.selectionIndex[j];
            			var tempElement = this.selection[j];
            			this.selectionIndex[j] = this.selectionIndex[j+1];
            			this.selection[j] = this.selection[j+1];
            			this.selectionIndex[j + 1]  = temp;
            			this.selection[j + 1]  = tempElement;
            		}
            	}
//            	var elementToDelete = JSON.parse(JSON.stringify(this.selection));
//            	var deletedElementsIndex = JSON.parse(JSON.stringify(this.selectionIndex));            	
            	var elementToDelete = [];
            	var deletedElementsIndex = [];
            	
            	for(var i = 0; i < this.selection.length ; i++){
            		elementToDelete[i] = jQuery.extend(false, {}, this.selection[i]);
            		deletedElementsIndex[i] = this.selectionIndex[i];
            	}
            	for(var i = elementToDelete.length - 1; i >=0 ; i--){
                    var key = deletedElementsIndex[i];                              
					if(this.annotationList[key].type=="EZONE"){
						this.zoneList.splice(this.annotationList[key].id-1,1);
						for (var j = 0 ; j < this.zoneList.length ; j++)
							this.zoneList[j].id = j+1;
					}					
                    this.annotationList.splice(key, 1);
            	}    
            
            	var operation = {operationType: OPERATION_TYPE.DELETE_ANNOTATION, positionList: deletedElementsIndex, elementList: elementToDelete};
                this.viewer.addToOperationsList(operation);
				//to remove tooltip of attachnote annotation
                document.getElementById("attachNoteTooltip").style.visibility = "hidden";
                document.getElementById("attachNoteTooltip").innerHTML = "";                
                this.selection = [];
                this.selectionIndex = [];
                this.valid = false;
                this.change = true;
				//$( "#contextMenu" ).hide();
				hideContextMenu();		//Amber Beriwal on 22/12/2014 [Bug: 4250]
            }
        }
    }
};


/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : undoDeleteAnnotation()
Arguments: None

Description:
This functin is used to undo the delete annotation operation.

@author        27/08/2014    Gaurav Dixit
#@e
*/
AnnotationHolder.prototype.undoDeleteAnnotation = function (operation) {
    if (this != null) {
    	
    	for(var i = 0; i < operation.elementList.length; i++){
    		var key = operation.positionList[i];
        	var element = operation.elementList[i];
			if(element.type=="EZONE"){
				this.zoneList.splice(key, 0, element);			
				for (var j = key+1 ; j < this.zoneList.length ; j++)
					this.zoneList[j].id = j+1;
			}
           	this.annotationList.splice(key, 0, element);					
    	}		
    	this.valid=false;
    }
};


/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : redoDeleteAnnotation()
Arguments: None

Description:
This functin is used to redo the delete annotation operation.

@author        27/08/2014    Gaurav Dixit
#@e
*/
AnnotationHolder.prototype.redoDeleteAnnotation = function (operation) {
    if (this != null) {
    	for(var i = operation.elementList.length - 1; i >= 0 ; i--){
    		var key = operation.positionList[i];
        	this.annotationList.splice(key, 1);
            this.valid = false;
        }
    	
    	this.change = true;
    }
};



/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : undoPropertiesChangeAnnotation()
Arguments: None

Description:
This functin is used to undo the properties change operation.

@author        27/08/2014    Gaurav Dixit
#@e
*/
AnnotationHolder.prototype.undoPropertiesChange = function (operation) {
    if (this != null) {
    	
    	var key = operation.positionUndo;
    	var element = operation.selectionUndo;
       	this.annotationList.splice(key, 1, element);
    	this.valid = false;
    }
};



/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : redoPropertiesChange()
Arguments: None

Description:
This functin is used to redo properties change operation.

@author        02/09/2014    Gaurav Dixit
#@e
*/
AnnotationHolder.prototype.redoPropertiesChange = function (operation) {
    if (this != null) {
    	var key = operation.positionRedo;
    	var element = operation.selectionRedo;
       	this.annotationList.splice(key, 1, element);
        this.selection = operation.selectionRedo;
    	this.valid = false;
    }
};



/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : undoAddAnnotation()
Arguments: None

Description:
This functin is used to undo the add annotation operation.

@author        27/08/2014    Gaurav Dixit
#@e
*/
AnnotationHolder.prototype.undoAddAnnotation = function (operation) {
    if (this != null) {
       	if(operation.element instanceof FreeHand){
       		//this.mode = this.modes.AnnotationEdit;
       		operation.element = this.annotationList.pop();
       	}
       	else{
       		this.annotationList.pop();
			if(operation.element.type=="EZONE")
				this.zoneList.pop();
       	}
       	this.valid=false;
       	this.selection = [];
       	this.selectionIndex = [];
    }
};


/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : redoAddAnnotation()
Arguments: None

Description:
This functin is used to redo the add annotation operation.

@author        27/08/2014    Gaurav Dixit
#@e
*/
AnnotationHolder.prototype.redoAddAnnotation = function (operation) {
    if (this != null) {
       	this.annotationList.push(operation.element);
		if ( this.annotationList[this.annotationList.length-1].type == "EZONE")
		  {
		    var redoPartitions = [];
		    for (var j = 0 ; j < this.annotationList[this.annotationList.length-1].partitions.length ; j++)
			 {
			    var redoPartition = jQuery.extend(false, {}, this.annotationList[this.annotationList.length-1].partitions[j]);
				redoPartition.zone = this.annotationList[this.annotationList.length-1];
				redoPartitions.push(redoPartition);
				
			 }
			 this.annotationList[this.annotationList.length-1].partitions = redoPartitions;
		  }
		
		
		if(operation.element.type=="EZONE")
			this.zoneList.push(operation.element);
       	this.valid=false;
       	this.selection = [];
       	this.selectionIndex = [];
    }
};


AnnotationHolder.prototype.copyAnnotation = function (){
	if (this != null) {
        this.clipBoardList =[];
        if (this.mode == this.modes.AnnotationEdit) {
            if (this.selection.length == 1) {
                var key = this.selectionIndex[0];
				this.clipBoardList.push(this.annotationList[key]);
				this.isAnnotationOnClipBoard = true;
                this.selectionIndex = [];
                this.selection = [];
                this.valid = false;
                this.change = true;
				//$( "#contextMenu" ).hide();
				hideContextMenu();		//Amber Beriwal on 22/12/2014 [Bug: 4250]
            }
        }  
	}     
};

/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : undoMoveAnnotation()
Arguments: None

Description:
This functin is used to undo the move annotation operation.

@author        28/08/2014    Gaurav Dixit
#@e
*/
AnnotationHolder.prototype.undoMoveAnnotation = function (operation) {
    if (this != null) {
    	
    	for(var i = 0; i < operation.elementIndex.length; i++){
    		var elementToUndo = this.annotationList[operation.elementIndex[i]];
        	elementToUndo.x = operation.startX1[i];
        	elementToUndo.y = operation.startY1[i];
        	
        	if(elementToUndo.type == "LNE" || elementToUndo.type == "DLNE" || elementToUndo.type == "LALNE" || elementToUndo.type == "TALNE" || elementToUndo.type == "DALNE"){
        		elementToUndo.endX = operation.startX2[i];
        		elementToUndo.endY = operation.startY2[i];
     		}
			if(elementToUndo.type=="EZONE"){
				var movedPartitions = [];
				for (var j = 0 ; j < this.annotationList[operation.elementIndex[i]].partitions.length ; j++)
				{
					var movedPartition = jQuery.extend(false, {}, this.annotationList[operation.elementIndex[i]].partitions[j]);
					movedPartition.zone = elementToUndo;
					movedPartitions.push(movedPartition);				
				}
			elementToUndo.partitions = movedPartitions;
			}
    	}   	
    	
    	this.valid=false;
    }
};


/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : redoMoveAnnotation()
Arguments: None

Description:
This functin is used to redo the move annotation operation.

@author        28/08/2014    Gaurav Dixit
#@e
*/
AnnotationHolder.prototype.redoMoveAnnotation = function (operation) {
	if (this != null) {
    	
    	for(var i = 0; i < operation.elementIndex.length; i++){
    		var elementToRedo = this.annotationList[operation.elementIndex[i]];
    		elementToRedo.x = operation.endX1[i];
    		elementToRedo.y = operation.endY1[i];
        	
        	if(elementToRedo.type == "LNE" || elementToRedo.type == "DLNE" || elementToRedo.type == "LALNE" || elementToRedo.type == "TALNE" || elementToRedo.type == "DALNE"){
        		elementToRedo.endX = operation.endX2[i];
        		elementToRedo.endY = operation.endY2[i];
     		}
    	}
    	
    	
    	this.valid=false;
    }
};


/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : undoResizeAnnotation()
Arguments: None

Description:
This functin is used to undo the resize annotation operation.

@author        29/08/2014    Gaurav Dixit
#@e
*/
AnnotationHolder.prototype.undoResizeAnnotation = function (operation) {
    if (this != null) {
    	var elementToUndo = this.annotationList[operation.elementIndex];
    	
    	elementToUndo.x = operation.x1Initial;
		elementToUndo.y = operation.y1Initial;
		
    	if(elementToUndo.type == "LNE" || elementToUndo.type == "DLNE" || elementToUndo.type == "LALNE" || elementToUndo.type == "TALNE" || elementToUndo.type == "DALNE"){
    		elementToUndo.endX = operation.x2Initial;
    		elementToUndo.endY = operation.y2Initial;
    		elementToUndo.diffX = elementToUndo.endX - elementToUndo.x;
    		elementToUndo.diffY = elementToUndo.endY - elementToUndo.y;
 		}
    	else{
    		elementToUndo.w = operation.widthInitial;
        	elementToUndo.h = operation.heightInitial;
    	}
		if(elementToUndo.type=="EZONE"){
				var resizePartitions = [];
				for (var j = 0 ; j < this.annotationList[operation.elementIndex].partitions.length ; j++)
				{
					var resizePartition = jQuery.extend(false, {}, this.annotationList[operation.elementIndex].partitions[j]);
					resizePartition.zone = elementToUndo;
					resizePartitions.push(resizePartition);				
				}
			elementToUndo.partitions = resizePartitions;
			}
    	
    	this.valid=false;
    }
};
/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : redoResizeAnnotation()
Arguments: None

Description:
This functin is used to redo the resize annotation operation.

@author        03/09/2014    Gaurav Dixit
#@e
*/
AnnotationHolder.prototype.redoResizeAnnotation = function (operation) {
    if (this != null) {
    	var elementToRedo = this.annotationList[operation.elementIndex];
    	
    	elementToRedo.x = operation.x1Final;
		elementToRedo.y = operation.y1Final;
		
    	if(elementToRedo.type == "LNE" || elementToRedo.type == "DLNE" || elementToRedo.type == "LALNE" || elementToRedo.type == "TALNE" || elementToRedo.type == "DALNE"){
    		elementToRedo.endX = operation.x2Final;
    		elementToRedo.endY = operation.y2Final;
    		elementToRedo.diffX = elementToRedo.endX - elementToRedo.x;
    		elementToRedo.diffY = elementToRedo.endY - elementToRedo.y;
 		}
    	else{
    		elementToRedo.w = operation.widthFinal;
            elementToRedo.h = operation.heightFinal;
    	}
    	
    }
    
    this.valid=false;
};
AnnotationHolder.prototype.pasteAnnotation = function (){
if (this != null) {
	
        if (this.mode == this.modes.AnnotationEdit) {
		if(this.clipBoardList.length<=0)
		return;
		var copiedAnnotation = jQuery.extend(true, {},this.clipBoardList[this.clipBoardList.length-1]);
		if(copiedAnnotation.type == "LNE" || copiedAnnotation.type == "DLNE" || copiedAnnotation.type == "LALNE" || copiedAnnotation.type == "TALNE" || copiedAnnotation.type == "DALNE"){
		   copiedAnnotation.endX =  this.mouseX + (copiedAnnotation.endX - this.clipBoardList[this.clipBoardList.length-1].x) ;
		   copiedAnnotation.endY =  this.mouseY + (copiedAnnotation.endY - this.clipBoardList[this.clipBoardList.length-1].y) ;
		   //OF Bug# 54471. Draw annotation within boundary of image.
			if(copiedAnnotation.endX> this.viewer.ImageCanvas.width){
				copiedAnnotation.x = this.mouseX - (copiedAnnotation.endX -  this.viewer.ImageCanvas.width);
				copiedAnnotation.endX -= copiedAnnotation.endX -  this.viewer.ImageCanvas.width;
			}
			else if(copiedAnnotation.endX<0){
				copiedAnnotation.x = this.mouseX - (copiedAnnotation.endX);
				copiedAnnotation.endX -= copiedAnnotation.endX ;
			}
			else{
				copiedAnnotation.x= this.mouseX;
			}
		   if(copiedAnnotation.endY> this.viewer.ImageCanvas.height){
				copiedAnnotation.y = this.mouseY - (copiedAnnotation.endY -  this.viewer.ImageCanvas.height);
				copiedAnnotation.endY -= copiedAnnotation.endY -  this.viewer.ImageCanvas.height;
				
			}
			else if(copiedAnnotation.endY<0){
				copiedAnnotation.y = this.mouseY - (copiedAnnotation.endY );
				copiedAnnotation.endY -= copiedAnnotation.endY ;
			}
			else{
				copiedAnnotation.y= this.mouseY;
			}
		   }
		   else{
			   if(copiedAnnotation.type == "IMGSTAMP")
			   {
				copiedAnnotation.StampFileSource="MASTER";
			   }
			   if(copiedAnnotation.h + this.mouseY > this.viewer.ImageCanvas.height){
					copiedAnnotation.y=this.mouseY - ((this.mouseY + copiedAnnotation.h) - this.viewer.ImageCanvas.height);
				}
				else{
					copiedAnnotation.y= this.mouseY;
				}
				if(copiedAnnotation.w + this.mouseX > this.viewer.ImageCanvas.width){
					copiedAnnotation.x=this.mouseX - ((this.mouseX + copiedAnnotation.w) - this.viewer.ImageCanvas.width);					
				}
				else{
					copiedAnnotation.x= this.mouseX;
				}				
			}
						
			copiedAnnotation.userid = this.userID;
			copiedAnnotation.groupid =this.currentGroupName;
			copiedAnnotation.timeorder =this.getAnnotationDateTime();		
			this.annotationList.push(copiedAnnotation);
			//$( "#contextMenu" ).hide();
			hideContextMenu();		//Amber Beriwal on 22/12/2014 [Bug: 4250]
			var key = this.annotationList.length - 1;
			var pastedAnnotation = jQuery.extend(true, {}, copiedAnnotation);
			var operation = {operationType: OPERATION_TYPE.PASTE_ANNOTATION, position: key, element: pastedAnnotation};
		    this.viewer.addToOperationsList(operation);
            this.valid = false;
		}
     }
};


/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : undoPasteAnnotation(URL)
Arguments: None

Description:
	This method is called to undo the paste annotation operation

@author        05/09/2014    Gaurav Dixit
#@e
*/
AnnotationHolder.prototype.undoPasteAnnotation = function (operation){
	if (this != null) {
		key = operation.position;
		this.annotationList.splice(key, 1);
		this.clipBoardList.push(operation.element);
		this.valid = false;
	}
};


/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : redoPasteAnnotation(URL)
Arguments: None

Description:
	This method is called to redo the paste annotation operation

@author        05/09/2014    Gaurav Dixit
#@e
*/
AnnotationHolder.prototype.redoPasteAnnotation = function (operation){
	if (this != null) {
		key = operation.position;
		var elementToInsert = jQuery.extend(true, {}, operation.element);
		this.annotationList.splice(key, 0, elementToInsert);
		this.valid = false;
	}
};



/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : LoadStampAnnotationINI(URL)
Arguments: 
            URL: url of stamp ini servlet to get stamp list.

Description:
This method is called to load stamp annotation list from ini

@author        12/11/2013    Anjali Singla
#@e
*/
AnnotationHolder.prototype.LoadStampAnnotationINI = function (URL) {
 try {
    if (URL != "") {
      var self = this;
      //this.getText(URL, this.annotationCallback);
      var txtFile = new XMLHttpRequest();
      
      var splitURL = URL.split("?");
      if(this.viewer.RequestMethod == 'POST'){
        txtFile.open("POST", splitURL[0], true);
        txtFile.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      }
      else{
        if(this.viewer.RequestMethod != 'GET'){
          console.log(" Incorrect value (" + VIEWER_MANAGER.RequestMethod + ") for PARAM.RequestMethod, hence using 'GET' as default ");
        }
        txtFile.open("GET", URL, true);
      }
      
      txtFile.onreadystatechange = function () {
        if (txtFile.readyState === 4 ){
          if(txtFile.status === 200) {
            self.StampAnnotationDataLoaded(txtFile.responseText);
          }
          else{
            OPALL.VIEWER.handlePageLoadError("Error while getting Stamp Annotation data.");
          }
        }
      };
      
      if (this.viewer.RequestMethod == 'POST') {
        txtFile.send(splitURL[1]);
      }
      else {
        txtFile.send(null);
      }
	  }
  }
  catch (err) {
    console.log("Error: " + err.message);
    OPALL.VIEWER.handlePageLoadError("Error while getting Stamp Annotation data.");
  }

};



/*
#@c
Class    : AnnotationHolder
Access   : Private
Function : StampAnnotationDataLoaded(data)
Arguments:
     data:stamp INI data retreived from ini servlet
            
Description:
This function is called when data gets retrieved from ini servlet. This function is used to parse ini data.

@author        12/11/2013    Anjali Singla
#@e
*/
AnnotationHolder.prototype.StampAnnotationDataLoaded = function (data) {
    this.ParseStampINIdataToAnnotations(data);    
};



/*
#@c
Class    : AnnotationHolder
Access   : Private
Function : drawEllipse(ctx, x, y, w, h, bfill)
Arguments:
            1)ctx:context of annotation canvas
            2)x:x coordinate of ellipse
            3)y:y cooordinate of ellipse
            4)w:width of ellipse
            5)h:height of ellipse
            6)bfill: filled or hollow ellipse

Description:
This function is used to draw hollow or filled ellipse.

@author        11/12/2013    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.drawEllipse=function(ctx, x, y, w, h, bfill) {
    var offset = .5522848,
      ox = (w / 2) * offset, // control point offset horizontal
      oy = (h / 2) * offset, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.closePath();
    if (bfill == true)
        ctx.fill();
    else
        ctx.stroke();
};
/*
#@c
Class    : AnnotationHolder
Access   : Public
Function : ChangeSelectedAnnotationProperties(Color, thickness)
Arguments:
            1)Color:color of annotation to be filled with
            2)thickness:thickness of annotation to be drawn with
            
Description:
This function is used to change the annotation color and thickness of selected annotation 

@author        27/05/2014    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.ChangeSelectedAnnotationProperties = function (Color, thickness) {
    if (this.selection.length == 1) {
		if(this.selection[0].type=="WIPOUT"){
			if(Color!="#FFFFFF" && Color!="#000000")
			return;
		}
        this.selection[0].fill = Color;
        if(thickness < 1){
        	thickness = 1;
        }
        else if(thickness > 5){
        	thickness = 5;
        }
		this.selection[0].thicknessLevel = thickness;
		this.selection[0].thickness = Math.round((thickness * this.viewer.ZoomFactor));
        this.valid = false;
    }
};
/*
#@c
Class     : AnnotationHolder
Function  : getStampImage(url, id, imgAnnotationObj)
Access    : Private

Arguments:
1)url - Url of stamp file that is to be fetched
2)id  - Id of the image stamp that is passed
3)imgAnnotationObj - image stamp object

Description:
This method is used to get the Image for Image stamp corresponding to the ID of Image stamp passed.
This method calls PDFHolder.getStampImage ,PDFHolder.stampImageDownloaded and ViewerManager.SetStampImage after the Image has been downloaded and rendered.

@author        13/06/2014    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.getStampImage = function (URL, id, imgAnnotationObj) {
    this.viewer.PdfManager.getStampImage(URL, id, imgAnnotationObj);
};



/*
#@c
Class     : AnnotationHolder
Function  : SetAnnotationDrawMode(annotType)
Access    : Public

Arguments:
1)annotType - annoatation type which needs to be drawn.

Description
This method is used to set which annotation needs to be drawn. Also draw mode is set to annotation draw mode.

@author        11/12/2013    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.SetAnnotationDrawMode = function (annotType) {
	
	if((!this.viewer.horizontallyFlipped && !this.viewer.verticallyFlipped && (this.viewer.Angle % 360 == 0)) ||
        (this.viewer.horizontallyFlipped && this.viewer.verticallyFlipped && (this.viewer.Angle == 180))){
		this.annotationType = annotType;
		this.SetDrawMode();
	}
		else{
		if (this.viewer.Angle != 0) {
			alert(OPALL_ERR_MESSAGE.AnnotationOnRotatedImageErrorMsg);
			return;
		}
		if (this.viewer.verticallyFlipped || this.viewer.horizontallyFlipped) {
			alert(OPALL_ERR_MESSAGE.AnnotationOnFlipImageErrorMsg);
			return;
		}
	}    
    
};



/*
#@c
Class     : AnnotationHolder
Function  : SetStampDrawMode(id, stampType)
Access    : Public

Arguments:
1)id        - id of stamp which needs to be drawn from the given stamp list.
2)stampType - type of stamp to specify whether it is image stamp or text stamp

Description:
This method is used to draw specified image/text stamp annotation. This function calls getStampImage for image stamp annotation.
 Also draw mode is set to annotation draw mode.

 @author        13/06/2014    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.SetStampDrawMode = function (id, stampType) {
if((!this.viewer.horizontallyFlipped && !this.viewer.verticallyFlipped && (this.viewer.Angle % 360 == 0)) ||
        (this.viewer.horizontallyFlipped && this.viewer.verticallyFlipped && (this.viewer.Angle == 180))){
		id = parseInt(id);
    
    if (stampType == "TEXT") {
        this.canvas.style.cursor = "none";
        this.annotationType = "TXTSTAMP";
        this.selectedTxtStampID = id;
    }
    else if (stampType == "IMAGE") {
        
        if (this.stampImageObjectList[id - 1]) {
            this.canvas.style.cursor = "none";            
        }
        else {
            this.canvas.style.cursor = "wait";
        }
        this.annotationType = "IMGSTAMP";
        this.selectedImgStampID = id;
    }
    this.SetDrawMode();
	}
	else{	
		if (this.viewer.Angle != 0) {
        //alert("Can not apply Annotations on rotated image");
			alert(OPALL_ERR_MESSAGE.AnnotationOnRotatedImageErrorMsg);
			return;
		}
		if (this.viewer.verticallyFlipped || this.viewer.horizontallyFlipped) {
			alert(OPALL_ERR_MESSAGE.AnnotationOnFlipImageErrorMsg);
			return;
		}
	}		
};


AnnotationHolder.prototype.downloadAllImageStamps = function() {
	for ( var i = 0; i < this.imgStampSelectionList.length; i++) {
		if(!this.stampImageObjectList[i]){
			this.getStampImage(this.imgStampSelectionList[i].filename, i+1,
					null);
		}
	}
};

/*
#@c
Class     : AnnotationHolder
Function  : LoadExistingStamps(imgStampObject)
Access    : Private

Arguments:
1)imgStampObject        - object of image stamp annotation.

Description:
This method is used to load existing stamps. This function will call getStampImage function to draw image stamp.

@author        13/06/2013    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.LoadExistingStamps = function (imgStampObject) {   
	this.viewer.PdfManager.getStampPDFImage(imgStampObject);
};



/*
#@c
Class     : AnnotationHolder
Function  : SetFreeTextAnnotationMode(annotType, freeTextAreaID)
Access    : Public

Arguments:
1)annotType      - annotation type
2)freeTextAreaID - ID of free text area.

Description:
This method is used to draw free text annotation.

@author        18/06/2014    Pooja Kamra

#@e
*/
AnnotationHolder.prototype.SetFreeTextAnnotationMode = function (annotType, freeTextAreaID) {

    if (freeTextAreaID.style.visibility == "visible")
        return;
	
	if((!this.viewer.horizontallyFlipped && !this.viewer.verticallyFlipped && (this.viewer.Angle % 360 == 0)) ||
        (this.viewer.horizontallyFlipped && this.viewer.verticallyFlipped && (this.viewer.Angle == 180))){
			this.annotationType = annotType;
			this.mode = this.modes.FreeTextDraw;
			this.freeTextAreaID = freeTextAreaID;
			this.canvas.style.cursor = "crosshair";
		}
		else{
			if (this.viewer.Angle != 0) {			
				alert(OPALL_ERR_MESSAGE.AnnotationOnRotatedImageErrorMsg);
			return;
			}
			if (this.viewer.verticallyFlipped || this.viewer.horizontallyFlipped) {
			alert(OPALL_ERR_MESSAGE.AnnotationOnFlipImageErrorMsg);
			return;
			}
		}    
};

/*
#@c
Class     : AnnotationHolder
Function  : ChangeSelectedFreeTextProperties(font_style, underline, strikethrough, fontname,fontsize)
Access    : Public

Arguments:
1)font_style      - font style of text.
2)underline       - underline style.
3)strikethrough   - strikethrough needs to be done or not
4)fontname        - font name
5)fontsize		  - font size to be set

Description:
This method is used to change the specified properties of selected freetext/stickynote or textstamp annotation

@author        20/06/2014    Pooja Kamra
#@e
*/
AnnotationHolder.prototype.ChangeSelectedFreeTextProperties = function (font_style, underline, strikethrough, fontname, fontsize) {
    if (this.selection.length == 1 && (this.selection[0].type == "FREETXT" || this.selection[0].type == "STICKYNOTE" || this.selection[0].type == "TXTSTAMP")) {
		this.selection[0].font_style=font_style;
        switch (font_style) {
            case 0:
                this.selection[0].italic = 0;
                this.selection[0].bold = 0;
                break;
            case 1:
                this.selection[0].italic = 0;
                this.selection[0].bold = 1;
                break;
            case 2:
                this.selection[0].italic = 1;
                this.selection[0].bold = 0;
                break;
            case 3:
                this.selection[0].italic = 1;
                this.selection[0].bold = 1;
                break;
            default:
                this.selection[0].italic = 0;
                this.selection[0].bold = 0;
                break;
        }
        this.selection[0].underline = parseInt(underline);
        this.selection[0].strikeOut = parseInt(strikethrough);
        this.selection[0].fontName = fontname;
        this.selection[0].fontSize = Math.ceil(fontsize);
        this.valid = false;
		if(this.selection[0].type == "FREETXT" || this.selection[0].type == "STICKYNOTE")
		this.bResize=false;//this variable is used to disable effect of drawdrag function for the selected annotation.
    }
};



/*
#@c
Class     : AnnotationHolder
Function  : SetAttachNoteAnnotationMode(attachNoteDivID)
Access    : Public

Arguments:
1)annotType      - annotation type
2)freeTextAreaID - ID of free text area.

Description:
This method is used to draw free text annotation.

@author        18/06/2014    Pooja Kamra

#@e
*/
AnnotationHolder.prototype.SetAttachNoteAnnotationMode = function (attachNoteUI) {
    if((!this.viewer.horizontallyFlipped && !this.viewer.verticallyFlipped && (this.viewer.Angle % 360 == 0)) ||
        (this.viewer.horizontallyFlipped && this.viewer.verticallyFlipped && (this.viewer.Angle == 180))){
		this.attachNoteUI = attachNoteUI;
		this.annotationType = "ATTACHNOTE";
		this.mode = this.modes.AttachNoteDraw;
		this.canvas.style.cursor = "crosshair";
		}
		else{
			if (this.viewer.Angle != 0) {
				//alert("Can not apply Annotations on rotated image");
				alert(OPALL_ERR_MESSAGE.AnnotationOnRotatedImageErrorMsg);
				return;
			}
			if (this.viewer.verticallyFlipped || this.viewer.horizontallyFlipped) {
				alert(OPALL_ERR_MESSAGE.AnnotationOnFlipImageErrorMsg);
				return;
			}
		}
};

AnnotationHolder.prototype.AttachNoteOk = function () {
    //this.attachNoteUI.div.style.visibility = "hidden";	//Amber Beriwal on 09/12/2014 [Bug: 4125]
	hideDialog("#attachNote");

    if (this.dblClick == false) {
        var value = this.attachNoteUI.textArea.value;
        if (value != "") {            
           var left = parseInt(this.attachNotePosition.left);
            var top = parseInt(this.attachNotePosition.top) ;
		   
            left = left + parseInt($("#viewArea").scrollLeft()) - this.viewer.viewerLeft;
            top = top + parseInt($("#viewArea").scrollTop()) - this.viewer.viewerTop;
			 //boundry conditions for attachnote annotation
            if(left + (this.AttachNoteImage.width*this.viewer.ZoomFactor) > this.viewer.ImageCanvas.width)
				left=left-this.AttachNoteImage.width;
			if(top + (this.AttachNoteImage.height*this.viewer.ZoomFactor) > this.viewer.ImageCanvas.height)
				top=top-this.AttachNoteImage.height;
            this.mode = this.modes.AnnotationEdit;
            var currentdrawing = GetAnnotationObject(this.viewer, this.annotationType, left, top, 32, 32, this.penColor[this.annotationType],
            this.thickness, "VM", this.userID, this.currentGroupName, 0, this.getAnnotationDateTime());
            this.change = true;
            this.annotationList.push(currentdrawing);			
            this.dragging = false;
            var l = this.annotationList.length;
            this.currentDraw = this.annotationList[l - 1];
            this.currentDraw.text = value;
            this.currentDraw.lines = this.currentDraw.GetContent(this.attachNoteUI.textArea);
            this.valid = this.currentDraw.NoRedrawOnCreation;
            var operation = {operationType: OPERATION_TYPE.ADD_NEW_ANNOTATION, position: this.annotationList.length, element: jQuery.extend(true, {}, this.annotationList[this.annotationList.length-1])};
			this.viewer.addToOperationsList(operation);
        }
        else{
            this.annotationType = null;
            this.mode = this.modes.AnnotationEdit;
    }
    }
    else {
        if (this.selection.length == 1) {
            this.selection[0].text = this.attachNoteUI.textArea.value;
            this.selection[0].lines = this.selection[0].GetContent(this.attachNoteUI.textArea);
			this.dblClick = false;
        }
    }

};

AnnotationHolder.prototype.AttachNoteCancel = function () {
    this.mode = this.modes.AnnotationEdit;
    this.annotationType = null;
    if (this.dblClick == false) {
        this.canvas.style.cursor = "default";
        //this.attachNoteUI.div.style.visibility = "hidden";	//Amber Beriwal on 09/12/2014 [Bug: 4125]
		hideDialog("#attachNote");

        this.attachNoteUI.textArea.value = "";
    }
    else {
        this.canvas.style.cursor = "default";
        //this.attachNoteUI.div.style.visibility = "hidden";	//Amber Beriwal on 09/12/2014 [Bug: 4125]
		hideDialog("#attachNote");

        if (this.selection.length == 1) {
            this.attachNoteUI.textArea.value = this.selection[0].text;
            this.selection[0].lines = this.selection[0].GetContent(this.attachNoteUI.textArea);
        }
    }
};


AnnotationHolder.prototype.DoubleClickEvent = function (e, myState) {
	// if(bDialogOpen == true && dialogOpened[dialogOpened.length - 1] != "#ZoomLens")	//Amber Beriwal on 09/12/2014 [Bug: 4125]
	// {
		// return;
	// }
	return;
    var mouse = myState.getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;
	//11.02.2015
	if(this.viewer.isFormExtractMode==true){
		var xResizeFactor   = this.viewer.ImageInfo.ImageWidth/this.viewer.ImageCanvas.width;
		var yResizeFactor = this.viewer.ImageInfo.ImageHeight / this.viewer.ImageCanvas.height;
		var x1 = parseInt(mx * xResizeFactor);
		var y1 = parseInt(my * yResizeFactor);
		var strCordinates=x1+"," + y1;					
		TOOLKIT.callbackImageDoubleClicked(strCordinates);
	}
    var mode = myState.mode;
    if (mode == myState.modes.AnnotationEdit) {
        var l = myState.annotationList.length;
        for (var i = l - 1; i >= 0; i--) {
            if (myState.annotationList[i].contains(mx, my)) {
                var mySel = myState.annotationList[i];
                if (myState.annotationList[i].type == "ATTACHNOTE") {
                	var absPoint = myState.findAbsoluteMouseCoOrdinates(mx,my);
                    myState.SetAttachNotePostition(absPoint);
                    this.attachNoteUI.textArea.value = myState.annotationList[i].text;
                    //this.attachNoteUI.div.style.visibility = "visible";	//Amber Beriwal on 09/12/2014 [Bug: 4125]
		//			showDialog("#attachNote");
		//			$(this.attachNoteUI.div).draggable({containment: 'parent'});   	//Amber Beriwal on 09/12/2014 [Bug: 4151] 
                    this.dblClick = true;
                }
				 else if (myState.annotationList[i].type == "FREETXT" || myState.annotationList[i].type == "STICKYNOTE") {                                        
				 if(this.FreeTextAreaManager==null)
				 {
				 this.freeTextAreaID = document.getElementById('freetextareaID');
				 this.FreeTextAreaManager=new FreeTextAreaHolder(this.viewer, this.freeTextAreaID);
				 this.FreeTextAreaManager.SetFontSize(Math.abs(myState.annotationList[i].fontSize));
				 if(myState.annotationList[i].type == "FREETXT")
				this.penColor["FREETXT"] =  myState.annotationList[i].fill;
				else
				this.penColor["STICKYNOTE"] = myState.annotationList[i].fill;
				 }
                    //this.FreeTextAreaManager.SetPositionOnDblClick(myState.annotationList[i].x, myState.annotationList[i].y, mx, my);
                    this.FreeTextAreaManager.SetTextProperties(myState.annotationList[i]);                                        
                    this.freeTextAreaID.style.visibility = "visible";
                    this.dblClick = true;
                    myState.mode = myState.modes.FreeTextDraw;
                    myState.annotationType = myState.annotationList[i].type;
                    myState.annotationList.splice(i, 1);
                    myState.selection = [];
					myState.selectionIndex = [];
                    myState.valid = false;                    
                }
				 else if(myState.annotationList[i].type == "HLINK"){
					 if (mySel.linkId != "")
						{
					       var win = window.open(mySel.linkId, 'Hyperlink');
                        win.focus();
						};
					    return;
				 }
                return;
            }
        }
    }
};

AnnotationHolder.prototype.getAnnotationGroupName = function () {
};
AnnotationHolder.prototype.setAnnotationGroupName = function () {
    if (this.viewer.groupID.match(/Default/gi) == null) {
        this.groupName = this.viewer.groupID;
        this.userID = this.viewer.groupID;
    }
};
AnnotationHolder.prototype.createAnnotationGroup = function (strGroup) {
    var groupName = strGroup;    
    if (groupName.length > 50 )    
        alert(OPALL_ERR_MESSAGE.GroupNameLengthErrorMsg);
    var totalGroups = this.GetTotalGroups();
    for (var i = 1; i <= totalGroups; i++) {
        if (this.checkIfGroupPresent(strGroup)) {            
            alert(OPALL_ERR_MESSAGE.GroupCreationErrorMsg);
            return;
        }        
    }
    this.currentGroupName = strGroup;
    if (i > totalGroups) {
        this.SetTotalGroups(++totalGroups);
        this.CreateGroupList(this.GetTotalGroups() - 1, strGroup);
    }
};
AnnotationHolder.prototype.GetCurrentAnnotationGroupID = function () {
    return this.currentGroupName;
};
AnnotationHolder.prototype.SetAnnotationGroupColor = function (strGroup) {
};
AnnotationHolder.prototype.SetAnnotationGroupThickness = function (strGroup) {
};
AnnotationHolder.prototype.GetTotalGroups = function () {
    return this.totalGroups;
};
AnnotationHolder.prototype.SetTotalGroups = function (val) {
    this.totalGroups=val;
};
AnnotationHolder.prototype.checkIfGroupPresent = function (groupName) {
    var totalGroups = this.totalGroups;    
    if (this.groupList.length == 0) {
        return false;
    }
    for (var i = 0; i < totalGroups; i++) {
        var val = this.groupList[i].name;        
        if (groupName.toLowerCase() === val.toLowerCase()) {
            return true;
        }
    }
    return false;
};
AnnotationHolder.prototype.CreateGroupList = function (index, groupName) {
        var grpObj = new Group(index, groupName);
        this.groupList[index] = grpObj;
        this.SetTotalGroups(index+1);
};
AnnotationHolder.prototype.SetDefaultGroupAndUser = function (strGroup) {
    if (strGroup != "Default" && strGroup != "") {
        this.defaultGroupName = strGroup;
        this.userID = strGroup;
    }
    else {
        this.defaultGroupName = "Default";
        this.userID = "aaaaaa";
    }
    this.currentGroupName = this.defaultGroupName;    
    this.CreateGroupList(0, this.currentGroupName);
};


AnnotationHolder.prototype.GetCurrentAnnotationGroupID = function () {
    return this.currentGroupName;
};


AnnotationHolder.prototype.SetCurrentAnnotationGroupID = function (strGroup) {
    if (!this.checkIfGroupPresent(strGroup)) {
        //alert("Group with the specified name does not exist");
        alert(OPALL_ERR_MESSAGE.GroupCreationErrorMsg);
        return;
    }
    this.currentGroupName = strGroup;
};


AnnotationHolder.prototype.deleteAnnotationGroup = function (strGroup) {
    if (!this.checkIfGroupPresent(strGroup)) {        
        alert(OPALL_ERR_MESSAGE.GroupCreationErrorMsg);
        return;
    }
    var totalGroups = this.totalGroups;
    for (var i = 0; i < totalGroups; i++) {
        var val = this.groupList[i].name;
        if (strGroup.toLowerCase() === val.toLowerCase()) {

             var response = confirm(OPALL_MESSAGE.DeleteAnnotationGroupMsg);
             if (response) {
                this.DeleteGroupAnnotations(strGroup, this.annotationList)
                this.groupList.splice(i, 1);
                this.totalGroups--;
                if (this.totalGroups > 0)
                    this.currentGroupName = this.groupList[0].name;
                else
                    this.SetDefaultGroupAndUser(this.defaultGroupName);
            }
            return true;
        }
    }
};


AnnotationHolder.prototype.DeleteGroupAnnotations = function (strGroup) {
    var length = this.annotationList.length;
    for (var k = 0; k < length; k++) {
        if (this.annotationList[k].groupid.toLowerCase() == strGroup.toLowerCase()) {
            this.annotationList.splice(k, 1);
			length--;
			k--;
			this.selection = [];
			this.selectionIndex = [];
            this.valid = false;
            this.change = true;
        }
    }
};

AnnotationHolder.prototype.SetFreeHandAnnotationMode = function (annotType) {
if((!this.viewer.horizontallyFlipped && !this.viewer.verticallyFlipped && (this.viewer.Angle % 360 == 0)) ||
        (this.viewer.horizontallyFlipped && this.viewer.verticallyFlipped && (this.viewer.Angle == 180))){
		this.annotationType = annotType;
		this.mode = this.modes.FreeHandCreate;
	}
   else{
		if (this.viewer.Angle != 0) {
			alert(OPALL_ERR_MESSAGE.AnnotationOnRotatedImageErrorMsg);
			return;
		}
		if (this.viewer.verticallyFlipped || this.viewer.horizontallyFlipped) {
			alert(OPALL_ERR_MESSAGE.AnnotationOnFlipImageErrorMsg);
			return;
		}
	}    
};
AnnotationHolder.prototype.RestoreDefaultProp = function () {
    this.selection = [];
	this.selectionIndex = [];
    this.mode = this.modes.AnnotationEdit;
    this.currentDraw = null;
    this.valid = true;   
};
AnnotationHolder.prototype.ChangeSelectedAnnotationFillColor = function (Color) {
    if (this.selection.length == 1) {
	if(this.selection[0].type=="WIPOUT"){
			if(Color!="#FFFFFF" && Color!="#000000")
			return;
		}
        this.selection[0].fillColor = Color;       
        this.valid = false;
    }
};

AnnotationHolder.prototype.SetFontSize = function (size) {
    this.fontSize = size;
    this.valid = false;
};

//@Modified Komal Walia 08/02/2019  Bug ID:14601
AnnotationHolder.prototype.DrawScaledAnnotation = function (invCanvas,annotationList,xScale,yScale, forPrint) 
{
  //Added by Komal Walia on 08/02/2019 for Bug id : 14601(OD Bugzilla)
  this.clear();
  var scaledAnnotationList = [];
  var l = annotationList.length;
  for (var i = 0; i < l; i++) { 
       // var copiedAnnotation = jQuery.extend(false, {}, annotationList[i]);
        var copiedAnnotation = copyObj(annotationList[i]);
        if ( annotationList[i].type == "EZONE")
		  {
		    var copiedPartitions = [];
		    for (var j = 0 ; j < annotationList[i].partitions.length ; j++)
			 {
		//	    var copiedPartition = jQuery.extend(false, {}, annotationList[i].partitions[j]);
		    	var copiedPartition = copyObj(annotationList[i].partitions[j]);
				copiedPartition.zone = copiedAnnotation;
				copiedPartitions.push(copiedPartition);
				
			 }
			 copiedAnnotation.partitions = copiedPartitions;
		  }
		
		scaledAnnotationList.push(copiedAnnotation);
    }  
    if(forPrint){
  for (var i = 0; i < scaledAnnotationList.length; i++) {
            scaledAnnotationList[i].Resize(1.0, 1.0, 1.0, 1.0);
        }
    }
    else{
     for (var i = 0; i < scaledAnnotationList.length; i++) {
        scaledAnnotationList[i].Resize(1.0, xScale,1.0, yScale);
    }  
    }  
   var ctx = invCanvas.getContext("2d");
   for (var i = 0; i < l; i++) {
            var annotationObj = scaledAnnotationList[i];
            // We can skip the drawing of elements that have moved off the screen:
            if (annotationObj.x > invCanvas.width || annotationObj.y > invCanvas.height ||
          annotationObj.x + annotationObj.w < 0 || annotationObj.y + annotationObj.h < 0) continue;
            if (annotationObj.type != "EZONE")
            {
                if (forPrint)
			      annotationObj.draw(ctx, yScale);
                else
			      annotationObj.draw(ctx);
            }
		    else
                  annotationObj.drawScaled(ctx,invCanvas);		
        }
};

/*
#@c
Class    : AnnotationHolder
Function : keyDownEvent(e, myState)
Arguments:
            1)e      :Event to perform
            2)myState:reference of Annotation Canvas State holder

Description:
The framework calls this function when key is pressed from keyboard.

@author   25/11/2013    Aditya Kamra
#@e
*/
AnnotationHolder.prototype.keyDownEvent = function (e, myState) {
	if(e.ctrlKey){
		this.controlPressed = true;
	}
	
	if(e.keyCode == 27){
		this.RestoreDefaultProp();
	}
	
	//$( "#contextMenu" ).hide();
	//hideContextMenu();		//Amber Beriwal on 22/12/2014 [Bug: 4250]
	//document.getElementById("attachNoteTooltip").style.visibility = "hidden";
  //  document.getElementById("attachNoteTooltip").innerHTML = "";
	var strClass = e.target.className;
	if (strClass.match(/Validation/gi) != null)	{
		if(e.target.id == "zoomLevelText" && (e.which == 190 || e.which == 110)){//Bug #4188 resolved by Nikhil Barar
			if (document.getElementById('zoomLevelText').value.indexOf('.') != -1)
				e.preventDefault();    
		}  
		else if (((e.which >=48) || (e.which <=57)) &&  (e.shiftKey))
			e.preventDefault();			
		else if (((e.which <48) || (e.which >57)) && (this.controlPressed == false) && (e.which != 13) && ((e.which < 96) || (e.which > 105)) && (e.which != 8) && (e.which != 9) && ((e.which < 112) || (e.which > 123)) && ((e.which < 37) || (e.which > 40)) && (e.which != 45) && (e.which != 46) && (e.which != 35) && (e.which != 36))
			e.preventDefault();
	}	
	// if(bDialogOpen == true && e.which!=13 && dialogOpened[dialogOpened.length - 1] != "#ZoomLens")	//Amber Beriwal on 09/12/2014 [Bug: 4125]
	// // {
		// // return;
	// // }
	
	var bVisibleAnnot;
	if(document.getElementById("annotCanvas").style.visibility=='hidden'){
		bVisibleAnnot = false;
	}else{
	    bVisibleAnnot = true;
	}
	
	if (strClass.match(/DefaultKeyEvent/gi) != null) {
		if (e.which == 13) {
			switch (e.target.id) {
				case "zoomLevelText":
					onOkCustomZoomDialog();
					break;            
				case "hyperLinkURL":
					OnHyperLinkDialogOk();
					break;
				case "page_no":
					ShowPageCustom(parseInt(e.target.value));
					break;
	}
	
		}
		return;		
	}	
	if(myState.selection.length==1 && myState.selection[0].type=="ATTACHNOTE" && myState.attachNoteUI.div.style.display!="none")	//Amber Beriwal on 23/12/2014 [Bugs: 4033, 4190]
	{
		return;
	}	
	if(e.which == 46 && myState.selection.length != 0) {
		 if(true == bVisibleAnnot) {
		  e.preventDefault();
	      myState.DeleteAnnotation();
	  }
	}
	else if(e.ctrlKey && !e.shiftKey && !e.altKey){
		e.preventDefault();
        switch(e.which){
		case 38 :
			myState.viewer.ZoomIn();
			break;
		case 40 :
			myState.viewer.ZoomOut();
			break;
		}
		switch(String.fromCharCode(e.which)){
			case "A":
					if(myState.viewer.AnnotationOption !=1 && myState.viewer.AnnotationOption !=2){
					if(true == bVisibleAnnot)
				       myState.SelectAllAnnotations();
					}
					break;
			case "B": 
					FitToPage();
					break;
		    case "C":
					if(myState.viewer.AnnotationOption !=1 && myState.viewer.AnnotationOption !=2){
					if(true == bVisibleAnnot)
						copyAnnotation();
					}
					break;
			case "D":			
			        if(myState.viewer.AnnotationOption !=1 && myState.viewer.AnnotationOption !=2){
						if(true == bVisibleAnnot)	
							deleteAnnotationGroup();	//Amber Beriwal on 09/12/2014 [Bug: 4055]
					}
					break;
			case "E":
			        if(myState.viewer.TransformOption != 1 && myState.viewer.TransformOption != 2){
					myState.viewer.Negate();
					}
					break;
			case "F":
			        if(myState.viewer.TransformOption != 1 && myState.viewer.TransformOption != 2){
					myState.viewer.horizontalFlip();
					}
					break;
			case "G":
			        if(myState.viewer.TransformOption != 1 && myState.viewer.TransformOption != 2){
					myState.viewer.verticalFlip();
					}
					break;
			case "H":
					FitToHeight();
					break;
			case "I":					
					//myState.viewer.setDefaultPropertyDialog();		//Amber Beriwal on 11/12/2014 [Bug: 4178]
					myState.viewer.showImagePropertiesDialog('200px','200px');
					break;
			case "J":
					FitToWidth();
					break;
			case "K":
					SetZoomPercentage(MENUBAR.Zoom_Scan);
					break;
			case "L":
			        if(myState.viewer.TransformOption != 1 && myState.viewer.TransformOption != 2){
					myState.viewer.Rotate(-90);
					}
					break;			
			case "M":
			        if(myState.viewer.AnnotationOption !=1 && myState.viewer.AnnotationOption !=2){
						if(true == bVisibleAnnot)
							createAnnotationGroup();	//Amber Beriwal on 09/12/2014 [Bug: 4055]
					}
					break;
			case "N":
					console.log("Can't override browser's default shortcuts");
					break;
			case "O":
          if(VIEWER_MANAGER.OpenFileOption){
            document.getElementById('menu_openFile').click();
          }
					//console.log("Open Local File functionality not implemented yet");
					break;
			case "P":
					if(myState.viewer.disablePrintOption!= true && myState.viewer.printOption == true){
					Print();
					}
					break;
			case "Q": 
					if(myState.viewer.IsZoomLensDisable==false)
						OpenZoomLens();
					break;
			case "R":
					if(myState.viewer.TransformOption != 1 && myState.viewer.TransformOption != 2){
					myState.viewer.Rotate(90);
					}
					break;
			case "S":
			        if(myState.viewer.AnnotationOption !=1 && myState.viewer.AnnotationOption !=2){
					if(true == bVisibleAnnot)
						myState.saveAnnotation();
					}
					break;
			case "T":
					console.log("CTRL +T is default browser shortcut,it can't be overridden");
					break;
			case "U":
					if(myState.viewer.TransformOption != 1 && myState.viewer.TransformOption != 2){
					myState.viewer.Rotate(180);
					}
					break;
		    case "V":
					if(myState.viewer.AnnotationOption !=1 && myState.viewer.AnnotationOption !=2){
					if(true == bVisibleAnnot)
						pasteAnnotation();
					}
					break;
			case "X":
			        if(myState.viewer.AnnotationOption !=1 && myState.viewer.AnnotationOption !=2){
					if(true == bVisibleAnnot)
						cutAnnotation();
					}
					break;
			case "Y":
			        if(myState.viewer.AnnotationOption !=1 && myState.viewer.AnnotationOption !=2){
					if(true == bVisibleAnnot)
						myState.viewer.redo();
					}
					break;
			case "Z":
			        if(myState.viewer.AnnotationOption !=1 && myState.viewer.AnnotationOption !=2){
					if(true == bVisibleAnnot)
						myState.viewer.undo();
					}
					break;

				
			}
		}
	 else if(e.altKey && !e.ctrlKey && !e.shiftKey){
			e.preventDefault();
		switch(String.fromCharCode(e.which)){
		case "A":
		        if(myState.viewer.AnnotationOption !=1 && myState.viewer.AnnotationOption !=2){
				if(true == bVisibleAnnot){
					myState.bShowUserNameWithAnnotation = false;
					ShowUserNameWithAnnotations();
				 }
				}
				break;
		case "C":
				if(myState.viewer.TransformOption != 1 && myState.viewer.TransformOption != 2){
				myState.viewer.autoDeskew();
				}
				break;
	    case "D":
				console.log("Annotation editing mode set to false");
				break;
		case "E":
				console.log("Annotation editing mode set to true");
				break;
		case "F":
				ShowFirstPage();
				break;
		case "P" :
				ShowPreviuosPage();
				break;
		case "N" :
				ShowNextPage();
				break;
		case "L" :
				ShowLastPage();
				break;
		case "Q" :
		        if(myState.viewer.AnnotationOption !=1 && myState.viewer.AnnotationOption !=2){
				if(true == bVisibleAnnot){
					myState.bShowUserNameWithAnnotation = true;
					ShowUserNameWithAnnotations();
				  }
				}
				break;
		case "U" :
				if(true == bVisibleAnnot)
					myState.viewer.undoAll();
				break;
		case "R" :
				if(true == bVisibleAnnot)
					myState.viewer.redoAll();
				break;
		case "W" : 
				console.log("Form Extraction mode is not set");
				break;	
		case "k" : //+ key is identified as k
				if(myState.viewer.TransformOption != 1 && myState.viewer.TransformOption != 2){
				IncreaseBrightness();
				}
				break;
		case "m" : //- key is identified as m
				if(myState.viewer.TransformOption != 1 && myState.viewer.TransformOption != 2){
				DecreaseBrightness();
				}
				break;
	    case "M": //make new annotation group 
				if(myState.viewer.AnnotationOption !=1 && myState.viewer.AnnotationOption !=2){
				 createAnnotationGroup();
				 }
				 break;
		case "H": //Erase annotation Group
		         if(myState.viewer.AnnotationOption !=1 && myState.viewer.AnnotationOption !=2){
		 		 deleteAnnotationGroup();
				 }
				 break;
		          
	}
}	
};

AnnotationHolder.prototype.ChangeHlinkProperties = function (font_style, underline, strikethrough, fontname, fontsize) {
	   this.fontStyle['HLINK'] = font_style;
	   this.fontname['HLINK'] = fontname;
	   this.underline['HLINK'] = underline;
	   this.StrikeOut['HLINK'] = strikethrough;
	   this.fontSize['HLINK'] = fontsize;
	   
};

AnnotationHolder.prototype.ChangeStickyNoteProperties = function (font_style, underline, strikethrough, fontname, fontsize) {
	   this.fontStyle['STICKYNOTE'] = font_style;
	   this.fontname['STICKYNOTE'] = fontname;
	   this.underline['STICKYNOTE'] = underline;
	   this.StrikeOut['STICKYNOTE'] = strikethrough;
	   this.fontSize['STICKYNOTE'] = fontsize;
};

/*
#@c
Class    : AnnotationHolder
Function : keyUpEvent(e, myState)
Arguments:
			annotationType: event captured on keyup event.
            myState: variable to access AnnotationHolder

Description:
This function is used to take actions on keyUp event.

@author        11/11/2014   Gaurav Dixit
#@e
*/
AnnotationHolder.prototype.keyUpEvent = function (e, myState) {
	if(e.keyCode == 17){
		this.controlPressed = false;		
	}
	else if(e.keyCode == 27 && bDialogOpen == true)		//Amber Beriwal on 09/12/2014 [Bug: 4147]
	{		
		if(dialogOpened[dialogOpened.length - 1] == "#attachNote")
		{
			OnCancelButton();
		}
		else if(dialogOpened[dialogOpened.length - 1] == "#hyperLinkDialog")
		{
			OnHyperLinkDialogCancel();
		}
		else if(dialogOpened[dialogOpened.length - 1] == "#PrintDialog")
		{
			OnPrintCancelButton();
		}
		else if(dialogOpened[dialogOpened.length - 1] == "#annotationPropertiesDialog")
		{
			VIEWER_MANAGER.closeAnnotationPropertiesDialog();
		}
		else if(dialogOpened[dialogOpened.length - 1] == "#CustomZoomDialog")
		{
			onCancelCustomZoomDialog();
		}
		else if(dialogOpened[dialogOpened.length - 1] == "#annotationGroupDialog")
		{
			onCancelAnnotationGroupDialog();
		}
		else if(dialogOpened[dialogOpened.length - 1] == "#ZoomLens")
		{
			CloseZoomLens();
		}
		else if(dialogOpened[dialogOpened.length - 1] == "#PropertiesDialog")
		{
			closeImagePropertiesDialog();
		}
		else
		{
			hideDialog(dialogOpened[dialogOpened.length - 1]);
		}
		return;
	}
	// else if(bDialogOpen == true && e.which!=13 && dialogOpened[dialogOpened.length - 1] != "#ZoomLens")	//Amber Beriwal on 09/12/2014 [Bug: 4125]
	// {
		// return;
	// }

};	

AnnotationHolder.prototype.ChangeFreeTextProperties = function (font_style, underline, strikethrough, fontname, fontsize) {
   this.fontStyle['FREETXT'] = font_style;
   this.fontname['FREETXT'] = fontname;
   this.underline['FREETXT'] = underline;
   this.StrikeOut['FREETXT'] = strikethrough;
   this.fontSize['FREETXT'] = fontsize;

};


 AnnotationHolder.prototype.ChangeAllTextProperties = function (font_style, underline, strikethrough, fontname, fontsize) {
	   this.fontStyle['FREETXT'] = font_style;
	   this.fontname['FREETXT'] = fontname;
	   this.underline['FREETXT'] = underline;
	   this.StrikeOut['FREETXT'] = strikethrough;
	   this.fontSize['FREETXT'] = fontsize;
	   this.fontStyle['FRH'] = font_style;
	   this.fontname['FRH'] = fontname;
	   this.underline['FRH'] = underline;
	   this.StrikeOut['FRH'] = strikethrough;
	   this.fontSize['FRH'] = fontsize;
	   this.fontStyle['STICKYNOTE'] = font_style;
	   this.fontname['STICKYNOTE'] = fontname;
	   this.underline['STICKYNOTE'] = underline;
	   this.StrikeOut['STICKYNOTE'] = strikethrough;
	   this.fontSize['STICKYNOTE'] = fontsize;
	   this.fontStyle['ATTACHNOTE'] = font_style;
	   this.fontname['ATTACHNOTE'] = fontname;
	   this.underline['ATTACHNOTE'] = underline;
	   this.StrikeOut['ATTACHNOTE'] = strikethrough;
	   this.fontSize['ATTACHNOTE'] = fontsize;
	   this.fontStyle['HLINK'] = font_style;
	   this.fontname['HLINK'] = fontname;
	   this.underline['HLINK'] = underline;
	   this.StrikeOut['HLINK'] = strikethrough;
	   this.fontSize['HLINK'] = fontsize;

 };


AnnotationHolder.prototype.SetDateTimeFormat = function (datetime, format) {
     var strDateTime = datetime; //comma seperated string having sequence year,month,date,hour,min,second.   
     var dateArray = strDateTime.split(",");
     var monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
     var datetime = "";
     var format = "";
     switch (format) {
         case 0:
         default:
             datetime = dateArray[1] + "/" + dateArray[2] + "/" + dateArray[0] + ", " + dateArray[3] + ":" + dateArray[4] + ":" + dateArray[5];
             break;
         case 1:
             if (dateArray[3] >= 12)
                 format = "PM";
             else
                 format = "AM";
             datetime = dateArray[2] + "-" + monthArray[dateArray[1] - 1] + "-" + dateArray[0] + " at " + dateArray[3] + ":" + dateArray[4]+ format;
             break;
     }
     return datetime;
 };
AnnotationHolder.prototype.UpdateAnnotations = function (currentAnnot) {
    if (currentAnnot.type == "LNE" || currentAnnot.type == "DLNE" || currentAnnot.type == "TALNE" || currentAnnot.type == "LALNE" || currentAnnot.type == "DALNE") {
    }
    else {
        if (currentAnnot.w < 0) {
            currentAnnot.x = currentAnnot.x + currentAnnot.w;
            currentAnnot.w = Math.abs(currentAnnot.w);
        }
        if (currentAnnot.h < 0) {
            currentAnnot.y = currentAnnot.y + currentAnnot.h;
            currentAnnot.h = Math.abs(currentAnnot.h);
        }
    }
    this.valid = false;
}
AnnotationHolder.prototype.ShowUserNameWithAnnotations = function () {
    if (this.bShowUserNameWithAnnotation == false) 
        this.bShowUserNameWithAnnotation = true;
    else
        this.bShowUserNameWithAnnotation = false;
    this.valid = false;
} 

AnnotationHolder.prototype.tapHoldEvent = function (e,myState){

    // var touchStartX =myState.mouseX;
    // var touchStartY = myState.mouseY;
	// if(myState.isTouchMoved == true)
	 // {
	 // return;
	 // }
     // if(myState.selection.length == 1){
					// setPropertiesForContextMenu(myState.selection[0]);
					// myState.viewer.setDialogBox(myState.selection[0]);
					// //$("#contextMenu").css({top: mx, left: my, position:'absolute'});
					// document.getElementById("contextMenu").style.top = myState.mouseY+"px";
					// document.getElementById("contextMenu").style.left = myState.mouseX+"px";
					// document.getElementById("annotationPropertiesDialog").style.top = myState.mouseY+"px";
					// document.getElementById("annotationPropertiesDialog").style.left = myState.mouseX+"px";
					// //break;
                    // myState.valid = false;
                    
             // }
			 // else{
					// document.getElementById('PropertiesDialog').style.top = myState.mouseY+"px";
					// document.getElementById('PropertiesDialog').style.left = myState.mouseX+"px";
			 // }
			  
			 // document.getElementById("contextMenu").style.top = myState.mouseY+"px";
			 // document.getElementById("contextMenu").style.left = myState.mouseX+"px";
			 // $( "#Menu" ).menu();
			// //$( "#contextMenu" ).show();
			// showContextMenu();	//Amber Beriwal on 19/12/2014	[Bug #4249]
				
   }



   AnnotationHolder.prototype.SetDefaultFontSettings = function (defaultSettings) {
       var fontSettings = defaultSettings.split(","); //font name, type and size
       this.fontname = fontSettings[0];
       this.fontStyle = parseInt(fontSettings[1]);
       if (this.fontStyle < 0 || this.fontStyle > 2) {
           console.log("Invalid value for - DefaultFontSettings Parameter ");
           this.fontStyle = 0;
       }

       if (parseInt(fontSettings[2]) > 48 || parseInt(fontSettings[2]) < 3) {
           //alert("Invalid Font Size value");
           alert(OPALL_ERR_MESSAGE.FontSizeErrMsg);
           return;
   }
       this.fontSize = parseInt(fontSettings[2]);
   }
   
   
 /*
#@c
Class     : SetHyperLinkDrawMode
Function  : SetHyperLinkDrawMode(displayText, link)
Access    : Public

Arguments:
1)displayText  - id of stamp which needs to be drawn from the given stamp list.
2)link         - type of stamp to specify whether it is image stamp or text stamp

Description:
This method is used to draw specified Hyperlink annotation. 

 @author        13/06/2014    Aditya Kamra
#@e
*/
AnnotationHolder.prototype.SetHyperLinkDrawMode = function (displayText, link) {
    if (this.viewer.Angle != 0) {
        //alert("Can not apply Annotations on rotated image");
        alert(OPALL_ERR_MESSAGE.RotateImageErrorMsg);
        return;
    }
    this.canvas.style.cursor = "crosshair";
    this.annotationType = "HLINK";
	this.hyperLinkDisplayText = displayText;
	this.hyperLinkURL = link;
    this.SetDrawMode();
};

AnnotationHolder.prototype.checkIfDoubleTap = function (e,myState){
var mouse = myState.getMouse(e);
 var touchStartX =mouse.x;
 var touchStartY = mouse.y;
 if((touchStartX <= myState.lastTouchMouseX-10) || (touchStartX >= myState.lastTouchMouseX+10)){
	 myState.isTouchMoved = true;
	}
    if((touchStartY <= myState.lastTouchMouseY-10) || (touchStartY >= myState.lastTouchMouseY+10)){
	 myState.isTouchMoved = true;
	}
 
if((myState.startTime -myState.lastTouchTime) > 0 && (myState.startTime - myState.lastTouchTime) < 600 && (myState.isTouchMoved == false)){
myState.DoubleClickEvent(e,myState);
}
else{
myState.DownEvent(e, myState);
}

}

AnnotationHolder.prototype.findAbsoluteMouseCoOrdinates = function (x,y)
{
	var offsetX = parseInt(this.viewer.viewArea.scrollLeft);
	 var offsetY = parseInt(this.viewer.viewArea.scrollTop);

	 var pointx = x - offsetX + this.viewer.viewerLeft;
	 var pointy = y - offsetY + this.viewer.viewerTop;
	 
	 var point = { 
			   x:pointx,
			   y:pointy
	 }
	 return point
}
AnnotationHolder.prototype.SetCurrentFreeTextProperties=function(annotObj,freetextAreaManager){
	if(annotObj.type=="STICKYNOTE")
		annotObj.fillColor=freetextAreaManager.backgroundColor;
	annotObj.fill = freetextAreaManager.fontColor;
	annotObj.fontName = freetextAreaManager.fontName;		
    annotObj.fontSize = freetextAreaManager.fontSize/VIEWER_MANAGER.ZoomFactor; //By Avinash for Bug #4281
    annotObj.bold =freetextAreaManager.bold;
    annotObj.italic = freetextAreaManager.italic;
    annotObj.underline = freetextAreaManager.underline;
    annotObj.strikeOut = freetextAreaManager.strikeout;
    annotObj.font_style = freetextAreaManager.font_style;    
}


AnnotationHolder.prototype.DrawImageStamps=function(imageStampList,index, attachment)
{
  
  getStampDocument(imageStampList,index, attachment);
};
AnnotationHolder.prototype.OpenHyperLinkDialog=function(hyperLinkDialog)
{
if((!this.viewer.horizontallyFlipped && !this.viewer.verticallyFlipped && (this.viewer.Angle % 360 == 0)) ||
        (this.viewer.horizontallyFlipped && this.viewer.verticallyFlipped && (this.viewer.Angle == 180))){		
		//hyperLinkDialog.style.visibility = "visible";	//Amber Beriwal on 09/12/2014 [Bug: 4125]
		//By Avinash Kumar for Bug #4219  
		document.getElementById('hyperLinkURL').value="http://";   
		showDialog("#hyperLinkDialog");
		document.getElementById('hyperLinkName').focus();
	}
	else{
		if (this.viewer.Angle != 0) {
			alert(OPALL_ERR_MESSAGE.AnnotationOnRotatedImageErrorMsg);
			return;
		}
		if (this.viewer.verticallyFlipped || this.viewer.horizontallyFlipped) {
			alert(OPALL_ERR_MESSAGE.AnnotationOnFlipImageErrorMsg);
			return;
		}
	}
};
AnnotationHolder.prototype.SetAttachNotePostition=function(point){
	var attachNoteWidth=parseInt(this.attachNoteUI.div.style.width);
	var attachNoteHeight=parseInt(this.attachNoteUI.div.style.height);
	var attachNoteLeft=point.x +10;
	var attachNoteTop=point.y+10;
	var maxWidth=this.viewer.viewerWidth > this.viewer.ImageCanvas.width ? this.viewer.ImageCanvas.width : 
	this.viewer.viewerWidth;
	var maxHeight=this.viewer.viewerHeight > this.viewer.ImageCanvas.height ? this.viewer.ImageCanvas.height : this.viewer.viewerHeight;
	if(point.x +attachNoteWidth > maxWidth){
		attachNoteLeft=point.x -attachNoteWidth;
	}	
	if(point.y +attachNoteHeight > maxHeight){
		attachNoteTop=point.y -attachNoteHeight;
	}
	this.attachNoteUI.div.style.left = attachNoteLeft+ "px";
    this.attachNoteUI.div.style.top = attachNoteTop + "px";
	this.attachNotePosition.left=point.x;
	this.attachNotePosition.top=point.y;
};
AnnotationHolder.prototype.drawZonePartition=function(zoneObject, x1,y1,x2,y2,bRClick){
	if(x2 < x1 || y2 < y1)
		return ;
    if(x1 < 0 || y1 < 0 || x2 < 0 || y2 < 0)
           return 0;
	if(bRClick==undefined || bRClick==false){
		var xResizeFactor   = this.viewer.ImageCanvas.width / this.viewer.ImageInfo.ImageWidth;	
		x1 = parseInt((x1 * xResizeFactor) + 0.5);
	}
	if(x1 < zoneObject.x)
		return 0;
	x1 = x1- zoneObject.x;
	var partitionObj=new Partition(x1,zoneObject,this.viewer);
	this.valid=false;
	return 1;
};
AnnotationHolder.prototype.GetExtractZoneDim=function(zoneObj){	
	var strPartitionInfo="";
	var xResizeFactor   = this.viewer.ImageInfo.ImageWidth/this.viewer.ImageCanvas.width;
	var yResizeFactor = this.viewer.ImageInfo.ImageHeight / this.viewer.ImageCanvas.height;
	var x1= zoneObj.x;
	var y1= zoneObj.y;
	var x2= zoneObj.w+x1;
	var y2= zoneObj.h+y1;
	x1 = parseInt(x1 * xResizeFactor + 0.5);
	y1 = parseInt(y1 * yResizeFactor + 0.5);
	x2 = parseInt(x2 * yResizeFactor + 0.5);
	y2 = parseInt(y2 * yResizeFactor + 0.5);
	if(zoneObj.partitions.length>0){		
		zoneObj.partitions = this.sortPartitionList(zoneObj.partitions);
		if(zoneObj.partitions.length>0)
		for(var i=0;i<zoneObj.partitions.length;i++){
				strPartitionInfo += (parseInt(zoneObj.partitions[i].x * xResizeFactor + 0.5) + x1) + "," + y1 + "," + (parseInt(zoneObj.partitions[i].x * xResizeFactor + 0.5) + x1) + "," + y2;
				if(i!=zoneObj.partitions.length-1){
					strPartitionInfo+=";";
				}
		}
	}
	var Info= x1+"," + y1+ ","+ x2+","+ y2;
	if(strPartitionInfo!="")
	Info += ";"+ strPartitionInfo;
	return Info;
};
/*
*  @Modified Komal Walia 08/02/2019  Bug ID:14601
*/
AnnotationHolder.prototype.deleteAllExtractZones=function(){
	var elementToDelete = [];
	var deletedElementsIndex = [];
	var count =0;
	for(var i = 0; i < this.annotationList.length ; i++){
		if(this.annotationList[i].type=="EZONE"){
            //modified by Komal Walia on 08/02/2019 for Bug id : 14601(OD Bugzilla)
			//elementToDelete[count] = jQuery.extend(true, {}, this.annotationList[i]);
			elementToDelete[count] = copyObj(this.annotationList[i]);
			deletedElementsIndex[count] = i;
			count++;
		}
	}
	for(var i = elementToDelete.length - 1; i >=0 ; i--){
		var key = deletedElementsIndex[i];		
		this.annotationList.splice(key, 1);		
	}
	this.zoneList=[];
    //modified by Komal Walia on 08/02/2019 for Bug id : 14601(OD Bugzilla)
	//var operation = {operationType: OPALL.OPERATION_TYPE.DELETE_ANNOTATION, positionList: deletedElementsIndex, elementList: elementToDelete};
	//this.viewer.addToOperationsList(operation);
	//to remove tooltip of attachnote annotation
	//document.getElementById("attachNoteTooltip").style.visibility = "hidden";
	//document.getElementById("attachNoteTooltip").innerHTML = "";                
	this.selection = [];
	this.selectionIndex = [];
	this.valid = false;
	this.change = true;
    //added by Komal Walia on 08/02/2019 for Bug id : 14601(OD Bugzilla)
	var page = this.viewer.document.Pages[this.viewer.displayedPage];
	this.viewer.AnnotationManager.DrawScaledAnnotation(this.viewer.AnnotationCanvas, this.viewer.AnnotationManager.annotationList, this.viewer.ZoomFactor * page.pageScale, this.viewer.ZoomFactor * page.pageScale);
	return 1;
};
AnnotationHolder.prototype.deletePartition=function(zoneObject){
	var partitionList = zoneObject.partitions;
	var selectedList=zoneObject.selectedPartitionIndex;
	var max=selectedList[0];
	var sortedList=[];
	for(var i=0; i<=zoneObject.selectedPartitionIndex.length-1;i++){
		var selected=zoneObject.selectedPartitionIndex[i];
		for(var j=i+ 1;j<=zoneObject.selectedPartitionIndex.length-1;j++){
			if(zoneObject.selectedPartitionIndex[j]< selected){
				var temp=selected;
				selected=zoneObject.selectedPartitionIndex[j];
				zoneObject.selectedPartitionIndex[j]=temp;
			}
		}
		sortedList[i]=selected;
	}	
	for(var i=zoneObject.selectedPartitionIndex.length-1; i>=0;i--){
		var key = sortedList[i];		
		partitionList.splice(key, 1);	
	}
};
AnnotationHolder.prototype.returnZoneInfo=function(zoneObj,bCreated){
	if(zoneObj == null || zoneObj==undefined){
		return 0;
	}
	//it will give dimensions of zone as well as dimensions of all the partitions related to that zone
	var info = this.GetExtractZoneDim(zoneObj);	
	var strPartitionInfo="";	
	var zoneDim="";
	var index = info.indexOf(";");
	if(index==-1){
		zoneDim = info.split(",");
	}
	else{
		zoneDim= ((info.slice(0,index)).split(",")).map(Number);
		strPartitionInfo=info.slice(index+1, info.length);		
	}
	TOOLKIT.callbackExtractZoneModified(zoneObj.zoneType,zoneDim[0],zoneDim[1],zoneDim[2],zoneDim[3],bCreated,zoneObj.id,strPartitionInfo);
	return 1;
};
AnnotationHolder.prototype.sortPartitionList=function(partitionList){
	for(var i=0;i<partitionList.length;i++){
		var min=partitionList[i].x;
		for(var j=i+1;j<partitionList.length;j++){
			if(min>partitionList[j].x){
				var temp = min;
				min = partitionList[j].x;
				partitionList[j].x= temp;
				//min=temp;
			}
		}
		partitionList[i].x=min;
	}
	return partitionList;
};
AnnotationHolder.prototype.clearPartition=function(zoneObject){
	var partitionList = zoneObject.partitions;
	if(	zoneObject.partitions.length>0)
		zoneObject.partitions=[];		
};
/*
*  @Modified Komal Walia 08/02/2019  Bug ID:14601
*/
AnnotationHolder.prototype.drawExtractZone = function(zoneType, x1, y1, x2, y2, zoneColor, thickness, isMutable, isDarkBackground,strPartitionInfo){
	//modified by Komal Walia on 08/02/2019 for Bug id : 14601(OD Bugzilla)
    var page = this.viewer.document.Pages[this.viewer.displayedPage];
    var xResizeFactor   = this.viewer.imageCanvas.width / page.width;
	var yResizeFactor   = this.viewer.imageCanvas.height / page.height;
	
    //commented by vishant gautam on 08/02/2019 not required for opall mobile
	// x1 = parseInt((x1 * xResizeFactor) + 0.5);
	// x2 = parseInt((x2 * xResizeFactor) + 0.5);
	// y1 = parseInt((y1 * yResizeFactor) + 0.5);
	// y2 = parseInt((y2 * yResizeFactor) + 0.5);
	var zoneWidth  = x2-x1;
	var zoneHeight = y2-y1;
	var annotationColor = this.GetAnnotationColor(zoneColor,true);
	var extractZoneObject = new ExtractZone(this.viewer,x1, y1, zoneWidth, zoneHeight, annotationColor,thickness,"VM", this.userID, this.currentGroupName,0,-1) ;
	extractZoneObject.zoneType = zoneType;
	extractZoneObject.thicknessLevel = thickness;
	extractZoneObject.thickness = ((thickness * this.viewer.ZoomFactor) < 1)?1:(thickness * this.viewer.ZoomFactor);
	extractZoneObject.isMutable = isMutable;
	if (isDarkBackground != null)
		extractZoneObject.zoneBackground = isDarkBackground;
	
	this.annotationList.push(extractZoneObject);
	this.zoneList.push(extractZoneObject);
	extractZoneObject.id = this.zoneList.length;
	this.viewer.AnnotationManager.valid = false;
    //modified by Komal Walia on 08/02/2019 for Bug id : 14601(OD Bugzilla)
	this.viewer.AnnotationManager.DrawScaledAnnotation(this.viewer.AnnotationCanvas, this.viewer.AnnotationManager.annotationList, this.viewer.ZoomFactor * page.pageScale, this.viewer.ZoomFactor * page.pageScale);
	//this.viewer.AnnotationManager.DrawScaledAnnotation(this.viewer.AnnotationCanvas, this.viewer.AnnotationManager.annotationList, 1, 1);
	// if ( this.viewer.ZoomLensForZoning && (this.viewer.ZoomLensForZoning[3] == "true"))
	// {
	  // this.viewer.ShowZoomLensForZone(x1,y1,zoneWidth,zoneHeight); 
	// }
	if(strPartitionInfo != null && strPartitionInfo!=""){		
		var infoArray=strPartitionInfo.split(";");			
		for(var list=0;list<infoArray.length;list++){
			var CoordArray = infoArray[list].split(",");
				CoordArray = CoordArray.map(Number);
			this.drawZonePartition(extractZoneObject,CoordArray[0],CoordArray[1],CoordArray[2],CoordArray[3]);
		}
	}
	//var addedAnnotation = this.annotationList[this.annotationList.length-1];
	//var operation = {operationType: OPALL.OPERATION_TYPE.ADD_NEW_ANNOTATION, position: this.annotationList.length, element: jQuery.extend(true, {}, addedAnnotation)};
	//this.viewer.addToOperationsList(operation);	
	//this.returnZoneInfo(extractZoneObject,true);//11.02.2015 to get information regarding zone
	return 1;
};

