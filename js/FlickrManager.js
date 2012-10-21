/* Author:

*/

WelcomeWall.FlickrEventsHandler.prototype.attachEventHandler = function (event, handler, argObj){
	var that = this;
	this.broker.on(event, function(data){
		//console.log("Attaching Event Handler")
		//console.log(this);
		handler.apply(that, [data, argObj]);
	});
}

WelcomeWall.FlickrEventsHandler.prototype.activateNavButtons = function (){
	var that = this;
	if(this.imageCache.cache.length < 3){
		return;
	}
	if(this.currentImage > 0){
		
		if(this.currentCacheImage <= 1){
			this.previousImageButton.addClass("disabled");
		}
		else{
			this.previousImageButton.removeClass("disabled");
			this.previousImageButton.click(function (){
				that.currentNavAction = that.getPreviousPhoto;
				that.getPreviousPhoto();
				that.stopTimer();
			});
		}
		this.previousImageButton.fadeIn();
		
		//that.attachEventHandler("NO_SIZE_FOUND", that.getPreviousPhoto);
		
	}

	if(this.currentImage < this.imagesList.length-1){
		this.nextImageButton.fadeIn();
		this.nextImageButton.click(function (){
			that.currentNavAction = that.getNextPhoto;
			that.getNextPhoto();
			that.stopTimer();
		});

		this.startTimer();
		//that.attachEventHandler("NO_SIZE_FOUND", that.getNextPhoto);
		
	}
	

}

WelcomeWall.FlickrEventsHandler.prototype.startTimer = function () {
	this.stopTimer();
	var that = this;
	console.log("Starting Flickr Image Timer");
	if(WelcomeWall.initObject.welcome){
		this.imageTimer = setInterval(function(){
			console.log("Firing Flickr Image Timer");
			that.currentNavAction = that.getNextPhoto;
			that.getNextPhoto();
		},7000);
	}
}

WelcomeWall.FlickrEventsHandler.prototype.stopTimer = function () {
	console.log("Stopping Flickr Image Timer");
	clearInterval(this.imageTimer);
}

WelcomeWall.FlickrEventsHandler.prototype.deactivateNavButtons = function (){
	var that = this;
	this.previousImageButton.fadeOut();
	this.nextImageButton.fadeOut();
	this.nextImageButton.unbind();
	this.previousImageButton.unbind();
	this.deactivateCaptionPanel();
}

WelcomeWall.FlickrEventsHandler.prototype.removeEventHandler = function (event){
	this.broker.off(event);
}

WelcomeWall.FlickrEventsHandler.prototype.getGroupPhotos = function (group_id){
	//var groupId = group_id || "554802@N25";
	var groupId = group_id || "74317573@N00";
	this.currentPage = 1;
	this.attachEventHandler("Flickr_API_CALL_COMPLETE", this.getGroupPhotosHandler);
	this.attachEventHandler("FLICKR_PANEL_UPDATE_COMPLETE", WelcomeWall.montageManager.init);
	$.getJSON("http://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&group_id=" + groupId + "&page=" + this.currentPage + "&api_key=3bdd28c7cb805fc97e345cfc6f4bf0b3&per_page=500&format=json&=?");
}

WelcomeWall.FlickrEventsHandler.prototype.getMoreGroupPhotos = function (obj){
	//var groupId = group_id || "554802@N25";
	var groupId = obj.group_id || "74317573@N00";
	this.currentPage++;
	this.attachEventHandler("Flickr_API_CALL_COMPLETE", obj.callback || this.getMoreGroupPhotosHandler);
	$.getJSON("http://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&group_id=" + groupId + "&page=" + this.currentPage + "&api_key=3bdd28c7cb805fc97e345cfc6f4bf0b3&per_page=500&format=json&=?");
}

WelcomeWall.FlickrEventsHandler.prototype.getUserPublicPhotos = function (user_id){
	var userId = user_id || "87646671@N07";
	this.attachEventHandler("Flickr_API_CALL_COMPLETE", this.getPublicPhotosHandler);
	$.getJSON("http://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&user_id=" + userId + "&api_key=3bdd28c7cb805fc97e345cfc6f4bf0b3&format=json&=?");
}

