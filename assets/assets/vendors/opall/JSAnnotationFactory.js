var document_version = '4446';
var document_release_version = '1.5.10.2';
/**
*   File :  JSAnnotationFactory.js 
* @modified  03/05/2019   Komal Walia    for Bug 5396
*                                           Function Modified:
*                                            TextStamp.draw
*                                            FreeText.draw
*                                            StickyNote.draw
*                                            HyperLink.draw
*                                           Ref: OpAll-Mobile-MS-07, OpAll-Mobile-CR-07
*/
/*
#@c
Class    : GetAnnotationObject

Description:
This is the class that is used to create the object of the specified annotation.

Arguments:
        1)type   : type of annotation
        2)mx     : starting x coordinate of annotation
        3)my     : starting y coordinate of annotation
        4)width  : Width of annotation
        5)height : Height of annotation
        6)fill   : Color of annotation

@author   25/11/2013    Aditya Kamra
#@e
*/
function GetAnnotationObject(viewerManager,type, mx, my, width, height, strokeColor,thickness,userRights,userName,groupID,fillcolor,timeorder) {
    if (type == "HLT")
        return (new Highlight(viewerManager, mx, my, width, height, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder));
    else if (type == "LNE")
        return (new Line(viewerManager, mx, my, width, height, strokeColor, thickness, userRights, userName, groupID, fillcolor,timeorder));
    else if (type == "BOX")
        return (new Box(viewerManager, mx, my, width, height, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder));
    else if (type == "FRECT")
        return (new FilledRect(viewerManager, mx, my, width, height, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder));
    else if (type == "FRH")
        return (new FreeHand(viewerManager, mx, my, width, height, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder));
    else if (type == "DLNE")
        return (new DashedLine(viewerManager, mx, my, width, height, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder));
    else if (type == "LALNE")
        return (new LeadingArrowLine(viewerManager, mx, my, width, height, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder));
    else if (type == "TALNE")
        return (new TrailingArrowLine(viewerManager, mx, my, width, height, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder));
    else if (type == "DALNE")
        return (new DoubleArrowLine(viewerManager, mx, my, width, height, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder));
    else if (type == "ELLI")
        return (new Ellipse(viewerManager, mx, my, width, height, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder));
    else if (type == "FELLI")
        return (new FilledEllipse(viewerManager, mx, my, width, height, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder));
    else if (type == "DZONE")
        return (new DynamicZone(viewerManager, mx, my, width, height, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder));
	else if (type == "EZONE")//Added on 11.02.2015 to draw extract zone on mouse click
        return (new ExtractZone(viewerManager, mx, my, width, height, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder));
    else if (type == "WIPOUT")
        return (new WipeOut(viewerManager, mx, my, width, height, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder));
    else if (type == "TXTSTAMP") {
        var txtStamp = new TextStamp(viewerManager, mx, my, width, height, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder);
        if (viewerManager.AnnotationManager.selectedTxtStampID != -1){
				txtStamp.fillProperties(viewerManager.AnnotationManager.textStampSelectionList[viewerManager.AnnotationManager.selectedTxtStampID - 1]);
				viewerManager.AnnotationManager.selectedTxtStampID=-1;
				}
        return (txtStamp);
    }
    else if (type == "IMGSTAMP") {
        var imgStamp = new ImageStamp(viewerManager, mx, my, width, height, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder);
        if (viewerManager.AnnotationManager.selectedImgStampID != -1){
				imgStamp.fillProperties(viewerManager.AnnotationManager.stampImageObjectList[viewerManager.AnnotationManager.selectedImgStampID - 1]);
				viewerManager.AnnotationManager.selectedImgStampID=-1;
			}
        return (imgStamp);
    }
    else if (type == "FREETXT") {
        var freetext = (new FreeText(viewerManager, mx, my, width, height, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder));
        if (viewerManager.AnnotationManager.FreeTextAreaManager != null)
            freetext.fillProperties(viewerManager.AnnotationManager.FreeTextAreaManager);
        return freetext;
    }
    else if (type == "STICKYNOTE") {
        var stickynote = (new StickyNote(viewerManager, mx, my, width, height, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder));
        if (viewerManager.AnnotationManager.FreeTextAreaManager != null)
            stickynote.fillProperties(viewerManager.AnnotationManager.FreeTextAreaManager);
        return stickynote;
    }
    else if (type == "ATTACHNOTE") {
        return (new AttachNote(viewerManager, mx, my, width, height, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder));        
    }
	else if (type == "HLINK") {
        var hyperLink = new HyperLink(viewerManager, mx, my, width, height, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder);
        hyperLink.fillProperties();
        return 	hyperLink;
	}
	
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// HighLight Annoation //////////////////////////////////////////////////////////////////////////////////////////////

/*
#@c
Class    : Highlight

Description:
Constructor of the highlight annotation.

Arguments:
        1) mx     : starting x coordinate of annotation
        2) my     : starting y coordinate of annotation
        3) width  : Width of annotation
        4) height : Height of annotation
        5)fill    : Color of annotation

@author   25/11/2013    Aditya Kamra
#@e
*/
function Highlight(viewerManager, x, y, w, h, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder) {
    // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
    // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
    // But we aren't checking anything else!
    this.viewer = viewerManager;
    this.type = "HLT";
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.fill = strokeColor || '#AAAAAA';
    this.NoRedrawOnCreation = false;
    this.mousesensitivity = 1;
    this.groupid = groupID;
    this.userid = userName;
    this.rights = userRights;
    this.timeorder = timeorder;
    this.alpha = 0.7;
	this.properties = [false,false,true,false,false,true,true];
    }

/*
#@c
Class    : Highlight
Access   : Private
Function : Draw
Arguments:
        ctx: context on which annotation to be drawn

Description:
Draw highlight annotation to a given context

@author   25/11/2013    Aditya Kamra
#@e
*/

Highlight.prototype.draw = function (ctx) {
    ctx.fillStyle = this.fill;
    ctx.globalAlpha = this.alpha;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.globalAlpha = 1;

}

/*
#@c
Class    : Highlight
Access   : Private
Function : contains
Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

Description:
This function determines if a point is inside the shape's bounds

@author   25/11/2013    Aditya Kamra
#@e
*/

Highlight.prototype.contains = function (mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Height) and its Y and (Y + Height)
    return (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my);
}

/*
 #@c
 Class    : HighLight
 Access   : Private
 Function : contains
 Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

 Description:
 This function determines if current point lies on the  bottom right of selection box of annotation.
 If so, annotation is eligible for resizing.

 @author  07/08/2014    Swati
 #@e
 */
Highlight.prototype.isResize = function (mx, my) {
    return ((this.x+this.w -15)<= mx) && ((this.x + this.w +10)>= mx) &&
          ((this.y+this.h-15)<= my) && ((this.y + this.h+10)>= my);
}
/*
#@c
Class    : Highlight
Access   : Private
Function : drawDrag
Arguments:
        1)X:   X position where mouse is being dragged
        2)Y:   Y position where mouse is being dragged
        3)ctx: context on which annotation to be drawn

Description:
This function is used to re draw the annotation while it is being drawn first time

@author   25/11/2013    Aditya Kamra
#@e
*/

Highlight.prototype.drawDrag = function (X, Y, ctx) {
    this.w = X - this.x;
    this.h = Y - this.y;
}


/*
#@c
Class    : Highlight
Access   : Private
Function : Drag
Arguments:
        1)X:   X position where mouse is being dragged
        2)Y:   Y position where mouse is being dragged

Description:
 This function is used to re draw the annotation while it is being dragged after selection.

@author   25/11/2013    Aditya Kamra
#@e
*/

Highlight.prototype.Drag = function (X, Y) {
    this.x = X;
    this.y = Y;
}

/*
#@c
Class    : Highlight
Access   : Private
Function : select
Arguments:
        ctx: current context

Description:
This function is called when annotation is moved

@author   25/11/2013    Aditya Kamra
#@e
*/

Highlight.prototype.select = function (ctx) {
		if(this.fill=="#000000")
			ctx.strokeStyle = 'Red';
		else
			ctx.strokeStyle = 'black';
		ctx.strokeRect((this.x - 2), (this.y - 2), 2, 2);
       ctx.strokeRect((this.x + this.w), (this.y - 2), 2, 2);
       ctx.strokeRect((this.x - 2), (this.y + this.h), 2, 2);
       ctx.font ="18px Arial";
	   ctx.strokeText("+",this.x+this.w-4, this.y+this.h+3); 
}

/*
#@c
Class    : Highlight
Access   : Private
Function : save
Arguments: None

Description:
This function is called to save Highlight Annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

Highlight.prototype.save = function () {
    var x2 = this.w + this.x;   // get value of final x coordinate
    var y2 = this.y + this.h;  // get value of final y coordinate  


    var xResizeFactor = this.viewer.ImageInfo.ImageWidth / this.viewer.ImageCanvas.width;
    var yResizeFactor = this.viewer.ImageInfo.ImageHeight / this.viewer.ImageCanvas.height;

    var info = "";
    info = info + "X1=" + parseInt(this.x * xResizeFactor) + "\n";
    info = info + "Y1=" + parseInt(this.y * yResizeFactor) + "\n";
    info = info + "X2=" + parseInt(x2 * xResizeFactor) + "\n";
    info = info + "Y2=" + parseInt(y2 * yResizeFactor) + "\n";
    info = info + "Color=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fill) + "\n";
    info = info + "TimeOrder=" + this.timeorder + "\n";
    info = info + "MouseSensitivity=" + this.mousesensitivity + "\n";
    info = info + "AnnotationGroupID=" + this.groupid + "\n";
    info = info + "UserID=" + this.userid + "\n";
    info = info + "Rights=" + this.rights + "\n";
    return info;
}

/*
#@c
Class    : Highlight
Access   : Private
Function : Resize
Arguments: 
        1)xPreviousZoomFactor: previous x-zoom factor
        2)xCurrentZoomFactor:  current x-zoom factor
        3)yPreviousZoomFactor: previous y-zoom factor
        4)yCurrentZoomFactor:  current y-zoom factor

Description:
This function is called to resize annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

Highlight.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
    this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
    this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
    this.h = this.h * (yCurrentZoomFactor / yPreviousZoomFactor);
    this.w = this.w *(xCurrentZoomFactor / xPreviousZoomFactor);
}

/*
#@c
Class    : Highlight
Access   : Private
Function : rotate
Arguments: 
1)angle: Angle by which annotation should be rotated
2)ctx:   current context

Description:
This function is called to rotate annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

Highlight.prototype.rotate = function (angle, ctx) {
    //alert("Highlight rotate ");
    var temp = this.h;
    var temp1 = this.x;
    //if(angle==90)
    {

        this.x = canvas2.width - this.y - this.h;
        this.y = temp1;
        this.h = this.w;
        this.w = temp;
        //this.x=img.height-this.x;
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// Line Annotation ///////////////////////////////////////////////////////////////////////////////////////////////

/*
#@c
Class    : Line

Description:
Constructor of the Line annotation.

Arguments:
1) mx     : starting x coordinate of annotation
2) my     : starting y coordinate of annotation
3) width  : Width of annotation
4) height : Height of annotation
5)fill    : Color of annotation

@author   25/11/2013    Aditya Kamra
#@e
*/
function Line(viewerManager, x, y, endX, endY, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder) {
  // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
    // But we aren't checking anything else!
    this.viewer = viewerManager;
  this.type= "LNE"
  this.x = x || 0;
  this.y = y || 0;
  this.endX = x+1;
  this.endY = y;
  this.fill = strokeColor || '#AAAAAA';
  this.NoRedrawOnCreation = false;
  this.context = null;
  this.diffX = this.endX - this.x;
  this.diffY = this.endY - this.y;
  this.thickness = thickness;
  this.thicknessLevel = thickness;    
  this.mousesensitivity = 1;
  this.groupid = groupID;
  this.userid = userName;
  this.rights = userRights;
  this.timeorder = timeorder;
  this.properties = [false,false,true,false,false,true,true];
}

/*
#@c
Class    : Line
Access   : Private
Function : Draw
Arguments:
ctx: context on which annotation to be drawn

Description:
Draw LINE annotation to a given context

@author   25/11/2013    Aditya Kamra
#@e
*/

Line.prototype.draw = function (ctx) {
    this.context = ctx;    
    this.context.beginPath();
    this.context.moveTo(this.x, this.y);
    this.context.lineTo(this.endX, this.endY);
    this.context.strokeStyle = this.fill;
    this.context.lineWidth = this.thickness;
    this.context.stroke();
}

/*
#@c
Class    : Line
Access   : Private
Function : contains
Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

Description:
This function determines if a point is inside the shape's bounds

@author   25/11/2013    Aditya Kamra
#@e
*/

Line.prototype.contains = function(mx, my) {
  // All we have to do is make sure the Mouse X,Y fall in the area between
  // the shape's X and (X + Height) and its Y and (Y + Height)
   	var sx = parseInt(this.x);
	var ex =parseInt(this.endX);
	var sy=parseInt(this.y);
	var ey=parseInt(this.endY);
	var dx=ex-sx;
	var dy=ey-sy;	   
	var c = dy*sx -dx*sy;
	var denominator=Math.sqrt((dx*dx)+(dy*dy));
	var distance=Math.abs(((-dy*mx) + (dx*my)+c)/denominator);	   
	var delta = this.thickness;
	if(this.thickness==1)
		delta=2;
	 else
		delta=this.thickness;	   
	if(distance < delta ){		
		if(((mx<ex && mx>sx) || (mx>ex && mx<sx)) || ((my<ey && my>sy) || (my>ey && my<sy))){
			return true;
		}
		else{
			return false;
		}
		return true;
	}
	else{
		return false;
	}  
}
/*
 #@c
 Class    : Line
 Access   : Private
 Function : contains
 Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

 Description:
 This function determines if current point lies on the  bottom right of selection box of annotation.
 If so, annotation is eligible for resizing.

 @author  07/08/2014    Swati
 #@e
 */
Line.prototype.isResize = function (mx, my) {
    // All we have to do is make sure the Mouse X,Y fall bottom right of selection box of annotation.

    return (this.endX - 15 <= mx) && (this.endX + 20 >= mx) &&
          (this.endY - 15 <= my) && (this.endY + 20 >= my);
}

/*
#@c
Class    : Line
Access   : Private
Function : drawDrag
Arguments:
        1)X:   X position where mouse is being dragged
        2)Y:   Y position where mouse is being dragged
        3)ctx: context on which annotation to be drawn

Description:
This function is used to re draw the annotation while it is being drawn first time

@author   25/11/2013    Aditya Kamra
#@e
*/

Line.prototype.drawDrag = function(X,Y,ctx) {
this.endX = X;
this.endY = Y;
this.diffX = this.endX - this.x;
this.diffY = this.endY - this.y;
}

/*
#@c
Class    : Line
Access   : Private
Function : Drag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged

Description:
This function is used to re draw the annotation while it is being dragged after selection.

@author   25/11/2013    Aditya Kamra
#@e
*/

Line.prototype.Drag  = function(X,Y) {
this.x = X;
this.y = Y; 
this.endX = this.x + this.diffX;
this.endY = this.y + this.diffY;
}

/*
#@c
Class    : Line
Access   : Private
Function : select
Arguments:
ctx: current context

Description:
This function is called when annotation is moved

@author   25/11/2013    Aditya Kamra
#@e
*/

Line.prototype.select = function (ctx) {
	if( this.fill=="#000000")
		ctx.strokeStyle = 'Red';
	else
		ctx.strokeStyle = 'black';
    ctx.strokeRect(this.x, this.y, 4, 4);
	ctx.font ="18px Arial";
	ctx.strokeText("+",this.endX-2, this.endY+3); 
}

/*
#@c
Class    : Line
Access   : Private
Function : save
Arguments: None

Description:
This function is called to save Highlight Annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

Line.prototype.save = function () {
    var info = "";
    var xResizeFactor = this.viewer.ImageInfo.ImageWidth / this.viewer.ImageCanvas.width;
    var yResizeFactor = this.viewer.ImageInfo.ImageHeight/ this.viewer.ImageCanvas.height;
    info = info + "X1=" + parseInt(this.x * xResizeFactor) + "\n";
    info = info + "Y1=" + parseInt(this.y * yResizeFactor) + "\n";
    info = info + "X2=" + parseInt(this.endX * xResizeFactor) + "\n";
    info = info + "Y2=" + parseInt(this.endY * yResizeFactor) + "\n";
    info = info + "Color=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fill) + "\n";
    info = info + "TimeOrder=" + this.timeorder + "\n";
    info = info + "MouseSensitivity=" + this.mousesensitivity + "\n";
    info = info + "AnnotationGroupID=" + this.groupid + "\n";
    info = info + "UserID=" + this.userid + "\n";
    info = info + "Rights=" + this.rights + "\n";
    info = info + "Thickness=" + this.thicknessLevel + "\n";
    info = info + "Style=" + 0 + "\n";
    return info;
}

/*
#@c
Class    : Line
Access   : Private
Function : Resize
Arguments: 
1)xPreviousZoomFactor: previous x-zoom factor
2)xCurrentZoomFactor:  current x-zoom factor
3)yPreviousZoomFactor: previous y-zoom factor
4)yCurrentZoomFactor:  current y-zoom factor

Description:
This function is called to resize annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

Line.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
    this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
    this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
    this.endX = this.endX * (xCurrentZoomFactor / xPreviousZoomFactor);
    this.endY = this.endY * (yCurrentZoomFactor / yPreviousZoomFactor);
    this.diffX = this.endX - this.x;
    this.diffY = this.endY - this.y;
    this.thickness = parseInt(this.thicknessLevel * xCurrentZoomFactor);
    if (this.thickness == 0)
        this.thickness = 1;
}

/*
#@c
Class    : Line
Access   : Private
Function : rotate
Arguments: 
1)angle: Angle by which line should be rotated
2)ctx:   current context

Description:
This function is called to rotate annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

Line.prototype.rotate = function (angle, ctx) {
    var temp = this.x;
    var temp1 = this.endX;
    this.x = canvas2.width - this.y;
    this.y = temp;
    this.endX = canvas2.width - this.endY;
    this.endY = temp1;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////// Box Annotation///////////////////////////////////////////////////////////////////////

/*
#@c
Class    : Box

Description:
Constructor of the Box annotation.

Arguments:
        1) mx     : starting x coordinate of annotation
        2) my     : starting y coordinate of annotation
        3) width  : Width of annotation
        4) height : Height of annotation
        5)fill    : Color of annotation

@author   25/11/2013    Aditya Kamra
#@e
*/

function Box(viewerManager, x, y, w, h, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder) {
  // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
    // But we aren't checking anything else!
    this.viewer = viewerManager;
  this.type= "BOX" ;
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 1;
  this.h = h || 1;
  this.fill = strokeColor || '#AAAAAA';
  this.NoRedrawOnCreation = false;
  //Nikhil Barar [Bug:4078]
  //this.thickness = viewerManager.AnnotationManager.penThickness[this.type];
  //this.thicknessLevel = viewerManager.AnnotationManager.penThickness[this.type];
  this.thickness = thickness;  
  this.thicknessLevel = thickness;
  this.mousesensitivity = 1;
  this.groupid = groupID;
  this.userid = userName;
  this.rights = userRights;
  this.timeorder = timeorder;
  this.properties = [false,false,true,false,false,true,true];
}

/*
#@c
Class    : Box
Access   : Private
Function : Draw
Arguments:
        ctx: context on which annotation to be drawn

Description:
Draw Box annotation to a given context

@author   25/11/2013    Aditya Kamra
#@e
*/

Box.prototype.draw = function(ctx) {
    ctx.strokeStyle = this.fill;
    ctx.lineWidth = this.thickness;
  ctx.strokeRect(this.x, this.y, this.w, this.h);
}

/*
#@c
Class    : Box
Access   : Private
Function : contains
Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

Description:
This function determines if a point is inside the shape's bounds

@author   25/11/2013    Aditya Kamra
#@e
*/

Box.prototype.contains = function (mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Height) and its Y and (Y + Height) 
        return (this.x <= mx) && (this.x + this.w >= mx) &&
              (this.y <= my) && (this.y + this.h >= my);
};

/*
 #@c
 Class    : Box
 Access   : Private
 Function : contains
 Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

 Description:
 This function determines if current point lies on the  bottom right of selection box of annotation.
 If so, annotation is eligible for resizing.

 @author  07/08/2014    Swati
 #@e
 */
Box.prototype.isResize = function (mx, my) {
    return ((this.x+this.w -15)<= mx) && ((this.x + this.w +10)>= mx) &&
          ((this.y+this.h-15)<= my) && ((this.y + this.h+10)>= my);
}
/*
#@c
Class    : Box
Access   : Private
Function : drawDrag
Arguments:
        1)X:   X position where mouse is being dragged
        2)Y:   Y position where mouse is being dragged
        3)ctx: context on which annotation to be drawn

Description:
This function is used to re draw the annotation while it is being drawn first time

@author   25/11/2013    Aditya Kamra
#@e
*/

Box.prototype.drawDrag = function (X, Y, ctx) {
    this.w = X - this.x;
    this.h = Y - this.y;    
}


/*
#@c
Class    : Box
Access   : Private
Function : Drag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged

Description:
This function is used to re draw the annotation while it is being dragged after selection.

@author   25/11/2013    Aditya Kamra
#@e
*/

Box.prototype.Drag  = function(X,Y) {
this.x = X;
this.y = Y;  
};

/*
#@c
Class    : Box
Access   : Private
Function : select
Arguments:
ctx: current context

Description:
This function is called when annotation is moved

@author   25/11/2013    Aditya Kamra
#@e
*/

Box.prototype.select = function (ctx) {
	if(this.fill=="#000000")
		ctx.strokeStyle = 'Red';
	else
		ctx.strokeStyle = 'black';
	ctx.strokeRect((this.x-2),(this.y -2),2,2);
	ctx.strokeRect((this.x+this.w),(this.y-2),2,2);
	ctx.strokeRect((this.x-2),(this.y+this.h),2,2);
	ctx.font ="18px Arial";
	ctx.strokeText("+",this.x+this.w-4, this.y+this.h+3); 
}

/*
#@c
Class    : Box
Access   : Private
Function : save
Arguments: None

Description:
This function is called to save Highlight Annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

Box.prototype.save = function () {

    var x2 = this.w + this.x;   // get value of final x coordinate
    var y2 = this.y + this.h;  // get value of final y coordinate  


    var xResizeFactor = this.viewer.ImageInfo.ImageWidth / this.viewer.ImageCanvas.width;
    var yResizeFactor = this.viewer.ImageInfo.ImageHeight / this.viewer.ImageCanvas.height;

    var info = "";
    info = info + "X1=" + parseInt(this.x * xResizeFactor) + "\n";
    info = info + "Y1=" + parseInt(this.y * yResizeFactor) + "\n";
    info = info + "X2=" + parseInt(x2 * xResizeFactor) + "\n";
    info = info + "Y2=" + parseInt(y2 * yResizeFactor) + "\n";
    info = info + "Color=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fill) + "\n";
    info = info + "TimeOrder=" + this.timeorder + "\n";
    info = info + "MouseSensitivity=" + this.mousesensitivity + "\n";
    info = info + "AnnotationGroupID=" + this.groupid + "\n";
    info = info + "UserID=" + this.userid + "\n";
    info = info + "Rights=" + this.rights + "\n";
    info = info + "Thickness=" + this.thicknessLevel + "\n";
    info = info + "FillColor=" + "4294967295" + "\n";
    return info;
}

/*
#@c
Class    : Box
Access   : Private
Function : Resize
Arguments: 
1)xPreviousZoomFactor: previous x-zoom factor
2)xCurrentZoomFactor:  current x-zoom factor
3)yPreviousZoomFactor: previous y-zoom factor
4)yCurrentZoomFactor:  current y-zoom factor

Description:
This function is called to resize annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

Box.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
    this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
    this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
    this.h = this.h * (yCurrentZoomFactor / yPreviousZoomFactor);
    this.w = this.w * (xCurrentZoomFactor / xPreviousZoomFactor);
    this.thickness = parseInt(this.thicknessLevel * xCurrentZoomFactor);
    if (this.thickness == 0)
        this.thickness = 1;
}

/*
#@c
Class    : Box
Access   : Private
Function : rotate
Arguments: 
1)angle: Angle by which box should be rotated
2)ctx:   current context

Description:
This function is called to rotate annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

Box.prototype.rotate = function (angle, ctx) {
    var temp = this.h;
    var temp1 = this.x;
    this.x = canvas2.width - this.y - this.h;
    this.y = temp1;
    this.h = this.w;
    this.w = temp;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////// Filled Rect Annotation/////////////////////////////////////////////////////

/*
#@c
Class    : FilledRect

Description:
Constructor of the Filled Rectangle annotation.

Arguments:
1) mx     : starting x coordinate of annotation
2) my     : starting y coordinate of annotation
3) width  : Width of annotation
4) height : Height of annotation
5)fill    : Color of annotation

@author   25/11/2013    Aditya Kamra
#@e
*/

