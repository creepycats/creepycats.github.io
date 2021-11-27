const backgroundColor = document.getElementById('backgroundColor');
const backgroundImage = document.getElementById('backgroundImage');
const textInput1 = document.getElementById('textInput1');
const textInput2 = document.getElementById('textInput2');
const textInput3 = document.getElementById('textInput3');
const textColor = document.getElementById('textColor');
const textSize = document.getElementById('textSize');
const inputDataUrl = document.getElementById('inputDataUrl');
const imagePreview = document.getElementById('imagePreview');
var canvasElement;

document.getElementById("saveValues").addEventListener("click", () => {
    createBillboardCanvas(1024, 512, textInput1.value, textInput2.value, textInput3.value, textSize.value, textColor.value, backgroundColor.value, backgroundImage.value);
});

function generateImage(dataUrl) {
    inputDataUrl.value = dataUrl;
    imagePreview.src = dataUrl;
    imagePreview.style = "display:block";
}

/**
 * Creates the Canvas for the billboard
 * 
 * @param {number} width
 * @param {number} height
 * @param {string} text
 * @returns {HTMLCanvasElement}
 */
function createBillboardCanvas(width, height, text1, text2, text3, textSize, textColor, backgroundColor, backgroundImage) {
    // Remove old renders
    if (document.contains(document.getElementById("prerender"))) {
        document.getElementById("prerender").remove();
    }

    var myFont = new FontFace('FFForward', 'url(./fonts/font2.ttf)');

    myFont.load().then(function (font) {

        // with canvas, if this is ommited won't work
        document.fonts.add(font);
        console.log('Font loaded');
        // Create Canvas, get context
        const element = document.createElement("canvas");
        const context = element.getContext("2d");

        // Set Canvas Width, Height
        element.width = width;
        element.height = height;

        // Set Canvas ID
        element.id = "prerender";
        element.style.display = "none";

        // Fill with BG Color
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, element.width, element.height);

        // Add Image
        var img = new Image();
        img.onload = function () {
            context.drawImage(img, 0, 0);

            // Add Text Over Background
            context.font = `${textSize}px FFForward`;
            context.fillStyle = textColor;
            context.textAlign = "center";
            context.textBaseline = "middle";
            var offsetTextSize = textSize - ((textSize / 2) * -1);
            var middleWidth = element.width / 2;
            var middleHeight = element.height / 2;
            var topHeight = middleHeight - offsetTextSize;
            var bottomHeight = middleHeight - (offsetTextSize * -1);
            context.fillText(`${text1}`, middleWidth, topHeight);
            context.fillText(`${text2}`, middleWidth, middleHeight);
            context.fillText(`${text3}`, middleWidth, bottomHeight);
            generateImage(element.toDataURL("image/png", 0.1))
        };
        img.setAttribute('crossorigin', 'Anonymous');
        img.src = backgroundImage;

        context.font = `${textSize}px FFForward`;
        context.fillStyle = textColor;
        context.textAlign = "center";
        context.textBaseline = "middle";
        var offsetTextSize = textSize - ((textSize / 2) * -1);
        var middleWidth = element.width / 2;
        var middleHeight = element.height / 2;
        var topHeight = middleHeight - offsetTextSize;
        var bottomHeight = middleHeight - (offsetTextSize * -1);
        context.fillText(`${text1}`, middleWidth, topHeight);
        context.fillText(`${text2}`, middleWidth, middleHeight);
        context.fillText(`${text3}`, middleWidth, bottomHeight);
        document.body.append(element);
        generateImage(element.toDataURL("image/png", 0.1)); 
    }); 
}