WelcomeWall.FlickrEventsHandler.prototype.getPhotoSizes = function (photo_id, callback){
	var photoId = photo_id || "8043778857";
	this.attachEventHandler("Flickr_API_CALL_COMPLETE", callback || this.getPhotoSizesHandler);
	$.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&photo_id=" + photoId + "&api_key=3bdd28c7cb805fc97e345cfc6f4bf0b3&format=json&=?");
	
}

WelcomeWall.FlickrEventsHandler.prototype.getPhotoSizesForMontage = function (photo_id, callback){
	var photoId = photo_id || "8043778857";
	this.attachEventHandler("Flickr_API_CALL_COMPLETE", callback || this.getPhotoSizesForMontageHandler);
	$.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&photo_id=" + photoId + "&api_key=3bdd28c7cb805fc97e345cfc6f4bf0b3&format=json&=?");
	
}

WelcomeWall.FlickrEventsHandler.prototype.getPhotoInfo = function (photo_id, callback){
	var photoId = photo_id || "8043778857";
	this.attachEventHandler("Flickr_API_CALL_COMPLETE", callback || this.getPhotoInfoHandler);
	$.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.getInfo&photo_id=" + photoId + "&api_key=3bdd28c7cb805fc97e345cfc6f4bf0b3&format=json&=?");
	//this.deactivateNavButtons();
}

WelcomeWall.FlickrEventsHandler.prototype.getPublicPhotosHandler = function (data){
	console.log("getPublicPhotosHandler");
	console.log(data);
	this.imagesList = data.photos.photo;
	this.removeEventHandler("Flickr_API_CALL_COMPLETE");
	this.getPhotoSizes(data.photos.photo[this.currentImage].id);
	//this.preLoadImages();
}

WelcomeWall.FlickrEventsHandler.prototype.getGroupPhotosHandler = function (data){
	console.log("getGroupPhotosHandler");
	console.log(data);
	this.imagesList = data.photos.photo;
	this.currentPage = 1;
	this.removeEventHandler("Flickr_API_CALL_COMPLETE");
	//this.currentImage = 1;
	this.currentNavAction = this.getNextPhoto;
	this.getPhotoSizes(data.photos.photo[this.currentImage].id);

	
	//this.preLoadImages();
	
	
}

WelcomeWall.FlickrEventsHandler.prototype.getMoreGroupPhotosHandler = function (data){
	console.log("getMoreGroupPhotosHandler");
	console.log(data);
	for(var x in data.photos.photo){
		this.imagesList.push(data.photos.photo[x]);
	}
	this.removeEventHandler("Flickr_API_CALL_COMPLETE");
	this.getPhotoSizes(this.imagesList[this.currentImage].id);
	//this.preLoadImages();
}

WelcomeWall.FlickrEventsHandler.prototype.getPhotoSizesHandler = function (data){
	//console.log("getPhotoSizesHandler");
	//console.log(data);
	this.removeEventHandler("Flickr_API_CALL_COMPLETE");
	this.attachEventHandler("NO_SIZE_FOUND", this.currentNavAction || this.getNextPhoto);
	/*var aspectRatioImage = this.getBestPhotoSizeForGCD(data.sizes.size);
	if(aspectRatioImage) {
		var aspectRatio = this.getAspectRatioForImage(aspectRatioImage);
		console.log(aspectRatio);
	}
	else {
		console.log("No Image found for Aspect Ratio Detection");
	}*/
	var bestSize = this.pullFromImageCache() || this.getBestPhotoSize(data.sizes.size, 1.5);
	var that = this;
	/*if(bestSize) {
		var myRatio = parseInt(bestSize.width) / parseInt(bestSize.height);
		console.log("Ratio: " + myRatio);
		if(myRatio <= 1.5){
			console.log(myRatio <= 1.5);
			var isItTrue = myRatio <= 1.5;
			
			console.log("No Suitable Ratio Found");
			bestSize = undefined;
		}
	}*/
	//console.log(data.sizes.size[data.sizes.size.length-1]);
	if(bestSize){
		//console.log("Size Found");
		//console.log(bestSize.source);
		var newImage = $("<img />").attr({
			src : bestSize.source
		}).one('load', function() { //Set something to run when it finishes loading
          
          that.imageOverlay.fadeIn(function (){
			that.imageContainer.html("");
			that.imageContainer.append(newImage2);
			that.imageOverlay.hide();
			that.activateNavButtons();
			that.getPhotoInfo(that.imagesList[that.currentImage].id);
			
		});
        })
        .each(function() {
          //Cache fix for browsers that don't trigger .load()
          if(this.complete) $(this).trigger('load');
        });

		var newImage2 = $("<img />").attr({
			src : bestSize.source
		});
		this.imageOverlay.html("");
		this.imageOverlay.append(newImage);
		
		this.removeEventHandler("NO_SIZE_FOUND");
		
	}
	else {
		//console.log("No Sizes Found");
		this.broker.trigger("NO_SIZE_FOUND");
		this.removeEventHandler("NO_SIZE_FOUND");
	}
	
}

