function gallery(sSelector){
	var g = this;
	g.init(sSelector);
	g.categories 		= g.find(".b-category");
	g.categoriesHeaders = g.find(".b-category__header");
	g.currentCategory = null;
	g.prevCategory 		= g.categories.eq(0);
	g.currentTabName 	= "banquet";
	g.prevTabName 		= "banquet";
	
	g.arrowPrev = g.find('.b-preview__arrow_prev');
	g.arrowNext = g.find('.b-preview__arrow_next');
	g.markStop = g.find('.b-preview__mark_stop');
	g.markRev = g.find('.b-preview__mark_reverse');
	g.markForw = g.find('.b-preview__mark_forward');
	g.preview = g.find('.b-preview');
	g.previewImage = g.find('.b-preview__image');
	g.filename = 1;
	g.max = 5; 
	g.imgSrc;
	
	g.load = function(){	
		g.previewImage.attr('src','images/gallery/' + g.currentTabName + '/1.jpg');
	}
	
	g.getTabName = function(){
		var 
			 tabNames = settings.get("tab_names")
			,max_photos = settings.get("max_photos")
			,tabNum = g.categoriesHeaders.index(this);
			
			g.currentCategory = g.categories.eq(tabNum); 
			// alert(tabNames[tabNum]);
			g.currentTabName = tabNames[tabNum];
			
			g.decoration();
			
			g.prevCategory = g.currentCategory;
			g.prevTabName = g.currentTabName;
			
			g.showImage(0);
			
			g.max = max_photos[g.currentTabName];
			//return tabNames[tabNum];
	}
	
	g.decoration = function(){
		g.prevCategory.find("div").removeClass('b-category__img_' + g.prevTabName + '-current');
		g.prevCategory.find("h4").removeClass('b-category__header_current');
		g.currentCategory.find("div").addClass('b-category__img_' + g.currentTabName + '-current');
		g.currentCategory.find("h4").addClass('b-category__header_current');
		
	}
	
	g.showImage = function(iShift){
		
		g.filename += iShift;
		if(g.filename > g.max){
			g.filename = 1;
		}
		else if(g.filename == 0){
			g.filename = g.max;
		}
		
		g.imgSrc = "images/gallery/" + g.currentTabName + "/" + g.filename + ".jpg";
		g.previewImage.attr('src',g.imgSrc);
	}
	
	g.showPrevious = function(){
		g.showImage(-1);
	}
	
	g.showNext = function(){	
		g.showImage(1);		
	}
	g.arrowLeftRight = function(event){
		if(event.which ==37){
			g.showPrevious();
		}
		else if(event.which ==39){
			g.showNext();
		}
		
	}	
	
	g.autoLoad = function(){
		g.ticker = window.setInterval(g.showNext,5000);	
	}
	
	g.autoLoadStop = function(){
		window.clearInterval(g.ticker);
		console.log('Прокрутка остановлена');
	
	}
	
	g.load();
	
	g.categoriesHeaders.bind("click", g.getTabName);
	$(document).ready(g.autoLoad);
	g.arrowPrev.click(g.showPrevious);
	g.markRev.click(g.showPrevious);
	g.arrowNext.click(g.showNext);
	g.markForw.click(g.showNext);
	$('body').keyup(g.arrowLeftRight);
	g.markStop.click(g.autoLoadStop);

}

gallery.prototype = new Component();

