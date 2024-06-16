// /*jshint esversion:6*/

// $(function () {
//     const video = $("video")[0];

//     var model;
//     var cameraMode = "environment"; // or "user"

//     const startVideoStreamPromise = navigator.mediaDevices
//         .getUserMedia({
//             audio: false,
//             video: {
//                 facingMode: cameraMode
//             }
//         })
//         .then(function (stream) {
//             return new Promise(function (resolve) {
//                 video.srcObject = stream;
//                 video.onloadeddata = function () {
//                     video.play();
//                     resolve();
//                 };
//             });
//         });

//     var publishable_key = "rf_F5yTWUSIA9ZvmMMZbXJ9j9VRkAx2";
//     var toLoad = {
//         // model: "types-of-active-mobility-devices",
//         // version: 2
//         model: "activemobilitydevices",
//         version: 1
//     };

//     const loadModelPromise = new Promise(function (resolve, reject) {
//         roboflow
//             .auth({
//                 publishable_key: publishable_key
//             })
//             .load(toLoad)
//             .then(function (m) {
//                 model = m;
//                 resolve();
//             });
//     });

//     Promise.all([startVideoStreamPromise, loadModelPromise]).then(function () {
//         $("body").removeClass("loading");
//         resizeCanvas();
//         detectFrame();
//     });

//     var canvas, ctx;
//     const font = "16px sans-serif";

//     function videoDimensions(video) {
//         // Ratio of the video's intrisic dimensions
//         var videoRatio = video.videoWidth / video.videoHeight;

//         // The width and height of the video element
//         var width = video.offsetWidth,
//             height = video.offsetHeight;

//         // The ratio of the element's width to its height
//         var elementRatio = width / height;

//         // If the video element is short and wide
//         if (elementRatio > videoRatio) {
//             width = height * videoRatio;
//         } else {
//             // It must be tall and thin, or exactly equal to the original ratio
//             height = width / videoRatio;
//         }

//         return {
//             width: width,
//             height: height
//         };
//     }

//     $(window).resize(function () {
//         resizeCanvas();
//     });

//     const resizeCanvas = function () {
//         $("canvas").remove();

//         canvas = $("<canvas/>");

//         ctx = canvas[0].getContext("2d");

//         var dimensions = videoDimensions(video);

//         console.log(
//             video.videoWidth,
//             video.videoHeight,
//             video.offsetWidth,
//             video.offsetHeight,
//             dimensions
//         );

//         canvas[0].width = video.videoWidth;
//         canvas[0].height = video.videoHeight;

//         canvas.css({
//             width: dimensions.width,
//             height: dimensions.height,
//             left: ($(window).width() - dimensions.width) / 2,
//             top: ($(window).height() - dimensions.height) / 2
//         });

//         $("body").append(canvas);
//     };
    
//     // Text Format
//     // const updateDashboard = function(predictionsData) {
//     //     // Check if predictions array is empty
//     //     if (predictionsData.length === 0) {
//     //         console.log("No predictions found.");
//     //         $("#dashboard").html(""); // Clear the dashboard content
//     //         return; // Exit the function if no predictions are found
//     //     }
    
//     //     // Loop through predictions and add information to the dashboard
//     //     predictionsData.forEach(function(prediction, index) {
//     //         const classLabel = prediction.class;
//     //         const confidence = prediction.confidence ? prediction.confidence.toFixed(2) : "N/A"; // Check if confidence property exists
    
//     //         // Create a unique ID for each prediction paragraph
//     //         const paragraphId = `prediction_${index}`;
    