function FilledRect(viewerManager, x, y, w, h, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder) {
    // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
    // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
    // But we aren't checking anything else!
    this.viewer = viewerManager;
    this.type = "FRECT";
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.fill = strokeColor || '#AAAAAA';
    this.fillColor = fillcolor || '#AAAAAA';
    this.NoRedrawOnCreation = false;
    this.thickness = viewerManager.AnnotationManager.penThickness[this.type];
    this.thicknessLevel = viewerManager.AnnotationManager.penThickness[this.type];
    this.mousesensitivity = 1;
    this.groupid = groupID;
    this.userid = userName;
    this.rights = userRights;
    this.timeorder = timeorder;
    this.properties = [false,false,true,false,false,true,true];
}

/*
#@c
Class    : FilledRect
Access   : Private
Function : Draw
Arguments:
        ctx: context on which annotation to be drawn

Description:
Draw Filled Rectangle annotation to a given context

@author   25/11/2013    Aditya Kamra
#@e
*/

FilledRect.prototype.draw = function (ctx) {
    //ctx.strokeStyle = this.fill;
    //ctx.lineWidth = this.thickness;
    ctx.fillStyle = this.fillColor;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    //ctx.fillRect(this.x + this.thickness/2, this.y + this.thickness/2, this.w - this.thickness, this.h - this.thickness);
	 }


 /*
 #@c
 Class    : FilledRect
 Access   : Private
 Function : contains
 Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

 Description:
 This function determines if a point is inside the shape's bounds

 @author   25/11/2013    Aditya Kamra
 #@e
 */

FilledRect.prototype.contains = function (mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Height) and its Y and (Y + Height)
    return (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my);
}

/*
 #@c
 Class    : FilledRect
 Access   : Private
 Function : contains
 Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

 Description:
 This function determines if current point lies on the  bottom right of selection box of annotation.
 If so, annotation is eligible for resizing.

 @author  06/08/2014    Swati
 #@e
 */
FilledRect.prototype.isResize = function (mx, my) {
    return ((this.x+this.w -15)<= mx) && ((this.x + this.w +10)>= mx) &&
          ((this.y+this.h-15)<= my) && ((this.y + this.h+10)>= my);
}
/*
#@c
Class    : FilledRect
Access   : Private
Function : drawDrag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged
3)ctx: context on which annotation to be drawn

Description:
This function is used to re draw the annotation while it is being drawn first time

@author   25/11/2013    Aditya Kamra
#@e
*/

FilledRect.prototype.drawDrag = function (X, Y, ctx) {
    this.w = X - this.x;    
    this.h = Y - this.y;    
}


/*
#@c
Class    : FilledRect
Access   : Private
Function : Drag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged

Description:
This function is used to re draw the annotation while it is being dragged after selection.

@author   25/11/2013    Aditya Kamra
#@e
*/

FilledRect.prototype.Drag = function (X, Y) {
    this.x = X;
    this.y = Y;
}


/*
#@c
Class    : FilledRect
Access   : Private
Function : select
Arguments:
ctx: current context

Description:
This function is called when annotation is moved

@author   25/11/2013    Aditya Kamra
#@e
*/

FilledRect.prototype.select = function (ctx) {
	if(this.fillColor=="#000000")
		ctx.strokeStyle = 'Red';
	else
		ctx.strokeStyle = 'black';
    ctx.strokeRect((this.x - 2), (this.y - 2), 2, 2);
    ctx.strokeRect((this.x + this.w), (this.y - 2), 2, 2);
    ctx.strokeRect((this.x - 2), (this.y + this.h), 2, 2);
	ctx.font ="18px Arial";
	ctx.strokeText("+",this.x + this.w-4, this.y + this.h+3); 
}

/*
#@c
Class    : FilledRect
Access   : Private
Function : save
Arguments: None

Description:
This function is called to save Highlight Annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

FilledRect.prototype.save = function () {
    var x2 = this.w + this.x;       // get value of final x coordinate
    var y2 = this.y + this.h;      // get value of final y coordinate  

    var xResizeFactor = this.viewer.ImageInfo.ImageWidth / this.viewer.ImageCanvas.width;
    var yResizeFactor = this.viewer.ImageInfo.ImageHeight / this.viewer.ImageCanvas.height;

    var info = "";
    info = info + "X1=" + parseInt(this.x * xResizeFactor) + "\n";
    info = info + "Y1=" + parseInt(this.y * yResizeFactor) + "\n";
    info = info + "X2=" + parseInt(x2 * xResizeFactor) + "\n";
    info = info + "Y2=" + parseInt(y2 *yResizeFactor) + "\n";
    info = info + "Color=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fill) + "\n";
    info = info + "TimeOrder=" + this.timeorder + "\n";
    info = info + "MouseSensitivity=" + this.mousesensitivity + "\n";
    info = info + "AnnotationGroupID=" + this.groupid + "\n";
    info = info + "UserID=" + this.userid + "\n";
    info = info + "Rights=" + this.rights + "\n";
    info = info + "Thickness=" + this.thicknessLevel + "\n";
    info = info + "FillColor=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fillColor) + "\n";
    return info;
}

/*
#@c
Class    : FilledRect
Access   : Private
Function : Resize
Arguments: 
1)xPreviousZoomFactor: previous x-zoom factor
2)xCurrentZoomFactor:  current x-zoom factor
3)yPreviousZoomFactor: previous y-zoom factor
4)yCurrentZoomFactor:  current y-zoom factor

Description:
This function is called to resize annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

FilledRect.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
    this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
    this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
    this.h = this.h * (yCurrentZoomFactor / yPreviousZoomFactor);
    this.w = this.w *(xCurrentZoomFactor / xPreviousZoomFactor);
    this.thickness = parseInt(this.thicknessLevel * xCurrentZoomFactor);
    if (this.thickness == 0)
        this.thickness = 1;
}

/*
#@c
Class    : FilledRect
Access   : Private
Function : rotate
Arguments: 
1)angle: Angle by which rectangle should be rotated
2)ctx:   current context

Description:
This function is called to rotate annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

FilledRect.prototype.rotate = function (angle, ctx) {

    // alert("Box rotate ");
    // alert(this.x);
    // alert(this.y);
    // alert(this.w);
    // alert(this.h);
    var temp = this.h;
    var temp1 = this.x;
    //if(angle==90)
    {
        //var startPt= RotateAll(angle,this.x,this.y,img.width,img.height);
        //this.x=img.height-this.y-this.h;
        //this.y=temp1;
        this.x = canvas2.width - this.y - this.h;
        this.y = temp1;
        this.h = this.w;
        this.w = temp;        
    }    
};

/////////////////////////////////////////Free Hand Annotation ///////////////////////////////////////////////////////////// 

/*
#@c
Class    : FreeHand

Description:
Constructor of the Free Hand annotation.

Arguments:
1) mx     : starting x coordinate of annotation
2) my     : starting y coordinate of annotation
3) width  : Width of annotation
4) height : Height of annotation
5)fill    : Color of annotation

@author   25/11/2013    Aditya Kamra
#@e
*/
function FreeHand(viewerManager, x, y, w, h, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder) {
    // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
    // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
    // But we aren't checking anything else!
    this.viewer = viewerManager;
    this.type = "FRH";
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.fill = strokeColor || '#AAAAAA';
    this.NoRedrawOnCreation = true;

    this.maxX = x;
    this.maxY = y;
    this.minX = x;
    this.minY = y;
    this.lastX = x;
    this.lastY = y;
    this.diffMaxXtoStartX = 0;
    this.diffMaxYtoStartY = 0;
    this.diffMinXtoStartX = 0;
    this.diffMinYtoStartY = 0;
    this.listX = [];
    this.listY = [];
    this.firstDraw = true;
    this.mousesensitivity = 1;
    this.groupid = groupID;
    this.userid = userName;
    this.rights = userRights;
    this.timeorder = timeorder;
    this.noofpoints = 0;    
    this.thickness =thickness;
    this.thicknessLevel = thickness;
    this.listArrayX = [];
    this.listArrayY = [];
    this.listPointCount = [];    
    this.properties = [false,false,true,false,false,true,true];
}

/*
#@c
Class    : FreeHand
Access   : Private
Function : Draw
Arguments:
ctx: context on which annotation to be drawn

Description:
Draw FreeHand annotation to a given context

@author   25/11/2013    Aditya Kamra
#@e
*/

FreeHand.prototype.draw = function (ctx) {
//     if (this.firstDraw) {      
//         this.firstDraw = false;
//         this.interpolate();
//     }
//     ctx.fillStyle = this.fill;
//     var length = this.listArrayX.length;
//     for (var i = 0; i < length; i++) {
//         for (var k = 0; k < this.listArrayX[i].length; k++)
//             ctx.fillRect((this.x + this.listArrayX[i][k]), (this.y + this.listArrayY[i][k]), this.thickness, this.thickness);	//Amber Beriwal on 09/12/2014 [Bug: 4110, 4137]
//            / //ctx.fillRect((this.x + this.listArrayX[i][k]), (this.y + this.listArrayY[i][k]), this.thickness, 2)
//     }
}

/*
#@c
Class    : FreeHand
Access   : Private
Function : contains
Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

Description:
This function determines if a point is inside the shape's bounds

@author   25/11/2013    Aditya Kamra
#@e
*/

FreeHand.prototype.contains = function (mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Height) and its Y and (Y + Height)  
    return (this.minX <= mx) && (this.maxX >= mx) &&
           (this.minY <= my) && (this.maxY >= my);
}

  /*
 #@c
 Class    : FreeHand
 Access   : Private
 Function : contains
 Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

 Description:
 This function determines if current point lies on the  bottom right of selection box of annotation.
 If so, annotation is eligible for resizing.

 @author  06/08/2014    Swati
 #@e
 */
FreeHand.prototype.isResize = function (mx, my) {    
		  return false;
}
FreeHand.prototype.refreshPointsCaptureList = function () {

    this.listArrayX.push(this.listX);
    this.listArrayY.push(this.listY);
    this.listPointCount.push(this.listX.length);
    this.listX = [];
    this.listY = [];
}


FreeHand.prototype.resetLastPoint = function (x, y) {

    this.lastX = x;
    this.lastY = y;

}


/*
#@c
Class    : FreeHand
Access   : Private
Function : drawDrag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged
3)ctx: context on which annotation to be drawn

Description:
This function is used to re draw the annotation while it is being drawn first time

@author   25/11/2013    Aditya Kamra
#@e
*/

FreeHand.prototype.drawDrag = function (X, Y, ctx) {
    if (X > this.maxX)
        this.maxX = X;
    if (X < this.minX)
        this.minX = X;
    if (Y > this.maxY)
        this.maxY = Y;
    if (Y < this.minY)
        this.minY = Y;

    this.diffMaxXtoStartX = this.maxX - this.x;
    this.diffMinXtoStartX = this.minX - this.x;
    this.diffMaxYtoStartY = this.maxY - this.y;
    this.diffMinYtoStartY = this.minY - this.y;
    this.w = this.maxX - this.x;
    this.h = this.maxY - this.y;
    // ctx.fillRect(X,Y,3,1)
    ctx.lineWidth = this.thickness;
    ctx.strokeStyle = this.fill;
    ctx.beginPath();
    ctx.moveTo(this.lastX, this.lastY);
    ctx.lineTo(X, Y);
    ctx.stroke();
    this.lastX = X;
    this.lastY = Y;

    var diffX = X - this.x;
    var diffY = Y - this.y;

    this.listX.push(diffX);
    this.listY.push(diffY);

}

/*
#@c
Class    : FreeHand
Access   : Private
Function : Drag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged

Description:
This function is used to re draw the annotation while it is being dragged after selection.

@author   25/11/2013    Aditya Kamra
#@e
*/

FreeHand.prototype.Drag = function (X, Y) {
    this.x = X;
    this.y = Y;

    this.maxX = this.x + this.diffMaxXtoStartX;
    this.maxY = this.y + this.diffMaxYtoStartY;
    this.minX = this.x + this.diffMinXtoStartX;
    this.minY = this.y + this.diffMinYtoStartY;
    this.w    = this.maxX - this.x;
    this.h    = this.maxY - this.y;
}


/*
#@c
Class    : FreeHand
Access   : Private
Function : select
Arguments:
ctx: current context

Description:
This function is called when annotation is moved

@author   25/11/2013    Aditya Kamra
#@e
*/

FreeHand.prototype.select = function (ctx) {
	if(this.fill=="#000000")
		ctx.strokeStyle = 'Red';
	else
		ctx.strokeStyle = 'black';	
    ctx.strokeRect(this.maxX, this.maxY, 2, 2);
    ctx.strokeRect(this.minX, this.minY, 2, 2);
    ctx.strokeRect(this.maxX, this.minY, 2, 2);
    ctx.strokeRect(this.minX, this.maxY, 2, 2);
}

/**
*   This function is called to interpolate the list of Points for the FreeHand annotation
*
*   @author   25/11/2013    Aditya Kamra
*/

FreeHand.prototype.interpolate = function () {
    for (var j = 0; j < this.listArrayX.length; j++) {
        this.listArrayX[j].splice(this.listPointCount[j]);
        this.listArrayY[j].splice(this.listPointCount[j]);
    }

    for (var j = 0; j < this.listArrayX.length; j++) {

        var length = this.listArrayX[j].length - 1;
        for (var i = 0; i < length; i++) {
            var x1 = this.listArrayX[j][i];
            var y1 = this.listArrayY[j][i];

            var x2 = this.listArrayX[j][i + 1];
            var y2 = this.listArrayY[j][i + 1];

            var flag = true;
            while (flag) {
                var X = x1;
                var Y = y1;
                if (X > x2)
                    X = X - 1;
                else if (X < x2)
                    X = X + 1;
                if (Y > y2)
                    Y = Y - 1;
                else if (Y < y2)
                    Y = Y + 1;
                if ((X != x2) || (Y != y2)) {
                    this.listArrayX[j].push(X);
                    this.listArrayY[j].push(Y);
                    x1 = X;
                    y1 = Y;

                }
                else {
                    flag = false;
                    break;
                }
            }
        }
    }
}

/*
#@c
Class    : FreeHand
Access   : Private
Function : save
Arguments: None

Description:
This function is called to save Highlight Annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

FreeHand.prototype.save = function () {

    var info = "";

    var xResizeFactor = this.viewer.ImageInfo.ImageWidth / this.viewer.ImageCanvas.width;
    var yResizeFactor = this.viewer.ImageInfo.ImageHeight / this.viewer.ImageCanvas.height;
    var x = this.x * xResizeFactor;
    var y = this.y * yResizeFactor;
    
    info = info + "X1=" + parseInt(x ) + "\n";
    info = info + "Y1=" + parseInt(y) + "\n";
    info = info + "X2=" + parseInt(this.maxX * xResizeFactor) + "\n";
    info = info + "Y2=" + parseInt(this.maxY * yResizeFactor) + "\n";
    info = info + "Color=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fill) + "\n";
    info = info + "TimeOrder=" + this.timeorder + "\n";
    info = info + "MouseSensitivity=" + this.mousesensitivity + "\n";
    info = info + "AnnotationGroupID=" + this.groupid + "\n";
    info = info + "UserID=" + this.userid + "\n";
    info = info + "Rights=" + this.rights + "\n";
    info = info + "Thickness=" + this.thicknessLevel + "\n";
    info = info + "Style=" + "1" + "\n";
    var points = 0;
    for (var pointCount = 0; pointCount < this.listPointCount.length; pointCount++) {
        points += this.listPointCount[pointCount];
    }
    info = info + "NoofPoints=" + points + "\n";
    var strXPos = "";
    var strYPos = "";
    for (var i = 0; i < this.listArrayX.length; i++) {
        var arrX = this.listArrayX[i].slice(0, this.listPointCount[i]);
        var arrY = this.listArrayY[i].slice(0, this.listPointCount[i]);
        for(var count = 0;count < this.listPointCount[i]; count++){
            arrX[count] *= xResizeFactor;
            arrY[count] *= yResizeFactor;
        }
        for (var j = 0; j < this.listPointCount[i]; j++) {
            arrX[j] = parseInt(arrX[j] + x);
            arrY[j] = parseInt(arrY[j] + y);
        }
        if (i != this.listArrayX.length - 1) {
            strXPos += arrX.toString() + ",-1,";
            strYPos += arrY.toString() + ",-1,";
        }
        else {
            strXPos += arrX.toString() + ",-1";
            strYPos += arrY.toString() + ",-1";
        }
    }
    info = info + "XPos=" + strXPos + "\n";
    info = info + "YPos=" + strYPos + "\n";
    return info;
}
/*
#@c
Class    : FreeHand
Access   : Private
Function : Resize
Arguments: 
1)xPreviousZoomFactor: previous x-zoom factor
2)xCurrentZoomFactor:  current x-zoom factor
3)yPreviousZoomFactor: previous y-zoom factor
4)yCurrentZoomFactor:  current y-zoom factor

Description:
This function is called to resize annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

FreeHand.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
//    this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
//    this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
//    this.maxX = this.maxX * (xCurrentZoomFactor / xPreviousZoomFactor);
//    this.maxY = this.maxY * (yCurrentZoomFactor / yPreviousZoomFactor);
//    this.minX = this.minX * (xCurrentZoomFactor / xPreviousZoomFactor);
//    this.minY = this.minY * (yCurrentZoomFactor / yPreviousZoomFactor);
//    this.w = this.maxX - this.minX;
//    this.h = this.maxY - this.minY;
//    for (var j = 0; j < this.listArrayX.length; j++) {
//        var length = this.listArrayX[j].length;
//        for (var i = 0; i < length; i++) {
//            this.listArrayX[j][i] = parseInt(this.listArrayX[j][i] * (xCurrentZoomFactor / xPreviousZoomFactor));
//            this.listArrayY[j][i] = parseInt(this.listArrayY[j][i] * (xCurrentZoomFactor / xPreviousZoomFactor));
//        }
//    }
//    this.thickness = parseInt(this.thicknessLevel * xCurrentZoomFactor);
//    if (this.thickness == 0)
//        this.thickness = 1;
//    this.interpolate();
//    this.firstDraw = false;

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////// Dashed Line Annotation///////////////////////////////////////////////////////////////////////////////////

/*
#@c
Class    : DashedLine

Description:
Constructor of the Dashed Line annotation.

Arguments:
1) mx     : starting x coordinate of annotation
2) my     : starting y coordinate of annotation
3) width  : Width of annotation
4) height : Height of annotation
5)fill    : Color of annotation

@author   25/11/2013    Aditya Kamra
#@e
*/

function DashedLine(viewerManager, x, y, w, h, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder) {
  // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
    // But we aren't checking anything else!
    this.viewer = viewerManager;
  this.type= "DLNE"
  this.x = x || 0;
  this.y = y || 0;
  this.endX = x+1;
  this.endY = y + 1;
  this.fill = strokeColor || '#AAAAAA';
  this.NoRedrawOnCreation = false;
  this.context = null;
  this.diffX = this.endX - this.x;
  this.diffY = this.endY - this.y;
  this.thickness = thickness;
  this.thicknessLevel = thickness;    
  this.mousesensitivity = 1;
  this.groupid = groupID;
  this.userid = userName;
  this.rights = userRights;
  this.timeorder = timeorder;
  this.dashlength = 5;
  this.spacelength = 5 ;
  this.properties = [false,false,true,false,false,true,true];
}

/*
#@c
Class    : DashedLine
Access   : Private
Function : Draw
Arguments:
        ctx: context on which annotation to be drawn

Description:
Draw Dashed Line annotation to a given context

@author   25/11/2013    Aditya Kamra
#@e
*/

DashedLine.prototype.draw = function (ctx) {
    var linelength = (Math.sqrt((this.diffX) * (this.diffX) + (this.diffY) * (this.diffY)))
    var dashes = (linelength / (this.dashlength));
    var dash_space_length = (linelength / (this.dashlength + this.spacelength));
    var xincdashspace = ((this.diffX) / dash_space_length);
    var yincdashspace = ((this.diffY) / dash_space_length);

    var dashX = ((this.diffX) / dashes);
    var dashY = ((this.diffY) / dashes);
    var counter = 0;
    this.context = ctx;
    this.context.beginPath();
   
    for (var i = 0; i < linelength - this.dashlength; i += this.dashlength + this.spacelength) {
        this.context.moveTo(this.x + xincdashspace * counter, this.y + yincdashspace * counter);
        this.context.lineTo(this.x + xincdashspace * counter + dashX, this.y + yincdashspace * counter + dashY);
        this.context.strokeStyle = this.fill;
        this.context.lineWidth = this.thickness;
        this.context.stroke();
        counter++;
    }
}

/*
#@c
Class    : DashedLine
Access   : Private
Function : contains
Arguments:
1)mx: current x-coordinate of mouse
2)my: current y-coordinate of mouse

Description:
This function determines if a point is inside the shape's bounds

@author   25/11/2013    Aditya Kamra
#@e
*/

DashedLine.prototype.contains = function (mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Height) and its Y and (Y + Height)
	var sx = parseInt(this.x);		
	var ex =parseInt(this.endX);
	var sy=parseInt(this.y);
	var ey=parseInt(this.endY);
	var dx=ex-sx;
	var dy=ey-sy;	   
	var c = dy*sx -dx*sy;
	var denominator=Math.sqrt((dx*dx)+(dy*dy));
	var distance=Math.abs(((-dy*mx) + (dx*my)+c)/denominator);
	var delta = this.thickness;
	if(this.thickness==1)
		delta=2;
	else
		delta=this.thickness;	   
	if(distance < delta ){		
		if(((mx<ex && mx>sx) || (mx>ex && mx<sx)) || ((my<ey && my>sy) || (my>ey && my<sy))){
			return true;
		}
		else{
			return false;
		}
		return true;
	}
	else{
		return false;
	}
}
/*
 #@c
 Class    : DashedLine
 Access   : Private
 Function : contains
 Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

 Description:
 This function determines if current point lies on the  bottom right of selection box of annotation.
 If so, annotation is eligible for resizing.

 @author  07/08/2014    Swati
 #@e
 */
DashedLine.prototype.isResize = function (mx, my) {
    // All we have to do is make sure the Mouse X,Y fall bottom right of selection box of annotation.
	
    return (this.endX-15<= mx) && (this.endX +20>= mx) &&
          (this.endY-15<= my) && (this.endY+20>= my);
}
/*
#@c
Class    : DashedLine
Access   : Private
Function : drawDrag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged
3)ctx: context on which annotation to be drawn

Description:
This function is used to re draw the annotation while it is being drawn first time

@author   25/11/2013    Aditya Kamra
#@e
*/

DashedLine.prototype.drawDrag = function(X,Y,ctx) {
this.endX = X;
this.endY = Y;
this.diffX = this.endX - this.x;
this.diffY = this.endY - this.y;
}

/*
#@c
Class    : DashedLine
Access   : Private
Function : Drag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged

Description:
This function is used to re draw the annotation while it is being dragged after selection.

@author   25/11/2013    Aditya Kamra
#@e
*/

DashedLine.prototype.Drag  = function(X,Y) {
this.x = X;
this.y = Y; 
this.endX = this.x + this.diffX;
this.endY = this.y + this.diffY; 

}

/*
#@c
Class    : DashedLine
Access   : Private
Function : select
Arguments:
ctx: current context

Description:
This function is called when annotation is moved

@author   25/11/2013    Aditya Kamra
#@e
*/

