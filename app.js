const app = document.getElementById("app");
var objects = [];
var logging = false;
var editing = true; // Hold down on object for 2 seconds, maybe with a load ring to enable edit
const r2D = 180 / Math.PI;
var clickDrag = false;
var clickHold = false;
var innerDim;

class Object {
    constructor(name) {
        this.name = name;
        this.location = { x: 10, y: 10 };
        this.rotation = 0;
    }
    updateLocation(x, y) {
        this.location = {
            x: x,
            y: y
        };
    }
    updateRotation(newRotation) {
        this.rotation = newRotation;
    }
}

function createNewObject() {
    var name = objects.length < 10 ? `object0${objects.length + 1}` : `object${objects.length + 1}`;
    var newObject = new Object(name);
    objects.push(newObject);
    console.log(objects);
    var rotateRing = document.createElement("div");
    var makeObject = document.createElement("div");
    rotateRing.id = `${name}RotateRing`;
    rotateRing.className = 'box';
    rotateRing.style = `top:${newObject.location.y}px; left:${newObject.location.x}px;`;
    app.appendChild(rotateRing);
    ////////////////////////////////////
    var box = document.querySelector('.box');
    var outerDim = getComputedStyle(box);
    outerDimWidth = outerDim.width.slice(0, outerDim.width.length - 2);
    outerDimHeight = outerDim.height.slice(0, outerDim.height.length - 2);
    innerDim = outerDimWidth / 3.75;
    ////////////////////////////////////
    var verticalTranslation = (outerDimHeight / 2) - (innerDim / 2);
    var horizontalTranslation = (outerDimWidth / 2) - (innerDim / 2);
    makeObject.style = `width: ${innerDim}px; height: ${innerDim}px; background-color: black; transform: translate(${horizontalTranslation}px,${verticalTranslation}px); cursor: move; display: inline-block`;
    document.querySelector('.box') ? makeObject.style = `width: ${innerDim}px; height: ${innerDim}px; background-color: black; transform: translate(${horizontalTranslation}px,${verticalTranslation}px); cursor: move; display: inline-block` : makeObject.style = `width: 20px; height: 20px; background-color: black; transform: translate(27.5px,27.5px); cursor: move; display: inline-block`;
    makeObject.id = `${name}`;
    rotateRing.appendChild(makeObject);
    

    addRotatingCursor(newObject, innerDim, outerDim);
    enableDragging(newObject);

};




// const objectRing = document.getElementById(`${name}RotateRing`);
const object = document.getElementById(name);

function addRotatingCursor(o, innerDim, outerDim) {
    const objectRing = document.getElementById(`${o.name}RotateRing`);
    const object = document.getElementById(o.name);
    outerDimWidth = outerDim.width.slice(0, outerDim.width.length - 2);
    outerDimHeight = outerDim.height.slice(0, outerDim.height.length - 2);
    objectRing.addEventListener("mouseover", (e) => {
        e.preventDefault();
        let center = {
            horizontal: e.target.offsetLeft + (outerDimWidth / 2),
            vertical: e.target.offsetTop + (outerDimHeight / 2)
        }
        let cursorLocation = {
            horizontal: e.clientX,
            vertical: e.clientY
        };
        let difference = {
            horizontal: cursorLocation.horizontal - center.horizontal,
            vertical: center.vertical - cursorLocation.vertical
        };
        var rad = Math.atan2(difference.vertical, difference.horizontal);
        const cD = 25; //standardized Cursor Distance from center
        var cX = (Math.cos(rad) * cD) + center.horizontal - (outerDimWidth * .4667 / 2);
        var cY = center.vertical - (Math.sin(rad) * cD) - (outerDimHeight * .4667 / 2);
        var rotation = rad * r2D;
        if (e.target.id != o.name + "RotateRing") {
            return;
        }
        if (!clickDrag) {
            if (!document.getElementById("rotateCursor")) {
                let cursor = document.createElement("div");
                cursor.id = "rotateCursor";
                // var newDim = (innerDim*1.5)/35;
                cursor.style = `top: ${cY}px; left: ${cX}px; transform: rotate(-${rotation}deg);`;
                // cursor.style.height = `${Math.floor(outerDimWidth*.4667)}px`;
                // cursor.style.width = `${Math.floor(outerDimWidth*.4667)}px`;
                e.target.appendChild(cursor);
            }
            const cursor = document.getElementById("rotateCursor");
            // if (!cursorSize) {
            //     var cursorSize = document.querySelector('#rotateCursor');
            //     cursorSize = getComputedStyle(cursorSize);
            //     cursorSize = cursorSize.width.slice(0, cursorSize.width.length - 2) / 2;
            // }
            if (rotation >= 0) {
                cursor.style = `top: ${cY}px; left: ${cX}px; transform: rotate(-${rotation}deg)`;
            }
            else {
                cursor.style = `top: ${cY}px; left: ${cX}px; transform: rotate(${rotation * -1}deg)`;
            }
            objectRing.addEventListener("mouseleave", removeRotateCursor);
            object.addEventListener("mouseover", removeRotateCursor);

            if (logging == true) {
                console.log(cursorLocation);
                console.log(rotation);
                console.log(event);
            }
            function removeRotateCursor() {
                cursor.remove();
            };
        }
        else {
            // objectRing.classList.add("drag");
        }
    });
};