//     //         // Check if the paragraph already exists in the dashboard
//     //         const existingParagraph = $(`#${paragraphId}`);
//     //         if (existingParagraph.length) {
//     //             // Update existing paragraph content
//     //             existingParagraph.html("<span style='color:black'>Register with LTA: No</span> <br>" +
//     //                 "<span style='color:black'>Cycling Path: Yes</span> <br>" +
//     //                 "<span style='color:black'>Foot Path: Yes</span> <br>" +
//     //                 "<span style='color:black'>Road: Yes</span> <br>" +
//     //                 "<span style='color:black'>Test: No</span> <br>" +
//     //                 "<span style='color:black'>Max Speed: 10km/h on Footpath</span> <br>" +
//     //                 "<span style='color:black'>Max Width: 70cm (on paths), 130cm (on roads)</span> <br>" +
//     //                 "<span style='color:black'>Max Length: 260cm</span> <br>" +
//     //                 "<span style='color:black'>At least one functioning handbrake is required to be installed at the handlebar of the device</span> <br>" +
//     //                 "<span style='color:black'>Max unladen weight: -20kg (on paths)</span> <br>" +
//     //                 "<span style='color:black'>Front white light and rear red light</span> <br>" +
//     //                 "<span style='color:black'>Helmet: Road - Must, Paths - Encourage</span> <br>");
//     //         } else {
//     //             // Create a new paragraph element with the class label and confidence
//     //             const paragraph = $("<p>").attr("id", paragraphId).html(
//     //                 "<span style='color:black'>Register with LTA: No</span> <br>" +
//     //                 "<span style='color:black'>Cycling Path: Yes</span> <br>" +
//     //                 "<span style='color:black'>Foot Path: Yes</span> <br>" +
//     //                 "<span style='color:black'>Road: Yes</span> <br>" +
//     //                 "<span style='color:black'>Test: No</span> <br>" +
//     //                 "<span style='color:black'>Max Speed: 10km/h on Footpath</span> <br>" +
//     //                 "<span style='color:black'>Max Width: 70cm (on paths), 130cm (on roads)</span> <br>" +
//     //                 "<span style='color:black'>Max Length: 260cm</span> <br>" +
//     //                 "<span style='color:black'>At least one functioning handbrake is required to be installed at the handlebar of the device</span> <br>" +
//     //                 "<span style='color:black'>Max unladen weight: -20kg (on paths)</span> <br>" +
//     //                 "<span style='color:black'>Front white light and rear red light</span> <br>" +
//     //                 "<span style='color:black'>Helmet: Road - Must, Paths - Encourage</span> <br>"
//     //             );
    
//     //             // Append paragraph to the dashboard
//     //             $("#dashboard").append(paragraph);
//     //         }
//     //     });
    
//     //     console.log("Dashboard updated with predictions:", predictionsData);
//     // };


//     // const updateDashboard = function(predictionsData) {
//     //     // Check if predictions array is empty
//     //     if (predictionsData.length === 0) {
//     //         console.log("No predictions found.");
//     //         $("#dashboard").html(""); // Clear the dashboard content
//     //         return; // Exit the function if no predictions are found
//     //     }
    
//     //     // Clear the previous content in the dashboard
//     //     $("#dashboard").empty();
    
//     //     // Loop through predictions and add information to the dashboard
//     //     predictionsData.forEach(function(prediction, index) {
//     //         const classLabel = prediction.class;
//     //         const confidence = prediction.confidence ? prediction.confidence.toFixed(2) : "N/A"; // Check if confidence property exists
    
//     //         // Create a unique ID for each prediction paragraph
//     //         const paragraphId = `prediction_${index}`;
//     //         const elementId = `prediction_${index}`;
    
//     //         let paragraph; // Declare paragraph variable outside the if-else block
//     //         let element;
//     //         let wheelImageCreated = false;
    
//     //         if (prediction.class === "Bicycle") {
//     //             element = $("<img>").attr({
//     //                 id: elementId,
//     //                 src: "https://W0ShiiSky.github.io/BicycleSpecification/image/BicycleSpecification3.jpg", // Replace with the actual image source
//     //                 alt: "Bicycle Image"
//     //             });

//     //             element.css({
//     //                 position: "absolute",
//     //                 top: prediction.bbox.y, // Adjust this according to your bounding box data
//     //                 left: prediction.bbox.x, // Adjust this according to your bounding box data
//     //                 zIndex: 100, // Set a high z-index to bring it forward
//     //                 width: "200px", // Set the width of the image
//     //                 height: "auto" // Maintain aspect ratio
//     //             });