DashedLine.prototype.select = function (ctx)
{ 
	if(this.fill=="#000000")
		ctx.strokeStyle = 'Red';
	else
		ctx.strokeStyle = 'black';	
	ctx.strokeRect(this.x,this.y,4,4);
	ctx.font ="18px Arial";
	ctx.strokeText("+",this.endX-2, this.endY+3); 

}
/*
#@c
Class    : DashedLine
Access   : Private
Function : Resize
Arguments: 
1)xPreviousZoomFactor: previous x-zoom factor
2)xCurrentZoomFactor:  current x-zoom factor
3)yPreviousZoomFactor: previous y-zoom factor
4)yCurrentZoomFactor:  current y-zoom factor

Description:
This function is called to resize annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

DashedLine.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
    this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
    this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
    this.endX = this.endX * (xCurrentZoomFactor / xPreviousZoomFactor);
    this.endY = this.endY * (yCurrentZoomFactor / yPreviousZoomFactor);
    this.diffX = this.endX - this.x;
    this.diffY = this.endY - this.y;
    this.thickness = parseInt(this.thicknessLevel * xCurrentZoomFactor);
    if (this.thickness == 0)
        this.thickness = 1;
}

/*
#@c
Class    : DashedLine
Access   : Private
Function : rotate
Arguments: 
1)angle: Angle by which line should be rotated
2)ctx:   current context

Description:
This function is called to rotate annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

DashedLine.prototype.rotate = function (angle, ctx) {
    var temp = this.x;
    var temp1 = this.endX;
    this.x = canvas2.width - this.y;
    this.y = temp;
    this.endX = canvas2.width - this.endY;
    this.endY = temp1;
}

/*
#@c
Class    : DashedLine
Access   : Private
Function : save
Arguments: None

Description:
This function is called to save Highlight Annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

DashedLine.prototype.save = function()  {


    var xResizeFactor = this.viewer.ImageInfo.ImageWidth / this.viewer.ImageCanvas.width;
    var yResizeFactor = this.viewer.ImageInfo.ImageHeight / this.viewer.ImageCanvas.height;

    var info = "";
    info = info + "X1=" + parseInt(this.x * xResizeFactor) + "\n";
    info = info + "Y1=" + parseInt(this.y * yResizeFactor) + "\n";
    info = info + "X2=" + parseInt(this.endX * xResizeFactor) + "\n";
       info = info + "Y2=" + parseInt(this.endY * yResizeFactor) + "\n";
       info = info + "Color=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fill) + "\n";
       info =  info + "TimeOrder=" + this.timeorder                + "\n"  ;
       info =  info + "MouseSensitivity=" + this.mousesensitivity  + "\n"  ;
       info =  info + "AnnotationGroupID=" + this.groupid          + "\n"  ;
       info =  info + "UserID=" +this.userid                       + "\n"  ;
       info =  info + "Rights=" +this.rights                       + "\n"  ;
       info = info + "Thickness=" + this.thicknessLevel            + "\n"  ;
       info =  info + "Style=" + 1                                 + "\n"  ;       
       return info ;
}


   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////// Leading Arrow Annotation/////////////////////////////////////////////////////////////////////////////////

   /*
   #@c
   Class    : LeadingArrowLine

   Description:
   Constructor of the Leading Arrow annotation.

   Arguments:
   1) mx     : starting x coordinate of annotation
   2) my     : starting y coordinate of annotation
   3) width  : Width of annotation
   4) height : Height of annotation
   5)fill    : Color of annotation

   @author   25/11/2013    Aditya Kamra
   #@e
   */
   function LeadingArrowLine(viewerManager, x, y, w, h, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder) {
       // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
       // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
       // But we aren't checking anything else!
       this.viewer = viewerManager;
       this.type = "LALNE"
       this.x = x || 0;
       this.y = y || 0;
       this.endX = x + 1;
       this.endY = y;
       this.fill = strokeColor || '#AAAAAA';
       this.NoRedrawOnCreation = false;
       this.context = null;
       this.diffX = this.endX - this.x;
       this.diffY = this.endY - this.y;
       this.thickness = thickness;
       this.thicknessLevel = thickness;      
       this.x2 = 0;
       this.y2 = 0;
       this.mousesensitivity = 1;
       this.groupid = groupID;
       this.userid = userName;
       this.rights = userRights;
       this.timeorder = timeorder;
       this.properties = [false,false,true,false,false,true,true];
       }

       /*
       #@c
       Class    : LeadingArrowLine
       Access   : Private
       Function : Draw
       Arguments:
            ctx: context on which annotation to be drawn

       Description:
       Draw Leading Arrow annotation to a given context

       @author   25/11/2013    Aditya Kamra
       #@e
       */

   LeadingArrowLine.prototype.draw = function (ctx) {

       this.context = ctx;
       this.context.beginPath();
       this.context.moveTo(this.x, this.y);
       this.context.lineTo(this.endX, this.endY);
       this.context.strokeStyle = this.fill;
       this.context.lineWidth = this.thickness;
       this.context.stroke();
       var ang = Math.atan2(this.endY - this.y, this.endX - this.x);
       //if(ang != 0)
           this.viewer.AnnotationManager.drawFilledPolygon(ctx, this.viewer.AnnotationManager.translateShape(this.viewer.AnnotationManager.rotateShape(this.viewer.AnnotationManager.trailing_arrow_shape, ang), this.x, this.y), this.thickness, this.fill);
   }

   /*
   #@c
   Class    : LeadingArrowLine
   Access   : Private
   Function : contains
   Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

   Description:
   This function determines if a point is inside the shape's bounds

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   LeadingArrowLine.prototype.contains = function (mx, my) {
       // All we have to do is make sure the Mouse X,Y fall in the area between
       // the shape's X and (X + Height) and its Y and (Y + Height)    
		var sx = parseInt(this.x);
		var ex =parseInt(this.endX);
		var sy=parseInt(this.y);
		var ey=parseInt(this.endY);
	    var dx=ex-sx;
	    var dy=ey-sy;	   
	    var c = dy*sx -dx*sy;
	    var denominator=Math.sqrt((dx*dx)+(dy*dy));
	    var distance=Math.abs(((-dy*mx) + (dx*my)+c)/denominator);	   
	    var delta = this.thickness;
		//By Avinash Kumar Bug #4253
	    if(denominator <13){
	      var distance =Math.floor(Math.abs( Math.sqrt((mx-sx)*(mx-sx) + (my-sy)*(my-sy))));
		  
		  delta=12+denominator/3;
		  if(this.thickness>1){
		    delta+=this.thickness;	   
	      }
		  
		  if(distance < delta )
		  {		
			 return true;
		  }
		   else {
			 return false;
		   }
		  
	   }
	   else {
		   var distance=Math.abs(((-dy*mx) + (dx*my)+c)/denominator);	   
		   var delta = this.thickness;
	       if(this.thickness==1)
		     delta=2;
	       else
		     delta=this.thickness;	   
	       if(distance < delta ){		
				if(((mx<ex && mx>sx) || (mx>ex && mx<sx)) || ((my<ey && my>sy) || (my>ey && my<sy))){
					return true;
				}
				else{
					return false;
				}
				return true;
			}
		   else{
			return false;
	       }
	    }
   }
/*
	#@c
	Class    : LeadingArrowLine
	Access   : Private
	Function : contains
	Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

	Description:
	This function determines if current point lies on the  bottom right of selection box of annotation.
	If so, annotation is eligible for resizing.

	@author  07/08/2014    Swati
	#@e
	*/
	LeadingArrowLine.prototype.isResize = function (mx, my) {
    // All we have to do is make sure the Mouse X,Y fall bottom right of selection box of annotation.
	
    return (this.endX-15<= mx) && (this.endX +20>= mx) &&
          (this.endY-15<= my) && (this.endY+20>= my);
	}
   /*
   #@c
   Class    : LeadingArrowLine
   Access   : Private
   Function : drawDrag
   Arguments:
   1)X:   X position where mouse is being dragged
   2)Y:   Y position where mouse is being dragged
   3)ctx: context on which annotation to be drawn

   Description:
   This function is used to re draw the annotation while it is being drawn first time

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   LeadingArrowLine.prototype.drawDrag = function (X, Y, ctx) {
       this.endX = X;
       this.endY = Y;
       this.diffX = this.endX - this.x;
       this.diffY = this.endY - this.y;
   }

   /*
   #@c
   Class    : LeadingArrowLine
   Access   : Private
   Function : Drag
   Arguments:
   1)X:   X position where mouse is being dragged
   2)Y:   Y position where mouse is being dragged

   Description:
   This function is used to re draw the annotation while it is being dragged after selection.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   LeadingArrowLine.prototype.Drag = function (X, Y) {
       this.x = X;
       this.y = Y;
       this.endX = this.x + this.diffX;
       this.endY = this.y + this.diffY;
   }

   /*
   #@c
   Class    : LeadingArrowLine
   Access   : Private
   Function : select
   Arguments:
   ctx: current context

   Description:
   This function is called when annotation is moved

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   LeadingArrowLine.prototype.select = function (ctx) {
		if(this.fill=="#000000")
			ctx.strokeStyle = 'Red';
		else
			ctx.strokeStyle = 'black';	
		ctx.strokeRect(this.x, this.y, 4, 4);
		ctx.font ="18px Arial";
		ctx.strokeText("+",this.endX-2, this.endY+3); 
   }

   /*
   #@c
   Class    : LeadingArrowLine
   Access   : Private
   Function : Resize
   Arguments: 
   1)xPreviousZoomFactor: previous x-zoom factor
   2)xCurrentZoomFactor:  current x-zoom factor
   3)yPreviousZoomFactor: previous y-zoom factor
   4)yCurrentZoomFactor:  current y-zoom factor

   Description:
   This function is called to resize annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   LeadingArrowLine.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
       this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
       this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
       this.endX = this.endX * (xCurrentZoomFactor / xPreviousZoomFactor);
       this.endY = this.endY * (yCurrentZoomFactor / yPreviousZoomFactor);
       this.diffX = this.endX - this.x;
       this.diffY = this.endY - this.y;
       this.thickness = parseInt(this.thicknessLevel * xCurrentZoomFactor);
       if (this.thickness == 0)
           this.thickness = 1;
   }

   /*
   #@c
   Class    : LeadingArrowLine
   Access   : Private
   Function : save
   Arguments: None

   Description:
   This function is called to save Highlight Annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   LeadingArrowLine.prototype.save = function () {

       var xResizeFactor = this.viewer.ImageInfo.ImageWidth / this.viewer.ImageCanvas.width;
       var yResizeFactor = this.viewer.ImageInfo.ImageHeight / this.viewer.ImageCanvas.height;

       var info = "";
       info = info + "X1=" + parseInt(this.x * xResizeFactor) + "\n";
       info = info + "Y1=" + parseInt(this.y * yResizeFactor) + "\n";
       info = info + "X2=" + parseInt(this.endX * xResizeFactor) + "\n";
       info = info + "Y2=" + parseInt(this.endY * yResizeFactor) + "\n";
       info = info + "Color=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fill) + "\n";
       info = info + "TimeOrder=" + this.timeorder + "\n";
       info = info + "MouseSensitivity=" + this.mousesensitivity + "\n";
       info = info + "AnnotationGroupID=" + this.groupid + "\n";
       info = info + "UserID=" + this.userid + "\n";
       info = info + "Rights=" + this.rights + "\n";
       info = info + "Thickness=" + this.thicknessLevel + "\n";
       info = info + "Style=" + 2 + "\n";       
       return info;
   }

   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////// Trailing Arrow Annotation/////////////////////////////////////////////////////////////////////////////////

   /*
   #@c
   Class    : TrailingArrowLine

   Description:
   Constructor of the Trailing Arrow annotation.

   Arguments:
   1) mx     : starting x coordinate of annotation
   2) my     : starting y coordinate of annotation
   3) width  : Width of annotation
   4) height : Height of annotation
   5)fill    : Color of annotation

   @author   25/11/2013    Aditya Kamra
   #@e
   */
   function TrailingArrowLine(viewerManager, x, y, w, h, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder) {
       // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
       // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
       // But we aren't checking anything else!
       this.viewer = viewerManager;
       this.type = "TALNE"
       this.x = x || 0;
       this.y = y || 0;
       this.endX = x + 1;
       this.endY = y;
       this.fill = strokeColor || '#AAAAAA';
       this.NoRedrawOnCreation = false;
       this.context = null;
       this.diffX = this.endX - this.x;
       this.diffY = this.endY - this.y;
       this.thickness = thickness;
       this.thicknessLevel = thickness;       
       this.x2 = 0;
       this.y2 = 0;
       this.mousesensitivity = 1;
       this.groupid = groupID;
       this.userid = userName;
       this.rights = userRights;
       this.timeorder = timeorder;
       this.properties = [false,false,true,false,false,true,true];
   }
   /*
   #@c
   Class    : TrailingArrowLine
   Access   : Private
   Function : Draw
   Arguments:
   ctx: context on which annotation to be drawn

   Description:
   Draw Trailing Arrow annotation to a given context

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   TrailingArrowLine.prototype.draw = function (ctx) {
       this.context = ctx;
       this.context.beginPath();
       this.context.moveTo(this.x, this.y);
       this.context.lineTo(this.endX, this.endY);
       this.context.strokeStyle = this.fill;
       this.context.lineWidth = this.thickness;
       this.context.stroke();
       var ang = Math.atan2(this.endY - this.y, this.endX - this.x);
       //if (ang != 0)
           this.viewer.AnnotationManager.drawFilledPolygon(ctx, this.viewer.AnnotationManager.translateShape(this.viewer.AnnotationManager.rotateShape(this.viewer.AnnotationManager.leading_arrow_shape, ang), this.endX, this.endY), this.thickness, this.fill);
   }
   /*
   #@c
   Class    : TrailingArrowLine
   Access   : Private
   Function : contains
   Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

   Description:
   This function determines if a point is inside the shape's bounds

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   TrailingArrowLine.prototype.contains = function (mx, my) {
       // All we have to do is make sure the Mouse X,Y fall in the area between
       // the shape's X and (X + Height) and its Y and (Y + Height)
		var sx = parseInt(this.x);
		var ex =parseInt(this.endX);
		var sy=parseInt(this.y);
		var ey=parseInt(this.endY);
	    var dx=ex-sx;
	    var dy=ey-sy;	   
	    var c = dy*sx -dx*sy;
	    var denominator=Math.sqrt((dx*dx)+(dy*dy));
	    var distance=Math.abs(((-dy*mx) + (dx*my)+c)/denominator);	   
	    var delta = this.thickness;
		//By Avinash Kumar Bug #4253
	    if(denominator < 13){
	      var distance =Math.floor(Math.abs( Math.sqrt((mx-sx)*(mx-sx) + (my-sy)*(my-sy))));
		  
		  delta=12+denominator/3;
		  if(this.thickness>1){
		    delta+=this.thickness;	   
	      }
		  
		if(distance < delta ){
			return true;
		}
		   else {
			 return false;
		   }
		  
	   }
	   else {
		   var distance=Math.abs(((-dy*mx) + (dx*my)+c)/denominator);	   
		   var delta = this.thickness;
	       if(this.thickness==1)
		     delta=2;
	       else
		     delta=this.thickness;	   
	       if(distance < delta ){		
				if(((mx<ex && mx>sx) || (mx>ex && mx<sx)) || ((my<ey && my>sy) || (my>ey && my<sy))){
					return true;
				}
				else{
					return false;
				}
				return true;
			}
		   else{
			return false;
	       }
	    }
   }
/*
	#@c
	Class    : TrailingArrowLine
	Access   : Private
	Function : contains
	Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

	Description:
	This function determines if current point lies on the  bottom right of selection box of annotation.
	If so, annotation is eligible for resizing.

	@author  07/08/2014    Swati
	#@e
	*/
	TrailingArrowLine.prototype.isResize = function (mx, my) {
    // All we have to do is make sure the Mouse X,Y fall bottom right of selection box of annotation.
	
    return (this.endX-15<= mx) && (this.endX +20>= mx) &&
          (this.endY-15<= my) && (this.endY+20>= my);
	}
   /*
   #@c
   Class    : TrailingArrowLine
   Access   : Private
   Function : drawDrag
   Arguments:
   1)X:   X position where mouse is being dragged
   2)Y:   Y position where mouse is being dragged
   3)ctx: context on which annotation to be drawn

   Description:
   This function is used to re draw the annotation while it is being drawn first time

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   TrailingArrowLine.prototype.drawDrag = function (X, Y, ctx) {
       this.endX = X;
       this.endY = Y;
       this.diffX = this.endX - this.x;
       this.diffY = this.endY - this.y;
   }

   /*
   #@c
   Class    : TrailingArrowLine
   Access   : Private
   Function : Drag
   Arguments:
   1)X:   X position where mouse is being dragged
   2)Y:   Y position where mouse is being dragged

   Description:
   This function is used to re draw the annotation while it is being dragged after selection.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   TrailingArrowLine.prototype.Drag = function (X, Y) {
       this.x = X;
       this.y = Y;
       this.endX = this.x + this.diffX;
       this.endY = this.y + this.diffY;
   }

   /*
   #@c
   Class    : TrailingArrowLine
   Access   : Private
   Function : select
   Arguments:
   ctx: current context

   Description:
   This function is called when annotation is moved

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   TrailingArrowLine.prototype.select = function (ctx) {
	if(this.fill=="#000000")
		ctx.strokeStyle = 'Red';
	else
		ctx.strokeStyle = 'black';	
	ctx.strokeRect(this.x, this.y, 4, 4);
	ctx.font ="18px Arial";
	ctx.strokeText("+",this.endX-2, this.endY+3); 
   }

   /*
   #@c
   Class    : TrailingArrowLine
   Access   : Private
   Function : Resize
   Arguments: 
   1)xPreviousZoomFactor: previous x-zoom factor
   2)xCurrentZoomFactor:  current x-zoom factor
   3)yPreviousZoomFactor: previous y-zoom factor
   4)yCurrentZoomFactor:  current y-zoom factor

   Description:
   This function is called to resize annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   TrailingArrowLine.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
       this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
       this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
       this.endX = this.endX * (xCurrentZoomFactor / xPreviousZoomFactor);
       this.endY = this.endY * (yCurrentZoomFactor / yPreviousZoomFactor);
       this.diffX = this.endX - this.x;
       this.diffY = this.endY - this.y;
       this.thickness = parseInt(this.thicknessLevel * xCurrentZoomFactor);
       if (this.thickness == 0)
           this.thickness = 1;
   }

   /*
   #@c
   Class    : TrailingArrowLine
   Access   : Private
   Function : save
   Arguments: None

   Description:
   This function is called to save Highlight Annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   TrailingArrowLine.prototype.save = function () {
       var xResizeFactor = this.viewer.ImageInfo.ImageWidth / this.viewer.ImageCanvas.width;
       var yResizeFactor = this.viewer.ImageInfo.ImageHeight / this.viewer.ImageCanvas.height;
       var info = "";
       info = info + "X1=" + parseInt(this.x * xResizeFactor) + "\n";
       info = info + "Y1=" + parseInt(this.y * yResizeFactor) + "\n";
       info = info + "X2=" + parseInt(this.endX * xResizeFactor) + "\n";
       info = info + "Y2=" + parseInt(this.endY * yResizeFactor) + "\n";
       info = info + "Color=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fill) + "\n";
       info = info + "TimeOrder=" + this.timeorder + "\n";
       info = info + "MouseSensitivity=" + this.mousesensitivity + "\n";
       info = info + "AnnotationGroupID=" + this.groupid + "\n";
       info = info + "UserID=" + this.userid + "\n";
       info = info + "Rights=" + this.rights + "\n";
       info = info + "Thickness=" + this.thicknessLevel + "\n";
       info = info + "Style=" + 3 + "\n";       
       return info;
   }

   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////// Double sided Arrow Annotation/////////////////////////////////////////////////////////////////////////

   /*
   #@c
   Class    : DoubleArrowLine

   Description:
   Constructor of the Double Sided Arrow annotation.

   Arguments:
   1) mx     : starting x coordinate of annotation
   2) my     : starting y coordinate of annotation
   3) width  : Width of annotation
   4) height : Height of annotation
   5)fill    : Color of annotation

   @author   25/11/2013    Aditya Kamra
   #@e
   */
   function DoubleArrowLine(viewerManager, x, y, w, h, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder) {
       // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
       // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
       // But we aren't checking anything else!
       this.viewer = viewerManager;
       this.type = "DALNE"
       this.x = x || 0;
       this.y = y || 0;
       this.endX = x + 1;
       this.endY = y;
       this.fill = strokeColor || '#AAAAAA';
       this.NoRedrawOnCreation = false;
       this.context = null;
       this.diffX = this.endX - this.x;
       this.diffY = this.endY - this.y;
       this.thickness = thickness;
       this.thicknessLevel = thickness;              
       this.x2 = 0;
       this.y2 = 0;
       this.mousesensitivity = 1;
       this.groupid = groupID;
       this.userid = userName;
       this.rights = userRights;
       this.timeorder = timeorder;
       this.properties = [false,false,true,false,false,true,true];
   }

   /*
   #@c
   Class    : DoubleArrowLine
   Access   : Private
   Function : Draw
   Arguments:
   ctx: context on which annotation to be drawn

   Description:
   Draw Double Arrow annotation to a given context

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   DoubleArrowLine.prototype.draw = function (ctx) {

       this.context = ctx;
       this.context.beginPath();
       this.context.moveTo(this.x, this.y);
       this.context.lineTo(this.endX, this.endY);
       this.context.strokeStyle = this.fill;
       this.context.lineWidth = this.thickness;
       this.context.stroke();
       var ang = Math.atan2(this.endY - this.y, this.endX - this.x);
       //if (ang != 0) {
           this.viewer.AnnotationManager.drawFilledPolygon(ctx, this.viewer.AnnotationManager.translateShape(this.viewer.AnnotationManager.rotateShape(this.viewer.AnnotationManager.trailing_arrow_shape, ang), this.x, this.y), this.thickness, this.fill);
           this.viewer.AnnotationManager.drawFilledPolygon(ctx, this.viewer.AnnotationManager.translateShape(this.viewer.AnnotationManager.rotateShape(this.viewer.AnnotationManager.leading_arrow_shape, ang), this.endX, this.endY), this.thickness, this.fill);
       //}
   }

   /*
   #@c
   Class    : DoubleArrowLine
   Access   : Private
   Function : contains
   Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

   Description:
   This function determines if a point is inside the shape's bounds

   @author   25/11/2013    Aditya Kamra
   #@e
   */

     DoubleArrowLine.prototype.contains = function (mx, my) {
       // All we have to do is make sure the Mouse X,Y fall in the area between
       // the shape's X and (X + Height) and its Y and (Y + Height)	   
		var sx = parseInt(this.x);
		var ex =parseInt(this.endX);
		var sy=parseInt(this.y);
		var ey=parseInt(this.endY);
	    var dx=ex-sx;
	    var dy=ey-sy;	   
	    var c = dy*sx -dx*sy;
	    var denominator=Math.sqrt((dx*dx)+(dy*dy));
	    var distance=Math.abs(((-dy*mx) + (dx*my)+c)/denominator);	   
	    var delta = this.thickness;
		//By Avinash Kumar Bug #4253
	    if(denominator <25 ){
	      var distance =Math.floor(Math.abs( Math.sqrt((mx-sx)*(mx-sx) + (my-sy)*(my-sy))));
		  
		  delta=12;
		  delta = delta+denominator/3;
		  if(this.thickness>1){
		    delta+=this.thickness;	   
	      }
		  
		  if(distance < delta ){
				return true;
			}
		   else {
			 return false;
		   }
		  
	   }
	   else {
		   var distance=Math.abs(((-dy*mx) + (dx*my)+c)/denominator);	   
		   var delta = this.thickness;
	       if(this.thickness==1)
		     delta=2;
	       else
		     delta=this.thickness;	   
	       if(distance < delta ){		
				if(((mx<ex && mx>sx) || (mx>ex && mx<sx)) || ((my<ey && my>sy) || (my>ey && my<sy))){
					return true;
			}
				else{
					return false;
				}
				return true;
			}
		   else{
			return false;
	       }
	    }
   }