WelcomeWall.FlickrEventsHandler.prototype.getPhotoSizesForMontageHandler = function (data){
	console.log("getPhotoSizesForMontageHandler");
	this.removeEventHandler("Flickr_API_CALL_COMPLETE");
	this.attachEventHandler("NO_SIZE_FOUND", this.currentNavAction || this.getNextPhoto);

	var bestSize = this.getBestPhotoSizeForMontage(data.sizes.size, 1.5);
	var that = this;

	if(bestSize){
		console.log("Size Found");
		console.log(bestSize.source);
		var newImage = $("<img />").attr({
			src : bestSize.source
		}).one('load', function() { //Set something to run when it finishes loading
        
		that.getPhotoInfo(that.imagesList[that.currentImage].id);
		
        })
        .each(function() {
          //Cache fix for browsers that don't trigger .load()
          if(this.complete) $(this).trigger('load');
        });;
		
	}
	else {
		this.broker.trigger("NO_SIZE_FOUND");
		this.removeEventHandler("NO_SIZE_FOUND");
	}
	
}

WelcomeWall.FlickrEventsHandler.prototype.pullFromImageCache = function () {
	//console.log("pullFromImageCache");
	if(this.currentNavAction === this.getNextPhoto){
		var currentCacheImage = this.currentCacheImage +1;
		//console.log("Proposed Current Cache Image: " + currentCacheImage);
		//console.log("Current Image Cache Length:" + this.imageCache.length);
		if(currentCacheImage >= this.imageCache.cache.length-1){
			this.currentCacheImage=0;
			return this.imageCache.cache[this.currentCacheImage];
		}
		else {
			this.currentCacheImage++;
			return this.imageCache.cache[this.currentCacheImage];
		}
	}

	if(this.currentNavAction === this.getPreviousPhoto){
		var currentCacheImage = this.currentCacheImage -1;
		//console.log("Proposed Current Cache Image: " + currentCacheImage);
		if(currentCacheImage < 0){
			
			return;
		}
		else {
			this.currentCacheImage--;
			return this.imageCache.cache[this.currentCacheImage];
		}
	}


}

WelcomeWall.FlickrEventsHandler.prototype.getPhotoInfoHandler = function (data) {
	//console.log("getPhotoInfoHandler");
	//console.log(data);
	this.removeEventHandler("Flickr_API_CALL_COMPLETE");
	this.captionPanel.html("By: " + ((data.photo.owner.realname==="")? data.photo.owner.username : data.photo.owner.realname));
	this.activateCaptionPanel();
	this.broker.trigger("FLICKR_PANEL_UPDATE_COMPLETE");
	if(this.imageCache.cache.length == 1 || this.imageCache.firstPreloadComplete == false){
		console.log("GETTING MORE MONTAGE IMAGESSSSS");
		this.imageCache.init({
					min: 700,
					max: 800,
					ratio: 1.7,
					numberOfImages: 10,
					currentImage:this.currentImage
				});
	}else if(this.currentCacheImage == this.imageCache.cache.length-5 || !this.imageCache.preloadComplete()){
		console.log("Image Cache almost out of images!  Getting more...");
		//this.imageCache.currentImage = this.currentImage;
		this.imageCache.getMoreImages();
	}
}