//     //         } else if (prediction.class === "Wheel"){
//     //             element = $("<img>").attr({
//     //                 id: elementId,
//     //                 src: "https://W0ShiiSky.github.io/BicycleSpecification/image/BicycleSpecification2.jpg", // Replace with the actual image source
//     //                 alt: "Wheel Image"
//     //             });

//     //             element.css({
//     //                 position: "absolute",
//     //                 top: prediction.bbox.y, // Adjust this according to your bounding box data
//     //                 right: prediction.bbox.x, // Adjust this according to your bounding box data
//     //                 zIndex: 100, // Set a high z-index to bring it forward
//     //                 width: "150px", // Set the width of the image
//     //                 height: "auto" // Maintain aspect ratio
//     //             });
//     //         }
//     //         else if (prediction.class === "Handlebars"){
//     //             element = $("<img>").attr({
//     //                 id: elementId,
//     //                 src: "https://W0ShiiSky.github.io/BicycleSpecification/image/BicycleSpecification.jpg", // Replace with the actual image source
//     //                 alt: "Bicycle Image"
//     //             });

//     //             element.css({
//     //                 position: "absolute",
//     //                 top: prediction.bbox.y, // Adjust this according to your bounding box data
//     //                 right: prediction.bbox.x, // Adjust this according to your bounding box data
//     //                 zIndex: 100, // Set a high z-index to bring it forward
//     //                 width: "200px", // Set the width of the image
//     //                 height: "auto" // Maintain aspect ratio
//     //             });
//     //         }
    
//     //         // Append each paragraph to the dashboard
//     //         // $("#dashboard").append(paragraph);
//     //         $("#dashboard").append(element);

//     //     });
    
//     //     console.log("Dashboard updated with predictions:", predictionsData);
//     // };
    
//     // const renderPredictions = function (predictions) {
//     //     var dimensions = videoDimensions(video);
//     //     console.log("Received predictions:", predictions);


//     //     var scale = 1;

//     //     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

//     //     predictions.forEach(function (prediction) {
//     //         const x = prediction.bbox.x;
//     //         const y = prediction.bbox.y;

//     //         const width = prediction.bbox.width;
//     //         const height = prediction.bbox.height;

//     //         // Draw the bounding box.
//     //         ctx.strokeStyle = prediction.color;
//     //         ctx.lineWidth = 4;
//     //         ctx.strokeRect(
//     //             (x - width / 2) / scale,
//     //             (y - height / 2) / scale,
//     //             width / scale,
//     //             height / scale
//     //         );

//     //         // Draw the label background.
//     //         ctx.fillStyle = prediction.color;
//     //         const textWidth = ctx.measureText(prediction.class).width;
//     //         const textHeight = parseInt(font, 10); // base 10
//     //         ctx.fillRect(
//     //             (x - width / 2) / scale,
//     //             (y - height / 2) / scale,
//     //             textWidth + 8,
//     //             textHeight + 4
//     //         );
//     //     });

//     //     predictions.forEach(function (prediction) {
//     //         const x = prediction.bbox.x;
//     //         const y = prediction.bbox.y;

//     //         const width = prediction.bbox.width;
//     //         const height = prediction.bbox.height;

//     //         // Draw the text last to ensure it's on top.
//     //         ctx.font = font;
//     //         ctx.textBaseline = "top";
//     //         ctx.fillStyle = "#000000";
//     //         ctx.fillText(
//     //             prediction.class,
//     //             (x - width / 2) / scale + 4,
//     //             (y - height / 2) / scale + 1
//     //         );
//     //     });
//     //     updateDashboard(predictions);

//     //     predictions = [];
//     // };

//     // var prevTime;
//     // var pastFrameTimes = [];
//     // const detectFrame = function () {
//     //     if (!model) return requestAnimationFrame(detectFrame);

