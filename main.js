// $(function () {
//     const video = $("video")[0];
//     let stream; // Variable to hold the stream object
//     let model;
//     const canvas = $("<canvas/>")[0]; // Create canvas element
//     const ctx = canvas.getContext("2d"); // Get 2D context
//     const font = "16px sans-serif";
//     let isCapturing = false; // Variable to track capture state

//     const startVideoStreamPromise = navigator.mediaDevices
//         .getUserMedia({
//             audio: false,
//             video: {
//                 facingMode: "environment"
//             }
//         })
//         .then(function (s) {
//             stream = s; // Store the stream object
//             video.srcObject = stream;
//             return new Promise(function (resolve) {
//                 video.onloadedmetadata = function () {
//                     video.play();
//                     resolve();
//                 };
//             });
//         })
//         .catch(function (err) {
//             console.error("Error accessing the camera:", err);
//         });

//     const loadModelPromise = new Promise(function (resolve, reject) {
//         const publishable_key = "rf_F5yTWUSIA9ZvmMMZbXJ9j9VRkAx2";
//         const toLoad = {
//             model: "activemobilitydevices",
//             version: 1
//         };

//         roboflow
//             .auth({
//                 publishable_key: publishable_key
//             })
//             .load(toLoad)
//             .then(function (m) {
//                 model = m;
//                 resolve();
//             })
//             .catch(function (err) {
//                 console.error("Error loading model:", err);
//                 reject(err);
//             });
//     });

//     Promise.all([startVideoStreamPromise, loadModelPromise]).then(function () {
//         $("body").removeClass("loading");
//         resizeCanvas();
//     });

//     $(window).resize(function () {
//         resizeCanvas();
//     });

//     const resizeCanvas = function () {
//         const dimensions = videoDimensions(video);

//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;

//         $(canvas).css({
//             width: dimensions.width,
//             height: dimensions.height,
//             left: ($(window).width() - dimensions.width) / 2,
//             top: ($(window).height() - dimensions.height) / 2
//         });

//         $("body").append(canvas);
//     };

//     const videoDimensions = function (video) {
//         const videoRatio = video.videoWidth / video.videoHeight;
//         let width = video.offsetWidth,
//             height = video.offsetHeight;
//         const elementRatio = width / height;

//         if (elementRatio > videoRatio) {
//             width = height * videoRatio;
//         } else {
//             height = width / videoRatio;
//         }

//         return {
//             width: width,
//             height: height
//         };
//     };

//     const updateDashboard = function (predictionsData) {
//         if (predictionsData.length === 0) {
//             console.log("No predictions found.");
//             $("#dashboard").html("");
//             return;
//         }

//         $("#dashboard").empty();

//         let bicycleImageCreated = false;
//         let handlebarsImageCreated = false;

//         const videoRect = video.getBoundingClientRect();

//         predictionsData.forEach(function (prediction, index) {
//             const classLabel = prediction.class;
//             const confidence = prediction.confidence ? prediction.confidence.toFixed(2) : "N/A";

//             const elementId = `prediction_${index}`;
//             let element;

//             if (prediction.class === "Bicycle" && !bicycleImageCreated) {
//                 bicycleImageCreated = true;

//                 element = $("<img>").attr({
//                     id: elementId,
//                     src: "https://W0ShiiSky.github.io/BicycleStaticSpecification/image/BicycleSpecification3.jpg",
//                     alt: "Bicycle Image"
//                 });

//                 element.css({
//                     position: "absolute",
//                     top: videoRect.top + (prediction.bbox.y - prediction.bbox.height / 2) + "px",
//                     left: videoRect.left + (prediction.bbox.x - prediction.bbox.width / 2) + "px",
//                     zIndex: 100,
//                     width: "150px",
//                     height: "auto"
//                 });

//             } else if (prediction.class === "Handlebars" && !handlebarsImageCreated) {
//                 handlebarsImageCreated = true;

//                 element = $("<img>").attr({
//                     id: elementId,
//                     src: "https://W0ShiiSky.github.io/BicycleStaticSpecification/image/BicycleSpecification.jpg",
//                     alt: "Handlebars Image"
//                 });

