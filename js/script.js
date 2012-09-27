/* Author:

*/

var bindContext = function (fn, context, arguments) {
	if(arguments){
		console.log("Binder Log");
		console.log(arguments);
		console.log(context);
		console.log(fn);
	}
	return function () {
		fn.apply(context, arguments);
	};
};

var WelcomeWall = {
	Tile : function(tileNumber){
		this.tileNumber = tileNumber;
		this.element = $("<tile />");
		this.element.attr("tile", tileNumber);
		this.container = $("<tilecontainer />").attr("tile", tileNumber).append(this.element);
		this.frontFace = $("<face />").addClass("front").appendTo(this.element);
		this.backFace = $("<face />").addClass("back").appendTo(this.element);

		this.init = function (){
			//console.log("Tile Init");
			this.container.click(bindContext(this.clickHandler, this));
		}
	},
	TileGroup : function(){
		this.element = $("<tilegroup />");
		this.container = $("<tilegroupcontainer />").append(this.element);
		this.currentTile;
		this.tiles = {};

		this.init = function (){
			var that = this;
			this.groupEvents = _.extend({}, Backbone.Events);
			this.groupEvents.on("TILE_CLICKED", function(e){
				console.log("A tile was clicked");
				//console.log(e);
				that.flipTile(e);
			});
			this.groupEvents.on("TILE_FLIP_COMPLETE", function (e){
				that.activateArticleNavButtons();
				that.activateNavButtons();
			})
			this.groupEvents.on("TILE_RESET", function(e){
				console.log("A tile was reset");
				//console.log(e);
				that.sendTileToBack(e);
			});
			for(var x=1; x<=4;x++){
				var tile = new WelcomeWall.Tile(x);
				tile.broker = this.groupEvents;
				this.tiles[x] = tile;
				this.element.append(tile.container);
				tile.init();
			}
			this.tileReadMoreButton = $("<div />").attr({"class":"article-button readmore"});
			this.tileCloseButton = $("<div />").attr({"class":"article-button close"});
			this.element.append(this.tileReadMoreButton);
			this.element.append(this.tileCloseButton);

			this.nextButton = $("<div />").attr({"class":"tile-nav-button next"});
			this.previousButton = $("<div />").attr({"class":"tile-nav-button previous"});
			this.element.append(this.nextButton);
			this.element.append(this.previousButton);
		}

	},
	Article : function (articleNumber){
		this.element = $("<articlecontainer />");
		this.container = this.element;
		this.tileGroup = new WelcomeWall.TileGroup();
		this.frontFace = $("<articleface />").addClass("front");
		this.backFace = $("<articleface />").addClass("back");
		this.articleIframe = $("<iframe />").attr({
			src: "",
			height:"90%",
			width:"100%",
			frameborder:"0"
		});
		this.backFace.append(this.articleIframe).appendTo(this.element);
		this.frontFace.append(this.tileGroup.container).appendTo(this.element);


		this.init = function (){
			this.tileGroup.init();
		}
	},
	ArticlePanel : function(panelNumber){
		this.container = $("<div />").attr({
			role:"panel-"+panelNumber
		});
		this.article;
		this.init = function (){
			console.log("Aritcle Panel Init");
			for(var x=1; x<=2;x++){
				var article = new WelcomeWall.Article(x);
				this.article = article;
				this.container.append(article.container);
				article.init();
			}
		}
	},

	
	
	init: function(){
		this.panel2 = new this.ArticlePanel(2);
		$(this.panel2.container).insertAfter("header");
		this.panel2.init();
	}

}

WelcomeWall.TileGroup.prototype.flipTile = function (tileNumber){
	console.log("Flipping Tile: " + tileNumber);
	this.bringTileToFront(tileNumber);
	this.currentTile = tileNumber;
	//console.log(this.tiles[tileNumber].backFace.offset().top);
	//var topPos = this.tiles[tileNumber].backFace.offset().top + 330;
	//var leftPos = this.tiles[tileNumber].backFace.offset().left - 30;
	//this.tileReadMoreButton.css({"top":topPos, "left":leftPos}).show();
	//his.tileCloseButton.css({"top":topPos, "left":(leftPos + 100)}).show();
	
	
}