WelcomeWall.FlickrEventsHandler.prototype.activateCaptionPanel = function(){
	this.captionPanel.fadeIn();
}

WelcomeWall.FlickrEventsHandler.prototype.deactivateCaptionPanel = function(){
	this.captionPanel.fadeOut();
}

WelcomeWall.FlickrEventsHandler.prototype.getBestPhotoSize = function(sizes, ratio){
	//console.log("Finding best size");
	//console.log(sizes.length-1);
	var image;
	for(var x in sizes){
		var size = parseInt(sizes[x].height);
		//console.log(sizes[x]);
		if(size >= 700 && size < 800){
			//console.log(x);
			image = sizes[x];
			//if(x == sizes.length-1){
				//return sizes[x];
			//}
		}
	}

	if(image){
		var myRatio = parseInt(image.width) / parseInt(image.height);
		if(myRatio <= ratio){
			console.log("No Suitable Ratio Found");
			image = undefined;
		}
		else{
			var isAlreadyThere;
			for(var img in this.imageCache.cache){
				if(this.imageCache.cache[img].source == image.source){
					isAlreadyThere = true;
				}
			}
			if(isAlreadyThere == false) {
				this.imageCache.cache.push(image);
				this.currentCacheImage = this.imageCache.cache.length-1;
			}
			//this.imageCache.cache.push(image);
			
			
		}
	}
	

	return image;
}

WelcomeWall.FlickrEventsHandler.prototype.getBestPhotoSizeForArticle = function(sizes){
	//console.log("Finding best size");
	//console.log(sizes.length-1);
	var image;
	for(var x in sizes){
		var size = parseInt(sizes[x].height);
		//console.log(sizes[x]);
		if(size >= 300 && size <= 500){
			//console.log(x);
			image = sizes[x];
			//if(x == sizes.length-1){
				//return sizes[x];
			//}
		}
	}

	return image;
}

WelcomeWall.FlickrEventsHandler.prototype.getBestPhotoSizeForMontage = function(myObj){
	//console.log("Finding best size");
	//console.log(sizes.length-1);
	console.log("FlickrEventsHandler.getBestPhotoSizeForMontage");
	var image;
	for(var x in myObj.sizes){
		var size = parseInt(myObj.sizes[x].height);
		//console.log(sizes[x]);
		if(size >= myObj.min && size < myObj.max){
			//console.log(x);
			image = myObj.sizes[x];
			//if(x == sizes.length-1){
				//return sizes[x];
			//}
		}
	}

	if(image){
		//console.log("Checking against this ratio: " + myObj.ratio);
		var myRatio = parseInt(image.width) / parseInt(image.height);
		//console.log("Image Ratio: " + myRatio);
		if(myRatio <= (myObj.ratio-0.2) || myRatio >= (myObj.ratio+0.2)){
			console.log("No Suitable Ratio Found");
			image = undefined;
		}
		else{
			//this.imageCache.push(image);
			//this.currentCacheImage = this.imageCache.length-1;
		}
	}


	return image;
}

WelcomeWall.FlickrEventsHandler.prototype.getBestPhotoSizeForMainImageCache = function(myObj){
	//console.log("Finding best size");
	//console.log(sizes.length-1);
	//console.log("FlickrEventsHandler.getBestPhotoSizeForMainImageCache");
	var image;
	this.CheckSizeForHorizontalImageCache1(myObj);
	this.CheckSizeForHorizontalImageCache2(myObj);
	this.CheckSizeForVerticalImageCache(myObj);
	for(var x in myObj.sizes){
		var size = parseInt(myObj.sizes[x].height);
		//console.log(sizes[x]);
		if(size >= myObj.min && size < myObj.max){
			//console.log(x);
			image = myObj.sizes[x];
			//if(x == sizes.length-1){
				//return sizes[x];
			//}
		}
	}

	if(image){
		//console.log("Checking against this ratio: " + myObj.ratio);
		var myRatio = parseInt(image.width) / parseInt(image.height);
		//console.log("Image Ratio: " + myRatio);
		if(myRatio <= myObj.ratio){
			console.log("No Suitable Ratio Found");
			image = undefined;
		}
		else{
			//this.imageCache.push(image);
			//this.currentCacheImage = this.imageCache.length-1;
		}
	}


	return image;
}