/*
	#@c
	Class    : DoubleArrowLine
	Access   : Private
	Function : contains
	Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

	Description:
	This function determines if current point lies on the  bottom right of selection box of annotation.
	If so, annotation is eligible for resizing.

	@author  07/08/2014    Swati
	#@e
	*/
	DoubleArrowLine.prototype.isResize = function (mx, my) {
    // All we have to do is make sure the Mouse X,Y fall bottom right of selection box of annotation.
	
    return (this.endX-15<= mx) && (this.endX +20>= mx) &&
          (this.endY-15<= my) && (this.endY+20>= my);
	}
   /*
   #@c
   Class    : DoubleArrowLine
   Access   : Private
   Function : drawDrag
   Arguments:
   1)X:   X position where mouse is being dragged
   2)Y:   Y position where mouse is being dragged
   3)ctx: context on which annotation to be drawn

   Description:
   This function is used to re draw the annotation while it is being drawn first time

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   DoubleArrowLine.prototype.drawDrag = function (X, Y, ctx) {
       this.endX = X;
       this.endY = Y;
       this.diffX = this.endX - this.x;
       this.diffY = this.endY - this.y;
   }

   /*
   #@c
   Class    : DoubleArrowLine
   Access   : Private
   Function : Drag
   Arguments:
   1)X:   X position where mouse is being dragged
   2)Y:   Y position where mouse is being dragged

   Description:
   This function is used to re draw the annotation while it is being dragged after selection.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   DoubleArrowLine.prototype.Drag = function (X, Y) {
       this.x = X;
       this.y = Y;
       this.endX = this.x + this.diffX;
       this.endY = this.y + this.diffY;
   }

   /*
   #@c
   Class    : DoubleArrowLine
   Access   : Private
   Function : select
   Arguments:
   ctx: current context

   Description:
   This function is called when annotation is moved

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   DoubleArrowLine.prototype.select = function (ctx) {
		if(this.fill=="#000000")
			ctx.strokeStyle = 'Red';
		else
			ctx.strokeStyle = 'black';	
		ctx.strokeRect(this.x, this.y, 4, 4);
		ctx.font ="18px Arial";
		ctx.strokeText("+",this.endX-2, this.endY+3); 
   }

   /*
   #@c
   Class    : DoubleArrowLine
   Access   : Private
   Function : Resize
   Arguments: 
   1)xPreviousZoomFactor: previous x-zoom factor
   2)xCurrentZoomFactor:  current x-zoom factor
   3)yPreviousZoomFactor: previous y-zoom factor
   4)yCurrentZoomFactor:  current y-zoom factor

   Description:
   This function is called to resize annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   DoubleArrowLine.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
       this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
       this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
       this.endX = this.endX * (xCurrentZoomFactor / xPreviousZoomFactor);
       this.endY = this.endY * (yCurrentZoomFactor / yPreviousZoomFactor);
       this.diffX = this.endX - this.x;
       this.diffY = this.endY - this.y;
       this.thickness = parseInt(this.thicknessLevel * xCurrentZoomFactor);
       if (this.thickness == 0)
           this.thickness = 1;
   }

   /*
   #@c
   Class    : DoubleArrowLine
   Access   : Private
   Function : save
   Arguments: None

   Description:
   This function is called to save Highlight Annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   DoubleArrowLine.prototype.save = function () {

       var xResizeFactor = this.viewer.ImageInfo.ImageWidth / this.viewer.ImageCanvas.width;
       var yResizeFactor = this.viewer.ImageInfo.ImageHeight / this.viewer.ImageCanvas.height;
       var info = "";
       info = info + "X1=" + parseInt(this.x * xResizeFactor) + "\n";
       info = info + "Y1=" + parseInt(this.y * yResizeFactor) + "\n";
       info = info + "X2=" + parseInt(this.endX * xResizeFactor) + "\n";
       info = info + "Y2=" + parseInt(this.endY * yResizeFactor) + "\n";
       info = info + "Color=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fill) + "\n";
       info = info + "TimeOrder=" + this.timeorder + "\n";
       info = info + "MouseSensitivity=" + this.mousesensitivity + "\n";
       info = info + "AnnotationGroupID=" + this.groupid + "\n";
       info = info + "UserID=" + this.userid + "\n";
       info = info + "Rights=" + this.rights + "\n";
       info = info + "Thickness=" + this.thicknessLevel + "\n";
       info = info + "Style=" + 4 + "\n";       
       return info;
   }

   ///////////////////////////////////////////////// Hollow Ellipse Annotation //////////////////////////////////////////////

   /*
   #@c
   Class    : Ellipse

   Description:
   Constructor of the Ellipse annotation.

   Arguments:
   1) mx     : starting x coordinate of annotation
   2) my     : starting y coordinate of annotation
   3) width  : Width of annotation
   4) height : Height of annotation
   5)fill    : Color of annotation

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   function Ellipse(viewerManager, x, y, w, h, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder) {
       // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
       // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
       // But we aren't checking anything else!
       this.viewer = viewerManager;
       this.type = "ELLI";
       this.x = x || 0;
       this.y = y || 0;
       this.w = w || 1;
       this.h = h || 1;
       this.fill = strokeColor;
       this.NoRedrawOnCreation = false;
       this.thickness = thickness;
       this.thicknessLevel = thickness;
       this.mousesensitivity = 1;
       this.groupid = groupID;
       this.userid = userName;
       this.rights = userRights;
       this.timeorder = timeorder;       
       this.properties = [false,false,true,false,false,true,true];	
   }
   /*
   #@c
   Class    : Ellipse
   Access   : Private
   Function : Draw
   Arguments:
   ctx: context on which annotation to be drawn

   Description:
   Draw Ellipse annotation to a given context

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   Ellipse.prototype.draw = function (ctx) {
       ctx.lineWidth = this.thickness;
       ctx.strokeStyle = this.fill;
       var bfill = false;
       this.viewer.AnnotationManager.drawEllipse(ctx, this.x, this.y, this.w, this.h, bfill);
   }
   /*
   #@c
   Class    : Ellipse
   Access   : Private
   Function : contains
   Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

   Description:
   This function determines if a point is inside the shape's bounds

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   Ellipse.prototype.contains = function (mx, my) {
       // All we have to do is make sure the Mouse X,Y fall in the area between
       // the shape's X and (X + Height) and its Y and (Y + Height)
       return (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my);
   }

/*
 #@c
 Class    : Ellipse
 Access   : Private
 Function : contains
 Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

 Description:
 This function determines if current point lies on the  bottom right of selection box of annotation.
 If so, annotation is eligible for resizing.

 @author  06/08/2014    Swati
 #@e
 */
Ellipse.prototype.isResize = function (mx, my) {
    return ((this.x+this.w -15)<= mx) && ((this.x + this.w +10)>= mx) &&
          ((this.y+this.h-15)<= my) && ((this.y + this.h+10)>= my);
}
   /*
   #@c
   Class    : Ellipse
   Access   : Private
   Function : drawDrag
   Arguments:
   1)X:   X position where mouse is being dragged
   2)Y:   Y position where mouse is being dragged
   3)ctx: context on which annotation to be drawn

   Description:
   This function is used to re draw the annotation while it is being drawn first time

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   Ellipse.prototype.drawDrag = function (X, Y, ctx) {
       this.w = X - this.x;       
       this.h = Y - this.y;       
   }


   /*
   #@c
   Class    : Ellipse
   Access   : Private
   Function : Drag
   Arguments:
   1)X:   X position where mouse is being dragged
   2)Y:   Y position where mouse is being dragged

   Description:
   This function is used to re draw the annotation while it is being dragged after selection.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   Ellipse.prototype.Drag = function (X, Y) {
       this.x = X;
       this.y = Y;
   }

   /*
   #@c
   Class    : Ellipse
   Access   : Private
   Function : select
   Arguments:
   ctx: current context

   Description:
   This function is called when annotation is moved

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   Ellipse.prototype.select = function (ctx) {
		if(this.fill=="#000000")
			ctx.strokeStyle = 'Red';
		else
			ctx.strokeStyle = 'black';	
		ctx.strokeRect((this.x - 2), (this.y - 2), 2, 2);
		ctx.strokeRect((this.x + this.w), (this.y - 2), 2, 2);
		ctx.strokeRect((this.x - 2), (this.y + this.h), 2, 2);
		ctx.font ="18px Arial";
		ctx.strokeText("+",this.x+this.w-4, this.y+this.h+3); 
   }

   /*
   #@c
   Class    : Ellipse
   Access   : Private
   Function : save
   Arguments: None

   Description:
   This function is called to save Highlight Annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   Ellipse.prototype.save = function () {
       var xResizeFactor = this.viewer.ImageInfo.ImageWidth / this.viewer.ImageCanvas.width;
       var yResizeFactor = this.viewer.ImageInfo.ImageHeight / this.viewer.ImageCanvas.height;
       var x2 = this.w + this.x;       // get value of final x coordinate
       var y2 = this.y + this.h;      // get value of final y coordinate  
       var info = "";
       info = info + "X1=" + parseInt(this.x * xResizeFactor) + "\n";
       info = info + "Y1=" + parseInt(this.y * yResizeFactor) + "\n";
       info = info + "X2=" + parseInt(x2 * xResizeFactor) + "\n";
       info = info + "Y2=" + parseInt(y2 * yResizeFactor) + "\n";
       info = info + "Color=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fill) + "\n";
       info = info + "TimeOrder=" + this.timeorder + "\n";
       info = info + "MouseSensitivity=" + this.mousesensitivity + "\n";
       info = info + "AnnotationGroupID=" + this.groupid + "\n";
       info = info + "UserID=" + this.userid + "\n";
       info = info + "Rights=" + this.rights + "\n";
       info = info + "Thickness=" + this.thicknessLevel + "\n";       
       info = info + "FillColor=" + "4294967295" + "\n";
       return info;
   }

   /*
   #@c
   Class    : Ellipse
   Access   : Private
   Function : Resize
   Arguments: 
   1)xPreviousZoomFactor: previous x-zoom factor
   2)xCurrentZoomFactor:  current x-zoom factor
   3)yPreviousZoomFactor: previous y-zoom factor
   4)yCurrentZoomFactor:  current y-zoom factor

   Description:
   This function is called to resize annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   Ellipse.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
       this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
       this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
       this.h = this.h * (yCurrentZoomFactor / yPreviousZoomFactor);
       this.w = this.w *(xCurrentZoomFactor / xPreviousZoomFactor);
       this.thickness = parseInt(this.thicknessLevel * xCurrentZoomFactor);
       if (this.thickness == 0)
           this.thickness = 1;
   }

   /*
   #@c
   Class    : Ellipse
   Access   : Private
   Function : rotate
   Arguments: 
   1)angle: Angle by which ellipse should be rotated
   2)ctx:   current context

   Description:
   This function is called to rotate annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   Ellipse.prototype.rotate = function (angle, ctx) {     
       var temp = this.h;
       var temp1 = this.x;       
       this.x = canvas2.width - this.y - this.h;
       this.y = temp1;
       this.h = this.w;
       this.w = temp;       
   };
   /*
   #@c
   Class    : FilledEllipse

   Description:
   Constructor of the Filled Ellipse annotation.

   Arguments:
   1) mx     : starting x coordinate of annotation
   2) my     : starting y coordinate of annotation
   3) width  : Width of annotation
   4) height : Height of annotation
   5)fill    : Color of annotation

   @author   25/11/2013    Aditya Kamra
   #@e
   */
   function FilledEllipse(viewerManager, x, y, w, h, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder) {
       // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
       // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
       // But we aren't checking anything else!
       this.viewer = viewerManager;
       this.type = "FELLI";
       this.x = x || 0;
       this.y = y || 0;
       this.w = w || 1;
       this.h = h || 1;
       this.fill = strokeColor|| '#AAAAAA';
       this.fillColor = fillcolor|| '#AAAAAA';
       this.NoRedrawOnCreation = false;
       this.thickness = thickness;
       this.thicknessLevel = thickness;
       this.mousesensitivity = 1;
       this.groupid = groupID;
       this.userid = userName;
       this.rights = userRights;
       this.timeorder = timeorder;       
       this.properties = [false,false,true,false,false,true,true];
   }
   /*
   #@c
   Class    : FilledEllipse
   Access   : Private
   Function : Draw
   Arguments:
   ctx: context on which annotation to be drawn

   Description:
   Draw Filled Ellipse to a given context

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   FilledEllipse.prototype.draw = function (ctx) {
       var bfill = true;
       //ctx.strokeStyle = this.fill;
       //ctx.lineWidth = this.thickness;
       ctx.fillStyle = this.fillColor;
       this.viewer.AnnotationManager.drawEllipse(ctx, this.x, this.y, this.w, this.h, bfill);
   }

   /*
   #@c
   Class    : FilledEllipse
   Access   : Private
   Function : contains
   Arguments:
   1)mx: current x-coordinate of mouse
   2)my: current y-coordinate of mouse

   Description:
   This function determines if a point is inside the shape's bounds

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   FilledEllipse.prototype.contains = function (mx, my) {
       // All we have to do is make sure the Mouse X,Y fall in the area between
       // the shape's X and (X + Height) and its Y and (Y + Height)
       return (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my);
   }
/*
 #@c
 Class    : FilledEllipse
 Access   : Private
 Function : contains
 Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

 Description:
 This function determines if current point lies on the  bottom right of selection box of annotation.
 If so, annotation is eligible for resizing.

 @author  06/08/2014    Swati
 #@e
 */
FilledEllipse.prototype.isResize = function (mx, my) {
    return ((this.x+this.w -15)<= mx) && ((this.x + this.w +10)>= mx) &&
          ((this.y+this.h-15)<= my) && ((this.y + this.h+10)>= my);
}

   /*
   #@c
   Class    : FilledEllipse
   Access   : Private
   Function : drawDrag
   Arguments:
   1)X:   X position where mouse is being dragged
   2)Y:   Y position where mouse is being dragged
   3)ctx: context on which annotation to be drawn

   Description:
   This function is used to re draw the annotation while it is being drawn first time

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   FilledEllipse.prototype.drawDrag = function (X, Y, ctx) {
       this.w = X - this.x;
       this.h = Y - this.y;       
   }


   /*
   #@c
   Class    : FilledEllipse
   Access   : Private
   Function : Drag
   Arguments:
   1)X:   X position where mouse is being dragged
   2)Y:   Y position where mouse is being dragged

   Description:
   This function is used to re draw the annotation while it is being dragged after selection.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   FilledEllipse.prototype.Drag = function (X, Y) {
       this.x = X;
       this.y = Y;
   }

   /*
   #@c
   Class    : FilledEllipse
   Access   : Private
   Function : select
   Arguments:
   ctx: current context

   Description:
   This function is called when annotation is moved

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   FilledEllipse.prototype.select = function (ctx) {
		if(this.fillColor=="#000000")
			ctx.strokeStyle = 'Red';
		else
			ctx.strokeStyle = 'black';	
		ctx.strokeRect((this.x - 2), (this.y - 2), 2, 2);
		ctx.strokeRect((this.x + this.w), (this.y - 2), 2, 2);
		ctx.strokeRect((this.x - 2), (this.y + this.h), 2, 2);
		ctx.font ="18px Arial";
		ctx.strokeText("+",this.x+this.w-4, this.y+this.h+3); 
   }

   /*
   #@c
   Class    : FilledEllipse
   Access   : Private
   Function : save
   Arguments: None

   Description:
   This function is called to save Highlight Annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   FilledEllipse.prototype.save = function () {
       var xResizeFactor = this.viewer.ImageInfo.ImageWidth / this.viewer.ImageCanvas.width;
       var yResizeFactor = this.viewer.ImageInfo.ImageHeight / this.viewer.ImageCanvas.height;
       var x2 = this.w + this.x;       // get value of final x coordinate
       var y2 = this.y + this.h;      // get value of final y coordinate  
       var info = "";
       info = info + "X1=" + parseInt(this.x * xResizeFactor) + "\n";
       info = info + "Y1=" + parseInt(this.y * yResizeFactor) + "\n";
       info = info + "X2=" + parseInt(x2 * xResizeFactor) + "\n";
       info = info + "Y2=" + parseInt(y2 * yResizeFactor) + "\n";
       info = info + "Color=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fill) + "\n";
       info = info + "TimeOrder=" + this.timeorder + "\n";
       info = info + "MouseSensitivity=" + this.mousesensitivity + "\n";
       info = info + "AnnotationGroupID=" + this.groupid + "\n";
       info = info + "UserID=" + this.userid + "\n";
       info = info + "Rights=" + this.rights + "\n";
       info = info + "Thickness=" + this.thicknessLevel + "\n";       
       info = info + "FillColor=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fillColor) + "\n";
       return info;
   }

   /*
   #@c
   Class    : FilledEllipse
   Access   : Private
   Function : Resize
   Arguments: 
   1)xPreviousZoomFactor: previous x-zoom factor
   2)xCurrentZoomFactor:  current x-zoom factor
   3)yPreviousZoomFactor: previous y-zoom factor
   4)yCurrentZoomFactor:  current y-zoom factor

   Description:
   This function is called to resize annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   FilledEllipse.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
       this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
       this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
       this.h = this.h * (yCurrentZoomFactor / yPreviousZoomFactor);
       this.w = this.w *(xCurrentZoomFactor / xPreviousZoomFactor);
       this.thickness = parseInt(this.thicknessLevel * xCurrentZoomFactor);
       if (this.thickness == 0)
           this.thickness = 1;
   }

   /*
   #@c
   Class    : FilledEllipse
   Access   : Private
   Function : rotate
   Arguments: 
   1)angle: Angle by which ellipse should be rotated
   2)ctx:   current context

   Description:
   This function is called to rotate annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   FilledEllipse.prototype.rotate = function (angle, ctx) {
       var temp = this.h;
       var temp1 = this.x;
	   this.x = canvas2.width - this.y - this.h;
	   this.y = temp1;
	   this.h = this.w;
	   this.w = temp;
       }

   /*
   #@c
   Class    : WipeOut

   Description:
   Constructor of the WipeOut annotation.

   Arguments:
   1) mx     : starting x coordinate of annotation
   2) my     : starting y coordinate of annotation
   3) width  : Width of annotation
   4) height : Height of annotation
   5)fill    : Color of annotation

   @author   25/11/2013    Aditya Kamra
   #@e
   */
   function WipeOut(viewerManager, x, y, w, h, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder) {
       // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
       // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
       // But we aren't checking anything else!
       this.viewer = viewerManager;
       this.type = "WIPOUT";
       this.x = x || 0;
       this.y = y || 0;
       this.w = w || 1;
       this.h = h || 1;       
	   this.fill = strokeColor|| '#AAAAAA';       
	   this.fillColor = fillcolor|| '#AAAAAA';
       this.NoRedrawOnCreation = false;
       this.thickness = thickness;
       this.thicknessLevel = thickness;
       this.mousesensitivity = 1;
       this.groupid = groupID;
       this.userid = userName;
       this.rights = userRights;
       this.timeorder = timeorder;
       this.properties = [false,false,true,false,false,true,true];
   }
   /*
   #@c
   Class    : WipeOut
   Access   : Private
   Function : Draw
   Arguments:
   ctx: context on which annotation to be drawn

   Description:
   Draw WipeOut annotation to a given context

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   WipeOut.prototype.draw = function (ctx) {
       //ctx.strokeStyle = this.fillColor;
       //ctx.lineWidth = this.thickness;
       ctx.fillStyle = this.fillColor;       
       ctx.fillRect(this.x, this.y, this.w, this.h);
   }

   /*
   #@c
   Class    : WipeOut
   Access   : Private
   Function : contains
   Arguments:
   1)mx: current x-coordinate of mouse
   2)my: current y-coordinate of mouse

   Description:
   This function determines if a point is inside the shape's bounds

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   WipeOut.prototype.contains = function (mx, my) {
       // All we have to do is make sure the Mouse X,Y fall in the area between
       // the shape's X and (X + Height) and its Y and (Y + Height)
       return (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my);
   }

/*
 #@c
 Class    : WipeOut
 Access   : Private
 Function : contains
 Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

 Description:
 This function determines if current point lies on the  bottom right of selection box of annotation.
 If so, annotation is eligible for resizing.

 @author  06/08/2014    Swati
 #@e
 */
WipeOut.prototype.isResize = function (mx, my) {
    return ((this.x+this.w -15)<= mx) && ((this.x + this.w +10)>= mx) &&
          ((this.y+this.h-15)<= my) && ((this.y + this.h+10)>= my);
}
   /*
   #@c
   Class    : WipeOut
   Access   : Private
   Function : drawDrag
   Arguments:
   1)X:   X position where mouse is being dragged
   2)Y:   Y position where mouse is being dragged
   3)ctx: context on which annotation to be drawn

   Description:
   This function is used to re draw the annotation while it is being drawn first time

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   WipeOut.prototype.drawDrag = function (X, Y, ctx) {
       this.w = X - this.x;
       this.h = Y - this.y;       
   }


   /*
   #@c
   Class    : WipeOut
   Access   : Private
   Function : Drag
   Arguments:
   1)X:   X position where mouse is being dragged
   2)Y:   Y position where mouse is being dragged

   Description:
   This function is used to re draw the annotation while it is being dragged after selection.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   WipeOut.prototype.Drag = function (X, Y) {
       this.x = X;
       this.y = Y;
   }



   /*
   #@c
   Class    : WipeOut
   Access   : Private
   Function : select
   Arguments:
   ctx: current context

   Description:
   This function is called when annotation is moved

   @author   25/11/2013    Aditya Kamra
   #@e
   */

WipeOut.prototype.select = function (ctx) {
		if(this.fillColor=="#000000")
			ctx.strokeStyle = 'Red';
		else
			ctx.strokeStyle = 'Black';
       ctx.strokeRect((this.x - 2), (this.y - 2), 2, 2);
       ctx.strokeRect((this.x + this.w), (this.y - 2), 2, 2);
       ctx.strokeRect((this.x - 2), (this.y + this.h), 2, 2);
       ctx.font ="18px Arial";
	   ctx.strokeText("+",this.x+this.w-4, this.y+this.h+3); 
   }

   /*
   #@c
   Class    : WipeOut
   Access   : Private
   Function : save
   Arguments: None

   Description:
   This function is called to save Highlight Annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   WipeOut.prototype.save = function () {
       var xResizeFactor = this.viewer.ImageInfo.ImageWidth / this.viewer.ImageCanvas.width;
       var yResizeFactor = this.viewer.ImageInfo.ImageHeight / this.viewer.ImageCanvas.height;
       var x2 = this.w + this.x;       // get value of final x coordinate
       var y2 = this.y + this.h;      // get value of final y coordinate  
       var info = "";
       info = info + "X1=" + parseInt(this.x * xResizeFactor) + "\n";
       info = info + "Y1=" + parseInt(this.y * yResizeFactor) + "\n";
       info = info + "X2=" + parseInt(x2 * xResizeFactor) + "\n";
       info = info + "Y2=" + parseInt(y2 * yResizeFactor) + "\n";
       info = info + "Color=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fill) + "\n";
       info = info + "TimeOrder=" + this.timeorder + "\n";
       info = info + "MouseSensitivity=" + this.mousesensitivity + "\n";
       info = info + "AnnotationGroupID=" + this.groupid + "\n";
       info = info + "UserID=" + this.userid + "\n";
       info = info + "Rights=" + this.rights + "\n";
       info = info + "Thickness=" + this.thicknessLevel + "\n";
       info = info + "FillColor=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fillColor) + "\n";
       return info;
   }

   /*
   #@c
   Class    : WipeOut
   Access   : Private
   Function : Resize
   Arguments: 
   1)xPreviousZoomFactor: previous x-zoom factor
   2)xCurrentZoomFactor:  current x-zoom factor
   3)yPreviousZoomFactor: previous y-zoom factor
   4)yCurrentZoomFactor:  current y-zoom factor

   Description:
   This function is called to resize annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   WipeOut.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
       this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
       this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
       this.h = this.h * (yCurrentZoomFactor / yPreviousZoomFactor);
       this.w = this.w *(xCurrentZoomFactor / xPreviousZoomFactor);
       this.thickness = parseInt(this.thicknessLevel * xCurrentZoomFactor);
       if (this.thickness == 0)
           this.thickness = 1;
   }

   /*
   #@c
   Class    : WipeOut
   Access   : Private
   Function : rotate
   Arguments: 
   1)angle: Angle by which wipeout annotation should be rotated
   2)ctx:   current context

   Description:
   This function is called to rotate annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   WipeOut.prototype.rotate = function (angle, ctx) {
       var temp = this.h;
       var temp1 = this.x;
       //if(angle==90)
       {
           this.x = canvas2.width - this.y - this.h;
           this.y = temp1;
           this.h = this.w;
           this.w = temp;
       }
   }

   /*
   #@c
   Class    : TextStamp

   Description:
   Constructor of the Text Stamp annotation.

   Arguments:
   1) mx     : starting x coordinate of annotation
   2) my     : starting y coordinate of annotation
   3) width  : Width of annotation
   4) height : Height of annotation
   5)fill    : Color of annotation

   @author   25/11/2013    Aditya Kamra
   #@e
   */
   function TextStamp(viewerManager, x, y, w, h, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder) {
       // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
       // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
       // But we aren't checking anything else!
       this.viewer = viewerManager;
       this.type = "TXTSTAMP";
       this.x = x || 0;
       this.y = y || 0;
       this.w = w || 1;
       this.h = h || 1;
       this.fill = strokeColor || '#AAAAAA';
       this.NoRedrawOnCreation = false;
       this.mousesensitivity = 1;
       this.groupid = groupID;
       this.userid = userName;
       this.rights = userRights;
       this.timeorder = timeorder;
       this.firstDraw = true;       
       this.title = "";
       this.text = "";
       this.fontName = "MS Shell Dlg";
       this.fontSize = this.h;
       this.bold = 0;
       this.italic = 0;
       this.underline = 0;
       this.strikeOut = 0;
       this.properties = [false, false, true, false, false, true, true];
       this.bDynamicText = this.viewer.AnnotationManager.bDynamicText;       
       
   }

   /*
   #@c
   Class    : TextStamp
   Access   : Private
   Function : Draw
   Arguments:
   ctx: context on which annotation to be drawn

   Description:
   Draw Text Stamp to a given context

   @author   25/11/2013    Aditya Kamra
   @modified 03/05/2019    Komal Walia for bug 5396
   #@e
   */

   TextStamp.prototype.draw = function (ctx, scale) {
       var len = this.text.length;
       if(!scale){
        //Modified by Komal Walia on 02/05/2019 for bug 5396.
        scale = OPALL.VIEWER.AnnotationManager.scaleForDrawing;
       }
       var scaledFont = this.fontSize * scale;
       ctx.font = scaledFont + "px " + this.fontName;
       if (this.bold == 1)
           ctx.font = "bold " + ctx.font;
       if (this.italic == 1)
           ctx.font = "italic " + ctx.font;
       ctx.textAlign = "left";
       this.w = ctx.measureText(this.text).width;
//       var twidth = 0;
//       var str = this.text;
//       for (var i=0; i<str.length; ++i) {
//    	   twidth += Math.round(ctx.measureText(str[i]).width);
//    	 }
//       this.w = twidth;
       ctx.fillStyle = this.fill;
       
      var canvas = ctx.canvas;
      if(canvas.id == 'annotCanvas'){
        if((this.x + this.w) >= canvas.width){
          this.x -= (this.x  + this.w - canvas.width + 4);
        }
        
        if((this.y + this.h) >= canvas.height){
          this.y -= (this.y + this.h - canvas.height + 4);
        }
        
      }
        

      
      ctx.fillText(this.text, this.x + 2, this.y + scaledFont, this.w);
       if (this.underline == true) {
           this.textUnderline(ctx, this.text, this.x + 2, this.y + scaledFont, ctx.fillStyle, scaledFont, ctx.textAlign);
       }
       if (this.strikeOut == true)
           this.textStrikeOut(ctx, this.text, this.x + 2, this.y + scaledFont, ctx.fillStyle, scaledFont, ctx.textAlign);
       this.h = scaledFont;
       if (this.firstDraw) {
           this.firstDraw = false;
           this.select(ctx);
       }
       document.getElementById("annotCanvas").style.cursor = "default";
   }

   /*
   #@c
   Class    : TextStamp
   Access   : Private
   Function : contains
   Arguments:
   1)mx: current x-coordinate of mouse
   2)my: current y-coordinate of mouse

   Description:
   This function determines if a point is inside the shape's bounds

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   TextStamp.prototype.contains = function (mx, my) {
       // All we have to do is make sure the Mouse X,Y fall in the area between
       // the shape's X and (X + Height) and its Y and (Y + Height)
       return (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my);
   }

/*
 #@c
 Class    : TextStamp
 Access   : Private
 Function : contains
 Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

 Description:
 This function determines if current point lies on the  bottom right of selection box of annotation.
 If so, annotation is eligible for resizing.

 @author  06/08/2014    Swati
 #@e
 */