//                 element.css({
//                     position: "absolute",
//                     top: videoRect.top + (prediction.bbox.y - prediction.bbox.height / 2) + "px",
//                     left: videoRect.left + (prediction.bbox.x - prediction.bbox.width / 2) + "px",
//                     zIndex: 100,
//                     width: "150px",
//                     height: "auto"
//                 });
//             }

//             if (element) {
//                 $("#dashboard").append(element);
//             }
//         });

//         console.log("Dashboard updated with predictions:", predictionsData);
//     };

//     const renderPredictions = function (predictions) {
//         const dimensions = videoDimensions(video);
//         console.log("Received predictions:", predictions);

//         const scale = 1;

//         ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

//         predictions.forEach(function (prediction) {
//             const x = prediction.bbox.x;
//             const y = prediction.bbox.y;

//             const width = prediction.bbox.width;
//             const height = prediction.bbox.height;

//             ctx.strokeStyle = prediction.color;
//             ctx.lineWidth = 4;
//             ctx.strokeRect(
//                 (x - width / 2) / scale,
//                 (y - height / 2) / scale,
//                 width / scale,
//                 height / scale
//             );

//             ctx.fillStyle = prediction.color;
//             const textWidth = ctx.measureText(prediction.class).width;
//             const textHeight = parseInt(font, 10);
//             ctx.fillRect(
//                 (x - width / 2) / scale,
//                 (y - height / 2) / scale,
//                 textWidth + 8,
//                 textHeight + 4
//             );
//         });

//         predictions.forEach(function (prediction) {
//             const x = prediction.bbox.x;
//             const y = prediction.bbox.y;

//             const width = prediction.bbox.width;
//             const height = prediction.bbox.height;

//             ctx.font = font;
//             ctx.textBaseline = "top";
//             ctx.fillStyle = "#000000";
//             ctx.fillText(
//                 prediction.class,
//                 (x - width / 2) / scale + 4,
//                 (y - height / 2) / scale + 1
//             );
//         });
//         updateDashboard(predictions);
//     };

//     // Function to capture the photo
//     const capturePhoto = function () {
//         const dimensions = videoDimensions(video);

//         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//         model
//             .detect(canvas)
//             .then(function (predictions) {
//                 renderPredictions(predictions);
//             })
//             .catch(function (e) {
//                 console.log("Error detecting objects:", e);
//             });
//     };

//     // Function to toggle capture state
//     const toggleCapture = function () {
//         if (!isCapturing) {
//             capturePhoto(); // Capture the photo and draw detections
//             $("#captureButton").text("Uncapture");
//         } else {
//             // Clear canvas and update dashboard to remove elements
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             $("#dashboard").empty(); // Remove any displayed elements in dashboard
//             $("#captureButton").text("Capture Photo");
//         }
//         isCapturing = !isCapturing; // Toggle capture state
//     };

//     // Event listener for capture button
//     $("#captureButton").click(function () {
//         toggleCapture();
//         // Optionally, you can add logic here to handle what happens after capturing or uncapturing the photo
//     });
// });


// $(function () {
//     const video = $("video")[0];
//     let stream; // Variable to hold the stream object
//     let model;
//     const canvas = $("<canvas/>")[0]; // Create canvas element
//     const ctx = canvas.getContext("2d"); // Get 2D context
//     const font = "16px sans-serif";
//     let isCapturing = false; // Variable to track capture state

//     const startVideoStreamPromise = navigator.mediaDevices
//         .getUserMedia({
//             audio: false,
//             video: {
//                 facingMode: "environment"
//             }
//         })
//         .then(function (s) {
//             stream = s; // Store the stream object
//             video.srcObject = stream;
//             return new Promise(function (resolve) {
//                 video.onloadedmetadata = function () {
//                     video.play();
//                     resolve();
//                 };
//             });
//         })
//         .catch(function (err) {
//             console.error("Error accessing the camera:", err);
//         });

//     const loadModelPromise = cocoSsd.load(); // Load COCO-SSD model