WelcomeWall.FlickrEventsHandler.prototype.getBestPhotoSizeForGCD = function(sizes){
	//console.log("Finding best size");
	//console.log(sizes.length-1);
	var image;
	for(var x in sizes){
		var size = parseInt(sizes[x].height);
		//console.log(sizes[x]);
		if(size >= 500 && size <= 800){
			//console.log(x);
			image = sizes[x];
			//if(x == sizes.length-1){
				//return sizes[x];
			//}
		}
	}

	return image;
}

WelcomeWall.FlickrEventsHandler.prototype.preLoadImages = function (){
	for(var x in this.imagesList){
		this.getPhotoSizes(this.imagesList[x].id, this.preLoadImagesEventHandler);
	}
}

WelcomeWall.FlickrEventsHandler.prototype.preLoadImagesEventHandler = function(data){
	console.log("preLoadImagesEventHandler");
	console.log(data);
	this.removeEventHandler("Flickr_API_CALL_COMPLETE");
	var bestSize = this.getBestPhotoSize(data.sizes.size);
	var that = this;
	//console.log(data.sizes.size[data.sizes.size.length-1]);
	if(bestSize){
		console.log("Size Found");
		var newImage = $("<img />").attr({
			src : bestSize.source
		});
		this.imagePreloader.append(newImage);
		this.removeEventHandler("NO_SIZE_FOUND");
	}
	else {
		console.log("No Sizes Found");
		//this.broker.trigger("NO_SIZE_FOUND");
	}
}

WelcomeWall.FlickrEventsHandler.prototype.getNextPhoto = function(){
	//console.log("Getting Next Image");
	this.currentImage++;
	if(this.currentImage === this.imagesList.length-100){
		console.log("Current Image: " + this.currentImage);
		this.getMoreGroupPhotos();
	}
	else{
		//console.log("Current Image: " + this.currentImage);
		this.getPhotoSizes(this.imagesList[this.currentImage].id);
		this.deactivateNavButtons();
	}
	
}

WelcomeWall.FlickrEventsHandler.prototype.getPhotoForMontage = function (myObj) {
	//console.log("Getting Photo For Montage");
	var myObj = myObj || this.tempMyObj;
	this.tempMyObj = myObj;
	var that = this;
	//console.log(this);
	//console.log("This is my Object!");
	//console.log(myObj);
	WelcomeWall.montageManager.currentImage++;
	var currentImage = WelcomeWall.montageManager.currentImage;
	var imagesLoaded = myObj.imagesLoaded;
	console.log("Current Image: " + currentImage);
	
	if(currentImage === this.imagesList.length-100){
		console.log("Current Image: " + currentImage);
		this.tempMyObj = myObj;
		this.getMoreGroupPhotos({callback:(function(myObj, scope){
			var that = scope;
			return function(data){
				console.log(that.imagesList.length);
				for(var x in data.photos.photo){
					that.imagesList.push(data.photos.photo[x]);
				}
				console.log(that.imagesList.length);
				that.removeEventHandler("Flickr_API_CALL_COMPLETE");
				that.getPhotoForMontage(myObj);
			}
		})(myObj, this)});
	}
	else{

		this.getPhotoSizesForMontage(this.imagesList[currentImage].id, (function (scope, myObj){
			return function(data){
						//console.log(scope);
						//console.log("And This is my Object!");
						//console.log(myObj);
						//console.log("Number of Images Loaded");
						//console.log(myObj.imagesLoaded);
						that = scope;
						that.removeEventHandler("Flickr_API_CALL_COMPLETE");
						//that.attachEventHandler("NO_SIZE_FOUND", that.getPhotoForMontage, [myObj]);
						//console.log("My Object");
						//console.log(myObj);
						//console.log(data);
						var bestSize = that.getBestPhotoSizeForMontage({
																		sizes:data.sizes.size, 
																		ratio:myObj[imagesLoaded].ratio,
																		min:myObj[imagesLoaded].min,
																		max:myObj[imagesLoaded].max
																	});
						//console.log("Best Size");
						//console.log(bestSize);
						var that = this;

						if(bestSize){
							//console.log("Size Found for image " + myObj.imagesLoaded);
							//console.log(bestSize.source);
							myObj[imagesLoaded].image = bestSize;
							myObj.imagesLoaded++;
							if(myObj.imagesLoaded == myObj.numberOfImages){
								console.log("ALL IMAGES LOADED");
								myObj.scope.updatePanelHandler.apply(myObj.scope, [myObj]);
								return myObj;
							}
							else {
								that.getPhotoForMontage(myObj);
							}
							
						}
						else {
							console.log("No Size Found");
							that.getPhotoForMontage(myObj);
						}
					}
		})(that, myObj));
	}
}

