/* Author:

*/

$(document).ready(function (){
	$("tile").click(function (){
		flipTile($(this));
	});
});

function flipTile(element){
	console.log("Firing transition");

	if($(element).hasClass("flipped")){
		
	}
	else {
		$(element).addClass("flipped");
		//$(element).parent().css({"z-index":"200"});
	}

	$(element).transition({
		rotateX: '180deg',
		perspective: '100px'
	}, function (){
		$("tile").unbind();
		console.log($(this).children("face.back").children(".readmore"));
		//$(this).children("face.back").children(".readmore").css({"z-index":8000});
		$(element).parents("tilegroupcontainer").click(function(){
			console.log("Fipping...");
			$(element).transition({
				rotateX: '0deg',
				perspective: '100px'
			}, function (){
				
			});
			flipArticle($(this).attr("article"));
			
		});
	});

	
}


function flipArticle(articleNumber){
	$("tile").removeClass("flipped");
	

	console.log("Flipping Article: " + articleNumber);
	$("articlecontainer articleface.back").show();
	$("articlecontainer articleface.front").transition({
		rotateY: '180deg',
		perspective: '1000px'
	}, 500, "linear", function(){
		//$(this).find("tilegroup").hide();
		$("tile").removeClass("flipped");
		
	}
	);
}