WelcomeWall.TileGroup.prototype.activateArticleNavButtons = function (){
	this.tileReadMoreButton.fadeIn();
	this.tileCloseButton.fadeIn();
	this.tileCloseButton.click(bindContext(this.closeButtonClickHandler, this, this.currentTile));
}

WelcomeWall.TileGroup.prototype.deactivateArticleNavButtons = function (){
	this.tileReadMoreButton.hide();
	this.tileCloseButton.hide();
	this.tileCloseButton.unbind();
}

WelcomeWall.TileGroup.prototype.activateNavButtons = function (){
	console.log(this.nextButton);
	this.nextButton.fadeIn();
	this.previousButton.fadeIn();
	this.nextButton.click(bindContext(this.nextButtonClickHandler, this, this.currentTile));
	this.previousButton.click(bindContext(this.previousButtonClickHandler, this, this.currentTile));
}

WelcomeWall.TileGroup.prototype.deactivateNavButtons = function (){
	this.nextButton.hide();
	this.previousButton.hide();
	this.unBindNavButtons();
}

WelcomeWall.TileGroup.prototype.unBindNavButtons = function () {
	this.nextButton.unbind()
	this.previousButton.unbind();
}

WelcomeWall.TileGroup.prototype.resetCurrentTile = function(tileNumber){
	console.log("Resetting Tile: " + tileNumber);
	
	this.tiles[this.currentTile].reset();

}

WelcomeWall.TileGroup.prototype.bringTileToFront = function(tileNumber){
	this.tiles[tileNumber].container.css({"z-index":"200"});
}

WelcomeWall.TileGroup.prototype.sendTileToBack = function(tileNumber){
	console.log(tileNumber);
	this.tiles[tileNumber].container.css({"z-index":""});
}


WelcomeWall.TileGroup.prototype.nextButtonClickHandler = function (){
	this.unBindNavButtons();
	this.deactivateArticleNavButtons();
	this.groupEvents.on("TILE_RESET:NAV", bindContext(this.goToNextTile, this));
	this.resetCurrentTile();
}

WelcomeWall.TileGroup.prototype.previousButtonClickHandler = function (){
	this.unBindNavButtons();
	this.deactivateArticleNavButtons();
	this.groupEvents.on("TILE_RESET:NAV", bindContext(this.goToPreviousTile, this));
	this.resetCurrentTile();
}

WelcomeWall.TileGroup.prototype.closeButtonClickHandler = function(){

	this.deactivateArticleNavButtons();
	this.deactivateNavButtons();
	this.resetCurrentTile();
}

WelcomeWall.TileGroup.prototype.goToNextTile = function (){
	this.groupEvents.off("TILE_RESET:NAV");
	var currentTileNumber = parseInt(this.currentTile);
	var nextTile;
	if(currentTileNumber == 4){
		nextTile = 1;
	}
	else {
		nextTile = currentTileNumber +1;
	}
	this.flipTile(nextTile)
	this.tiles[nextTile].flip();
}

WelcomeWall.TileGroup.prototype.goToPreviousTile = function (){
	this.groupEvents.off("TILE_RESET:NAV");
	var currentTileNumber = parseInt(this.currentTile);
	var nextTile;
	if(currentTileNumber == 1){
		nextTile = 4;
	}
	else {
		nextTile  = currentTileNumber -1;;
	}
	this.flipTile(nextTile)
	this.tiles[nextTile].flip();
}

WelcomeWall.Tile.prototype.clickHandler = function (){
	this.broker.trigger("TILE_CLICKED", this.tileNumber);
	this.flip();
}

WelcomeWall.Tile.prototype.flip = function (){
	var that = this;
	this.element.transition({
		rotateX: '180deg',
		perspective: '1000px'
	}, function (){
		that.broker.trigger("TILE_FLIP_COMPLETE", that.tileNumber);
	});
}

WelcomeWall.Tile.prototype.reset = function (){
	var that = this;
	this.element.transition({
		rotateX: '0deg',
		perspective: '1000px'
	}, function (){
		that.broker.trigger("TILE_RESET", that.tileNumber);
		that.broker.trigger("TILE_RESET:NAV", that.tileNumber);
	});
}