//     Promise.all([startVideoStreamPromise, loadModelPromise]).then(function () {
//         $("body").removeClass("loading");
//         resizeCanvas();
//     });

//     $(window).resize(function () {
//         resizeCanvas();
//     });

//     const resizeCanvas = function () {
//         const dimensions = videoDimensions(video);

//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;

//         $(canvas).css({
//             width: dimensions.width,
//             height: dimensions.height,
//             left: ($(window).width() - dimensions.width) / 2,
//             top: ($(window).height() - dimensions.height) / 2
//         });

//         $("body").append(canvas);
//     };

//     const videoDimensions = function (video) {
//         const videoRatio = video.videoWidth / video.videoHeight;
//         let width = video.offsetWidth,
//             height = video.offsetHeight;
//         const elementRatio = width / height;

//         if (elementRatio > videoRatio) {
//             width = height * videoRatio;
//         } else {
//             height = width / videoRatio;
//         }

//         return {
//             width: width,
//             height: height
//         };
//     };

//     const updateDashboard = function (predictionsData) {
//         if (predictionsData.length === 0) {
//             console.log("No predictions found.");
//             $("#dashboard").html("");
//             return;
//         }

//         $("#dashboard").empty();

//         let bicycleImageCreated = false;
//         let handlebarsImageCreated = false;

//         const videoRect = video.getBoundingClientRect();

//         predictionsData.forEach(function (prediction, index) {
//             const classLabel = prediction.class;
//             const confidence = prediction.confidence ? prediction.confidence.toFixed(2) : "N/A";

//             const elementId = `prediction_${index}`;
//             let element;

//             if (prediction.class === "bicycle" && !bicycleImageCreated) {
//                 bicycleImageCreated = true;

//                 element = $("<img>").attr({
//                     id: elementId,
//                     src: "https://W0ShiiSky.github.io/BicycleStaticSpecification/image/BicycleSpecification3.jpg", // Local path to the bicycle image
//                     alt: "Bicycle Image"
//                 });

//                 element.css({
//                     position: "absolute",
//                     top: videoRect.top + (prediction.bbox.y - prediction.bbox.height / 2) + "px",
//                     left: videoRect.left + (prediction.bbox.x - prediction.bbox.width / 2) + "px",
//                     zIndex: 100,
//                     width: "150px",
//                     height: "auto"
//                 });

//             } else if (prediction.class === "handlebars" && !handlebarsImageCreated) {
//                 handlebarsImageCreated = true;

//                 element = $("<img>").attr({
//                     id: elementId,
//                     src: "https://W0ShiiSky.github.io/BicycleStaticSpecification/image/BicycleSpecification.jpg", // Local path to the handlebars image
//                     alt: "Handlebars Image"
//                 });

//                 element.css({
//                     position: "absolute",
//                     top: videoRect.top + (prediction.bbox.y - prediction.bbox.height / 2) + "px",
//                     left: videoRect.left + (prediction.bbox.x - prediction.bbox.width / 2) + "px",
//                     zIndex: 100,
//                     width: "150px",
//                     height: "auto"
//                 });
//             }

//             if (element) {
//                 $("#dashboard").append(element);
//             }
//         });

//         console.log("Dashboard updated with predictions:", predictionsData);
//     };

//     const renderPredictions = function (predictions) {
//         const dimensions = videoDimensions(video);
//         console.log("Received predictions:", predictions);

//         const scale = 1;

//         ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

//         predictions.forEach(function (prediction) {
//             const x = prediction.bbox.x;
//             const y = prediction.bbox.y;

//             const width = prediction.bbox.width;
//             const height = prediction.bbox.height;

//             ctx.strokeStyle = prediction.color;
//             ctx.lineWidth = 4;
//             ctx.strokeRect(
//                 (x - width / 2) / scale,
//                 (y - height / 2) / scale,
//                 width / scale,
//                 height / scale
//             );

//             ctx.fillStyle = prediction.color;
//             const textWidth = ctx.measureText(prediction.class).width;
//             const textHeight = parseInt(font, 10);
//             ctx.fillRect(
//                 (x - width / 2) / scale,
//                 (y - height / 2) / scale,
//                 textWidth + 8,
//                 textHeight + 4
//             );
//         });

