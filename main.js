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

$(function () {
    const video = $("video")[0];
    let stream; // Variable to hold the stream object
    let model;
    const canvas = $("<canvas/>")[0]; // Create canvas element
    const ctx = canvas.getContext("2d"); // Get 2D context
    const font = "16px sans-serif";
    let isCapturing = false; // Variable to track capture state

    const startVideoStreamPromise = navigator.mediaDevices
        .getUserMedia({
            audio: false,
            video: {
                facingMode: "environment"
            }
        })
        .then(function (s) {
            stream = s; // Store the stream object
            video.srcObject = stream;
            return new Promise(function (resolve) {
                video.onloadedmetadata = function () {
                    video.play();
                    resolve();
                };
            });
        })
        .catch(function (err) {
            console.error("Error accessing the camera:", err);
        });

    const loadModelPromise = new Promise(function (resolve, reject) {
        const modelPath = 'runs/train/yolov5s_results/weights/best.onnx'; // Replace with your model path
    
        onnx.loadModel(modelPath).then(function (m) {
            model = m;
            resolve();
        }).catch(function (err) {
            console.error('Error loading model:', err);
            reject(err);
        });
    });

    Promise.all([startVideoStreamPromise, loadModelPromise]).then(function () {
        $("body").removeClass("loading");
        resizeCanvas();
    });

    $(window).resize(function () {
        resizeCanvas();
    });

    const resizeCanvas = function () {
        const dimensions = videoDimensions(video);

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        $(canvas).css({
            width: dimensions.width,
            height: dimensions.height,
            left: ($(window).width() - dimensions.width) / 2,
            top: ($(window).height() - dimensions.height) / 2
        });

        $("body").append(canvas);
    };

    const videoDimensions = function (video) {
        const videoRatio = video.videoWidth / video.videoHeight;
        let width = video.offsetWidth,
            height = video.offsetHeight;
        const elementRatio = width / height;

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

    const updateDashboard = function (predictionsData) {
        if (predictionsData.length === 0) {
            console.log("No predictions found.");
            $("#dashboard").html("");
            return;
        }
    
        // Clear previous elements
        $("#dashboard").empty();

        // Example: Create images based on predictions
        predictionsData.forEach(function (prediction, index) {
            const classLabel = prediction.class;
    
            // Example: Create image element based on classLabel
            const element = $("<img>").attr({
                src: prediction.imageUrl, // Replace with appropriate URL
                alt: `${classLabel} Image`
            });
    
            element.css({
                position: "absolute",
                top: prediction.bbox.y + "px",
                left: prediction.bbox.x + "px",
                zIndex: 100,
                width: "150px",
                height: "auto"
            });
    
            $("#dashboard").append(element);
        });
    
        console.log("Dashboard updated with predictions:", predictionsData);
    };

    const renderPredictions = function (predictions) {
        const dimensions = videoDimensions(video);
    
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
        predictions.forEach(function (prediction) {
            const x = prediction.bbox.x * dimensions.width / video.videoWidth;
            const y = prediction.bbox.y * dimensions.height / video.videoHeight;
            const width = prediction.bbox.width * dimensions.width / video.videoWidth;
            const height = prediction.bbox.height * dimensions.height / video.videoHeight;
    
            // Draw bounding box
            ctx.strokeStyle = prediction.color;
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
    
            // Draw label
            ctx.fillStyle = prediction.color;
            ctx.font = font;
            ctx.fillText(prediction.class, x, y > 10 ? y - 5 : 10);
        });
    
        updateDashboard(predictions);
    };
    

    // Function to capture the photo
    const capturePhoto = function () {
        const dimensions = videoDimensions(video);

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        model
            .detect(canvas)
            .then(function (predictions) {
                renderPredictions(predictions);
            })
            .catch(function (e) {
                console.log("Error detecting objects:", e);
            });
    };

    // Function to toggle capture state
    const toggleCapture = function () {
        if (!isCapturing) {
            capturePhoto();
            $("#captureButton").text("Uncapture");
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            $("#dashboard").empty();
            $("#captureButton").text("Capture Photo");
        }
        isCapturing = !isCapturing;
    };
    
    $("#captureButton").click(function () {
        toggleCapture();
    });
});
