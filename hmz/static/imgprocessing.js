function redraw() {
	if(imageSrc != null) {
		ctx.drawImage(imageSrc, 0, 0, canvas.width, canvas.height);
		
		status = "";
		statusLine.value = status;
	}
}

function saveFile() {
	var savedImage = document.querySelector('canvas').toDataURL();
	window.open(savedImage);
}

function handleFileSelect(evt) {
	var file = evt.target.files[0];
	
	var reader = new FileReader();
	reader.onload = function(fileObj) {
		var data = fileObj.target.result;
		
		var image = new Image();
		image.onload = function() {
			imageSrc = this;
			if(imageSrc != null) {
				redraw();
			}
		};
		
		image.src = data;
	};
	reader.readAsDataURL(file);
}

var grayscale = function(r, g, b, a) {
	var y = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
	return {r : y, g : y, b : y, a : a};
};

var sepia = function(r, g, b, a) {
	var y = (0.3 * r) + (0.59 * g) + (0.11 * b);
	return {r : y + 40, g : y + 20, b : y - 20, a : a};
};

var thresholding = function(r, g, b, a) {
	var y = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
	var thr = a || 128;
	return {r : r > thr ? 255 : 0, g : r > thr ? 255 : 0, b : r > thr ? 255 : 0, a : a};
};

var invert = function(r, g, b, a) {
	return {r : 255 - r, g : 255 - g, b : 255 - b, a : a};
};

var saturation = function(r, g, b, a) {
	var level = 2.9;
	RW = 0.3086;
	RG = 0.6084;
	RB = 0.0820;
	RW0 = (1 - level) * RW + level;
	RW1 = (1 - level) * RW;
	RW2 = (1 - level) * RW;
	RG0 = (1 - level) * RG;
	RG1 = (1 - level) * RG + level;
	RG2 = (1 - level) * RG;
	RB0 = (1 - level) * RB;
	RB1 = (1 - level) * RB;
	RB2 = (1 - level) * RB + level;
	return {r : RW0 * r + RG0 * g + RB0 * b, g : RW1 * r + RG1 * g + RB1 * b, b : RW2 * r + RG2 * g + RB2 * b, a : a};
};

var red = function(r, g, b, a) {
	return {r : r, g : 0, b : 0, a : a};
};

var green = function(r, g, b, a) {
	return {r : 0, g : g, b : 0, a : a};
};

var blue = function(r, g, b, a) {
	return {r : 0, g : 0, b : b, a : a};
};

function pixelEffect() {
	var r, g, b, a;
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var numPixels = imageData.data.length / 4;
	for(var i = 0; i < numPixels; i++) {
		r = imageData.data[i * 4 + 0];
		g = imageData.data[i * 4 + 1];
		b = imageData.data[i * 4 + 2];
		a = imageData.data[i * 4 + 4];
		pixel = this(r, g, b, a);
		imageData.data[i * 4 + 0] = pixel.r;
		imageData.data[i * 4 + 1] = pixel.g;
		imageData.data[i * 4 + 2] = pixel.b;
		imageData.data[i * 4 + 3] = pixel.a;
	}
	ctx.putImageData(imageData, 0, 0);
	
	status += this.name + " ";
	statusLine.value = status;
}

function mirror() {
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var numPixels = imageData.data.length / 4;
	var rowSize = numPixels / canvas.height;
	for(var w = 0; w < canvas.height; w++) {
		for(var i = 0; i < rowSize / 2; i++) {
			var counti = (w * rowSize + i) * 4;
			var tmpR = imageData.data[counti];
			var tmpG = imageData.data[counti + 1];
			var tmpB = imageData.data[counti + 2];
			var countj = (rowSize - 1 - i + w * rowSize) * 4;
			imageData.data[counti] = imageData.data[countj];
			imageData.data[counti + 1] = imageData.data[countj + 1];
			imageData.data[counti + 2] = imageData.data[countj + 2];
			imageData.data[countj] = tmpR;
			imageData.data[countj + 1] = tmpG;
			imageData.data[countj + 2] = tmpB;
		}
	}
	ctx.putImageData(imageData, 0, 0);
	
	status += "mirror ";
	statusLine.value = status;
}

var sharpen = function() {
	var operator = [0, -0.2, 0, -0.2, 1.8, -0.2, 0, -0.2, 0];
	return operator;
};

var highpass = function() {
	var operator = [-8, -8, -8, -8, 32, -8, -8, -8, -8];
	return operator;
};

var lowpass5 = function() {
	var k = 1/25;
	var operator = [k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k];
	return operator;
};

function convolution() {
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var side = Math.round(Math.sqrt(this().length));
	var halfSide = Math.floor(side / 2);
	
	for(var y = 0; y < canvas.height; y++) {
		for(var x = 0; x < canvas.width; x++) {
			var dstOff = (y * canvas.width + x) * 4;
			var sumReds = 0, sumGreens = 0, sumBlues = 0;
			
			for(var kernelY = 0; kernelY < side; kernelY++) {
				for(var kernelX = 0; kernelX < side; kernelX++) {
					var currentKernelY = y + kernelY - halfSide;
					var currentKernelX = x + kernelX - halfSide;
					
					if(currentKernelY >= 0 && currentKernelY < canvas.height && currentKernelX >= 0 && currentKernelX < canvas.width) {
						var offset = (currentKernelY * canvas.width + currentKernelX) * 4;
						var weight = this()[kernelY * side + kernelX];
						sumReds += imageData.data[offset] * weight;
						sumGreens += imageData.data[offset + 1] * weight;
						sumBlues += imageData.data[offset + 2] * weight;
					}
				}
			}
			
			imageData.data[dstOff] = sumReds;
			imageData.data[dstOff + 1] = sumGreens;
			imageData.data[dstOff + 2] = sumBlues;
			imageData.data[dstOff + 3] = 255;
		}
	}
	ctx.putImageData(imageData, 0, 0);
	
	status += this.name + " ";
	statusLine.value = status;
}