//         predictions.forEach(function (prediction) {
//             const x = prediction.bbox.x;
//             const y = prediction.bbox.y;

//             const width = prediction.bbox.width;
//             const height = prediction.bbox.height;

//             ctx.font = font;
//             ctx.textBaseline = "top";
//             ctx.fillStyle = "#000000";
//             ctx.fillText(
//                 prediction.class,
//                 (x - width / 2) / scale + 4,
//                 (y - height / 2) / scale + 1
//             );
//         });
//         updateDashboard(predictions);
//     };

//     // Function to capture the photo
//     const capturePhoto = function () {
//         const dimensions = videoDimensions(video);

//         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//         loadModelPromise.then(function () {
//             cocoSsd.detect(canvas)
//                 .then(function (predictions) {
//                     renderPredictions(predictions);
//                 })
//                 .catch(function (e) {
//                     console.log("Error detecting objects:", e);
//                 });
//         }).catch(function (error) {
//             console.error('Error loading COCO-SSD model:', error);
//         });
//     };

//     // Function to toggle capture state
//     const toggleCapture = function () {
//         if (!isCapturing) {
//             capturePhoto(); // Capture the photo and draw detections
//             $("#captureButton").text("Uncapture");
//         } else {
//             // Clear canvas and update dashboard to remove elements
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             $("#dashboard").empty(); // Remove any displayed elements in dashboard
//             $("#captureButton").text("Capture Photo");
//         }
//         isCapturing = !isCapturing; // Toggle capture state
//     };

//     // Event listener for capture button
//     $("#captureButton").click(function () {
//         toggleCapture();
//         // Optionally, you can add logic here to handle what happens after capturing or uncapturing the photo
//     });
// });