function enableDragging(o) {
    const object = document.getElementById(o.name);
    const objectRing = document.getElementById(o.name + "RotateRing");
    var startX, startY, objectGrabbed, newLocation = {
        left: o.location.x,
        top: o.location.y
    };
    object.addEventListener("mousedown", function click(e) {
        e.preventDefault();
        console.log(e.target);
        objectGrabbed = !isNaN(e.target.id.slice(6, 8)) ? e.target.id.slice(6, 8) : null; 
        console.log(objectGrabbed);
        e.stopImmediatePropagation();
        if (e.which != 1) {
            releaseObject;
        }
        else {
            if (logging == true) {
                console.log(object);
                console.log(e);
            }
            objectRing.classList.add("drag");
            clickDrag = true;
            startX = e.clientX;
            startY = e.clientY;
        }
    });
    var releaseObject = document.addEventListener("mouseup", (e) => {
        if (objectGrabbed) {

            clickDrag = false;
            objectRing.classList.remove("drag");
            object.addEventListener("mouseup", null);
            object.addEventListener("mousemove", null);
            if (!isNaN(objectGrabbed)) {
                var outerDim = innerDim * 3.75
                // objects.forEach((o) => {
                //     if (objectGrabbed == o.name.slice(6, 8)) {
                //         return;
                //     }
                //     var oProx = {
                //         horizontal: o.location.x + (outerDim / 2),
                //         vertical: o.location.y + (outerDim / 2)
                //     }
                //     var oMoveProx = {
                //         horizontal: newLocation.left,
                //         vertical: newLocation.top
                //     };
                //     var difference = {
                //         horizontal: oMoveProx.horizontal - oProx.horizontal,
                //         vertical: oProx.vertical - oMoveProx.vertical
                //     };
                //     console.log(oMoveProx.vertical)
                //     console.log(oMoveProx.horizontal)
                //     console.log(oProx.vertical)
                //     console.log(oProx.horizontal)
                //     var b = oMoveProx.vertical - oProx.vertical;
                //     var a = oMoveProx.horizontal - oProx.horizontal;
                //     var c = Math.sqrt(a * a + b * b);
                //     console.log(c)
                //     var dist = Math.hypot(oMoveProx.horizontal - oProx.horizontal, oMoveProx.vertical - oProx.vertical);
                //     var cD = outerDim;
                //     console.log("o", o.name, "obGrab", objectGrabbed, "dist", dist);
                //     if (dist < cD && dist != cD) {
                //         console.log("o", o.name, "obGrab", objectGrabbed, "dist", dist);
                //         var rad = Math.atan2(difference.vertical, difference.horizontal);
                //         var cX = (Math.cos(rad) * cD) + oProx.horizontal - (outerDim * .4667 / 2);
                //         var cY = oProx.vertical - (Math.sin(rad) * cD) - (outerDim * .4667 / 2);
                //         console.log("X", cX, "Y", cY);
                //         // newLocation = {
                //         //     left : cX,
                //         //     top : cY
                //         // }
                //     }


                // });
                console.log(objects[objectGrabbed - 1]);
                objects[objectGrabbed - 1].updateLocation(newLocation.left, newLocation.top);
                objectGrabbed = null;
            }
        }
    });
    document.addEventListener("mousemove", (e) => {
        e.stopPropagation();
        var objectMoving = document.getElementById(`object${e.target.id.slice(6, 8)}RotateRing`);
        if (clickDrag && objectMoving) {
            var endX = startX - e.clientX;
            var endY = startY - e.clientY;
            startX = e.clientX;
            startY = e.clientY;
            newLocation = {
                left: (objectMoving.offsetLeft - endX),
                top: (objectMoving.offsetTop - endY)
            };
            objectMoving.style.left = newLocation.left + "px";
            objectMoving.style.top = newLocation.top + "px";
        }
    });
};




