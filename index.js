const density = "`-.',~\"_:;^r>*?|\\/Licl7vz1xt{}]Ffujy2SoaZemwXPEhk6$9qKOdHDR8MWgN#BQ@";

const clearAndReload = () => {
    location.reload();
}

const loadFile = (event) => {
    var asciiImage = "";
    const canvas = document.getElementById('outputImage');
    const widthInput = document.getElementById('width');
    const image = new Image();
    image.src = URL.createObjectURL(event.target.files[0]);
    image.onload = () => {

        var asciiWidth;
        if (widthInput.value != "" && !isNaN(widthInput.value)) {
            asciiWidth = Math.floor(parseInt(widthInput.value, 10));
        } else {
            asciiWidth = 90;
        }
        const asciiHeight = Math.floor((asciiWidth * 100 / image.width) * image.height / 100 * 0.45);

        const context = canvas.getContext("2d", { willReadFrequently: true });
        context.canvas.width = asciiWidth;
        context.canvas.height = asciiHeight;
        context.drawImage(image, 0, 0, asciiWidth, asciiHeight);

        canvas.toBlob(
            (blob) => {
                if (blob) {
                    image.src = URL.createObjectURL(blob);
                }
            },
            "image/png",
            100
        );
        image.onload = () => {
            const imgData = context.getImageData(0, 0, asciiWidth, asciiHeight);
            const data = imgData.data;

            for (let i = 0; i < data.length; i += 4) {
                const red = data[i];
                const green = data[i + 1];
                const blue = data[i + 2];

                const brightness = Math.sqrt(0.241 * red * red + 0.691 * green * green + 0.068 * blue * blue);
                const brightnessPercent = brightness * 100 / 255;
                const asciiCalc = density.length * brightnessPercent / 100;
                const asciiMatch = parseInt(asciiCalc, 10);

                if (asciiMatch != 0) {
                    asciiImage += `<span style='color: rgb(${red},${green},${blue});'>${density[asciiMatch-1]}</span>`;
                } else {
                    asciiImage += `<span style='color: rgb(${red},${green},${blue});'>${density[0]}</span>`;
                }

                if ((i + 4) % (asciiWidth * 4) == 0) {
                    asciiImage += "\n";
                }

                if ((i + 4) >= data.length) {
                    const p = document.getElementById('ascii');
                    p.innerHTML = asciiImage;
                    const f = document.getElementById('file');
                    f.value = "";
                }
            }
        }
    }
};

const video = document.getElementById("webcam");

const asciiVideo = () => {
    var asciiVideo = "";
    const canvas = document.getElementById('outputVideo');
    const widthInput = document.getElementById('width');
    var asciiWidth;
    if (widthInput.value != "" && !isNaN(widthInput.value)) {
        asciiWidth = Math.floor(parseInt(widthInput.value, 10));
    } else {
        asciiWidth = 90;
    }
    const asciiHeight = Math.floor((asciiWidth * 100 / video.videoWidth) * video.videoHeight / 100 * 0.45);

    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.canvas.width = asciiWidth;
    context.canvas.height = asciiHeight;
    context.drawImage(video, 0, 0, asciiWidth, asciiHeight);

    const imgData = context.getImageData(0, 0, asciiWidth, asciiHeight);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        const brightness = Math.sqrt(0.241 * red * red + 0.691 * green * green + 0.068 * blue * blue);
        const brightnessPercent = brightness * 100 / 255;
        const asciiCalc = density.length * brightnessPercent / 100;
        const asciiMatch = parseInt(asciiCalc, 10);

        if (asciiMatch != 0) {
            if (asciiWidth > 90) {
                asciiVideo += density[asciiMatch-1];
            } else {
                asciiVideo += `<span style='color: rgb(${red},${green},${blue});'>${density[asciiMatch-1]}</span>`;
            }
        } else {
            if (asciiWidth > 90) {
                asciiVideo += density[0];
            } else {
                asciiVideo += `<span style='color: rgb(${red},${green},${blue});'>${density[0]}</span>`;
            }
        }

        if ((i + 4) % (asciiWidth * 4) == 0) {
            asciiVideo += "\n";
        }

        if ((i + 4) >= data.length) {
            const p = document.getElementById('asciiVideo');
            p.innerHTML = asciiVideo;
        }
    }

};

var startDrawingASCIIVideo = function () {
    const fps = 60;
    setInterval(asciiVideo, Math.round(1000 / fps));
}

const startVideo = () => {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { width: 1280 } })
            .then(function (stream) {
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    startDrawingASCIIVideo();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}