//     //     model
//     //         .detect(video)
//     //         .then(function (predictions) {
//     //             requestAnimationFrame(detectFrame);
//     //             renderPredictions(predictions);
//     //             updateDashboard(predictions);

//     //             if (prevTime) {
//     //                 pastFrameTimes.push(Date.now() - prevTime);
//     //                 if (pastFrameTimes.length > 30) pastFrameTimes.shift();

//     //                 var total = 0;
//     //                 _.each(pastFrameTimes, function (t) {
//     //                     total += t / 1000;
//     //                 });

//     //                 var fps = pastFrameTimes.length / total;
//     //                 $("#fps").text(Math.round(fps));
//     //             }
//     //             prevTime = Date.now();
//     //         })
//     //         .catch(function (e) {
//     //             console.log("CAUGHT", e);
//     //             requestAnimationFrame(detectFrame);
//     //         });
//     // };

//     //Only one image per class will be shown, regardless of how many predictions of each class are detected
//     const updateDashboard = function(predictionsData) {
//         // Check if predictions array is empty
//         if (predictionsData.length === 0) {
//             console.log("No predictions found.");
//             $("#dashboard").html(""); // Clear the dashboard content
//             return; // Exit the function if no predictions are found
//         }
    
//         // Clear the previous content in the dashboard
//         $("#dashboard").empty();
    
//         // Flags to track if an image has been created for each class
//         let bicycleImageCreated = false;
//         let wheelImageCreated = false;
//         let handlebarsImageCreated = false;
    
//         // Loop through predictions and add information to the dashboard
//         predictionsData.forEach(function(prediction, index) {
//             const classLabel = prediction.class;
//             const confidence = prediction.confidence ? prediction.confidence.toFixed(2) : "N/A"; // Check if confidence property exists
    
//             // Create a unique ID for each prediction paragraph
//             const paragraphId = `prediction_${index}`;
//             const elementId = `prediction_${index}`;
    
//             let element;
    
//             if (prediction.class === "Bicycle" && !bicycleImageCreated) {
//                 bicycleImageCreated = true; // Mark the flag as true
    
//                 element = $("<img>").attr({
//                     id: elementId,
//                     src: "https://W0ShiiSky.github.io/BicycleSpecification/image/BicycleSpecification3.jpg", // Replace with the actual image source
//                     alt: "Bicycle Image"
//                 });
    
//                 element.css({
//                     position: "absolute",
//                     top: prediction.bbox.y + "px", // Ensure these are in pixel units
//                     left: prediction.bbox.x + "px", // Ensure these are in pixel units
//                     zIndex: 100, // Set a high z-index to bring it forward
//                     width: "150px", // Set the width of the image
//                     height: "auto" // Maintain aspect ratio
//                 });
    
//             } else if (prediction.class === "Wheel" && !wheelImageCreated) {
//                 wheelImageCreated = true; // Mark the flag as true
    
//             } else if (prediction.class === "Handlebars" && !handlebarsImageCreated) {
//                 handlebarsImageCreated = true; // Mark the flag as true
    
//                 element = $("<img>").attr({
//                     id: elementId,
//                     src: "https://W0ShiiSky.github.io/BicycleSpecification/image/BicycleSpecification.jpg", // Replace with the actual image source
//                     alt: "Bicycle Image"
//                 });
    
//                 element.css({
//                     position: "absolute",
//                     top: prediction.bbox.y + "px", // Ensure these are in pixel units
//                     right : prediction.bbox.x + "px", // Ensure these are in pixel units
//                     zIndex: 100, // Set a high z-index to bring it forward
//                     width: "150px", // Set the width of the image
//                     height: "auto" // Maintain aspect ratio
//                 });
//             }
    
//             // Append the element to the dashboard if it was created
//             if (element) {
//                 $("#dashboard").append(element);
//             }
//         });
    
//         console.log("Dashboard updated with predictions:", predictionsData);
//     };
    
//     const renderPredictions = function (predictions) {
//         var dimensions = videoDimensions(video);
//         console.log("Received predictions:", predictions);
    
//         var scale = 1;
    