WelcomeWall.FlickrEventsHandler.prototype.getPhotosForCache = function (myObj) {
	//console.log("getPhotosForCache");
	var myObj = myObj || this.tempMyObj;
	this.tempMyObj = myObj;
	var that = this;
	//console.log(this);
	//console.log("This is my Object!");
	//console.log(myObj);
	myObj.cache.currentImage++;
	var currentImage = myObj.cache.currentImage;
	var imagesLoaded = myObj.imagesLoaded;
	//console.log(myObj);
	//console.log("Images Queried: " + currentImage);
	
	if(currentImage === this.imagesList.length-100){
		//console.log("Current Image: " + currentImage);
		this.tempMyObj = myObj;
		this.getMoreGroupPhotos({callback:(function(myObj, scope){
			var that = scope;
			return function(data){
				//console.log("CallBack after getting more group photos for cache");
				//console.log(that.imagesList.length);
				for(var x in data.photos.photo){
					that.imagesList.push(data.photos.photo[x]);
				}
				//console.log(that.imagesList.length);
				that.removeEventHandler("Flickr_API_CALL_COMPLETE");
				that.getPhotosForCache(myObj);
			}
		})(myObj, this)});
	}
	else{

		this.getPhotoSizesForMontage(this.imagesList[currentImage].id, (function (scope, myObj){
			return function(data){
						//console.log(scope);
						//console.log("And This is my Object!");
						//console.log(myObj);
						//console.log(myObj.imagesLoaded + "/" + myObj.numberOfImages + " images Loaded");
						that = scope;
						that.removeEventHandler("Flickr_API_CALL_COMPLETE");
						//that.attachEventHandler("NO_SIZE_FOUND", that.getPhotoForMontage, [myObj]);
						//console.log("My Object");
						//console.log(myObj);
						//console.log(data);
						var bestSize = that.getBestPhotoSizeForMainImageCache({
																		sizes:data.sizes.size, 
																		ratio:myObj.ratio,
																		min:myObj.min,
																		max:myObj.max
																	});
						//console.log("Best Size");
						//console.log(bestSize);
						var that = this;

						if(bestSize){
							//console.log("Size Found for image " + myObj.imagesLoaded);
							//console.log(bestSize.source);
							myObj.cache.cache.push(bestSize);
							if(that.imageCache.cache.length == 10){
								that.activateNavButtons();
							}
							myObj.imagesLoaded++;
							that.imageCache.updateStatusDisplay({
								imagesLoaded:myObj.imagesLoaded,
								numberOfImages:myObj.numberOfImages
							});
							if(myObj.imagesLoaded >= myObj.numberOfImages && that.imageCache.preloadComplete() == true){
								console.log("ALL IMAGES LOADED");
								//myObj.scope.updatePanelHandler.apply(myObj.scope, [myObj]);
								return myObj;
							}
							else {
								that.getPhotosForCache(myObj);
							}
							
						}
						else {
							//console.log("No Size Found");
							that.getPhotosForCache(myObj);
						}
					}
		})(that, myObj));
	}
}

