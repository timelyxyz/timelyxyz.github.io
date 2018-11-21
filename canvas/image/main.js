(function() {
	var imageData, data, red, green, blue, alpha, average;

	var image = document.images[0];
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	
	ctx.drawImage(image, 0, 0, image.width, image.height);
	imageData = ctx.getImageData(0, 0, image.width, image.height);
	data = imageData.data;
	
	for ( var i = 0; i < data.length; i += 4) {
		red = data[i];
        green = data[i + 1];
        blue = data[i + 2];
        alpha = data[i + 3];
        average = Math.floor((red + green + blue) / 3);

        data[i] = average; 
        data[i+1] = average; 
        data[i+2] = average;
	}

	imageData.data = data;

	ctx.putImageData(imageData, 0, 0);
})();