function bindGlassPanel(element){
	$(element).children(".panel-container").children(".panel.front").children(".open-button").click(function (){
		$(this).unbind();
		//$(element).children(".panel-container").children(".panel.front").children(".open-button").hide();
		//$(element).children(".panel-container").children(".panel.front").children(".agenda-button").hide();
		$(element).transition({
				rotateX: '180deg',
				perspective: '500px'
			}, function (){
				$(this).children(".panel-container").children(".panel.back").children(".hide-button").click(function(){
					$(element).transition({
						rotateX: '0deg',
						perspective: '500px'}, function (){
							bindGlassPanel(element);
					});
					$(this).unbind();
				});
			});
	});
}

function parseRSS(url, callback) {
	  $.ajax({
	    url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(url),
	    dataType: 'json',
	    success: function(data) {
	      callback(data.responseData.feed);
	    }
	  });
}

function jsonFlickrApi(data){
	console.log("jsonFlickrApi Thing");
	console.log(data);
}

function displayFlickrFeed(data){
	console.log("Displaying flickr Feed");
	console.log(data);
}

function flipTile(element){
	

	$(element).transition({
		rotateX: '180deg',
		perspective: '1000px'
	}, function (){
	//console.log($(element).children("face.back").children("tilefacecontent").offset());
	//console.log($(element).children("face.back").children("tilefacecontent").width());
	//console.log($(element).children("face.back").children("tilefacecontent").height());
	activateTileNavButtons(myArticleNumber);

	var topPos = ($(element).children("face.back").children("tilefacecontent").offset().top + $(element).children("face.back").children("tilefacecontent").height()) - 20;
	var leftPos = ($(element).children("face.back").children("tilefacecontent").offset().left + $(element).children("face.back").children("tilefacecontent").width()) - 560;
	var readMoreButton = $(".article-button.readmore[article="+myArticleNumber+"]");
	var closeButton = $(".article-button.close[article="+myArticleNumber+"]");

	readMoreButton.offset({top:topPos, left: leftPos});
	readMoreButton.fadeIn();
		//Remove all click events from tiles
		console.log("yo");
		console.log($("articlecontainer[article="+myArticleNumber+"] tile"));
		$("articlecontainer[article="+myArticleNumber+"] tile").unbind();

		readMoreButton.click(function(){
			$(".article-button.readmore[article="+myArticleNumber+"]").hide();
			$(".article-button.close[article="+myArticleNumber+"]").hide();
			
			//On click, flip the tile over again
			$(element).transition({
				rotateX: '0deg',
				perspective: '100px'
			}, function (){
				$("articlecontainer[article="+myArticleNumber+"] tile").css({"-webkit-transform-style": "flat"});
				console.log($(element).attr("articleSource"));
				$("articlecontainer[article="+myArticleNumber+"] articleface.back iframe").attr("src", $(element).attr("articleSource"));
				flipArticle($(element).attr("article"));
			});
			
			
		});

		closeButton.offset({top:topPos, left: leftPos+90});
		closeButton.fadeIn();

		closeButton.click(function (){
			
			resetTile(element, myArticleNumber);
			deactivateTileNavButtons(myArticleNumber);
		});
	});

	
}

function resetTile(element, articleNumber){
	console.log("Resetting Tile");
	console.log($(element));
	if($(element).hasClass("flipped")){
		$(element).removeClass("flipped");
	}
	else {
		
	}

	$(".article-button.readmore[article="+articleNumber+"]").offset({top:0, left: 0});
	$(".article-button.readmore[article="+articleNumber+"]").hide();
	$(".article-button.readmore[article="+articleNumber+"]").unbind();


	$(".article-button.close[article="+articleNumber+"]").offset({top:0, left: 0});
	$(".article-button.close[article="+articleNumber+"]").hide();
	$(".article-button.close[article="+articleNumber+"]").unbind();

	

	$(element).transition({
		rotateX: '0deg',
		perspective: '100px'
	}, function (){
		$(element).parent("tilecontainer").css({"z-index":""});
		bindTiles(articleNumber);
	});
}


