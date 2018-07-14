$(function(){
	new Timeline("data.json");
});

function Timeline(dataURL){
	var _this = this;

	this.mainCarousel;
	this.totalFrames = 0;
	this.responsiveFrames = 0;
	this.timelinedata = {};
	this.videoPlayer;
	this.activeVideoID = 0;
	this.currentStep = 0;
	this.previousStep = 0;
	this.startDragX = 0;
	this.stopDragX = 0;
	this.navOver = false;

	this.loadJSON(function(response) {
		var data = JSON.parse(response);
		_this.createArticles(data);
		_this.init();
	}, dataURL);

	videojs("videoPlayer").ready(function(){
	    _this.videoPlayer = this;
	});
}

Timeline.prototype = {
	loadJSON:function(callback, url) {   
		var _this = this;
	    var xobj = new XMLHttpRequest();
	    xobj.overrideMimeType("application/json");
		xobj.open('GET', url, true);
	    xobj.onreadystatechange = function () {
	        if (xobj.readyState == 4 && xobj.status == "200") {
	            callback(xobj.responseText);
	        }
		};
		xobj.send(null);
	},
	init:function(){
		var _this = this;
		this.mainCarousel = new Dragdealer('timeline', {
	        steps: _this.totalFrames,
	        speed: 0.1,
	        loose: true,
	        animationCallback: function(x, y){ _this.updateBG(x); _this.updateNav(x); },
	        dragStartCallback: function(x, y){ _this.startDragX = x; },
	        dragStopCallback: function(x, y){ _this.stopDragX = x; }
	    });

	    this.updateTimeLineSize();

	    $( window ).resize(function() {
	    	_this.updateTimeLineSize();
		});
	    this.setupListeners();
	    this.staggerAssets();
	},
	createArticles:function(data){
		var _this = this;
		var newArticle;
		_this.timelinedata = data;
		_this.totalFrames = _this.timelinedata.events.length;
		
		createEvents();
		function createEvents(){
			for(var i = 0; i < _this.timelinedata.events.length; i++){
				var _asset = _this.timelinedata.events[i].asset;
				var _year = _this.timelinedata.events[i].year;
				var _employee = _this.timelinedata.events[i].employees;
				var _articale = _this.timelinedata.events[i].articles;
				newArticle = $( "<div id='a"+i+"' class='frame'>"+
						"<div class='asset'>"+getAsset(_asset)+"</div>"+
						"<div class='year'>"+_year+"</div>"+
						"<span style='width:100px; height:2px; background:#ea9b82; display:block; margin:0px 0px 5px 20px; box-sizing:border-box;'></span>"+
						getMessages(_articale)+
					"</div>" );
				$("#articles").append(newArticle);

				addYearToNav(_year);
				_this.updateNav();
			}
		}
		function getMessages(articles){
			var returnDiv = "";
			var article;
			for(var j = 0; j < articles.length; j++){
				article = articles[j];
				if(articles[j].lightbox){
					returnDiv += "<div class='statment'>"+article.text+((article.text)?"<br><br>":"")+"<a class='lbox' lb-href='"+article.lightbox.url+"'>"+article.lightbox.text+"</a></div>"
				}else{
					returnDiv += "<div class='statment'>"+article.text+"</div>"
				}
			}
			return returnDiv;
		}
		function getAsset(asset){
			var returnAsset = "";
			for(var i = 0; i < asset.length; i++){
				switch(asset[i].type){
					case "text": returnAsset += createText(asset[i].message); break;
					case "quote": returnAsset += createQuote(asset[i].message); break;
					case "video": returnAsset += createVideo(asset[i].video_id, asset[i].url, asset[i].message); break;
					case "image": returnAsset += createImage(asset[i].url); break;
					default: returnAsset = "";
				}
			}
			return returnAsset;
		}
		function createText(message){
			var txtQuote = "";
			txtQuote = "<div class='text_box'><p>"+message+"</p></div>";
			return txtQuote;
		}
		function createQuote(message){
			var newQuote = "";
			newQuote = "<div class='quote'><span class='quote_icon'></span><p>"+message+"</p></div>";
			return newQuote;
		}
		function createVideo(video_id, icon_url, message){
			var newVideo = "";
			newVideo = "<div class='video_icon' video-id='"+video_id+"'><img src='"+icon_url+"' width='220px'><div class='play_icon'></div><div class='img_quote'><p>"+message+"</p></div></div>";
			return newVideo;
		}
		function createImage(imageUrl){
			var newImage = "";
			newImage = "<div class='image_icon'><img src='"+imageUrl+"' width='220px'></div>";
			return newImage;
		}
		function addYearToNav(year){
			var newYear = $("<div>"+year+"</div>");
			$("#nav").append(newYear);
		}
	},
	setupListeners:function(){
		var _this = this;
		$("#nav div").click(function(){ _this.gotoYear($(this).html()); });
		$(".year").click(function(){ _this.gotoYear($(this).html());});

		$( "#nav_wrapper" ).mousemove(function( event ) {
			var navY = (event.pageY - $("#nav_wrapper").offset().top)/400 * ($("#nav").height()-200)-100;
			if(navY >= ($("#nav").height()-400)) navY = $("#nav").height()-400;
			if(navY <= 0) navY = 0;
			TweenMax.to(nav, 0.5, {top:-navY});
		});

		$(".video_icon").click(function(){
			if(_this.startDragX == _this.stopDragX){
				TweenMax.set(video_frame, {scale:0, opacity:0});
				TweenMax.to(video_frame, 0.3, {scale:1, opacity:1});
				$("#video_frame").css("display", "inline"); 
				var videoID = $(this).attr("video-id");
				if(_this.activeVideoID != videoID){
					_this.activeVideoID = videoID;
					changeVideo(videoID);
				}else{
					_this.videoPlayer.play();
				}
			}
		});
		$("#close_btn").click(function(){ _this.closeVideo(); });
		$("#right_arrow").click(function(){
			var nextStep = _this.mainCarousel.getStep()[0]+1;
			_this.mainCarousel.setStep(nextStep, 0, false);
		});
		$("#left_arrow").click(function(){
			var prevStep = _this.mainCarousel.getStep()[0]-1;
			_this.mainCarousel.setStep(prevStep, 0, false);
		});

		$(".video_icon").hover(function(){
			$(this).find(".play_icon").css({"opacity":"1"});
		}, function(){
			$(this).find(".play_icon").css({"opacity":"0"});
		});

		$("#right_arrow").hover(function(){
			$(this).css({"color":"red"});
		}, function(){
			$(this).css({"color":"black"});
		});

		$("#left_arrow").hover(function(){
			$(this).css({"color":"red"});
		}, function(){
			$(this).css({"color":"black"});
		});

		$("#nav div").hover(function(){
			_this.navOver = true;
			if($(this).html() != _this.timelinedata.events[_this.currentStep].year) $(this).css({"background-color":"#888"});
		}, function(){
			_this.navOver = false;
			if($(this).html() != _this.timelinedata.events[_this.currentStep].year) $(this).css({"background-color":"#424242"});
		});

		$(".lbox").click(function(){
			var imageURL = $(this).attr("lb-href");

			$("#lightbox").css({"display":"inline"});
			$("#img_holder").css({"background-image":"url("+imageURL+")"});
			
		});
		$("#lb_close").click(function(){
			$("#lightbox").css({"display":"none"});
		});
		$("#lightbox").click(function(){
			$("#lightbox").css({"display":"none"});
		});
		
		function changeVideo(video_id){
		    _this.videoPlayer.catalog.getVideo(video_id, function(error, video) {
		        _this.videoPlayer.catalog.load(video);
		        _this.videoPlayer.play();
		    })
		}
	},
	staggerAssets:function(){
		var staggerIndex = 0;
		var newPos = 50;
		$(".asset").each(function(i, obj){
			if($(obj).children().length == 1){
				switch(staggerIndex){
					case 0: newPos = 50; break;
					case 1: newPos = 200 - $(obj).children().first().height()/2; break;
					case 2: newPos = 100; break;
				}
				$(obj).children().first().css({top:newPos});

				staggerIndex++;
				if(staggerIndex > 2) staggerIndex = 0;
			}
			if($(obj).children().length == 2){
				$(obj).children().first().css({top:40});
				$(obj).children().last().css({top:220});
			}
		});
	},
	closeVideo:function(){
		TweenMax.to(video_frame, 0.3, {scale:0, opacity:0, onComplete:function(){$("#video_frame").css({"display":"none"});}});
		this.videoPlayer.pause();
	},
	gotoYear: function(year){
		this.mainCarousel.setStep(this.getIndexByYear(year), 0, false);
	},
	getIndexByYear: function (year){
		var index = 0;
		for(var i = 0; i < this.timelinedata.events.length; i++){
			if(this.timelinedata.events[i].year == year) index = i+1;
		}
		return index;
	},
	updateTimeLineSize:function(){
		var wrapperWidth = $("#wrapper").width();
		console.log(wrapperWidth);
		var _this = this;
		var removeFrameTotal = Math.floor((wrapperWidth-70)/250) - 1;

		this.responsiveFrames = _this.totalFrames - removeFrameTotal;
		$(".handle").width((250*(_this.responsiveFrames)));

		$("#dragArea").width(250*(_this.totalFrames+removeFrameTotal+2));
		$("#articles").width(250*(_this.totalFrames+removeFrameTotal));

		for(var i = 0; i < (_this.totalFrames); i++){
			$(".frame").eq(i).css("left", (250*i)+"px");
		}
		if(wrapperWidth < 1200) $("#img_holder").css("background-size", (wrapperWidth+"px"));
		else $("#img_holder").css("background-size", "1200px");
		if( _this.totalFrames != this.responsiveFrames){
			this.mainCarousel.setNewSteps((_this.responsiveFrames));
			this.mainCarousel.reflow();
			//this.updateNav();
		}
	},
	updateBG:function(x){
		var moveAmount = 800*x;
		$("#bg").css({"left":-(moveAmount+75)+"px"})
	},
	updateNav: function (x){
		if(!this.navOver) {
			var moveAmount = ($("#nav").height()-400) * x;
			TweenMax.to(nav, 0.5, {top:-(moveAmount)});
		}

		var cStep = Math.round(x * (this.responsiveFrames-1));
		if(cStep != this.currentStep){
			this.currentStep = cStep;
			var navDiv = $("#nav div").eq(this.currentStep);
			var preDiv = $("#nav div").eq(this.previousStep);
			TweenMax.to(navDiv, 0.3,{scale:1.1, backgroundColor:"#DA291C"});
			TweenMax.to(preDiv, 0.3,{scale:1, backgroundColor:"#424242"});
			this.previousStep = cStep;
			
			if(this.currentStep > 0) $("#left_arrow").css({"display":"inline"}); else $("#left_arrow").css({"display":"none"});
			if(this.currentStep == (this.responsiveFrames-1)) $("#right_arrow").css({"display":"none"}); else $("#right_arrow").css({"display":"inline"});
		}
	}
}