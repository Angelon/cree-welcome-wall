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
});

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
		$("articlecontainer[article="+articleNumber+"] tilecontainer").css({"z-index":""});
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
	resetTile(currentTile, articleNumber);
	var nextTile;
	if(currentTileNumber == 4){
		nextTile = $("articlecontainer[article="+articleNumber+"] tilecontainer[tile="+1+"] tile");
	}
	else {
		currentTileNumber = currentTileNumber +1;
		nextTile = $("articlecontainer[article="+articleNumber+"] tilecontainer[tile="+currentTileNumber+"] tile");
	}

	flipTile(nextTile);
}

function goToPreviousTile(articleNumber){
	console.log(articleNumber);
	var currentTileNumber = $("articlecontainer[article="+articleNumber+"] tilegroupcontainer tilegroup").attr("currentTile");
	var currentTile = $("articlecontainer[article="+articleNumber+"] tilecontainer[tile="+currentTileNumber+"] tile");
	console.log(currentTileNumber);
	console.log(currentTile);
	currentTileNumber = parseInt(currentTileNumber);
	resetTile(currentTile, articleNumber);
	var nextTile;
	if(currentTileNumber == 1){
		nextTile = $("articlecontainer[article="+articleNumber+"] tilecontainer[tile="+4+"] tile");
	}
	else {
		currentTileNumber = currentTileNumber -1;
		nextTile = $("articlecontainer[article="+articleNumber+"] tilecontainer[tile="+currentTileNumber+"] tile");
	}

	flipTile(nextTile);
}
