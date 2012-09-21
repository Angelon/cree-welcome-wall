/* Author:

*/

$(document).ready(function (){
	$("tile").click(function (){
		flipTile($(this));
	});
});

function flipTile(element){
	console.log("Firing transition");
	//console.log($(element));
	var myArticleNumber = $(element).attr("article");
	console.log($("articlecontainer[article="+myArticleNumber+"] tile"));

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

	var topPos = ($(element).children("face.back").children("tilefacecontent").offset().top + $(element).children("face.back").children("tilefacecontent").height()) - 30;
	var leftPos = ($(element).children("face.back").children("tilefacecontent").offset().left + $(element).children("face.back").children("tilefacecontent").width()) - 350;
	var readMoreButton = $(".article-button.readmore[article="+myArticleNumber+"]");
	var closeButton = $(".article-button.close[article="+myArticleNumber+"]");

	readMoreButton.offset({top:topPos, left: leftPos});
	readMoreButton.fadeIn();
		//Remove all click events from tiles
		$("articlecontainer[article="+myArticleNumber+"] tile").unbind();

		readMoreButton.click(function(){
			$(".article-button.readmore").hide();
			$(".article-button.close").hide();
			
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

		closeButton.offset({top:topPos, left: leftPos+200});
		closeButton.fadeIn();

		closeButton.click(function (){
			
			resetTile(element, myArticleNumber);
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

	$(".article-button.readmore").offset({top:0, left: 0});
	$(".article-button.readmore").hide();
	$(".article-button.readmore").unbind();


	$(".article-button.close").offset({top:0, left: 0});
	$(".article-button.close").hide();
	$(".article-button.close").unbind();

	

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
		$(".article-button.close").offset({top: topPos, left: leftPos});
		$(".article-button.close").fadeIn();
		$(".article-button.close").unbind();
		$(".article-button.close").click(function (){
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