TextStamp.prototype.isResize = function (mx, my) {
    return false;
}
   /*
   #@c
   Class    : TextStamp
   Access   : Private
   Function : drawDrag
   Arguments:
   1)X:   X position where mouse is being dragged
   2)Y:   Y position where mouse is being dragged
   3)ctx: context on which annotation to be drawn

   Description:
   This function is used to re draw the annotation while it is being drawn first time

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   TextStamp.prototype.drawDrag = function (X, Y, ctx) {
       this.x = X;
       this.y = Y;       
       this.w = ctx.measureText(this.text).width;
       ctx.strokeStyle = 'black';
       ctx.strokeRect(this.x, this.y, this.w, this.h * this.viewer.ZoomFactor);
   }


   /*
   #@c
   Class    : TextStamp
   Access   : Private
   Function : Drag
   Arguments:
   1)X:   X position where mouse is being dragged
   2)Y:   Y position where mouse is being dragged

   Description:
   This function is used to re draw the annotation while it is being dragged after selection.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   TextStamp.prototype.Drag = function (X, Y) {
       this.x = X;
       this.y = Y;
   }


   /*
   #@c
   Class    : TextStamp
   Access   : Private
   Function : select
   Arguments:
   ctx: current context

   Description:
   This function is called when annotation is moved

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   TextStamp.prototype.select = function (ctx) {       
	   if(this.fill=="#000000")
			ctx.strokeStyle = 'Red';
		else
			ctx.strokeStyle = 'Black';
    //  if(this.underline==1)
          ctx.strokeRect(this.x, this.y, this.w+3 , this.h+5 );
      // else
          // ctx.strokeRect(this.x, this.y, this.w , this.h );
   }

   /*
   #@c
   Class    : TextStamp
   Access   : Private
   Function : save
   Arguments: None

   Description:
   This function is called to save Highlight Annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   TextStamp.prototype.save = function () {
       var xResizeFactor = this.viewer.ImageInfo.ImageWidth / this.viewer.ImageCanvas.width;
       var yResizeFactor = this.viewer.ImageInfo.ImageHeight / this.viewer.ImageCanvas.height;
       var info = "";
       var x2 = this.w + this.x;       // get value of final x coordinate
       var y2 = this.y + this.h;      // get value of final y coordinate  

       info = info + "X1=" + parseInt(this.x * xResizeFactor) + "\n";
       info = info + "Y1=" + parseInt(this.y * yResizeFactor) + "\n";
       info = info + "X2=" + parseInt(x2 * xResizeFactor) + "\n";
       info = info + "Y2=" + parseInt(y2 * yResizeFactor) + "\n";
       info = info + "Color=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fill) + "\n";
       info = info + "TimeOrder=" + this.timeorder + "\n";
       info = info + "MouseSensitivity=" + this.mousesensitivity + "\n";
       info = info + "AnnotationGroupID=" + this.groupid + "\n";
       info = info + "UserID=" + this.userid + "\n";
       info = info + "Rights=" + this.rights + "\n";
       info = info + "Type=" + 1 + "\n";
       info = info + "Text=" + this.text + "\n";
       info = info + "Height=" +(-Math.ceil(this.fontSize)) + "\n";
       info = info + "Width=" + "0" + "\n";
       info = info + "Escapement=" + "0" + "\n";
       info = info + "Orientation=" + "0" + "\n";
       if (this.bold == 1)
           info = info + "Weight=" + "700" + "\n";
       else
           info = info + "Weight=" + "400" + "\n";
       if (this.italic == 1)
           info = info + "Italic=" + "255" + "\n";
       else
           info = info + "Italic=" + "0" + "\n";
       info = info + "Underlined=" + this.underline + "\n";
       info = info + "StrikeOut=" + this.strikeOut + "\n";
       info = info + "CharSet=" + "0" + "\n";
       info = info + "OutPrecision=" + "0" + "\n";
       info = info + "ClipPrecision=" + "0" + "\n";
       info = info + "Quality=" + "1" + "\n";
       if (((this.fontName).match(/TimesRoman/i) != null) || ((this.fontName).match(/Serif/i) != null))
           info = info + "PitchAndFamily=" + "18" + "\n";
       else if (((this.fontName).match(/Dialog/i) != null) || ((this.fontName).match(/SansSerif/i) != null) || ((this.fontName).match(/Helvetica/i) != null))
           info = info + "PitchAndFamily=" + "34" + "\n";
       else if ((this.fontName).match(/DialogInput/i) != null)
           info = info + "PitchAndFamily=" + "34" + "\n";
       else
           info = info + "PitchAndFamily=" + "49" + "\n";
       info = info + "FontName=" + this.fontName + "\n";
       info = info + "TextWidth=" + parseInt(this.w) + "\n";
       return info;
   }

   /*
   #@c
   Class    : TextStamp
   Access   : Private
   Function : Resize
   Arguments: 
   1)xPreviousZoomFactor: previous x-zoom factor
   2)xCurrentZoomFactor:  current x-zoom factor
   3)yPreviousZoomFactor: previous y-zoom factor
   4)yCurrentZoomFactor:  current y-zoom factor

   Description:
   This function is called to resize annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   TextStamp.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
       this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
       this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
    //   this.h = this.h * (yCurrentZoomFactor / yPreviousZoomFactor);
     //  this.w = this.w * (xCurrentZoomFactor / xPreviousZoomFactor);
    //   this.fontSize =  this.fontSize * (xCurrentZoomFactor / xPreviousZoomFactor);
   }

   /*
   #@c
   Class    : TextStamp
   Access   : Private
   Function : rotate
   Arguments: 
   1)angle: Angle by which stamp should be rotated
   2)ctx:   current context

   Description:
   This function is called to rotate annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   TextStamp.prototype.rotate = function (angle, ctx) {      
   }

   /*
   #@c
   Class    : TextStamp
   Access   : Private
   Function : fillProperties
   Arguments: 
        textStampSelectionList: list of all text stamps   

   Description:
   This function is called to fill properties of text stamp which needs to be drawn

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   TextStamp.prototype.fillProperties = function (textStampSelectionList) {
       var dynamicText = "";
       var dateTime = "";
       var userID = "";
       this.title = textStampSelectionList.title;
       this.firstDraw = false;
       if (this.viewer.AnnotationManager.bDynamicText == true)
           dynamicText = this.viewer.DynamicText;
       if (this.viewer.AnnotationManager.bUserName == true)
           userID = this.userid;
       if (this.viewer.AnnotationManager.bDateTime == true)
           dateTime = this.DateStamp();

       if (textStampSelectionList.title == "Date and Time")
           this.text = this.DateStamp();
       else {
           this.text = textStampSelectionList.text + userID + dynamicText+dateTime;
       }
       this.fontName = textStampSelectionList.fontName;
       this.fontSize = textStampSelectionList.fontSize;// Bug 4262 by Pooja Kamra
       this.fill = this.viewer.AnnotationManager.GetAnnotationColor(textStampSelectionList.color);
       this.bold = textStampSelectionList.bold;
       this.italic = textStampSelectionList.italic;
       this.underline = textStampSelectionList.underline;
       this.strikeOut = textStampSelectionList.strikeOut;
   }

   /*
   #@c
   Class    : TextStamp
   Access   : Private
   Function : DateStamp
   Arguments: None
   
   Description:
   This function is called to set format of date stamp

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   TextStamp.prototype.DateStamp=function() {
       var strArrayDateTime = [];
       var d = new Date();
       strArrayDateTime[0] = d.getFullYear();
       strArrayDateTime[1] = d.getMonth();
       strArrayDateTime[2] = d.getDate();
       strArrayDateTime[3] = d.getHours();
       strArrayDateTime[4] = d.getMinutes();
       strArrayDateTime[5] = d.getSeconds();
       var date = strArrayDateTime[2] + "-" + strArrayDateTime[1] + "-" + strArrayDateTime[0];
       var time = strArrayDateTime[3] + ":" + strArrayDateTime[4] + ":" + strArrayDateTime[5];
       var stamp = date + ",  " + time;
       return stamp;
   }

   /*
   #@c
   Class    : TextStamp
   Access   : Private
   Function : textUnderline
   Arguments: 
            1)context   : context on which line needs to be drawn
            2)text      : text below which annotation needs to be drawn
            3)x         : starting x coordinate of text
            4)y         : starting y coordinate of text
            5)color     : color of underline
            6)textSize  : font size of text
            7:align     : alignment of text
   
   Description:
   This function is called to draw underline in text stamp.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   TextStamp.prototype.textUnderline = function (context, text, x, y, color, textSize, align) {
    var textWidth = context.measureText(text).width;
    var startX; //var to store the starting position of text (X-axis)    
    var startY = y + 2; ////var to store the starting position of text (Y-axis)
    var endX; //var to store the end position of text (X-axis)
    var endY = startY; //var to store the end position of text (Y-axis). It should be the same as start position vertically.     
    var underlineHeight = parseInt(textSize) / 15; ////To set the size line which is to be drawn as underline.
    if (underlineHeight < 1) {
        underlineHeight = 1;
    }
    
    startY = y + (1.5*underlineHeight);
    endY = startY;
    
    context.beginPath();
    if (align == "center") {
        startX = x - (textWidth / 2);
        endX = x + (textWidth / 2);
    } else if (align == "right") {
        startX = x - textWidth;
        endX = x;
    } else {
        startX = x;
        endX = x + textWidth;
    }
    context.strokeStyle = color;
    context.lineWidth = underlineHeight;
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
}
/*
#@c
Class    : TextStamp
Access   : Private
Function : textStrikeOut
Arguments: 
1)context   : context on which line needs to be drawn
2)text      : text below which annotation needs to be drawn
3)x         : starting x coordinate of text
4)y         : starting y coordinate of text
5)color     : color of underline
6)textSize  : font size of text
7:align     : alignment of text
   
Description:
This function is called to draw stikeout line in text stamp.

@author   25/11/2013    Aditya Kamra
#@e
*/

TextStamp.prototype.textStrikeOut = function (context, text, x, y, color, textSize, align) {
    var textWidth = context.measureText(text).width;
    //var to store the starting position of text (X-axis)
    var startX;
    var startY = y - (parseInt(textSize) / 3 );
    //var to store the end position of text (X-axis)
    var endX;
    //var to store the end position of text (Y-axis)
    //It should be the same as start position vertically. 
    var endY = startY;
    //To set the size line which is to be drawn as underline.
    //Its set as per the size of the text. Feel free to change as per need.
    var underlineHeight = parseInt(textSize) / 15;
    //Because of the above calculation we might get the value less 
    //than 1 and then the underline will not be rendered. this is to make sure 
    //there is some value for line width.
    if (underlineHeight < 1) {
        underlineHeight = 1;
    }
    context.beginPath();
    if (align == "center") {
        startX = x - (textWidth / 2);
        endX = x + (textWidth / 2);
    } else if (align == "right") {
        startX = x - textWidth;
        endX = x;
    } else {
        startX = x;
        endX = x + textWidth;
    }
    context.strokeStyle = color;
    context.lineWidth = underlineHeight;
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
}

/*
#@c
Class    : ImageStamp

Description:
Constructor of the Image Stamp annotation.

Arguments:
1) mx     : starting x coordinate of annotation
2) my     : starting y coordinate of annotation
3) width  : Width of annotation
4) height : Height of annotation
5)fill    : Color of annotation

@author   25/11/2013    Aditya Kamra
#@e
*/
function ImageStamp(viewerManager, x, y, w, h, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder) {
       // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
       // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
    // But we aren't checking anything else!
    this.viewer = viewerManager;
       this.type = "IMGSTAMP";
       this.x = x || 0;
       this.y = y || 0;
       this.w = w || 1;
       this.h = h || 1;
       this.NoRedrawOnCreation = false;
       this.mousesensitivity = 1;
       this.groupid = groupID;
       this.userid = userName;
       this.rights = userRights;
       this.timeorder = timeorder;
       this.firstDraw = true;       
       this.title = "";
       this.filename = 0; 
	   this.StampFileSource="MASTER";	   
      // this.imgStampWidth = 0;
       //this.imgStampHeight = 0;
       this.image = new Image;
       this.reference = 0;	   
       this.properties = [false,false,true,false,false,true,true];	   
   }
   /*
   #@c
   Class    : ImageStamp
   Access   : Private
   Function : Draw
   Arguments:
   ctx: context on which annotation to be drawn

   Description:
   Draw Image Stamp to a given context

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   ImageStamp.prototype.draw = function (ctx) {
       var x = this.x;
       var y = this.y;
       if (this.image != null) {           
           // if (this.viewer.PdfManager.getOriginalWidth <= this.image.width || this.viewer.PdfManager.getOriginalHeight <= this.image.height) {
               // //alert("Image stamp bigger than the displayed image");              
               // alert(OPALL_ERR_MESSAGE.ImageStampErrorMsg);
               // return;
           // }
           
		   if((this.image.width > 0) && (this.image.height > 0)){	//Vishant Gautam on 23/12/2014
        var canvas = ctx.canvas;
        if(canvas.id == 'annotCanvas'){
          if((x + this.w) >= canvas.width){
            x -= (x  + this.w - canvas.width + 2);
          }
          
          if((y + this.h) >= canvas.height){
            y -= (y + this.h - canvas.height + 2);
          }
          
        }
        
        this.x = x;
        this.y = y;
				ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, x, y, this.w , this.h );
       }
       
		 //  console.log(this);
       document.getElementById("annotCanvas").style.cursor = "default";
       }
   }

   /*
   #@c
   Class    : ImageStamp
   Access   : Private
   Function : contains
   Arguments:
   1)mx: current x-coordinate of mouse
   2)my: current y-coordinate of mouse

   Description:
   This function determines if a point is inside the shape's bounds

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   ImageStamp.prototype.contains = function (mx, my) {
       // All we have to do is make sure the Mouse X,Y fall in the area between
       // the shape's X and (X + Height) and its Y and (Y + Height)
      // this.w = this.imgStampWidth;
     //  this.h = this.imgStampHeight;
       return (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my);
   }
/*
 #@c
 Class    : ImageStamp
 Access   : Private
 Function : contains
 Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

 Description:
 This function determines if current point lies on the  bottom right of selection box of annotation.
 If so, annotation is eligible for resizing.

 @author  06/08/2014    Swati
 #@e
 */
ImageStamp.prototype.isResize = function (mx, my) {
    return false;
}
   /*
   #@c
   Class    : ImageStamp
   Access   : Private
   Function : drawDrag
   Arguments:
   1)X:   X position where mouse is being dragged
   2)Y:   Y position where mouse is being dragged
   3)ctx: context on which annotation to be drawn

   Description:
   This function is used to re draw the annotation while it is being drawn first time

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   ImageStamp.prototype.drawDrag = function (X, Y, ctx) {		
       this.x = X;
       this.y = Y;
       ctx.strokeStyle = 'black';      
   }


   /*
   #@c
   Class    : ImageStamp
   Access   : Private
   Function : Drag
   Arguments:
   1)X:   X position where mouse is being dragged
   2)Y:   Y position where mouse is being dragged

   Description:
   This function is used to re draw the annotation while it is being dragged after selection.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   ImageStamp.prototype.Drag = function (X, Y) {
       this.x = X;
       this.y = Y;	   
       //this.w = this.imgStampWidth;
       //this.h = this.imgStampHeight;
       //ctx.strokeRect(this.x, this.y, this.w, this.h);
   }

   /*
   #@c
   Class    : ImageStamp
   Access   : Private
   Function : select
   Arguments:
   ctx: current context

   Description:
   This function is called when annotation is moved

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   ImageStamp.prototype.select = function (ctx) {
       ctx.strokeStyle = 'black';       
       ctx.strokeRect(this.x, this.y, this.w , this.h );
   }

   /*
   #@c
   Class    : ImageStamp
   Access   : Private
   Function : save
   Arguments: None

   Description:
   This function is called to save Highlight Annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   ImageStamp.prototype.save = function () {

       var xResizeFactor = this.viewer.ImageInfo.ImageWidth / this.viewer.ImageCanvas.width;
       var yResizeFactor = this.viewer.ImageInfo.ImageHeight / this.viewer.ImageCanvas.height;

       var info = "";
       //       var x2 =parseInt(this.w * this.viewer.ZoomFactor) + this.x;       // get value of final x coordinate
       //       var y2 = this.y + parseInt(  this.h * this.viewer.ZoomFactor);      // get value of final y coordinate  
       var x2 = this.w + this.x;
       var y2 = this.h + this.y;
       info = info + "X1=" + parseInt(this.x * xResizeFactor) + "\n";
       info = info + "Y1=" + parseInt(this.y * yResizeFactor) + "\n";
       info = info + "X2=" + parseInt(x2 * xResizeFactor) + "\n";
       info = info + "Y2=" + parseInt(y2 * yResizeFactor) + "\n";
       info = info + "Color=" + "0" + "\n";
       info = info + "TimeOrder=" + this.timeorder + "\n";
       info = info + "MouseSensitivity=" + this.mousesensitivity + "\n";
       info = info + "AnnotationGroupID=" + this.groupid + "\n";
       info = info + "UserID=" + this.userid + "\n";
       info = info + "Rights=" + this.rights + "\n";
       info = info + "Type=" + 0 + "\n";
       info = info + "FileName=" + this.filename + "\n";	   
	   info = info + "StampFileSource=" + this.StampFileSource + "\n";	   
       return info;
   }

   /*
   #@c
   Class    : ImageStamp
   Access   : Private
   Function : Resize
   Arguments: 
   1)xPreviousZoomFactor: previous x-zoom factor
   2)xCurrentZoomFactor:  current x-zoom factor
   3)yPreviousZoomFactor: previous y-zoom factor
   4)yCurrentZoomFactor:  current y-zoom factor

   Description:
   This function is called to resize annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   ImageStamp.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
       this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
       this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
       this.h = this.h * (yCurrentZoomFactor / yPreviousZoomFactor);
       this.w = this.w *(xCurrentZoomFactor / xPreviousZoomFactor);
   }

   /*
   #@c
   Class    : ImageStamp
   Access   : Private
   Function : rotate
   Arguments: 
   1)angle: Angle by which stamp should be rotated
   2)ctx:   current context

   Description:
   This function is called to rotate annotation.

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   ImageStamp.prototype.rotate = function (angle, ctx) {      
   }

   /*
   #@c
   Class    : ImageStamp
   Access   : Private
   Function : fillProperties
   Arguments: 
   imgStampSelectionList: list of all image stamps   

   Description:
   This function is called to fill properties of image stamp which needs to be drawn

   @author   25/11/2013    Aditya Kamra
   #@e
   */

   ImageStamp.prototype.fillProperties = function (imgStampSelectionList) {
       this.filename = imgStampSelectionList.id;
       this.image = imgStampSelectionList.image;
       this.reference = imgStampSelectionList.reference++;
       this.h = this.image.height * this.viewer.ZoomFactor ;
       this.w = this.image.width *  this.viewer.ZoomFactor;
	   this.firstDraw = false;
   }

   /*
   #@c
   Class    : FreeText

   Description:
   Constructor of the Free Text annotation.

   Arguments:
   1) mx     : starting x coordinate of annotation
   2) my     : starting y coordinate of annotation
   3) width  : Width of annotation
   4) height : Height of annotation
   5)fill    : Color of annotation

   @author   25/11/2013    Aditya Kamra
   #@e
   */
   function FreeText(viewerManager, x, y, w, h, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder) {
    // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
    // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
       // But we aren't checking anything else!
       this.viewer = viewerManager;
    this.type = "FREETXT";
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.fill = strokeColor || '#AAAAAA';
    this.NoRedrawOnCreation = false;
    this.mousesensitivity = 1;
    this.groupid = groupID;
    this.userid = userName;
    this.rights = userRights;
    this.timeorder = timeorder;
    this.firstDraw = true;
    this.fontName = "Arial";    
    this.fontSize = 15;
    this.bold = 0;
    this.italic = 0;
    this.underline = 0;
    this.strikeOut = 0;
    this.lines = [];
    this.font_style = 0;    
    this.properties = [false,false,true,false,false,true,true];	
	this.bResize=false;
	this.prevFontSize = -1; 
	this.prevcontextFont="";
}
/*
#@c
Class    : FreeText
Access   : Private
Function : Draw
Arguments:
ctx: context on which annotation to be drawn

Description:
Draw Free Text to a given context

@author   25/11/2013    Aditya Kamra
@modified 03/05/2019    Komal Walia for bug 5396
#@e
*/

FreeText.prototype.draw = function (ctx, scale) {
    if(!scale){
      //Modified by Komal Walia on 02/05/2019 for bug 5396.
      scale = OPALL.VIEWER.AnnotationManager.scaleForDrawing;
    }
    var scaledFont = this.fontSize * scale;
    ctx.font = scaledFont + "px " + this.fontName;
   // ctx.font = this.fontSize + "px " + this.fontName;
    if (this.bold == 1)
        ctx.font = "bold " + ctx.font;
    if (this.italic == 1)
        ctx.font = "italic " + ctx.font;
    ctx.textAlign = "left";    
	ctx.textBaseline = 'bottom';    
    var y = this.y; 
    ctx.fillStyle = this.fill;	
    for (i = 0; i < this.lines.length; i++) {
		y = y + scaledFont+5;
        ctx.fillText(this.lines[i], this.x, y);
        if (this.underline == true) {
                    this.textUnderline(ctx, this.lines[i], this.x, y, ctx.fillStyle, scaledFont, ctx.textAlign);
        }
        if (this.strikeOut == true) {
            this.textStrikeOut(ctx, this.lines[i], this.x, y, ctx.fillStyle, scaledFont, ctx.textAlign);
        }       
    }
	/*By Avinash Kumar For Bug:4185 and Bug:4236 and Bug:4278*/
	if(this.prevFontSize != scaledFont || ctx.font != this.prevcontextFont){
	   this.bResize = false;
	}
	if(this.bResize==false)
	{
		this.h=y-this.y;	
		var maxWidth = 0;
		for(var i = 0; i < this.lines.length; i++){
			var ithLineWidth = parseInt(ctx.measureText(this.lines[i]).width);
			if(ithLineWidth > maxWidth){
				maxWidth = ithLineWidth;
			}
		}
		this.w = maxWidth;
	}
    if(!scale)
        document.getElementById("annotCanvas").style.cursor = "default";
	/* For Bug:4185 */
	this.prevFontSize = scaledFont;
	this.prevcontextFont = ctx.font;
	this.bResize = true;
	
}

/*
#@c
Class    : FreeText
Access   : Private
Function : contains
Arguments:
1)mx: current x-coordinate of mouse
2)my: current y-coordinate of mouse

Description:
This function determines if a point is inside the shape's bounds

@author   25/11/2013    Aditya Kamra
#@e
*/

FreeText.prototype.contains = function (mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Height) and its Y and (Y + Height)
    return (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my);
}

/*
 #@c
 Class    : FreeText
 Access   : Private
 Function : contains
 Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

 Description:
 This function determines if current point lies on the  bottom right of selection box of annotation.
 If so, annotation is eligible for resizing.

 @author  06/08/2014    Swati
 #@e
 */
FreeText.prototype.isResize = function (mx, my) {
return ((this.x+this.w -15)<= mx) && ((this.x + this.w +10)>= mx) &&
          ((this.y+this.h-15)<= my) && ((this.y + this.h+10)>= my);    
}
/*
#@c
Class    : FreeText
Access   : Private
Function : drawDrag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged
3)ctx: context on which annotation to be drawn

Description:
This function is used to re draw the annotation while it is being drawn first time

@author   25/11/2013    Aditya Kamra
#@e
*/

FreeText.prototype.drawDrag = function (X, Y, ctx) {
	this.bResize=true;
	//By Avinash For Bug #4281
	ctx.font = this.fontSize*this.viewer.ZoomFactor + "px " + this.fontName;	
	if(ctx.measureText(this.lines[0]).width < (X - this.x))
		this.w = X - this.x;
	else
		this.w = ctx.measureText(this.lines[0]).width+4;
	if((this.lines.length* (this.fontSize+5)) <  (Y - this.y))
		this.h = Y - this.y;
	//else
	//	this.h = (this.lines.length* this.fontSize+4);
}