//         ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
//         predictions.forEach(function (prediction) {
//             const x = prediction.bbox.x;
//             const y = prediction.bbox.y;
    
//             const width = prediction.bbox.width;
//             const height = prediction.bbox.height;
    
//             // Draw the bounding box.
//             ctx.strokeStyle = prediction.color;
//             ctx.lineWidth = 4;
//             ctx.strokeRect(
//                 (x - width / 2) / scale,
//                 (y - height / 2) / scale,
//                 width / scale,
//                 height / scale
//             );
    
//             // Draw the label background.
//             ctx.fillStyle = prediction.color;
//             const textWidth = ctx.measureText(prediction.class).width;
//             const textHeight = parseInt(font, 10); // base 10
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
    
//             // Draw the text last to ensure it's on top.
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
    
//     var prevTime;
//     var pastFrameTimes = [];
//     const detectFrame = function () {
//         if (!model) return requestAnimationFrame(detectFrame);
    
//         model
//             .detect(video)
//             .then(function (predictions) {
//                 requestAnimationFrame(detectFrame);
//                 renderPredictions(predictions);
    
//                 if (prevTime) {
//                     pastFrameTimes.push(Date.now() - prevTime);
//                     if (pastFrameTimes.length > 30) pastFrameTimes.shift();
    
//                     var total = 0;
//                     _.each(pastFrameTimes, function (t) {
//                         total += t / 1000;
//                     });
    
//                     var fps = pastFrameTimes.length / total;
//                     $("#fps").text(Math.round(fps));
//                 }
//                 prevTime = Date.now();
//             })
//             .catch(function (e) {
//                 console.log("CAUGHT", e);
//                 requestAnimationFrame(detectFrame);
//             });
//     };
    
// });



/*jshint esversion:6*/

