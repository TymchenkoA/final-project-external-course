function slider(sSelector){
	var s = this;
	s.init(sSelector);	
	s.changeBgContainer = s.find('.b-container__main');
	s.filename = 1;
	s.max = 4; 
	s.bgSrc;
	
	s.changeBg = function(){
		
		s.filename += 1;
		if(s.filename > s.max){
			s.filename = 1;
		}
		
		var mobilePath = $(window).width() < 600 ? "mobile/" : ""; 
		
		s.bgSrc = "images/home/" + mobilePath + s.filename + ".jpg";
		s.changeBgContainer.css('background', 'url("' + s.bgSrc + '") no-repeat fixed center center / cover');
	}		
	
	s.autoLoad = function(){
		s.ticker = window.setInterval(s.changeBg,5000);	
	}
	$(document).ready(s.autoLoad);
	
}
slider.prototype = new Component();

