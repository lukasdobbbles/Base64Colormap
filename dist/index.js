"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Jimp = require('jimp');
const ndarray = require('ndarray');
const colormap = require('colormap');
const colormapForm = document.getElementById("colormapForm");
const base64Image = document.getElementById("base64Image");
const outputImage = document.getElementById("outputImage");
const inputImage = document.getElementById("inputImage");
const resultImages = document.getElementById("resultImages");
colormapForm.addEventListener("submit", (e) => {
    e.preventDefault();
    base64ToColormap();
});
function convertToGrayscale(data) {
    const height = data.shape[0];
    const width = data.shape[1];
    let grayscaleBuffer = new Float32Array(height * width);
    let grayscaleIndex = 0;
    for (let i = 0; i < data.data.length; i += 4) {
        let luminosity = 0.299 * data.data[i] + 0.587 * data.data[i + 1] + 0.114 * data.data[i + 2];
        grayscaleBuffer[grayscaleIndex++] = luminosity;
    }
    let grayscale = ndarray(grayscaleBuffer, [height, width]);
    return grayscale;
}
const testCmap = colormap({
    colormap: 'jet',
    nshades: 256,
    format: 'rgb'
});
async function convertNdarrayToImage(ndarrayImage, image) {
    const height = ndarrayImage.shape[0];
    const width = ndarrayImage.shape[1];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const color = testCmap[ndarrayImage.get(y, x)];
            const r = color[0];
            const g = color[1];
            const b = color[2];
            const a = 255;
            image.setPixelColor(Jimp.rgbaToInt(r, g, b, a), x, y);
        }
    }
    image.getBase64(Jimp.AUTO, (err, src) => {
        outputImage.setAttribute("src", src);
    });
    resultImages.style.display = "block";
}
async function base64ToColormap() {
    inputImage.setAttribute('src', base64Image.value);
    const image = await Jimp.read(Buffer.from(base64Image.value.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/webp;base64,/, ""), 'base64'));
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const data = new Uint8Array(image.bitmap.data);
    // Convert image data to ndarray
    const imageNdArray = ndarray(data, [height, width, 4]);
    const grayscaleImage = convertToGrayscale(imageNdArray);
    await convertNdarrayToImage(grayscaleImage, image);
}
