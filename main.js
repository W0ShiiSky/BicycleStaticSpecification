$(function () {
    const video = $("video")[0];
    var model;
    var cameraMode = "environment"; // or "user"
    let stream; // Variable to hold the stream object

    // const startVideoStreamPromise = navigator.mediaDevices
    //     .getUserMedia({
    //         audio: false,
    //         video: {
    //             facingMode: cameraMode
    //         }
    //     })
    //     .then(function (stream) {
    //         return new Promise(function (resolve) {
    //             video.srcObject = stream;
    //             video.onloadeddata = function () {
    //                 video.play();
    //                 resolve();
    //             };
    //         });
    //     });

    const startVideoStreamPromise = navigator.mediaDevices
        .getUserMedia({
            audio: false,
            video: {
                facingMode: "environment"
            }
        })
        .then(function (s) {
            stream = s; // Store the stream object in the variable
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

        // Capture button click event listener
    $("#captureButton").click(function () {
        // Stop the video stream
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(function (track) {
                track.stop();
            });
        }

        // Perform capture logic here (e.g., capturePhoto() function)
        capturePhoto();
    });

     // Function to capture the photo
     function capturePhoto() {
        var dimensions = videoDimensions(video);

        ctx.drawImage(video, 0, 0, canvas[0].width, canvas[0].height);

        model
            .detect(canvas[0])
            .then(function (predictions) {
                renderPredictions(predictions);
            })
            .catch(function (e) {
                console.log("Error detecting objects:", e);
            });
    };

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
                    src: "https://W0ShiiSky.github.io/BicycleStaticSpecification/image/BicycleSpecification3.jpg",
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
                    src: "https://W0ShiiSky.github.io/BicycleStaticSpecification/image/BicycleSpecification.jpg",
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

    // Function to capture the photo
    const capturePhoto = function () {
        var dimensions = videoDimensions(video);

        ctx.drawImage(video, 0, 0, canvas[0].width, canvas[0].height);

        model
            .detect(canvas[0])
            .then(function (predictions) {
                renderPredictions(predictions);
            })
            .catch(function (e) {
                console.log("Error detecting objects:", e);
            });
    };

    // Event listener for capture button
    $("#captureButton").click(function () {
        capturePhoto();
    });
});