// objectRing.addEventListener("mouseover", (event) => {
//     event = event || window.event;
//     event.preventDefault();
//     let center = {
//         horizontal: event.target.offsetLeft + (outerDimWidth / 2),
//         vertical: event.target.offsetTop + (outerDimHeight / 2)
//     }
//     let cursorLocation = {
//         horizontal: event.clientX,
//         vertical: event.clientY
//     };
//     let difference = {
//         horizontal: cursorLocation.horizontal - center.horizontal,
//         vertical: center.vertical - cursorLocation.vertical
//     };
//     var rad = Math.atan2(difference.vertical, difference.horizontal);
//     const cD = 25; //standardized Cursor Distance from center
//     var cX = (Math.cos(rad) * cD) + center.horizontal - 17.5;
//     var cY = center.vertical - (Math.sin(rad) * cD) - 17.5;
//     var rotation = rad * r2D;
//     if (event.target.id != name + "RotateRing") {
//         return;
//     }
//     if (!document.getElementById("rotateCursor")) {
//         let cursor = document.createElement("div");
//         cursor.id = "rotateCursor";
//         // cursor.style = `top: ${cursorLocation.vertical-cursorSize}px; left: ${cursorLocation.horizontal-cursorSize}px; transform: rotate(-${rotation}deg)`;
//         cursor.style = `top: ${cY}px; left: ${cX}px; transform: rotate(-${rotation}deg)`;
//         event.target.appendChild(cursor);
//     }
//     const cursor = document.getElementById("rotateCursor");
//     if (!cursorSize) {
//         var cursorSize = document.querySelector('#rotateCursor');
//         cursorSize = getComputedStyle(cursorSize);
//         cursorSize = cursorSize.width.slice(0, cursorSize.width.length - 2) / 2;
//     }
//     if (rotation >= 0) {
//         // cursor.style = `top: ${cursorLocation.vertical-cursorSize}px; left: ${cursorLocation.horizontal-cursorSize}px; transform: rotate(-${rotation}deg)`;
//         cursor.style = `top: ${cY}px; left: ${cX}px; transform: rotate(-${rotation}deg)`;
//     }
//     else {
//         // cursor.style = `top: ${cursorLocation.vertical-cursorSize}px; left: ${cursorLocation.horizontal-cursorSize}px; transform: rotate(${rotation*-1}deg)`;
//         cursor.style = `top: ${cY}px; left: ${cX}px; transform: rotate(${rotation * -1}deg)`;
//     }

//     var clickDrag = false;
//     let newRotation = 0;

//     objectRing.addEventListener("mousedown", (event) => {
//         console.log("MouseDown");
//         event.preventDefault();
//         startRotation(event, clickDrag);
//     });
//     objectRing.addEventListener("mousemove", (event) => {
//         if (clickHold == true) {
//             event.preventDefault();
//             rotateObject(event, startAngle, objectAngle);
//         }
//     });
//     objectRing.addEventListener("mouseup", (event) => {
//         event.preventDefault();
//         stopRotation();
//     });
//     objectRing.addEventListener("mouseleave", removeRotateCursor);
//     object.addEventListener("mouseover", removeRotateCursor);


