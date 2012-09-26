/* Author:

*/

var WelcomeWall = {
	TileGroup : function(){
		this.currentTile;
	},
	tileGroups : {}

}

var tileGroup1Current;
var tileGroup2Current;
var tileGroup3Current;
var tileGroup4Current;

$(document).ready(function (){
	for(var x=0;x<=4;x++){

	}

	$("tile").click(function (){
		flipTile($(this));
	});

	$(".glass-panel").each(function (){
		bindGlassPanel($(this));
	});


	//$.getJSON("http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&photoset_id=72157631528268528&api_key=3bdd28c7cb805fc97e345cfc6f4bf0b3&format=json&=?", function(data){
	//	console.log(data);
	//});

	parseRSS("http://api.flickr.com/services/feeds/groups_pool.gne?id=554802@N25&lang=en-us&format=rss_200", displayFlickrFeed);

});

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
	console.log("Firing transition");
	console.log($(element));
	var myArticleNumber = $(element).attr("article");
	var myTileNumber = $(element).parent().attr("tile");
	$(element).parent().parent().attr("currentTile", myTileNumber);
	//console.log($("articlecontainer[article="+myArticleNumber+"] tile"));

	if($(element).hasClass("flipped")){
		
	}
	else {
		$(element).addClass("flipped");
		$(element).parent().css({"z-index":"200"});
	}

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
