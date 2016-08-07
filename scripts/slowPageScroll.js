function slowPageScroll(sSelector){
var c = this;

c.main = function(){
	c.init(sSelector);
	
	c.links 		= c.find(".b-menu__link[href^='#']");
	c.items 		= c.find(".b-menu__item");
	c.linkPrev 		= c.items.eq(0).children(".b-menu__link");
	c.linkCurrent 	= null;	
	
	c.links.click(c.slowScroll);
	c.links.bind("click", c.changeItem);
	}

c.slowScroll = function(e){
	
    e.preventDefault();

    var target = $(this.hash);
	console.log(this.hash);

    $('html, body').stop().animate({
        'scrollTop': target.offset().top
    }, 900, 'swing', function () {
        window.location.hash = target;
    }); 
		
}
c.changeItem = function(e){
		e.preventDefault();	
		c.linkCurrent = $(this);
		c.decoration();	
		c.linkPrev = c.linkCurrent;

}
c.decoration = function(){
		c.linkPrev.removeClass('b-menu__link_current');
		c.linkCurrent.addClass('b-menu__link_current');
	}


$(document).ready(c.main);
}

slowPageScroll.prototype = new Component();