//     if (logging == true) {
//         console.log(cursorLocation);
//         console.log(rotation);
//         console.log(event);
//     }
//     function removeRotateCursor() {
//         cursor.remove();
//     };

//     function startRotation() {
//         event = event || window.event;
//         event.preventDefault();
//         let objectAngle = newObject.rotation;
//         let startAngle = rotation;
//         console.log("SA", startAngle);
//         return clickHold = true;
//     };

//     function rotateObject(event, startAngle, objectAngle) {
//         event = event || window.event;
//         event.preventDefault();
//         var newCursorLocation = {
//             x: event.clientX - center.horizontal,
//             y: event.clientY - center.vertical
//         }
//         newRad = Math.atan2(newCursorLocation.y, newCursorLocation.x);
//         newRotation = ((newRad * r2D) - startAngle) + objectAngle;
//         console.log("NewRotRO", newRotation);
//         object.style.transform = `transform: translate(${horizontalTranslation}px,${verticalTranslation}px) rotate(${newRotation}deg)`;
//     };

//     function stopRotation(event, newRotation) {
//         event = event || window.event;
//         event.preventDefault();
//         console.log("MouseUp");
//         console.log("NR", newRotation);
//         newObject.updateRotation(newRotation);
//         return clickHold = false;
//     }
// });


// objectRing.addEventListener("mousedown", (event) => {
//     event = event || window.event;
//     event.preventDefault();
//     // console.log("Current Target",event.currentTarget); Parent
//     // console.log("Target",event.target); Actual
//     if (event.target.id != name + "RotateRing") {
//         return;
//     }
//     var oIM = document.getElementById(event.target.id);
//     if (logging == true) {
//         console.log(oIM);
//         console.log(event);
//     }
// })
// objectRing.addEventListener("mousedown", (event) => {
//     event = event || window.event;
//     event.preventDefault();
//     // console.log("Current Target",event.currentTarget); Parent
//     // console.log("Target",event.target); Actual
//     if (event.target.id != name + "RotateRing") {
//         return;
//     }
//     var oIM = document.getElementById(event.target.id);
//     if (logging == true) {
//         console.log(oIM);
//         console.log(event);
//     }
// })


// object.addEventListener("mousedown", (event) => {
//     event = event || window.event;
//     event.preventDefault();
//     if (event.which != 1) {
//         releaseObject();
//     }
//     else {
//         var oIM = document.getElementById(event.target.id);
//         if (logging == true) {
//             console.log(oIM);
//             console.log(event);
//         }
//         var cursorX = event.clientX;
//         var cursorY = event.clientY;
//         document.onmouseup = releaseObject;
//         document.onmousemove = moveObject;
//     }

//     function moveObject(event) {
//         event = event || window.event;
//         event.preventDefault();
//         var objectX = cursorX - event.clientX;
//         var objectY = cursorY - event.clientY;
//         cursorX = event.clientX;
//         cursorY = event.clientY;
//         oIM.style.left = (oIM.offsetLeft - objectX) + "px";
//         oIM.style.top = (oIM.offsetTop - objectY) + "px";
//     };

//     function releaseObject() {
//         document.onmouseup = null;
//         document.onmousemove = null;
//     }
// });

function toggleLogging() {
    logging == false ? logging = true : logging = false;
}
function toggleMassEdit() {
    editing == false ? editing = true : editing = false;
    objects.forEach((o) => {
        var co = document.getElementById(o.name);
        var coR = document.getElementById(o.name + "RotateRing");
        var box = "box";
        console.log(co);
        coR.classList.contains(box) ? console.log("yep") : console.log("nope");
        co.style.top = "94.09375px";
        co.style.left = "93.296875px";
        co.style.transform = "translate(0px, 0px)";
        co.style.top = "15%";
        co.style.left = "10%";
        co.style.transform = "translate(27.5px, 27.5px)";
        coR.classList.toggle("box");
    });
}