WelcomeWall.FlickrEventsHandler.prototype.getPreviousPhoto = function(){
	this.currentImage--;
	this.getPhotoSizes(this.imagesList[this.currentImage].id);
	this.deactivateNavButtons();
}

WelcomeWall.FlickrEventsHandler.prototype.getRandomPhotoForElement = function(element){ 
	console.log("getRandomPhotoForElement");
	var randomImageNumber = Math.floor((Math.random()*this.imagesList.length-1)+1);
	console.log(randomImageNumber);
	this.tempElement = element;
	this.getPhotoSizes(this.imagesList[randomImageNumber].id, this.getRandomPhotoForElementHandler);
	
}

WelcomeWall.FlickrEventsHandler.prototype.getAspectRatioForImage = function(image){ 
	console.log("getAspectRatioForImage");
	var gcd = this.getGCD(parseInt(image.width), parseInt(image.height));
	console.log("Width: " + image.width);
	console.log("Height: " + image.height);
	console.log("GCD: " + gcd);
	//var aspectRatio = image.width/gcd + ":" + image.height/gcd;
	var aspectRatio = parseInt(image.width) / parseInt(image.height);
	return aspectRatio;
	
}

WelcomeWall.FlickrEventsHandler.prototype.getGCD = function(a,b) {
	return (b == 0) ? a : this.getGCD (b, a%b);
}

WelcomeWall.FlickrEventsHandler.prototype.getRandomPhotoForElementHandler = function(data){
	console.log("getRandomPhotoForElementHandler");

	var bestSize = this.getBestPhotoSizeForArticle(data.sizes.size);
	var that = this;
	//console.log(data.sizes.size[data.sizes.size.length-1]);
	if(bestSize){
		console.log("Size Found");
		var newImage = $("<img />").attr({
			src : bestSize.source
		});
		this.tempElement[0].append(newImage);
		var newImage2 = $("<img />").attr({
			src : bestSize.source
		});
		this.tempElement[1].append(newImage2);
		this.removeEventHandler("NO_SIZE_FOUND");
	}
	else {
		console.log("No Sizes Found");
		//this.broker.trigger("NO_SIZE_FOUND");
	}
}

WelcomeWall.FlickrEventsHandler.prototype.CheckSizeForHorizontalImageCache1 = function(myObj){
	var image;
	for(var x in myObj.sizes){
		var size = parseInt(myObj.sizes[x].height);
		//console.log(sizes[x]);
		if(size >= 450 && size < 550){
			//console.log(x);
			image = myObj.sizes[x];
			//if(x == sizes.length-1){
				//return sizes[x];
			//}
		}
	}

	if(image){
		var myRatio = parseInt(image.width) / parseInt(image.height);
		var ratio = 1.7;
		if(myRatio <= (ratio-0.2) || myRatio >= (ratio+0.2)){
			image = undefined;
		}
		else{
			//this.imageCache.push(image);
			//this.currentCacheImage = this.imageCache.length-1;
		}
	}

	if(image){
		console.log("Adding Image to Horizontal Image Cache 1");
		var isAlreadyThere;
		for(var img in this.imageCache.horizontalCache1){
			if(this.imageCache.horizontalCache1[img].source == image.source){
				isAlreadyThere = true;
			}
		}
		if(isAlreadyThere == false) {
			this.imageCache.horizontalCache1.push(image);
		}
		//this.imageCache.horizontalCache1.push(image);
	}
}