/*
#@c
Class    : FreeText
Access   : Private
Function : Drag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged

Description:
This function is used to re draw the annotation while it is being dragged after selection.

@author   25/11/2013    Aditya Kamra
#@e
*/

FreeText.prototype.Drag = function (X, Y) {
    this.x = X;
    this.y = Y;
}

/*
#@c
Class    : FreeText
Access   : Private
Function : select
Arguments:
ctx: current context

Description:
This function is called when annotation is moved

@author   25/11/2013    Aditya Kamra
#@e
*/

FreeText.prototype.select = function (ctx) {		
		if(this.fill=="#000000")
			ctx.strokeStyle = 'Red';
		else
			ctx.strokeStyle = 'Black';
		ctx.strokeRect((this.x - 2), (this.y - 2), 2, 2);
       ctx.strokeRect((this.x + this.w), (this.y-2), 2, 2);
       ctx.strokeRect((this.x - 2), (this.y + this.h), 2, 2);
       ctx.font ="18px Arial";
	   ctx.strokeText("+",this.x+this.w-4, this.y+this.h+5); 
}

/*
#@c
Class    : FreeText
Access   : Private
Function : save
Arguments: None

Description:
This function is called to save Highlight Annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

FreeText.prototype.save = function () {
    var xResizeFactor = this.viewer.ImageInfo.ImageWidth / this.viewer.ImageCanvas.width;
    var yResizeFactor = this.viewer.ImageInfo.ImageHeight / this.viewer.ImageCanvas.height;
    var info = "";
    var x2 = this.w + this.x;       // get value of final x coordinate
    var y2 = this.y + this.h;      // get value of final y coordinate  

    info = info + "X1=" + parseInt(this.x * xResizeFactor) + "\n";
    info = info + "Y1=" + parseInt(this.y * yResizeFactor) + "\n";
    info = info + "X2=" + parseInt(x2 * xResizeFactor) + "\n";
    info = info + "Y2=" + parseInt(y2 * yResizeFactor) + "\n";
    info = info + "Color=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fill) + "\n";
    info = info + "TimeOrder=" + this.timeorder + "\n";
    info = info + "MouseSensitivity=" + this.mousesensitivity + "\n";
    info = info + "AnnotationGroupID=" + this.groupid + "\n";
    info = info + "UserID=" + this.userid + "\n";
    info = info + "Rights=" + this.rights + "\n";
    for (var ilineCount = 0; ilineCount < this.lines.length; ilineCount++)
        info = info + "Line" + (ilineCount + 1) + "=" + this.lines[ilineCount] + "\n";
    info = info + "LinesOfText=" + this.lines.length + "\n";
   // info = info + "Height=" +(- Math.ceil(this.fontSize / this.viewer.ZoomFactor)) + "\n";
    info = info + "Height=" +(- Math.ceil(this.fontSize)) + "\n";
    info = info + "Width=" + "0" + "\n";
    info = info + "Escapement=" + "0" + "\n";
    info = info + "Orientation=" + "0" + "\n";
    if (this.bold == 1)
        info = info + "Weight=" + "700" + "\n";
    else
        info = info + "Weight=" + "400" + "\n";
    if (this.italic == 1)
        info = info + "Italic=" + "255" + "\n";
    else
        info = info + "Italic=" + "0" + "\n";
    info = info + "Underlined=" + this.underline + "\n";
    info = info + "StrikeOut=" + this.strikeOut + "\n";
    info = info + "CharSet=" + "0" + "\n";
    info = info + "OutPrecision=" + "0" + "\n";
    info = info + "ClipPrecision=" + "0" + "\n";
    info = info + "Quality=" + "1" + "\n";
    if (((this.fontName).match(/TimesRoman/i) != null) || ((this.fontName).match(/Serif/i) != null))
        info = info + "PitchAndFamily=" + "18" + "\n";
    else if (((this.fontName).match(/Dialog/i) != null) || ((this.fontName).match(/SansSerif/i) != null) || ((this.fontName).match(/Helvetica/i) != null))
        info = info + "PitchAndFamily=" + "34" + "\n";
    else if ((this.fontName).match(/DialogInput/i) != null)
        info = info + "PitchAndFamily=" + "34" + "\n";
    else
        info = info + "PitchAndFamily=" + "49" + "\n";
    info = info + "FontName=" + this.fontName + "\n";
    info = info + "FontColor=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fill) + "\n";
    info = info + "TextWidth=" + parseInt(this.w) + "\n";
    return info;
}
/*
#@c
Class    : FreeText
Access   : Private
Function : fillProperties
Arguments: 
freetextAreaManager: object of FreeTextAreaHolder class

Description:
This function is called to fill properties of free text annotation which needs to be drawn

@author   25/11/2013    Aditya Kamra
#@e
*/

FreeText.prototype.fillProperties = function (freetextAreaManager) {
    this.fontName = freetextAreaManager.GetFontName();
    this.fontSize = freetextAreaManager.GetFontSize();
    this.font_style = freetextAreaManager.GetFontStyle();
    switch (this.font_style) {
        case 0:
            this.italic = 0;
            this.bold = 0;
            break;
        case 1:
            this.italic = 0;
            this.bold = 1;
            break;
        case 2:
            this.italic = 1;
            this.bold = 0;
            break;
        case 3:
            this.italic = 1;
            this.bold = 1;
            break;
        default:
            this.italic = 0;
            this.bold = 0;
            break;
    }
    this.underline = freetextAreaManager.GetUnderline();
    this.strikeOut = freetextAreaManager.GetStrikeThrough();
}


/*
#@c
Class    : FreeText
Access   : Private
Function : Resize
Arguments: 
1)xPreviousZoomFactor: previous x-zoom factor
2)xCurrentZoomFactor:  current x-zoom factor
3)yPreviousZoomFactor: previous y-zoom factor
4)yCurrentZoomFactor:  current y-zoom factor

Description:
This function is called to resize annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

FreeText.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
    this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
    this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
    // this.h = this.h * (yCurrentZoomFactor / yPreviousZoomFactor);
    // this.w = this.w * (xCurrentZoomFactor / xPreviousZoomFactor);
    // this.fontSize = this.fontSize * (xCurrentZoomFactor / xPreviousZoomFactor);
}

/*
#@c
Class    : FreeText
Access   : Private
Function : rotate
Arguments: 
1)angle: Angle by which text should be rotated
2)ctx:   current context

Description:
This function is called to rotate annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

FreeText.prototype.rotate = function (angle, ctx) {
}

/*
#@c
Class    : FreeText
Access   : Private
Function : textUnderline
Arguments: 
1)context   : context on which line needs to be drawn
2)text      : text below which annotation needs to be drawn
3)x         : starting x coordinate of text
4)y         : starting y coordinate of text
5)color     : color of underline
6)textSize  : font size of text
7:align     : alignment of text
   
Description:
This function is called to draw underline in free text annotation

@author   25/11/2013    Aditya Kamra
#@e
*/

FreeText.prototype.textUnderline = function (context, text, x, y, color, textSize, align) {

    var textWidth = context.measureText(text).width;
    //var to store the starting position of text (X-axis)
    var startX;
    //var to store the starting position of text (Y-axis)
    // I have tried to set the position of the underline according 
    // to size of text. You can change as per your need
    var startY = y + 2;
    //var to store the end position of text (X-axis)
    var endX;
    //var to store the end position of text (Y-axis)
    //It should be the same as start position vertically. 
    var endY = startY;
    //To set the size line which is to be drawn as underline.
    //Its set as per the size of the text. Feel free to change as per need.
    var underlineHeight = parseInt(textSize) / 15;
    //Because of the above calculation we might get the value less 
    //than 1 and then the underline will not be rendered. this is to make sure 
    //there is some value for line width.
    if (underlineHeight < 1) {
        underlineHeight = 1;
    }
    context.beginPath();
    if (align == "center") {
        startX = x - (textWidth / 2);
        endX = x + (textWidth / 2);
    } else if (align == "right") {
        startX = x - textWidth;
        endX = x;
    } else {
        startX = x;
        endX = x + textWidth;
    }
    context.strokeStyle = color;
    context.lineWidth = underlineHeight;
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
}
/*
#@c
Class    : FreeText
Access   : Private
Function : textStrikeOut
Arguments: 
1)context   : context on which line needs to be drawn
2)text      : text below which annotation needs to be drawn
3)x         : starting x coordinate of text
4)y         : starting y coordinate of text
5)color     : color of underline
6)textSize  : font size of text
7:align     : alignment of text
   
Description:
This function is called to draw strike out line in text stamp.

@author   25/11/2013    Aditya Kamra
#@e
*/

FreeText.prototype.textStrikeOut = function (context, text, x, y, color, textSize, align) {
    var textWidth = context.measureText(text).width;
    //var to store the starting position of text (X-axis)
    var startX;
    var startY = y - (parseInt(textSize) / 3);
    //var to store the end position of text (X-axis)
    var endX;
    //var to store the end position of text (Y-axis)
    //It should be the same as start position vertically. 
    var endY = startY;
    //To set the size line which is to be drawn as underline.
    //Its set as per the size of the text. Feel free to change as per need.
    var underlineHeight = parseInt(textSize) / 15;
    //Because of the above calculation we might get the value less 
    //than 1 and then the underline will not be rendered. this is to make sure 
    //there is some value for line width.
    if (underlineHeight < 1) {
        underlineHeight = 1;
    }
    context.beginPath();
    if (align == "center") {
        startX = x - (textWidth / 2);
        endX = x + (textWidth / 2);
    } else if (align == "right") {
        startX = x - textWidth;
        endX = x;
    } else {
        startX = x;
        endX = x + textWidth;
    }
    context.strokeStyle = color;
    context.lineWidth = underlineHeight;
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////// Dymnamic Zone///////////////////////////////////////////////////////////////////////

/*
#@c
Class    : DynamicZone

Description:
Constructor of the Dynamic Zone annotation.

Arguments:
1) mx     : starting x coordinate of annotation
2) my     : starting y coordinate of annotation
3) width  : Width of annotation
4) height : Height of annotation
5)fill    : Color of annotation

@author   25/11/2013    Aditya Kamra
#@e
*/
function DynamicZone(viewerManager, x, y, w, h, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder) {
  // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
    // But we aren't checking anything else!
    this.viewer = viewerManager;
  this.type= "DZONE" ;
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 1;
  this.h = h || 1;
  this.fill = strokeColor || '#AAAAAA';
  this.NoRedrawOnCreation = false;
  this.thickness = viewerManager.AnnotationManager.penThickness[this.type];
  this.thicknessLevel = viewerManager.AnnotationManager.penThickness[this.type];
  this.groupid = groupID;
  this.userid = userName;
  this.rights = userRights;
  this.timeorder = timeorder;
  this.mousesensitivity = 1;
  this.properties = [true,true,true,false,true,false,true];
}

/*
#@c
Class    : DynamicZone
Access   : Private
Function : Draw
Arguments:
ctx: context on which annotation to be drawn

Description:
Draw Dynamic Zone to a given context

@author   25/11/2013    Aditya Kamra
#@e
*/

DynamicZone.prototype.draw = function(ctx) {
    ctx.strokeStyle = this.fill;
    ctx.lineWidth = this.thickness;
  ctx.strokeRect(this.x, this.y, this.w, this.h);
}

/*
#@c
Class    : DynamicZone
Access   : Private
Function : contains
Arguments:
1)mx: current x-coordinate of mouse
2)my: current y-coordinate of mouse

Description:
This function determines if a point is inside the shape's bounds

@author   25/11/2013    Aditya Kamra
#@e
*/

DynamicZone.prototype.contains = function(mx, my) {
  // All we have to do is make sure the Mouse X,Y fall in the area between
  // the shape's X and (X + Height) and its Y and (Y + Height)
  return  (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my);
}

/*
 #@c
 Class    : DynamicZone
 Access   : Private
 Function : contains
 Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

 Description:
 This function determines if current point lies on the  bottom right of selection box of annotation.
 If so, annotation is eligible for resizing.

 @author  06/08/2014    Swati
 #@e
 */
DynamicZone.prototype.isResize = function (mx, my) {
    return ((this.x+this.w -15)<= mx) && ((this.x + this.w +10)>= mx) &&
          ((this.y+this.h-15)<= my) && ((this.y + this.h+10)>= my);
}
/*
#@c
Class    : DynamicZone
Access   : Private
Function : drawDrag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged
3)ctx: context on which annotation to be drawn

Description:
This function is used to re draw the annotation while it is being drawn first time

@author   25/11/2013    Aditya Kamra
#@e
*/

DynamicZone.prototype.drawDrag = function (X, Y, ctx) {
    this.w = X - this.x;    
    this.h= Y - this.y;    
}


/*
#@c
Class    : DynamicZone
Access   : Private
Function : Drag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged

Description:
This function is used to re draw the annotation while it is being dragged after selection.

@author   25/11/2013    Aditya Kamra
#@e
*/

DynamicZone.prototype.Drag  = function(X,Y) {
this.x = X;
this.y = Y;  
}



/*
#@c
Class    : DynamicZone
Access   : Private
Function : select
Arguments:
ctx: current context

Description:
This function is called when annotation is moved

@author   25/11/2013    Aditya Kamra
#@e
*/

DynamicZone.prototype.select = function (ctx) {
		ctx.strokeStyle = 'black';
	   ctx.strokeRect((this.x - 2), (this.y - 2), 2, 2);
       ctx.strokeRect((this.x + this.w), (this.y - 2), 2, 2);
       ctx.strokeRect((this.x - 2), (this.y + this.h), 2, 2);
       ctx.font ="18px Arial";
	   ctx.strokeText("+",this.x+this.w-4, this.y+this.h+3); 
}

/*
#@c
Class    : DynamicZone
Access   : Private
Function : save
Arguments: None

Description:
This function is called to save Highlight Annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

DynamicZone.prototype.save = function () {
    var info  = "";
    return info;
}

/*
#@c
Class    : DynamicZone
Access   : Private
Function : Resize
Arguments: 
1)xPreviousZoomFactor: previous x-zoom factor
2)xCurrentZoomFactor:  current x-zoom factor
3)yPreviousZoomFactor: previous y-zoom factor
4)yCurrentZoomFactor:  current y-zoom factor

Description:
This function is called to resize annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

DynamicZone.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
    this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
    this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
    this.h = this.h * (yCurrentZoomFactor / yPreviousZoomFactor);
    this.w = this.w * (xCurrentZoomFactor / xPreviousZoomFactor);
    this.thickness = parseInt(this.thicknessLevel * xCurrentZoomFactor);
    if (this.thickness == 0)
        this.thickness = 1;
}

/*
#@c
Class    : DynamicZone
Access   : Private
Function : rotate
Arguments: 
1)angle: Angle by which zone should be rotated
2)ctx:   current context

Description:
This function is called to rotate annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

DynamicZone.prototype.rotate = function (angle, ctx) {
    var temp = this.h;
    var temp1 = this.x;
    this.x = canvas2.width - this.y - this.h;
    this.y = temp1;
    this.h = this.w;
    this.w = temp;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////// Extract Zone //////////////////////////////////////////////////////////////////////

/*
#@c
Class    : ExtactZone

Description:
Constructor of the Extract Zone annotation.

Arguments:
1) mx     : starting x coordinate of annotation
2) my     : starting y coordinate of annotation
3) width  : Width of annotation
4) height : Height of annotation
5)fill    : Color of annotation

@author   25/11/2013    Aditya Kamra
#@e
*/
function ExtractZone(viewer, x, y, w, h, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder) {
  // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
    // But we aren't checking anything else!    
  this.type= "EZONE" ;
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 1;
  this.h = h || 1;
  this.id = -1;
  this.viewer = viewer ;
  this.fill = strokeColor || '#000000';
  this.NoRedrawOnCreation = false;
  this.thickness = viewer.AnnotationManager.penThickness[this.type];
  this.thicknessLevel = viewer.AnnotationManager.penThickness[this.type];
  this.zoneType = 1;
  this.zoneBackground = 0;
  this.isMutable = true;
  this.partitions = [];
  this.selectedPartitionIndex = [];
  this.bSelectAll=false;
  this.properties = [true,true,true,false,true,true,false];
}
/*
#@c
Class    : ExtractZone
Access   : Private
Function : Draw
Arguments:
ctx: context on which annotation to be drawn

Description:
Draw Extact Zone to a given context

@author   25/11/2013    Aditya Kamra
#@e
*/

ExtractZone.prototype.draw = function(ctx) {
   if (this.zoneType == 1)
      {
	    ctx.strokeStyle = this.fill;
	    ctx.fillStyle = this.fill;
        ctx.lineWidth = this.thickness;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
	  }
   else if (this.zoneType == 2)
      {
	    if (this.zoneBackground == 0)
		   {
	         ctx.globalAlpha = 0.5;
			 ctx.strokeStyle = this.fill;
			 ctx.fillStyle = this.fill;
             ctx.lineWidth = this.thickness;
             ctx.fillRect(this.x, this.y, this.w, this.h);
			 ctx.globalAlpha = 1;
			 }
		else if (this.zoneBackground == 1)
           {
               imageCtx = this.viewer.ImageCanvas.getContext("2d");  
		     imgData = imageCtx.getImageData(this.x, this.y, this.w, this.h);
             for (var i = 0; i < imgData.data.length; i += 4) {
                 imgData.data[i] = 255 - imgData.data[i];
                 imgData.data[i + 1] = 255 - imgData.data[i + 1];
                 imgData.data[i + 2] = 255 - imgData.data[i + 2];
                 imgData.data[i + 3] = 255;
                }
             ctx.putImageData(imgData, this.x, this.y);
           }
           }
   else if (this.zoneType == 3)
      {
	    ctx.strokeStyle = this.fill;
	    ctx.fillStyle = this.fill;
        ctx.lineWidth = this.thickness;
        ctx.fillRect(this.x, this.y, this.w, this.h);    
      }   
	  
	for (var index = 0; index < this.partitions.length; index++) {
	this.partitions[index].draw(ctx);
	}
}

/*
#@c
Class    : ExtractZone
Access   : Private
Function : drawScaled
Arguments:
ctx: context on which annotation to be drawn
canvas : scaled cnavas
Description:
Draw Extact Zone to a given scaled context done for ZoomLens

@author   25/11/2013    Aditya Kamra
#@e
*/

ExtractZone.prototype.drawScaled = function(ctx,canvas) {
   // if (this.zoneType == 1)
      // {
	    // ctx.strokeStyle = this.fill;
        // ctx.lineWidth = this.thickness;
        // ctx.strokeRect(this.x, this.y, this.w, this.h);
	  // }
   // else if (this.zoneType == 2)
      // {
	    // if (this.zoneBackground == 0)
		   // {
	         // ctx.globalAlpha = 0.5;
			 // ctx.strokeStyle = this.fill;
             // ctx.lineWidth = this.thickness;
             // ctx.fillRect(this.x, this.y, this.w, this.h);
			 // ctx.globalAlpha = 1;
			 // }
		// else if (this.zoneBackground == 1)
           // {
             // imageCtx = canvas.getContext("2d");  
		     // imgData = imageCtx.getImageData(this.x, this.y, this.w, this.h);
             // for (var i = 0; i < imgData.data.length; i += 4) {
                 // imgData.data[i] = 255 - imgData.data[i];
                 // imgData.data[i + 1] = 255 - imgData.data[i + 1];
                 // imgData.data[i + 2] = 255 - imgData.data[i + 2];
                 // imgData.data[i + 3] = 255;
                // }
             // ctx.putImageData(imgData, this.x, this.y);
           // }
           // }
   // else if (this.zoneType == 3)
      // {
	    // ctx.strokeStyle = this.fill;
        // ctx.lineWidth = this.thickness;
        // ctx.fillRect(this.x, this.y, this.w, this.h);    
      // }   
	  
	  if (this.zoneType == 1)
      {
	    ctx.strokeStyle = this.fill;
	    ctx.fillStyle = this.fill;
        ctx.lineWidth = this.thickness;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
	  }
   else if (this.zoneType == 2)
      {
	    if (this.zoneBackground == 0)
		   {
	         ctx.globalAlpha = 0.5;
			 ctx.strokeStyle = this.fill;
			 ctx.fillStyle = this.fill;
             ctx.lineWidth = this.thickness;
             ctx.fillRect(this.x, this.y, this.w, this.h);
			 ctx.globalAlpha = 1;
			 }
		else if (this.zoneBackground == 1)
           {
               imageCtx = canvas.getContext("2d");  
		     imgData = imageCtx.getImageData(this.x, this.y, this.w, this.h);
             for (var i = 0; i < imgData.data.length; i += 4) {
                 imgData.data[i] = 255 - imgData.data[i];
                 imgData.data[i + 1] = 255 - imgData.data[i + 1];
                 imgData.data[i + 2] = 255 - imgData.data[i + 2];
                 imgData.data[i + 3] = 255;
                }
             ctx.putImageData(imgData, this.x, this.y);
           }
           }
   else if (this.zoneType == 3)
      {
	    ctx.strokeStyle = this.fill;
	    ctx.fillStyle = this.fill;
        ctx.lineWidth = this.thickness;
        ctx.fillRect(this.x, this.y, this.w, this.h);    
      }   
	  
	for (var index = 0; index < this.partitions.length; index++) {
	this.partitions[index].draw(ctx);
	}
}
/*
#@c
Class    : ExtractZone
Access   : Private
Function : contains
Arguments:
1)mx: current x-coordinate of mouse
2)my: current y-coordinate of mouse

Description:
This function determines if a point is inside the shape's bounds

@author   25/11/2013    Aditya Kamra
#@e
*/

ExtractZone.prototype.contains = function(mx, my) {
  // All we have to do is make sure the Mouse X,Y fall in the area between
  // the shape's X and (X + Height) and its Y and (Y + Height)
  return  ((this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my) && (this.isMutable == true));
}

/*
#@c
Class    : ExtractZone
Access   : Private
Function : drawDrag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged
3)ctx: context on which annotation to be drawn

Description:
This function is used to re draw the annotation while it is being drawn first time

@author   25/11/2013    Aditya Kamra
#@e
*/
ExtractZone.prototype.drawDrag = function (X, Y, ctx) {
	if(this.partitions.length>0){
		if(this.partitions[this.partitions.length-1].x < (X-this.x))
			this.w = X - this.x;
		else
			this.w = this.partitions[this.partitions.length-1].x +4;
	}
	else
		this.w = X - this.x;
    this.h = Y - this.y;
}

/*
#@c
Class    : ExtractZone
Access   : Private
Function : Drag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged

Description:
This function is used to re draw the annotation while it is being dragged after selection.

@author   25/11/2013    Aditya Kamra
#@e
*/
ExtractZone.prototype.Drag  = function(X,Y) {
 if ( this.selectedPartitionIndex.length > 0 )
  {
    for (var index = 0; index < this.selectedPartitionIndex.length; index++) {
	   this.partitions[this.selectedPartitionIndex[index]].Drag(X,Y);
	} 
  }
 else
   {
    this.x = X;
    this.y = Y;
   }
}

/*
#@c
Class    : ExtractZone
Access   : Private
Function : select
Arguments:
ctx: current context

Description:
This function is called when annotation is moved

@author   25/11/2013    Aditya Kamra
#@e
*/
ExtractZone.prototype.select = function (ctx) {
   if (this.selectedPartitionIndex.length < 1)
   {	 
		if(this.fill=="#000000")
			ctx.strokeStyle = 'Red';
		else
			ctx.strokeStyle = 'black';
		ctx.strokeRect((this.x - 2), (this.y - 2), 2, 2);
		ctx.strokeRect((this.x + this.w), (this.y - 2), 2, 2);
		ctx.strokeRect((this.x - 2), (this.y + this.h), 2, 2);
		ctx.font ="18px Arial";
		ctx.strokeText("+",this.x + this.w-4, this.y + this.h+3); 
		if(this.bSelectAll==true){
			for(var count=0;count<this.partitions.length;count++)
				this.partitions[count].select(ctx);
		}
	}
	else {
	  for (var index = 0; index < this.selectedPartitionIndex.length; index++) {
			this.partitions[this.selectedPartitionIndex[index]].select(ctx);
		}
	}
}

/*
#@c
Class    : ExtractZone
Access   : Private
Function : save
Arguments: None

Description:
This function is called to save Highlight Annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

ExtractZone.prototype.save = function () {
    var info = "";
    return info;
}

/*
#@c
Class    : ExtractZone
Access   : Private
Function : Resize
Arguments: 
1)xPreviousZoomFactor: previous x-zoom factor
2)xCurrentZoomFactor:  current x-zoom factor
3)yPreviousZoomFactor: previous y-zoom factor
4)yCurrentZoomFactor:  current y-zoom factor

Description:
This function is called to resize annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

ExtractZone.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
    this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
    this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
    this.h = this.h * (yCurrentZoomFactor / yPreviousZoomFactor);
    this.w = this.w * (xCurrentZoomFactor / xPreviousZoomFactor);
    this.thickness = parseInt(this.thicknessLevel * xCurrentZoomFactor);
    if (this.thickness == 0)
        this.thickness = 1;
	for (var index = 0; index < this.partitions.length; index++) {
		this.partitions[index].Resize(xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor);
	}
}
ExtractZone.prototype.isResize = function (mx, my) {
return ((this.x+this.w -15)<= mx) && ((this.x + this.w +10)>= mx) &&
          ((this.y+this.h-15)<= my) && ((this.y + this.h+10)>= my);  
}
/*
#@c
Class    : ExtractZone
Access   : Private
Function : rotate
Arguments: 
1)angle: Angle by which zone should be rotated
2)ctx:   current context

Description:
This function is called to rotate annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

ExtractZone.prototype.rotate = function (angle, ctx) {
 
}


ExtractZone.prototype.CheckContainsForPartitions = function(mx,my,isMultiSelect)
{
    if (!isMultiSelect)
       this.selectedPartitionIndex = [];
    var selectedIndex = -1;
    for(var j=0; j < this.partitions.length;j++)
	{
	    if (this.partitions[j].contains(mx,my))
	    {
		    selectedIndex = j;
			this.selectedPartitionIndex.push(j);
			break;
		}
	}
	if (selectedIndex == -1)
	   this.selectedPartitionIndex = [];
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////// Sticky Note //////////////////////////////////////////////////////////////////////

/*
#@c
Class    : StickyNote

Description:
Constructor of the Sticky Note annotation.

Arguments:
1) mx     : starting x coordinate of annotation
2) my     : starting y coordinate of annotation
3) width  : Width of annotation
4) height : Height of annotation
5)fill    : Color of annotation

@author   25/11/2013    Aditya Kamra
#@e
*/
function StickyNote(viewerManager, x, y, w, h, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder) {
    // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
    // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
    // But we aren't checking anything else!
    this.viewer = viewerManager;
    this.type = "STICKYNOTE";
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.fillColor =  fillcolor||'#ffff00';
    this.fill = strokeColor || '#AAAAAA';
    this.NoRedrawOnCreation = false;
    this.groupid = groupID;
    this.userid = userName;
    this.rights = userRights;
    this.timeorder = timeorder;
    this.mousesensitivity = 1;
    this.firstDraw = true;
    this.fontName = "Arial";
    this.fontSize = 15;
    this.bold = 0;
    this.italic = 0;
    this.underline = 0;
    this.strikeOut = 0;
    this.lines = [];
    this.font_style = 0;    
    this.properties = [false,false,true,false,false,true,true];
	this.bResize=false;
    this.prevFontSize = -1;	
	this.prevcontextFont="";
}

/*
#@c
Class    : StickyNote
Access   : Private
Function : Draw
Arguments:
ctx: context on which annotation to be drawn

Description:
Draw Sticky Note to a given context

@author   25/11/2013    Aditya Kamra
@modified 03/05/2019    Komal Walia for bug 5396
#@e
*/
StickyNote.prototype.draw = function (ctx, scale) {
    if(!scale){
      //Modified by Komal Walia on 02/05/2019 for bug 5396.
      scale = OPALL.VIEWER.AnnotationManager.scaleForDrawing;
    }
    var scaledFont = this.fontSize * scale;
    ctx.font = scaledFont + "px " + this.fontName;
    
	//ctx.font = this.fontSize + "px " + this.fontName;
    if (this.bold == 1)
        ctx.font = "bold " + ctx.font;
    if (this.italic == 1)
        ctx.font = "italic " + ctx.font;
    ctx.textAlign = "left";
	ctx.fillStyle = this.fillColor;
	ctx.textBaseline = 'bottom';
	 var y = this.y + scaledFont;
    for (j = 0; j < this.lines.length; j++) {
        y = y + scaledFont+5;
    }
	/*BY avinash Kumar For BugID:4185 and BugID:4236*/
	//for Bug 4278 by Pooja Kamra
    if(scaledFont != this.prevFontSize || ctx.font != this.prevcontextFont){
		this.bResize = false;
	}    
	if(this.bResize==false)
	{
		this.h=y-this.y;
		var maxWidth = 0;
		for(var i = 0; i < this.lines.length; i++){
			var ithLineWidth = parseInt(ctx.measureText(this.lines[i]).width);
			if(ithLineWidth > maxWidth){
				maxWidth = ithLineWidth;
			}
		}
		this.w = maxWidth;	
	}
    ctx.fillRect(this.x, this.y, this.w,this.h);
    ctx.fillStyle = this.fill;    
	y = this.y + scaledFont+5;
    for (i = 0; i < this.lines.length; i++) {
        ctx.fillText(this.lines	[i], this.x, y);
        if (this.underline == true) {
            this.textUnderline(ctx, this.lines[i], this.x, y, ctx.fillStyle, scaledFont, ctx.textAlign);
        }
        if (this.strikeOut == true)
            this.textStrikeOut(ctx, this.lines[i], this.x, y, ctx.fillStyle, scaledFont, ctx.textAlign);
        y = y + scaledFont + 5;
    }
	 document.getElementById("annotCanvas").style.cursor = "default";
	 this.prevFontSize = scaledFont;
	 this.prevcontextFont=ctx.font;
	 this.bResize=true;
}
/*
#@c
Class    : StickyNote
Access   : Private
Function : contains
Arguments:
1)mx: current x-coordinate of mouse
2)my: current y-coordinate of mouse

Description:
This function determines if a point is inside the shape's bounds

@author   25/11/2013    Aditya Kamra
#@e
*/
StickyNote.prototype.contains = function (mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Height) and its Y and (Y + Height)
    return (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my);
}