$(function () {
    const video = $("video")[0];

    var model;
    var cameraMode = "environment"; // or "user"

    const startVideoStreamPromise = navigator.mediaDevices
        .getUserMedia({
            audio: false,
            video: {
                facingMode: cameraMode
            }
        })
        .then(function (stream) {
            return new Promise(function (resolve) {
                video.srcObject = stream;
                video.onloadeddata = function () {
                    video.play();
                    resolve();
                };
            });
        });

    var publishable_key = "rf_F5yTWUSIA9ZvmMMZbXJ9j9VRkAx2";
    var toLoad = {
        model: "activemobilitydevices",
        version: 1
    };

    const loadModelPromise = new Promise(function (resolve, reject) {
        roboflow
            .auth({
                publishable_key: publishable_key
            })
            .load(toLoad)
            .then(function (m) {
                model = m;
                resolve();
            });
    });

    Promise.all([startVideoStreamPromise, loadModelPromise]).then(function () {
        $("body").removeClass("loading");
        resizeCanvas();
        detectFrame();
    });

    var canvas, ctx;
    const font = "16px sans-serif";

    function videoDimensions(video) {
        var videoRatio = video.videoWidth / video.videoHeight;
        var width = video.offsetWidth,
            height = video.offsetHeight;
        var elementRatio = width / height;

        if (elementRatio > videoRatio) {
            width = height * videoRatio;
        } else {
            height = width / videoRatio;
        }

        return {
            width: width,
            height: height
        };
    }

    $(window).resize(function () {
        resizeCanvas();
    });

    const resizeCanvas = function () {
        $("canvas").remove();

        canvas = $("<canvas/>");

        ctx = canvas[0].getContext("2d");

        var dimensions = videoDimensions(video);

        canvas[0].width = video.videoWidth;
        canvas[0].height = video.videoHeight;

        canvas.css({
            width: dimensions.width,
            height: dimensions.height,
            left: ($(window).width() - dimensions.width) / 2,
            top: ($(window).height() - dimensions.height) / 2
        });

        $("body").append(canvas);
    };

    const updateDashboard = function (predictionsData) {
        if (predictionsData.length === 0) {
            console.log("No predictions found.");
            $("#dashboard").html("");
            return;
        }

        $("#dashboard").empty();

        let bicycleImageCreated = false;
        let handlebarsImageCreated = false;

        var videoRect = video.getBoundingClientRect();

        predictionsData.forEach(function (prediction, index) {
            const classLabel = prediction.class;
            const confidence = prediction.confidence ? prediction.confidence.toFixed(2) : "N/A";

            const elementId = `prediction_${index}`;
            let element;

            if (prediction.class === "Bicycle" && !bicycleImageCreated) {
                bicycleImageCreated = true;

                element = $("<img>").attr({
                    id: elementId,
                    src: "https://W0ShiiSky.github.io/BicycleSpecification/image/BicycleSpecification3.jpg",
                    alt: "Bicycle Image"
                });

                element.css({
                    position: "absolute",
                    top: videoRect.top + (prediction.bbox.y - prediction.bbox.height / 2) + "px",
                    left: videoRect.left + (prediction.bbox.x - prediction.bbox.width / 2) + "px",
                    zIndex: 100,
                    width: "150px",
                    height: "auto"
                });

            } else if (prediction.class === "Handlebars" && !handlebarsImageCreated) {
                handlebarsImageCreated = true;

                element = $("<img>").attr({
                    id: elementId,
                    src: "https://W0ShiiSky.github.io/BicycleSpecification/image/BicycleSpecification.jpg",
                    alt: "Handlebars Image"
                });

                element.css({
                    position: "absolute",
                    top: videoRect.top + (prediction.bbox.y - prediction.bbox.height / 2) + "px",
                    left: videoRect.left + (prediction.bbox.x - prediction.bbox.width / 2) + "px",
                    zIndex: 100,
                    width: "150px",
                    height: "auto"
                });
            }

            if (element) {
                $("#dashboard").append(element);
            }
        });

        console.log("Dashboard updated with predictions:", predictionsData);
    };

    const renderPredictions = function (predictions) {
        var dimensions = videoDimensions(video);
        console.log("Received predictions:", predictions);

        var scale = 1;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        predictions.forEach(function (prediction) {
            const x = prediction.bbox.x;
            const y = prediction.bbox.y;

            const width = prediction.bbox.width;
            const height = prediction.bbox.height;

            ctx.strokeStyle = prediction.color;
            ctx.lineWidth = 4;
            ctx.strokeRect(
                (x - width / 2) / scale,
                (y - height / 2) / scale,
                width / scale,
                height / scale
            );

            ctx.fillStyle = prediction.color;
            const textWidth = ctx.measureText(prediction.class).width;
            const textHeight = parseInt(font, 10);
            ctx.fillRect(
                (x - width / 2) / scale,
                (y - height / 2) / scale,
                textWidth + 8,
                textHeight + 4
            );
        });

        predictions.forEach(function (prediction) {
            const x = prediction.bbox.x;
            const y = prediction.bbox.y;

            const width = prediction.bbox.width;
            const height = prediction.bbox.height;

            ctx.font = font;
            ctx.textBaseline = "top";
            ctx.fillStyle = "#000000";
            ctx.fillText(
                prediction.class,
                (x - width / 2) / scale + 4,
                (y - height / 2) / scale + 1
            );
        });
        updateDashboard(predictions);
    };

    var prevTime;
    var pastFrameTimes = [];
    const detectFrame = function () {
        if (!model) return requestAnimationFrame(detectFrame);

        model
            .detect(video)
            .then(function (predictions) {
                requestAnimationFrame(detectFrame);
                renderPredictions(predictions);

                if (prevTime) {
                    pastFrameTimes.push(Date.now() - prevTime);
                    if (pastFrameTimes.length > 30) pastFrameTimes.shift();

                    var total = 0;
                    _.each(pastFrameTimes, function (t) {
                        total += t / 1000;
                    });

                    var fps = pastFrameTimes.length / total;
                    $("#fps").text(Math.round(fps));
                }
                prevTime = Date.now();
            })
            .catch(function (e) {
                console.log("CAUGHT", e);
                requestAnimationFrame(detectFrame);
            });
    };
});
