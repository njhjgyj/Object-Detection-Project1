const video = document.getElementById('video-tag1');
const getDiv1 = document.getElementById('div1');
const getDiv2 = document.getElementById('div2');
const getBtn1 = document.getElementById('button-id1');
var getBtn2 = document.getElementById('stopVideo-btn');

// Check if Webcam access is supported
function getUserMediaSupported() {

    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

};

// If webcam supported add event listener to button for when user wants to activate it to call enableCam function which we will define in the next step
if (getUserMediaSupported()) {

    getBtn1.addEventListener('click', enableCam);

} else {

    console.warn('getUserMedia() is not supported by your browser');

};

// Enable the live webcam view and start classification

function enableCam(event) {

    // Only continue if the COCO-SSD has finished loading
    if (!model) {

        return;

    }

    // Hide the button once clicked
    event.target.style.display = 'none';

    // getUserMedia parameters to force video but not audio
    const constraints = {

        video: true

    };

    // Activate the webcam stream
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {

        video.srcObject = stream;
        video.addEventListener('loadeddata', predictWebcam);

    });

    getBtn2.style.display = 'block';

};

function stopVideo() {

    video.pause();
    getBtn2.style.display = 'none';
    getBtn1.style.display = 'block';


}

var model = undefined;

cocoSsd.load().then((loadedModel) => {

    model = loadedModel;

});

var children = [];

function predictWebcam() {

    // Now let's start classifying a frame in the stream.
    model.detect(video).then((predictions) => {

        // Remove any highlighting we did previous frame.
        for (let i = 0; i < children.length; i++) {

            getDiv1.removeChild(children[i]);

        };
        children.splice(0);

        // Now lets loop through predictions and draw them to the live view if
        // they have a high confidence score.
        for (let n = 0; n < predictions.length; n++) {

            // If we are over 66% sure we are sure we classified it right, draw it!
            if (predictions[n].score > 0.66) {    // score is come from coco-ssd model

                const p = document.createElement('p');
                p.innerText = predictions[n].class + ' - with ' + Math.round(parseFloat(predictions[n].score) * 100) + '% confidence.';
                p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: ' + (predictions[n].bbox[1] - 10) + 'px; width: ' + (predictions[n].bbox[2] - 10) + 'px; top: 10; left: 0;';

                const highlighter = document.createElement('div');
                highlighter.setAttribute('class', 'highlighter');
                highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: ' + predictions[n].bbox[1] + 'px; width: ' + predictions[n].bbox[2] + 'px; height: ' + predictions[n].bbox[3] + 'px;';

                getDiv1.appendChild(highlighter);
                getDiv1.appendChild(p);
                children.push(highlighter);
                children.push(p);

            }

        }

        // Call this function again to keep predicting when the browser is ready.
        window.requestAnimationFrame(predictWebcam);

    });

};

            alert("If you don't see the enable webcam button then enable the desktop site")