/*
 #@c
 Class    : StickyNote
 Access   : Private
 Function : contains
 Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

 Description:
 This function determines if current point lies on the  bottom right of selection box of annotation.
 If so, annotation is eligible for resizing.

 @author  06/08/2014    Swati
 #@e
 */
StickyNote.prototype.isResize = function (mx, my) {
   return ((this.x+this.w -15)<= mx) && ((this.x + this.w +10)>= mx) &&
          ((this.y+this.h-15)<= my) && ((this.y + this.h+10)>= my);   
}
/*
#@c
Class    : StickyNote
Access   : Private
Function : drawDrag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged
3)ctx: context on which annotation to be drawn

Description:
This function is used to re draw the annotation while it is being drawn first time

@author   25/11/2013    Aditya Kamra
#@e
*/
StickyNote.prototype.drawDrag = function (X, Y, ctx) {
	this.bResize=true;
	//by Avinash For Bug #4281
	ctx.font = Math.ceil(this.fontSize*this.viewer.ZoomFactor) + "px " + this.fontName;	
	if(ctx.measureText(this.lines[0]).width < (X - this.x))
		this.w = X - this.x;
	else
		this.w = ctx.measureText(this.lines[0]).width+4;
	if((this.lines.length* (this.fontSize+5)) <  (Y - this.y))
		this.h = Y - this.y;
	//else
	//	this.h = (this.lines.length* this.fontSize+4);	
}


/*
#@c
Class    : StickyNote
Access   : Private
Function : Drag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged

Description:
This function is used to re draw the annotation while it is being dragged after selection.

@author   25/11/2013    Aditya Kamra
#@e
*/
StickyNote.prototype.Drag = function (X, Y) {
    this.x = X;
    this.y = Y;
}

/*
#@c
Class    : StickyNote
Access   : Private
Function : select
Arguments:
ctx: current context

Description:
This function is called when annotation is moved

@author   25/11/2013    Aditya Kamra
#@e
*/

StickyNote.prototype.select = function (ctx) {
		if(this.fillColor=="#000000")
			ctx.strokeStyle = 'Red';
		else
			ctx.strokeStyle = 'Black';
		ctx.strokeRect((this.x - 2), (this.y - 2), 2, 2);
       ctx.strokeRect((this.x + this.w), (this.y-2), 2, 2);
       ctx.strokeRect((this.x - 2), (this.y + this.h), 2, 2);
       ctx.font ="18px Arial";
	   ctx.strokeText("+",this.x+this.w-4, this.y+this.h+3); 
}

/*
#@c
Class    : StickyNote
Access   : Private
Function : save
Arguments: None

Description:
This function is called to save Highlight Annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

StickyNote.prototype.save = function () {
    var xResizeFactor = this.viewer.ImageInfo.ImageWidth / this.viewer.ImageCanvas.width;
    var yResizeFactor = this.viewer.ImageInfo.ImageHeight / this.viewer.ImageCanvas.height;
    var info = "";
    var x2 = this.w + this.x;       // get value of final x coordinate
    var y2 = this.y + this.h;      // get value of final y coordinate  

    info = info + "X1=" + parseInt(this.x * xResizeFactor) + "\n";
    info = info + "Y1=" + parseInt(this.y * yResizeFactor) + "\n";
    info = info + "X2=" + parseInt(x2 * xResizeFactor) + "\n";
    info = info + "Y2=" + parseInt(y2 * yResizeFactor) + "\n";
    info = info + "Color=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fillColor) + "\n";
    info = info + "TimeOrder=" + this.timeorder + "\n";
    info = info + "MouseSensitivity=" + this.mousesensitivity + "\n";
    info = info + "AnnotationGroupID=" + this.groupid + "\n";
    info = info + "UserID=" + this.userid + "\n";
    info = info + "Rights=" + this.rights + "\n";
    for (var ilineCount = 0; ilineCount < this.lines.length; ilineCount++)
        info = info + "Line" + (ilineCount + 1) + "=" + this.lines[ilineCount] + "\n";
    info = info + "LinesOfText=" + this.lines.length + "\n";
   // info = info + "Height=" +(-Math.ceil(this.fontSize / this.viewer.ZoomFactor)) + "\n";
    info = info + "Height=" +(-Math.ceil(this.fontSize)) + "\n";
    info = info + "Width=" + "0" + "\n";
    info = info + "Escapement=" + "0" + "\n";
    info = info + "Orientation=" + "0" + "\n";
    if (this.bold == 1)
        info = info + "Weight=" + "700" + "\n";
    else
        info = info + "Weight=" + "400" + "\n";
    if (this.italic == 1)
        info = info + "Italic=" + "255" + "\n";
    else
        info = info + "Italic=" + "0" + "\n";
    info = info + "Underlined=" + this.underline + "\n";
    info = info + "StrikeOut=" + this.strikeOut + "\n";
    info = info + "CharSet=" + "0" + "\n";
    info = info + "OutPrecision=" + "0" + "\n";
    info = info + "ClipPrecision=" + "0" + "\n";
    info = info + "Quality=" + "1" + "\n";
    info = info + "Thickness=" + "0" + "\n";
    if (((this.fontName).match(/TimesRoman/i) != null) || ((this.fontName).match(/Serif/i) != null))
        info = info + "PitchAndFamily=" + "18" + "\n";
    else if (((this.fontName).match(/Dialog/i) != null) || ((this.fontName).match(/SansSerif/i) != null) || ((this.fontName).match(/Helvetica/i) != null))
        info = info + "PitchAndFamily=" + "34" + "\n";
    else if ((this.fontName).match(/DialogInput/i) != null)
        info = info + "PitchAndFamily=" + "34" + "\n";
    else
        info = info + "PitchAndFamily=" + "49" + "\n";
    info = info + "FontName=" + this.fontName + "\n";
    info = info + "FontColor=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fill) + "\n";
    return info;
}

/*
#@c
Class    : StickyNote
Access   : Private
Function : fillProperties
Arguments: 
freetextAreaManager: object of FreeTextAreaHolder class

Description:
This function is called to fill properties of sticky note annotation which needs to be drawn

@author   25/11/2013    Aditya Kamra
#@e
*/

StickyNote.prototype.fillProperties = function (freetextAreaManager) {
    this.fontName = freetextAreaManager.GetFontName();
    this.fontSize = freetextAreaManager.GetFontSize();
    this.font_style = freetextAreaManager.GetFontStyle();
    switch (this.font_style) {
        case 0:
            this.italic = 0;
            this.bold = 0;
            break;
        case 1:
            this.italic = 0;
            this.bold = 1;
            break;
        case 2:
            this.italic = 1;
            this.bold = 0;
            break;
        case 3:
            this.italic = 1;
            this.bold = 1;
            break;
        default:
            this.italic = 0;
            this.bold = 0;
            break;
    }
    this.underline = freetextAreaManager.GetUnderline();
    this.strikeOut = freetextAreaManager.GetStrikeThrough();
}


/*
#@c
Class    : StickyNote
Access   : Private
Function : Resize
Arguments: 
1)xPreviousZoomFactor: previous x-zoom factor
2)xCurrentZoomFactor:  current x-zoom factor
3)yPreviousZoomFactor: previous y-zoom factor
4)yCurrentZoomFactor:  current y-zoom factor

Description:
This function is called to resize annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

StickyNote.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
    this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
    this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
    // this.h = this.h * (yCurrentZoomFactor / yPreviousZoomFactor);
    // this.w = this.w * (xCurrentZoomFactor / xPreviousZoomFactor);
    // this.fontSize = this.fontSize * (xCurrentZoomFactor / xPreviousZoomFactor);
}

/*
#@c
Class    : StickyNote
Access   : Private
Function : rotate
Arguments: 
1)angle: Angle by which Note should be rotated
2)ctx:   current context

Description:
This function is called to rotate annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

StickyNote.prototype.rotate = function (angle, ctx) {
}

/*
#@c
Class    : StickyNote
Access   : Private
Function : textUnderline
Arguments: 
1)context   : context on which line needs to be drawn
2)text      : text below which annotation needs to be drawn
3)x         : starting x coordinate of text
4)y         : starting y coordinate of text
5)color     : color of underline
6)textSize  : font size of text
7:align     : alignment of text
   
Description:
This function is called to draw underline in sticky note annotation

@author   25/11/2013    Aditya Kamra
#@e
*/

StickyNote.prototype.textUnderline = function (context, text, x, y, color, textSize, align) {

    var textWidth = context.measureText(text).width;
    //var to store the starting position of text (X-axis)
    var startX;
    //var to store the starting position of text (Y-axis)
    // I have tried to set the position of the underline according 
    // to size of text. You can change as per your need
    var startY = y + 2;
    //var to store the end position of text (X-axis)
    var endX;
    //var to store the end position of text (Y-axis)
    //It should be the same as start position vertically. 
    var endY = startY;
    //To set the size line which is to be drawn as underline.
    //Its set as per the size of the text. Feel free to change as per need.
    var underlineHeight = parseInt(textSize) / 15;
    //Because of the above calculation we might get the value less 
    //than 1 and then the underline will not be rendered. this is to make sure 
    //there is some value for line width.
    if (underlineHeight < 1) {
        underlineHeight = 1;
    }
    context.beginPath();
    if (align == "center") {
        startX = x - (textWidth / 2);
        endX = x + (textWidth / 2);
    } else if (align == "right") {
        startX = x - textWidth;
        endX = x;
    } else {
        startX = x;
        endX = x + textWidth;
    }
    context.strokeStyle = color;
    context.lineWidth = underlineHeight;
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
}

/*
#@c
Class    : StickyNote
Access   : Private
Function : textStrikeOut
Arguments: 
1)context   : context on which line needs to be drawn
2)text      : text below which annotation needs to be drawn
3)x         : starting x coordinate of text
4)y         : starting y coordinate of text
5)color     : color of underline
6)textSize  : font size of text
7:align     : alignment of text
   
Description:
This function is called to draw strike out line in text stamp.

@author   25/11/2013    Aditya Kamra
#@e
*/

StickyNote.prototype.textStrikeOut = function (context, text, x, y, color, textSize, align) {
    var textWidth = context.measureText(text).width;
    //var to store the starting position of text (X-axis)
    var startX;
    var startY = y - (parseInt(textSize) / 3);
    //var to store the end position of text (X-axis)
    var endX;
    //var to store the end position of text (Y-axis)
    //It should be the same as start position vertically. 
    var endY = startY;
    //To set the size line which is to be drawn as underline.
    //Its set as per the size of the text. Feel free to change as per need.
    var underlineHeight = parseInt(textSize) / 15;
    //Because of the above calculation we might get the value less 
    //than 1 and then the underline will not be rendered. this is to make sure 
    //there is some value for line width.
    if (underlineHeight < 1) {
        underlineHeight = 1;
    }
    context.beginPath();
    if (align == "center") {
        startX = x - (textWidth / 2);
        endX = x + (textWidth / 2);
    } else if (align == "right") {
        startX = x - textWidth;
        endX = x;
    } else {
        startX = x;
        endX = x + textWidth;
    }
    context.strokeStyle = color;
    context.lineWidth = underlineHeight;
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
}
/*
#@c
Class    : ImageStamp

Description:
Constructor of the Image Stamp annotation.

Arguments:
1) mx     : starting x coordinate of annotation
2) my     : starting y coordinate of annotation
3) width  : Width of annotation
4) height : Height of annotation
5)fill    : Color of annotation

@author   25/11/2013    Aditya Kamra
#@e
*/
function AttachNote(viewerManager, x, y, w, h, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder) {
    // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
    // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
    // But we aren't checking anything else!
    var height = 0;
    var width = 0;
    this.viewer = viewerManager;
    this.type = "ATTACHNOTE";
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.NoRedrawOnCreation = false;
    this.groupid = groupID;
    this.userid = userName;
    this.rights = userRights;
    this.timeorder = timeorder;
    this.mousesensitivity = 1;
    this.image = this.viewer.AnnotationManager.AttachNoteImage;
    this.w = this.image.width;
    this.h = this.image.height;
    this.text = "";
    this.lines = [];    
    this.properties = [false,false,true,false,false,true,true];	
}
/*
#@c
Class    : ImageStamp
Access   : Private
Function : Draw
Arguments:
ctx: context on which annotation to be drawn

Description:
Draw Image Stamp to a given context

@author   25/11/2013    Aditya Kamra
#@e
*/

AttachNote.prototype.draw = function (ctx, scale) {
//    var x = this.x;
//    var y = this.y;
//     if(!scale){
//        scale = this.viewer.ZoomFactor;
//     }
//    if (this.image != null) {
//        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, x, y, this.w * scale, this.h * scale);
//        document.getElementById("annotCanvas").style.cursor = "default";        
//    }
}

/*
#@c
Class    : ImageStamp
Access   : Private
Function : contains
Arguments:
1)mx: current x-coordinate of mouse
2)my: current y-coordinate of mouse

Description:
This function determines if a point is inside the shape's bounds

@author   25/11/2013    Aditya Kamra
#@e
*/

AttachNote.prototype.contains = function (mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Height) and its Y and (Y + Height)
    // this.w = this.imgStampWidth;
    //  this.h = this.imgStampHeight;
    return (this.x <= mx) && (this.x + this.w* this.viewer.ZoomFactor >= mx) &&
          (this.y <= my) && (this.y + this.h* this.viewer.ZoomFactor >= my);
};

/*
 #@c
 Class    : AttachNote
 Access   : Private
 Function : contains
 Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

 Description:
 This function determines if current point lies on the  bottom right of selection box of annotation.
 If so, annotation is eligible for resizing.

 @author  06/08/2014    Swati
 #@e
 */
AttachNote.prototype.isResize = function (mx, my) {
    return false;
}
/*
#@c
Class    : ImageStamp
Access   : Private
Function : drawDrag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged
3)ctx: context on which annotation to be drawn

Description:
This function is used to re draw the annotation while it is being drawn first time

@author   25/11/2013    Aditya Kamra
#@e
*/

AttachNote.prototype.drawDrag = function (X, Y, ctx) {
}


/*
#@c
Class    : ImageStamp
Access   : Private
Function : Drag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged

Description:
This function is used to re draw the annotation while it is being dragged after selection.

@author   25/11/2013    Aditya Kamra
#@e
*/

AttachNote.prototype.Drag = function (X, Y) {
    if (X + this.w < this.viewer.ImageCanvas.width && X > 0 )
    this.x = X;
    if (Y + this.h < this.viewer.ImageCanvas.height && Y > 0)
    this.y = Y;    
}

/*
#@c
Class    : ImageStamp
Access   : Private
Function : select
Arguments:
ctx: current context

Description:
This function is called when annotation is moved

@author   25/11/2013    Aditya Kamra
#@e
*/

AttachNote.prototype.select = function (ctx) {
    ctx.strokeStyle = 'black';
    ctx.strokeRect(this.x, this.y, this.w * this.viewer.ZoomFactor, this.h * this.viewer.ZoomFactor);
}

/*
#@c
Class    : ImageStamp
Access   : Private
Function : save
Arguments: None

Description:
This function is called to save Highlight Annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

AttachNote.prototype.save = function () {        
    var info = "";
    var x2 = this.w + this.x;       // get value of final x coordinate
    var y2 = this.y + this.h;      // get value of final y coordinate  
    var xResizeFactor = this.viewer.ImageInfo.ImageWidth / this.viewer.ImageCanvas.width;
    var yResizeFactor = this.viewer.ImageInfo.ImageHeight / this.viewer.ImageCanvas.height;

    info = info + "X1=" + parseInt(this.x * xResizeFactor) + "\n";
    info = info + "Y1=" + parseInt(this.y * yResizeFactor) + "\n";
    info = info + "X2=" + parseInt(x2 * xResizeFactor) + "\n";
    info = info + "Y2=" + parseInt(y2 * yResizeFactor) + "\n";
    info = info + "Color=" + "0" + "\n";
    info = info + "TimeOrder=" + this.timeorder + "\n";
    info = info + "MouseSensitivity=" + this.mousesensitivity + "\n";
    info = info + "AnnotationGroupID=" + this.groupid + "\n";
    info = info + "UserID=" + this.userid + "\n";
    info = info + "Rights=" + this.rights + "\n";
    for (var ilineCount = 0; ilineCount < this.lines.length; ilineCount++)
        info = info + "Line" + (ilineCount + 1) + "=" + this.lines[ilineCount] + "\n";
    info = info + "LinesOfText=" + this.lines.length + "\n";    
    return info;
}

/*
#@c
Class    : ImageStamp
Access   : Private
Function : Resize
Arguments: 
1)xPreviousZoomFactor: previous x-zoom factor
2)xCurrentZoomFactor:  current x-zoom factor
3)yPreviousZoomFactor: previous y-zoom factor
4)yCurrentZoomFactor:  current y-zoom factor

Description:
This function is called to resize annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

AttachNote.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
//    this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
//    this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
}

/*
#@c
Class    : ImageStamp
Access   : Private
Function : rotate
Arguments: 
1)angle: Angle by which stamp should be rotated
2)ctx:   current context

Description:
This function is called to rotate annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

AttachNote.prototype.rotate = function (angle, ctx) {
}

/*
#@c
Class    : ImageStamp
Access   : Private
Function : fillProperties
Arguments: 
imgStampSelectionList: list of all image stamps   

Description:
This function is called to fill properties of image stamp which needs to be drawn

@author   25/11/2013    Aditya Kamra
#@e
*/
AttachNote.prototype.GetContent = function (textAreaID) {
    var id = textAreaID;
    var val = id.value;
    var linearray = [];
    var lines = val.split(/\r\n|\r|\n/g);
    var iLength = val.length;
    var index = 0;
    var currentPos = 0;
    var ctxFont = this.viewer.AnnotationManager.ctx.font;
    var fontSize = id.style.fontSize;
    var font = id.style.fontFamily;
    this.viewer.AnnotationManager.ctx.font = fontSize + " " + font;
    var textAreawidth = parseInt(id.style.width);
    for (iLine = 0; iLine < lines.length; iLine++) {
        currentPos = 0;
        for (iCharPos = 1; iCharPos <= lines[iLine].length; iCharPos++) {
            var strWidth = parseInt(this.viewer.AnnotationManager.ctx.measureText(lines[iLine].substring(currentPos, iCharPos)).width);
            if (strWidth > textAreawidth) {
                linearray[index] = lines[iLine].substring(currentPos, iCharPos - 1);
                index++;
                currentPos = iCharPos - 1;
                iCharPos = iCharPos - 1;
            }
        }
        linearray[index] = lines[iLine].substring(currentPos, lines[iLine].length);
        index++;
    }
    this.viewer.AnnotationManager.ctx.font = ctxFont;
    return linearray;
}
AttachNote.prototype.SetDimension = function (width, height) {
    this.h = height;
    this.w = width;
}
AttachNote.prototype.ShowToolTipText = function () {
    var attachNoteTextArea = document.getElementById("textAreaID");
    var textDiv = document.getElementById("attachNoteTooltip");
    this.viewer.AnnotationManager.ctx.font = parseInt(attachNoteTextArea.style.fontSize) + "px" + " " + attachNoteTextArea.style.fontFamily;
	
	textDiv.style.position = "absolute";
    textDiv.style.left = (this.x + this.w * this.viewer.ZoomFactor) + "px";
    textDiv.style.top = (this.y + this.h * this.viewer.ZoomFactor) + "px";
    textDiv.style.background = "#f5f5dc";
    textDiv.style.fontSize = attachNoteTextArea.style.fontSize;
    textDiv.style.fontFamily = attachNoteTextArea.style.fontFamily;
    textDiv.style.zIndex = 3;   
	textDiv.style.visibility = "visible";
	
	//Nikhil Barar [Bug: 4081]	
	var finaltext = '';
	for (var i = 0; i < this.text.length; i++)
	{
		if (this.text.charAt(i) == ' ')
			finaltext += '&nbsp';
		else if (this.text.charAt(i) == '\n')
			finaltext += '<br/>';
		else
			finaltext += this.text.charAt(i);		
	}
	textDiv.innerHTML = finaltext;
	
	var height = $("#attachNoteTooltip").height();
	var width = $("#attachNoteTooltip").width();
	
	//Modified by: Amber Beriwal on 24/02/2015 [Bug: 53056-OF]
	if ((this.y + this.h * this.viewer.ZoomFactor + height > this.viewer.ImageCanvas.height) && (this.x + this.w * this.viewer.ZoomFactor + width > this.viewer.ImageCanvas.width)) {
		textDiv.style.left = (this.x - width) + "px";	
		textDiv.style.top = (this.y - height) + "px";		
	}
	else if (this.x + this.w * this.viewer.ZoomFactor + width > this.viewer.ImageCanvas.width) {
		textDiv.style.left = (this.x - width) + "px";		
	}
	else if (this.y + this.h * this.viewer.ZoomFactor + height > this.viewer.ImageCanvas.height) {
    	textDiv.style.top = (this.y - height) + "px";
	}	
}
AttachNote.prototype.ClearText = function () {
  //  document.getElementById("attachNoteTooltip").style.visibility = "hidden";
 //   document.getElementById("attachNoteTooltip").innerHTML = "";
}



