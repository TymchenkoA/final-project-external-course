function pageElements(sSelector){
var p = this;
		

p.main = function(){
	
	p.init(sSelector);
	p.topBtn = p.find('.b-container__top');
	p.menuBtn = p.find('.b-menu-toggle');
	p.reservationBtn = p.find('.b-section__link_reserve');
	p.formCloseBtn = p.find('.b-form__closebtn');
	
		if($(window).width() > 600){
			$(window).scroll(p.showHideTopBtn);
			}
	p.topBtn.click(p.slowScroll);
	p.menuBtn.click(p.showHideMenu);
	p.reservationBtn.click(p.showReservationForm);
	p.formCloseBtn.click(p.hideReservationForm);
}

p.showHideTopBtn = function(){
	
	if ($(window).scrollTop() > 300) {
		//p.topBtn.show();
		p.topBtn.fadeIn(1000);
	}
	else {
		//p.topBtn.hide();
		p.topBtn.fadeOut(1000);
	}	
}

p.slowScroll = function(){
	$("html,body")
	.stop()
	.animate({scrollTop:0},"slow");
}

p.showHideMenu = function(){
	$('.b-menu').toggleClass('b-invisible');
}

p.showReservationForm = function(event){
	$('.b-container__reservation').removeClass('b-invisible');
	event.preventDefault();
}
p.hideReservationForm = function(event){
	$('.b-container__reservation').addClass('b-invisible');
	event.preventDefault();
}	


$(document).ready(p.main);
}

pageElements.prototype = new Component();