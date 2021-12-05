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

// APIs
var bbapikey = `6523526425538c3460446952970522302a2ee526b9721507202618039548400313786624`;
bbapikey = bbapikey.replace('6523526425', '');
bbapikey = bbapikey.replace('0313786624', '');
bbapikey = bbapikey.replace('4695297052', '');
bbapikey = bbapikey.replace('9721507202', '');
var imgurapikey = `652352642527d830313786624df4b4695297052e018089721507202`;
imgurapikey = imgurapikey.replace('6523526425', '');
imgurapikey = imgurapikey.replace('0313786624', '');
imgurapikey = imgurapikey.replace('4695297052', '');
imgurapikey = imgurapikey.replace('9721507202', '');

document.getElementById("saveValues").addEventListener("click", () => {
    // URL stuff
    backgroundUrl = backgroundImage.value.replace('http:', 'https:');
    if (backgroundUrl.includes('https://imgur.com/a/')) {
        getImgurData(backgroundUrl.replace('https://imgur.com/a/', ''));
    }
    else {
        createBillboardCanvas(1024, 512, textInput1.value, textInput2.value, textInput3.value, textSize.value, textColor.value, backgroundColor.value, backgroundUrl);
    }
});

function generateImage(dataUrl) {
    newDataUrl = dataUrl.replace(`data:image/png;base64,`, ``);
    apiUrl = 'https://api.imgbb.com/1/upload?key=' + bbapikey;
    postData(apiUrl, newDataUrl);
    imagePreview.src = dataUrl;
    imagePreview.style = "display:block";
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result.replace(`-`, `9`);
}

// Example POST method implementation:
async function postData(url = '', data) {
    inputDataUrl.value = 'Generating..';
    var filename = 'gatobb-' + makeid(5);
    var form = new FormData();
    form.append("image", data);
    form.append("name", filename);
    form.append("expiration", 2592000);
    var settings = {
        "url": url,
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    console.log(form);

    $.ajax(settings).done(function (response) {
        var jx = JSON.parse(response);
        inputDataUrl.value = jx.data.url;
    });
}

async function getImgurData(url = '') {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://api.imgur.com/3/album/${url}/images`,
        "method": "GET",
        "headers": {
            "authorization": `Client-ID ${imgurapikey}`
        }
    };
    $.ajax(settings).done(function (response) {
        console.log(response.data[0].link);
        createBillboardCanvas(1024, 512, textInput1.value, textInput2.value, textInput3.value, textSize.value, textColor.value, backgroundColor.value, response.data[0].link);
    });
}

/**
 * Creates the Canvas for the billboard
 * 
 * @param {number} width
 * @param {number} height
 * @param {string} text
 * @returns {HTMLCanvasElement}
 */
function createBillboardCanvas(width, height, text1, text2, text3, textSize, textColor, backgroundColor, backgroundImage = '') {
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
            context.drawImage(img, 0, 0, element.width, element.height);

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
            generateImage(element.toDataURL("image/png", 0.1));
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
        if (backgroundImage == '') {
            generateImage(element.toDataURL("image/png", 0.1)); 
        }
    }); 
}