////////////

  /*
   #@c
   Class    : HyperLink

   Description:
   Constructor of the hyperLink annotation.

   Arguments:
   1) mx     : starting x coordinate of annotation
   2) my     : starting y coordinate of annotation
   3) width  : Width of annotation
   4) height : Height of annotation
   5)fill    : Color of annotation

   @author   25/11/2013    Aditya Kamra
   #@e
   */
   function HyperLink(viewerManager, x, y, w, h, strokeColor, thickness, userRights, userName, groupID, fillcolor, timeorder) {
    // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
    // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
       // But we aren't checking anything else!
       this.viewer = viewerManager;
    this.type = "HLINK";
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.fill = strokeColor || '#AAAAAA';
    this.NoRedrawOnCreation = false;
    this.mousesensitivity = 1;
    this.groupid = groupID;
    this.userid = userName;
    this.rights = userRights;
    this.timeorder = timeorder;
    this.firstDraw = true;
    this.displayText  = "Test Text";
	this.fontName = this.viewer.AnnotationManager.fontname[this.type];
	this.linkId = "";
    this.fontSize = this.viewer.AnnotationManager.fontSize[this.type];
    this.bold = 0;
    this.italic = 0;
    this.underline = this.viewer.AnnotationManager.underline[this.type];
    this.strikeOut = this.viewer.AnnotationManager.StrikeOut[this.type];
    this.font_style = this.viewer.AnnotationManager.fontStyle[this.type];    
    this.properties = [false,false,true,false,false,true,true];	
}
/*
#@c
Class    : FreeText
Access   : Private
Function : Draw
Arguments:
ctx: context on which annotation to be drawn

Description:
Draw Free Text to a given context

@author   25/11/2013    Aditya Kamra
@modified 03/05/2019    Komal Walia for bug 5396
#@e
*/

HyperLink.prototype.draw = function (ctx, scale) {
    
    if(!scale){
      //Modified by Komal Walia on 02/05/2019 for bug 5396.
      scale = OPALL.VIEWER.AnnotationManager.scaleForDrawing;
    }
     var scaledFont = this.fontSize * scale;
     ctx.font = scaledFont + "px " + this.fontName;
 // //   ctx.font = this.fontSize + "px " + this.fontName ;
     if (this.bold == 1)
            ctx.font = "bold " + ctx.font;
     if (this.italic == 1)
            ctx.font = "italic " + ctx.font;
	 this.w = ctx.measureText(this.displayText).width;
	 this.h = scaledFont;
     ctx.textAlign = "left";    
    ctx.fillStyle = this.fill;
     ctx.fillText(this.displayText,this.x,this.y);
	 if (this.underline == true) {
         this.textUnderline(ctx, this.displayText, this.x, this.y, ctx.fillStyle, scaledFont, ctx.textAlign);
		 }
	 if (this.strikeOut == 1) {
             this.textStrikeOut(ctx, this.displayText, this.x, this.y, ctx.fillStyle, scaledFont, ctx.textAlign);	
			 }
    
};
//Nikhil Barar [Bug: 4076]
HyperLink.prototype.ShowToolTipText = function () {
    var attachNoteTextArea = document.getElementById("textAreaID");
    var textDiv = document.getElementById("attachNoteTooltip");
    this.viewer.AnnotationManager.ctx.font = parseInt(attachNoteTextArea.style.fontSize) + "px" + " " + attachNoteTextArea.style.fontFamily;
	
	var HyperlinkPrefix = OPALL_MESSAGE.HyperlinkPrefix;
	
	 if (this.viewer.AnnotationManager.ctx.measureText(this.linkId).width > this.viewer.AnnotationManager.ctx.measureText(HyperlinkPrefix).width)
		 width = this.viewer.AnnotationManager.ctx.measureText(this.linkId).width;
	 else
		 width = this.viewer.AnnotationManager.ctx.measureText(HyperlinkPrefix).width;
	
	 width += 5;
	
	var finalHyperlinkText = '';
	for (var i = 0; i < HyperlinkPrefix.length; i++)
	{
		if (HyperlinkPrefix.charAt(i) == ' ')
			finalHyperlinkText += '&nbsp';
		else
			finalHyperlinkText += HyperlinkPrefix.charAt(i);	
	}
	
	finalHyperlinkText += "<br/>" + this.linkId;
	
    //textDiv.style.width = width + "px";
    textDiv.style.position = "absolute";
    textDiv.style.left = (this.x + this.w * this.viewer.ZoomFactor) + "px";
    textDiv.style.top = (this.y - 10 + this.h * this.viewer.ZoomFactor) + "px";
    textDiv.style.background = "#f5f5dc";
    textDiv.style.fontSize = attachNoteTextArea.style.fontSize;
    textDiv.style.fontFamily = attachNoteTextArea.style.fontFamily;
    textDiv.style.zIndex = 3;
    textDiv.innerHTML = finalHyperlinkText;
    textDiv.style.visibility = "visible";
	
	var width = $("#attachNoteTooltip").width();
	var height = $("#attachNoteTooltip").height();
	
	var scrollLeft = parseInt($("#viewArea").scrollLeft());
	var scrolLTop = parseInt($("#viewArea").scrollTop());
	
	//Modified by: Amber Beriwal on 24/02/2015 [Bug: 53056-OF]
	if ((this.y + this.h * this.viewer.ZoomFactor + height > (this.viewer.viewerHeight>this.viewer.ImageCanvas.height?this.viewer.ImageCanvas.height:this.viewer.viewerHeight) + scrolLTop) && (this.x + this.w * this.viewer.ZoomFactor + width > (this.viewer.viewerWidth>this.viewer.ImageCanvas.width?this.viewer.ImageCanvas.width:this.viewer.viewerWidth) + scrollLeft)) {
		textDiv.style.left = (this.x - width) + "px";	
		textDiv.style.top = (this.y - 10 - height) + "px";		
		if ((this.x - width) < 0)
			textDiv.style.left = 0 + "px";
		if ((this.y - 10 - height) < 0)
			textDiv.style.top = 0 + "px";
	}
	else if (this.x + this.w * this.viewer.ZoomFactor + width > (this.viewer.viewerWidth>this.viewer.ImageCanvas.width?this.viewer.ImageCanvas.width:this.viewer.viewerWidth) + scrollLeft) {
		textDiv.style.left = (this.x - width) + "px";
		if ((this.x - width) < 0)
			textDiv.style.left = 0 + "px";
	}
	else if (this.y + this.h * this.viewer.ZoomFactor + height > (this.viewer.viewerHeight>this.viewer.ImageCanvas.height?this.viewer.ImageCanvas.height:this.viewer.viewerHeight) + scrolLTop) {
    	textDiv.style.top = (this.y - 10 - height) + "px";
		// if (((this.x - width) * this.viewer.ZoomFactor) < 0)
			// textDiv.style.left = 0 + "px";
		if ((this.y - 10 - height) < 0)
			textDiv.style.top = 0 + "px";
	}
}

HyperLink.prototype.ClearText = function () {
  //  document.getElementById("attachNoteTooltip").style.visibility = "hidden";
  //  document.getElementById("attachNoteTooltip").innerHTML = "";
};

/*
#@c
Class    : FreeText
Access   : Private
Function : contains
Arguments:
1)mx: current x-coordinate of mouse
2)my: current y-coordinate of mouse

Description:
This function determines if a point is inside the shape's bounds

@author   25/11/2013    Aditya Kamra
#@e
*/

HyperLink.prototype.contains = function (mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Height) and its Y and (Y + Height)
   return ((this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y >= my) && (this.y - this.h <= my))
		  
}

/*
 #@c
 Class    : FreeText
 Access   : Private
 Function : contains
 Arguments:
        1)mx: current x-coordinate of mouse
        2)my: current y-coordinate of mouse

 Description:
 This function determines if current point lies on the  bottom right of selection box of annotation.
 If so, annotation is eligible for resizing.

 @author  06/08/2014    Swati
 #@e
 */
HyperLink.prototype.isResize = function (mx, my) {
    return false;
}
/*
#@c
Class    : FreeText
Access   : Private
Function : drawDrag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged
3)ctx: context on which annotation to be drawn

Description:
This function is used to re draw the annotation while it is being drawn first time

@author   25/11/2013    Aditya Kamra
#@e
*/

HyperLink.prototype.drawDrag = function (X, Y, ctx) {
}


/*
#@c
Class    : FreeText
Access   : Private
Function : Drag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged

Description:
This function is used to re draw the annotation while it is being dragged after selection.

@author   25/11/2013    Aditya Kamra
#@e
*/

HyperLink.prototype.Drag = function (X, Y) {
    this.x = X;
    this.y = Y;
}

/*
#@c
Class    : FreeText
Access   : Private
Function : select
Arguments:
ctx: current context

Description:
This function is called when annotation is moved

@author   25/11/2013    Aditya Kamra
#@e
*/

HyperLink.prototype.select = function (ctx) {
    if(this.fill=="#000000")
		ctx.strokeStyle = 'Red';
	else
		ctx.strokeStyle = 'Black';	
    if (this.underline == 1)
        ctx.strokeRect(this.x-2, this.y -this.h , this.w+2 , this.h+5);
    else
        ctx.strokeRect(this.x-2, this.y - this.h , this.w+2 , this.h+5);
}

/*
#@c
Class    : FreeText
Access   : Private
Function : save
Arguments: None

Description:
This function is called to save Highlight Annotation.

@author   25/11/2013    Aditya Kamra


#@e
*/

HyperLink.prototype.save = function () {
    var xResizeFactor = this.viewer.ImageInfo.ImageWidth / this.viewer.ImageCanvas.width;
    var yResizeFactor = this.viewer.ImageInfo.ImageHeight / this.viewer.ImageCanvas.height;
    var info = "";
    var x2 = this.w + this.x;       // get value of final x coordinate
    var y2 = this.y + this.h;      // get value of final y coordinate  

    info = info + "X1=" + parseInt(this.x * xResizeFactor) + "\n";
    info = info + "Y1=" + parseInt(this.y * yResizeFactor) + "\n";
    info = info + "X2=" + parseInt(x2 * xResizeFactor) + "\n";
    info = info + "Y2=" + parseInt(y2 * yResizeFactor) + "\n";
    info = info + "Color=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fill) + "\n";
    info = info + "TimeOrder=" + this.timeorder + "\n";
    info = info + "MouseSensitivity=" + this.mousesensitivity + "\n";
    info = info + "AnnotationGroupID=" + this.groupid + "\n";
    info = info + "UserID=" + this.userid + "\n";
    info = info + "Rights=" + this.rights + "\n";
	info = info + "HyperlinkName=" + this.displayText + "\n";
    info = info + "HyperlinkURL=" + this.linkId + "\n";
    info = info + "Height=" +(- Math.ceil(this.fontSize)) + "\n";
    info = info + "Width=" + this.w + "\n";
    info = info + "Escapement=" + "0" + "\n";
    info = info + "Orientation=" + "0" + "\n";
    if (this.bold == 1)
        info = info + "Weight=" + "700" + "\n";
    else
        info = info + "Weight=" + "400" + "\n";
    if (this.italic == 1)
        info = info + "Italic=" + "255" + "\n";
    else
        info = info + "Italic=" + "0" + "\n";
    info = info + "Underlined=" + this.underline + "\n";
    info = info + "StrikeOut=" + this.strikeOut + "\n";
    info = info + "CharSet=" + "0" + "\n";
    info = info + "OutPrecision=" + "0" + "\n";
    info = info + "ClipPrecision=" + "0" + "\n";
    info = info + "Quality=" + "1" + "\n";
    if (((this.fontName).match(/TimesRoman/i) != null) || ((this.fontName).match(/Serif/i) != null))
        info = info + "PitchAndFamily=" + "18" + "\n";
    else if (((this.fontName).match(/Dialog/i) != null) || ((this.fontName).match(/SansSerif/i) != null) || ((this.fontName).match(/Helvetica/i) != null))
        info = info + "PitchAndFamily=" + "34" + "\n";
    else if ((this.fontName).match(/DialogInput/i) != null)
        info = info + "PitchAndFamily=" + "34" + "\n";
    else
        info = info + "PitchAndFamily=" + "49" + "\n";
    info = info + "FontName=" + this.fontName + "\n";
    info = info + "FontColor=" + this.viewer.AnnotationManager.ConvertToDecimal(this.fill) + "\n";

    return info;
}
/*
#@c
Class    : FreeText
Access   : Private
Function : fillProperties
Arguments: 
freetextAreaManager: object of FreeTextAreaHolder class

Description:
This function is called to fill properties of free text annotation which needs to be drawn

@author   25/11/2013    Aditya Kamra
#@e
*/

HyperLink.prototype.fillProperties = function () {
    if (this.viewer.AnnotationManager.hyperLinkDisplayText)
	   this.displayText = this.viewer.AnnotationManager.hyperLinkDisplayText;
	if (this.viewer.AnnotationManager.hyperLinkURL)   
	   this.linkId = this.viewer.AnnotationManager.hyperLinkURL;
}


/*
#@c
Class    : FreeText
Access   : Private
Function : Resize
Arguments: 
1)xPreviousZoomFactor: previous x-zoom factor
2)xCurrentZoomFactor:  current x-zoom factor
3)yPreviousZoomFactor: previous y-zoom factor
4)yCurrentZoomFactor:  current y-zoom factor

Description:
This function is called to resize annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

HyperLink.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
    this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
    this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
    // this.h = this.h * (yCurrentZoomFactor / yPreviousZoomFactor);
    // this.w = this.w * (xCurrentZoomFactor / xPreviousZoomFactor);
    // this.fontSize = this.fontSize * (xCurrentZoomFactor / xPreviousZoomFactor);
}

/*
#@c
Class    : FreeText
Access   : Private
Function : rotate
Arguments: 
1)angle: Angle by which text should be rotated
2)ctx:   current context

Description:
This function is called to rotate annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

HyperLink.prototype.rotate = function (angle, ctx) {
}

/*
#@c
Class    : FreeText
Access   : Private
Function : textUnderline
Arguments: 
1)context   : context on which line needs to be drawn
2)text      : text below which annotation needs to be drawn
3)x         : starting x coordinate of text
4)y         : starting y coordinate of text
5)color     : color of underline
6)textSize  : font size of text
7:align     : alignment of text
   
Description:
This function is called to draw underline in free text annotation

@author   25/11/2013    Aditya Kamra
#@e
*/

HyperLink.prototype.textUnderline = function (context, text, x, y, color, textSize, align) {

    var textWidth = context.measureText(text).width;
    //var to store the starting position of text (X-axis)
    var startX;
    //var to store the starting position of text (Y-axis)
    // I have tried to set the position of the underline according 
    // to size of text. You can change as per your need
    var startY = y + 2;
    //var to store the end position of text (X-axis)
    var endX;
    //var to store the end position of text (Y-axis)
    //It should be the same as start position vertically. 
    var endY = startY;
    //To set the size line which is to be drawn as underline.
    //Its set as per the size of the text. Feel free to change as per need.
    var underlineHeight = parseInt(textSize) / 15;
    //Because of the above calculation we might get the value less 
    //than 1 and then the underline will not be rendered. this is to make sure 
    //there is some value for line width.
    if (underlineHeight < 1) {
        underlineHeight = 1;
    }
    context.beginPath();
    if (align == "center") {
        startX = x - (textWidth / 2);
        endX = x + (textWidth / 2);
    } else if (align == "right") {
        startX = x - textWidth;
        endX = x;
    } else {
        startX = x;
        endX = x + textWidth;
    }
    context.strokeStyle = color;
    context.lineWidth = underlineHeight;
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
}
/*
#@c
Class    : FreeText
Access   : Private
Function : textStrikeOut
Arguments: 
1)context   : context on which line needs to be drawn
2)text      : text below which annotation needs to be drawn
3)x         : starting x coordinate of text
4)y         : starting y coordinate of text
5)color     : color of underline
6)textSize  : font size of text
7:align     : alignment of text
   
Description:
This function is called to draw strike out line in text stamp.

@author   25/11/2013    Aditya Kamra
#@e
*/

HyperLink.prototype.textStrikeOut = function (context, text, x, y, color, textSize, align) {
    var textWidth = context.measureText(text).width;
    //var to store the starting position of text (X-axis)
    var startX;
    var startY = y - (parseInt(textSize) / 3);
    //var to store the end position of text (X-axis)
    var endX;
    //var to store the end position of text (Y-axis)
    //It should be the same as start position vertically. 
    var endY = startY;
    //To set the size line which is to be drawn as underline.
    //Its set as per the size of the text. Feel free to change as per need.
    var underlineHeight = parseInt(textSize) / 15;
    //Because of the above calculation we might get the value less 
    //than 1 and then the underline will not be rendered. this is to make sure 
    //there is some value for line width.
    if (underlineHeight < 1) {
        underlineHeight = 1;
    }
    context.beginPath();
    if (align == "center") {
        startX = x - (textWidth / 2);
        endX = x + (textWidth / 2);
    } else if (align == "right") {
        startX = x - textWidth;
        endX = x;
    } else {
        startX = x;
        endX = x + textWidth;
    }
    context.strokeStyle = color;
    context.lineWidth = underlineHeight;
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
};


////////////////////////////////////////////////Partition////////////////////////////////////////////////////////////////////
/*
#@c
Class    : Partition

Description:
Constructor of the Partition annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/
function Partition(x,extractZone,viewer) {
  // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
    // But we aren't checking anything else!    
  this.type= "PART" ;
  this.x = x || 0;
  this.y = 0;
  this.viewer = viewer ;
  //this.fill = fill || '#000000';
  this.NoRedrawOnCreation = false;
  this.thickness = 2;
  this.thicknessLevel = 1;
  this.zone = extractZone;
  this.zone.partitions.push(this);
  this.properties = [true,true,true,true,true,true,true];
}
/*
#@c
Class    : Partition
Access   : Private
Function : Draw
Arguments:
ctx: context on which annotation to be drawn

Description:
Draw Extact Zone to a given context

@author   25/11/2013    Aditya Kamra
#@e
*/

Partition.prototype.draw = function(ctx) {
   ctx.fillStyle = this.zone.fill;
   ctx.fillRect(this.zone.x + this.x, this.zone.y, this.zone.thickness, this.zone.h);
}

/*
#@c
Class    : Partition
Access   : Private
Function : drawScaled
Arguments:
ctx: context on which annotation to be drawn
canvas : scaled cnavas
Description:
Draw Extact Zone to a given scaled context done for ZoomLens

@author   25/11/2013    Aditya Kamra
#@e
*/

Partition.prototype.drawScaled = function(ctx,canvas) {

   if (this.zoneType == 1)
      {
	    ctx.strokeStyle = this.fill;
        ctx.lineWidth = this.thickness;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
	  }
   else if (this.zoneType == 2)
      {
	    if (this.zoneBackground == 0)
		   {
	         ctx.globalAlpha = 0.5;
			 ctx.strokeStyle = this.fill;
             ctx.lineWidth = this.thickness;
             ctx.fillRect(this.x, this.y, this.w, this.h);
			 ctx.globalAlpha = 1;
			 }
		else if (this.zoneBackground == 1)
           {
             imageCtx = canvas.getContext("2d");  
		     imgData = imageCtx.getImageData(this.x, this.y, this.w, this.h);
             for (var i = 0; i < imgData.data.length; i += 4) {
                 imgData.data[i] = 255 - imgData.data[i];
                 imgData.data[i + 1] = 255 - imgData.data[i + 1];
                 imgData.data[i + 2] = 255 - imgData.data[i + 2];
                 imgData.data[i + 3] = 255;
                }
             ctx.putImageData(imgData, this.x, this.y);
           }
           }
   else if (this.zoneType == 3)
      {
	    ctx.strokeStyle = this.fill;
        ctx.lineWidth = this.thickness;
        ctx.fillRect(this.x, this.y, this.w, this.h);    
      }   
}
/*
#@c
Class    : Partition
Access   : Private
Function : contains
Arguments:
1)mx: current x-coordinate of mouse
2)my: current y-coordinate of mouse

Description:
This function determines if a point is inside the shape's bounds

@author   25/11/2013    Aditya Kamra
#@e
*/

Partition.prototype.contains = function(mx, my) {
  // All we have to do is make sure the Mouse X,Y fall in the area between
  // the shape's X and (X + Height) and its Y and (Y + Height)
  var startX = this.zone.x + this.x;
  return  ((startX <= mx) && (startX + this.zone.thickness >= mx) &&
          (this.zone.y <= my) && (this.zone.y + this.zone.h >= my) && (this.zone.isMutable == true));
}

/*
#@c
Class    : Partition
Access   : Private
Function : drawDrag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged
3)ctx: context on which annotation to be drawn

Description:
This function is used to re draw the annotation while it is being drawn first time

@author   25/11/2013    Aditya Kamra
#@e
*/
Partition.prototype.drawDrag = function (X, Y, ctx) {
    this.w = X - this.x;    
    this.h = Y - this.y;    
}

/*
#@c
Class    : Partition
Access   : Private
Function : Drag
Arguments:
1)X:   X position where mouse is being dragged
2)Y:   Y position where mouse is being dragged

Description:
This function is used to re draw the annotation while it is being dragged after selection.

@author   25/11/2013    Aditya Kamra
#@e
*/
Partition.prototype.Drag  = function(X,Y) {
var drag = X - this.zone.x;
var margin = 3 * this.viewer.ZoomFactor;
var newX = this.x + drag;
if (newX -margin < 0)
   newX = margin;
if (newX > this.zone.w -margin)
   newX = this.zone.w-margin;
this.x = newX;   
}

/*
#@c
Class    : Partition
Access   : Private
Function : select
Arguments:
ctx: current context

Description:
This function is called when annotation is moved

@author   25/11/2013    Aditya Kamra
#@e
*/
Partition.prototype.select = function (ctx) {
	if(this.zone.fill=="#000000")
			ctx.strokeStyle = 'Red';
		else
			ctx.strokeStyle = 'Black';	
	ctx.strokeRect((this.zone.x + this.x),(this.zone.y -2),2,2);
	ctx.strokeRect((this.zone.x + this.x),(this.zone.y + this.zone.h +2),2,2);
}

/*
#@c
Class    : Partition
Access   : Private
Function : save
Arguments: None

Description:
This function is called to save Highlight Annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

Partition.prototype.save = function () {
    var info = "";
    return info;
}

/*
#@c
Class    : ExtractZone
Access   : Private
Function : Resize
Arguments: 
1)xPreviousZoomFactor: previous x-zoom factor
2)xCurrentZoomFactor:  current x-zoom factor
3)yPreviousZoomFactor: previous y-zoom factor
4)yCurrentZoomFactor:  current y-zoom factor

Description:
This function is called to resize annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

Partition.prototype.Resize = function (xPreviousZoomFactor, xCurrentZoomFactor, yPreviousZoomFactor, yCurrentZoomFactor) {
    this.x = this.x * (xCurrentZoomFactor / xPreviousZoomFactor);
    //this.y = this.y * (yCurrentZoomFactor / yPreviousZoomFactor);
    //this.h = this.h * (yCurrentZoomFactor / yPreviousZoomFactor);
    //this.w = this.w * (xCurrentZoomFactor / xPreviousZoomFactor);
    //this.thickness = parseInt(this.thicknessLevel * xCurrentZoomFactor);
    //if (this.thickness == 0)
        //this.thickness = 1;
}
Partition.prototype.isResize = function (mx, my) {
  return false;
}
/*
#@c
Class    : Partition
Access   : Private
Function : rotate
Arguments: 
1)angle: Angle by which zone should be rotated
2)ctx:   current context

Description:
This function is called to rotate annotation.

@author   25/11/2013    Aditya Kamra
#@e
*/

Partition.prototype.rotate = function (angle, ctx) {
 
}