WelcomeWall.FlickrEventsHandler.prototype.CheckSizeForHorizontalImageCache2 = function(myObj){
	var image;
	for(var x in myObj.sizes){
		var size = parseInt(myObj.sizes[x].height);
		//console.log(sizes[x]);
		if(size >= 450 && size < 550){
			//console.log(x);
			image = myObj.sizes[x];
			//if(x == sizes.length-1){
				//return sizes[x];
			//}
		}
	}

	if(image){
		var myRatio = parseInt(image.width) / parseInt(image.height);
		var ratio = 2.2;
		if(myRatio <= (ratio-0.2) || myRatio >= (ratio+0.2)){
			image = undefined;
		}
		else{
			//this.imageCache.push(image);
			//this.currentCacheImage = this.imageCache.length-1;
		}
	}

	if(image){
		console.log("Adding Image to Horizontal Image Cache 2");
		var isAlreadyThere;
		for(var img in this.imageCache.horizontalCache2){
			if(this.imageCache.horizontalCache2[img].source == image.source){
				isAlreadyThere = true;
			}
		}
		if(isAlreadyThere == false) {
			this.imageCache.horizontalCache2.push(image);
		}
	}
}

WelcomeWall.FlickrEventsHandler.prototype.CheckSizeForVerticalImageCache = function(myObj){
	var image;
	for(var x in myObj.sizes){
		var size = parseInt(myObj.sizes[x].height);
		//console.log(sizes[x]);
		if(size >= 850 && size < 950){
			//console.log(x);
			image = myObj.sizes[x];
			//if(x == sizes.length-1){
				//return sizes[x];
			//}
		}
	}

	if(image){
		var myRatio = parseInt(image.width) / parseInt(image.height);
		var ratio = 0.7;
		if(myRatio <= (ratio-0.2) || myRatio >= (ratio+0.2)){
			image = undefined;
		}
		else{
			//this.imageCache.push(image);
			//this.currentCacheImage = this.imageCache.length-1;
		}
	}

	if(image){
		console.log("Adding Image to Vertical Image Cache");
		var isAlreadyThere;
		for(var img in this.imageCache.verticalCache){
			if(this.imageCache.verticalCache[img].source == image.source){
				isAlreadyThere = true;
			}
		}
		if(isAlreadyThere == false) {
			this.imageCache.verticalCache.push(image);
		}
		
	}
}

WelcomeWall.ImageCache.prototype.getMontageImage = function(myObj){
	
	//return WelcomeWall.flickrEventsHandler.imageCache.cache[0];
	//console.log("Getting Montage Image");
	//console.log(myObj);
	//console.log(this[myObj.cache]);
	//console.log(this[myObj.currentImage]);
	//this[myObj.currentImage]++;
	//return this[myObj.cache][this[myObj.currentImage]];
	//if(this.checkImageCount){
		//console.log(myObj);
		this[myObj.currentImage]++;
		if(this[myObj.currentImage] >= this[myObj.cache].length-1){
			this[myObj.currentImage] = 0;
		}
		return this[myObj.cache][this[myObj.currentImage]];
	//}
	//else {
		//WelcomeWall.flickrEventsHandler.attachEventHandler("PRELOAD_COMPLETE", (function (myObj, scope){
		//														return function(){
		//															scope.getMontageImage(myObj);
		//														}
		//															})(myObj, this));
		//this.preLoadImages();

	//}
	
}

WelcomeWall.ImageCache.prototype.getImagesFromList = function(imageList){
	var myImageList = {};
	for(var x in imageList){
		var newImage = this.getMontageImage(imageList[x]);
		if(newImage){
			myImageList[x] = newImage;
		}
		else{
			return newImage;
		}
		
	}

	return myImageList;
}

WelcomeWall.ImageCache.prototype.checkImageCount = function(myObj){
	if(this.currentVerticalCacheImage >= this.verticalCache.length-this.numberOfVerticalImages){
		this.preloadIsComplete = false;
		this.preloadImages();
		return false;
	}

	if(this.currentHoriztonalCache1Image >= this.horizontalCache1.length-this.numberOfHorizontal1Images){
		this.preloadIsComplete = false;
		this.preloadImages();
		return false;
	}

	if(this.currentHoriztonalCache2Image >= this.horizontalCache2.length-this.numberOfHorizontal2Images){
		this.preloadIsComplete = false;
		this.preloadImages();
		return false;
	}

	return true;
}