function flipArticle(articleNumber){
	console.log("Showing article: " + articleNumber);
	$("articlecontainer[article="+articleNumber+"] tile").removeClass("flipped");

	$("articlecontainer[article="+articleNumber+"]").show();
	$("articlecontainer[article="+articleNumber+"]").transition({
		rotateY: '180deg',
		perspective: '1000px'
	}, 500,  function(){
		var topPos = $(this).height() - 500;
		var leftPos = $(this).width();
		$(".article-button.close[article="+articleNumber+"]").offset({top: topPos, left: leftPos});
		$(".article-button.close[article="+articleNumber+"]").fadeIn();
		$(".article-button.close[article="+articleNumber+"]").unbind();
		$(".article-button.close[article="+articleNumber+"]").click(function (){
			resetArticle(articleNumber);
		});
		
	});
}

function resetArticle(articleNumber){
	$(".article-button.close").hide();
	$(".article-button.close").unbind();
	$("articlecontainer[article="+articleNumber+"]").transition({
		rotateY: '0deg',
		perspective: '1000px'
	}, 500,  function(){
		$("articlecontainer[article="+articleNumber+"] tilecontainer").css({"z-index":""});
		bindTiles(articleNumber);
		
	});
}

function bindTiles(articleNumber){
	$("articlecontainer[article="+articleNumber+"] tile").css({"-webkit-transform-style": "preserve-3d"}); 
	$("articlecontainer[article="+articleNumber+"] tile").click(function (){
			flipTile($(this));
	});
}

function activateTileNavButtons(articleNumber){
	$(".tile-nav-button.next[article="+articleNumber+"]").fadeIn();
	$(".tile-nav-button.next[article="+articleNumber+"]").unbind();
	$(".tile-nav-button.next[article="+articleNumber+"]").click(function(){
		goToNextTile(articleNumber);
	});

	$(".tile-nav-button.previous[article="+articleNumber+"]").fadeIn();
	$(".tile-nav-button.previous[article="+articleNumber+"]").unbind();
	$(".tile-nav-button.previous[article="+articleNumber+"]").click(function(){
		goToPreviousTile(articleNumber);
	});
}

function deactivateTileNavButtons(articleNumber){
	$(".tile-nav-button.next[article="+articleNumber+"]").fadeOut();
	$(".tile-nav-button.next[article="+articleNumber+"]").unbind();

	$(".tile-nav-button.previous[article="+articleNumber+"]").fadeOut();
	$(".tile-nav-button.previous[article="+articleNumber+"]").unbind();
}

function goToNextTile(articleNumber){
	console.log(articleNumber);
	var currentTileNumber = $("articlecontainer[article="+articleNumber+"] tilegroupcontainer tilegroup").attr("currentTile");
	var currentTile = $("articlecontainer[article="+articleNumber+"] tilecontainer[tile="+currentTileNumber+"] tile");
	console.log(currentTileNumber);
	console.log(currentTile);
	
	currentTileNumber = parseInt(currentTileNumber);
	
	var nextTile;
	if(currentTileNumber == 4){
		nextTile = $("articlecontainer[article="+articleNumber+"] tilecontainer[tile="+1+"] tile");
	}
	else {
		currentTileNumber = currentTileNumber +1;
		nextTile = $("articlecontainer[article="+articleNumber+"] tilecontainer[tile="+currentTileNumber+"] tile");
	}

	flipTile(nextTile);
	resetTile(currentTile, articleNumber);
}

function goToPreviousTile(articleNumber){
	console.log(articleNumber);
	var currentTileNumber = $("articlecontainer[article="+articleNumber+"] tilegroupcontainer tilegroup").attr("currentTile");
	var currentTile = $("articlecontainer[article="+articleNumber+"] tilecontainer[tile="+currentTileNumber+"] tile");
	console.log(currentTileNumber);
	console.log(currentTile);
	
	currentTileNumber = parseInt(currentTileNumber);
	
	var nextTile;
	if(currentTileNumber == 1){
		nextTile = $("articlecontainer[article="+articleNumber+"] tilecontainer[tile="+4+"] tile");
	}
	else {
		currentTileNumber = currentTileNumber -1;
		nextTile = $("articlecontainer[article="+articleNumber+"] tilecontainer[tile="+currentTileNumber+"] tile");
	}

	flipTile(nextTile);
	resetTile(currentTile, articleNumber);
}