$(function () {
    const video = $("video")[0]; // Get the first video element
    const canvas = $("<canvas/>")[0]; // Create a canvas element
    const ctx = canvas.getContext("2d"); // Get 2D context for the canvas
    const font = "16px sans-serif"; // Font for drawing text

    let isCapturing = false; // Variable to track capture state
    let stream; // Variable to hold the video stream

    // Function to start the video stream from the device camera
    const startVideoStream = function () {
        navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment" // Use the environment-facing camera
            },
            audio: false // Do not capture audio
        })
        .then(function (s) {
            stream = s; // Store the video stream
            video.srcObject = stream; // Set the video source to the stream
            return new Promise(function (resolve) {
                video.onloadedmetadata = function () {
                    video.play(); // Start playing the video
                    resolve();
                };
            });
        })
        .catch(function (err) {
            console.error("Error accessing the camera:", err);
        });
    };

    // Function to load the COCO-SSD model
    const loadModel = function () {
        return cocoSsd.load(); // Load the COCO-SSD model from TensorFlow.js
    };

    // Function to resize the canvas based on video dimensions
    const resizeCanvas = function () {
        const dimensions = videoDimensions(video); // Calculate video dimensions

        canvas.width = video.videoWidth; // Set canvas width to video width
        canvas.height = video.videoHeight; // Set canvas height to video height

        $(canvas).css({
            width: dimensions.width,
            height: dimensions.height,
            left: ($(window).width() - dimensions.width) / 2,
            top: ($(window).height() - dimensions.height) / 2
        });

        $("body").append(canvas); // Append the canvas to the body
    };

    // Function to calculate video dimensions respecting aspect ratio
    const videoDimensions = function (video) {
        const videoRatio = video.videoWidth / video.videoHeight; // Calculate video aspect ratio
        let width = video.offsetWidth; // Get current video width
        let height = video.offsetHeight; // Get current video height
        const elementRatio = width / height; // Calculate current aspect ratio of video element

        // Adjust width and height to match video aspect ratio
        if (elementRatio > videoRatio) {
            width = height * videoRatio;
        } else {
            height = width / videoRatio;
        }

        return {
            width: width,
            height: height
        };
    };

    // Function to capture a photo from the video stream and perform object detection
    const capturePhoto = function () {
        const dimensions = videoDimensions(video); // Get video dimensions

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw video frame on canvas

        cocoSsd.detect(canvas) // Perform object detection on the canvas
        .then(function (predictions) {
            renderPredictions(predictions); // Render predictions on the canvas
        })
        .catch(function (error) {
            console.error("Error detecting objects:", error);
        });
    };

    // Function to render object detection predictions on the canvas
    const renderPredictions = function (predictions) {
        const scale = 1; // Scale factor for rendering

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear previous drawings

        predictions.forEach(function (prediction) {
            const x = prediction.bbox[0]; // X-coordinate of bounding box
            const y = prediction.bbox[1]; // Y-coordinate of bounding box
            const width = prediction.bbox[2]; // Width of bounding box
            const height = prediction.bbox[3]; // Height of bounding box

            ctx.strokeStyle = "blue"; // Set stroke color
            ctx.lineWidth = 4; // Set line width
            ctx.strokeRect(x, y, width, height); // Draw bounding box

            ctx.fillStyle = "blue"; // Set fill color
            ctx.font = font; // Set font
            ctx.fillText(prediction.class, x, y); // Draw class label
        });

        updateDashboard(predictions); // Update dashboard with predictions
    };

    // Function to update the dashboard with detected objects
    const updateDashboard = function (predictionsData) {
        const dashboard = $("#dashboard"); // Get dashboard element

        dashboard.empty(); // Clear previous predictions

        predictionsData.forEach(function (prediction, index) {
            const classLabel = prediction.class; // Get class label
            const confidence = prediction.score ? prediction.score.toFixed(2) : "N/A"; // Get confidence score

            // Example condition to display images for specific classes (e.g., "bicycle" and "handlebars")
            if (classLabel === "bicycle") {
                createImageElement("https://W0ShiiSky.github.io/BicycleStaticSpecification/image/BicycleSpecification3.jpg", "Bicycle Image", prediction.bbox);
            } else if (classLabel === "handlebars") {
                createImageElement("https://W0ShiiSky.github.io/BicycleStaticSpecification/image/BicycleSpecification.jpg", "Handlebars Image", prediction.bbox);
            }
        });

        console.log("Dashboard updated with predictions:", predictionsData);
    };

    // Function to create and position image elements on the dashboard
    const createImageElement = function (src, alt, bbox) {
        const videoRect = video.getBoundingClientRect(); // Get video element's position

        const element = $("<img>").attr({ // Create img element with attributes
            src: src, // Set image source
            alt: alt // Set alt text
        });

        element.css({ // Apply CSS styles to image element
            position: "absolute",
            top: videoRect.top + bbox[1] + "px",
            left: videoRect.left + bbox[0] + "px",
            zIndex: 100,
            width: "150px",
            height: "auto"
        });

        $("#dashboard").append(element); // Append image element to dashboard
    };

    // Function to toggle capture state and handle capture button click event
    const toggleCapture = function () {
        if (!isCapturing) {
            capturePhoto(); // Capture photo and perform object detection
            $("#captureButton").text("Uncapture"); // Update button text
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
            $("#dashboard").empty(); // Clear dashboard
            $("#captureButton").text("Capture Photo"); // Update button text
        }
        isCapturing = !isCapturing; // Toggle capture state
    };

    // Event listener for capture button click
    $("#captureButton").click(function () {
        toggleCapture(); // Toggle capture state
        // Add additional logic as needed after capturing or uncapturing photo
    });

    // Event listener for window resize
    $(window).resize(function () {
        resizeCanvas(); // Resize canvas when window is resized
    });

    // Initialize video stream and load model when the document is ready
    $(document).ready(function () {
        startVideoStream(); // Start video stream from camera
        loadModel().then(function () {
            $("body").removeClass("loading"); // Remove loading class from body
            resizeCanvas(); // Resize canvas based on video dimensions
        }).catch(function (error) {
            console.error("Error loading COCO-SSD model:", error); // Log error if model loading fails
        });
    });
});
