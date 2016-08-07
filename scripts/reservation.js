  $.fn.removeClassByMask = function(mask) {
	var re = mask.replace(/\*/g, '\\S+');
	this.each(function (){
		var classes = ($(this).attr('class').match(new RegExp('\\b' + re + '', 'g')) || []).join(' ')
		$(this).removeClass(classes);
		});
    return this;
    };

	
function Timeline(sSelector, oOptions){
	
	var t = this;
	t.options 		= oOptions || {};
	t._status 		= 0;
	t.init(sSelector);
	t.startHour 	= null;
	t.endHour 		= null;
	t.latestLimit	= null;
	

	t.create = function(){					// создаёт шкалу
		for(var iHour=t.options['openHour']; iHour < t.options['closeHour']; iHour++){
			var oSegment = t.find(".b-timeline__segment:first-child").clone(true);
			t.elem.append(oSegment);
			oSegment.attr("data-hour", iHour+1)
				.find(".b-timeline__hour").html(iHour+1);
		}
	}
	t.status = function (sStatus, bSet){	// считывание статуса текущего - без параметров, номера указанного статуса sStatus или установка статуса если есть bSet
		if (sStatus){
		console.log(Timeline.statuses, sStatus);
			for (iCode in Timeline.statuses){	// по названию статуса ищем номер статуса
				var sStatusName = Timeline.statuses[iCode];
				console.log(sStatus + '==' + sStatusName);
				if (sStatus == sStatusName){
					if (bSet){
						t._status = iCode;
						}
					return iCode;
					}
				}
			return undefined;
			}
		else{
			return Timeline.statuses[t._status]; 	// выдаёт текстовое название текущего статуса			
			}
		}
	t.showStatus = function (){
		t.elem.attr('data-status', Timeline.statuses[t._status]);
		}
	
	t.nextStatus = function (){
		Timeline.statuses[++t._status] 				// если в перечне статусов есть статус с номером, большим чем текущий на 1, тогда статус сохраняется на уровне текущий + 1	
			|| Timeline.statuses[--t._status];		// иначе откатываемся назад: от увеличенного статуса +1 делаем - 1 и возвращаемся к текущему статусу
		t.showStatus();
		}
	
	t.selectBoundary = function(){					// отвечает за выбор начальных временных точек и формирование интервала
		var sCurrentStatus 		= t.status();
		var jqSelectedSegment 	= $(this);
		
		if (sCurrentStatus 		== 'NO_RANGE'
			|| sCurrentStatus 	== 'RANGE_STARTED'
			){
			var jqStartingSegment = 
				sCurrentStatus == 'NO_RANGE'
					? jqSelectedSegment.next()
					: jqSelectedSegment;
				
			if (!jqStartingSegment.hasClass('b-timeline__segment_reserved')){																											// TODO проверка на резервацию
				t.nextStatus();
				var iSelectedHour = jqSelectedSegment.data('hour');

				if (sCurrentStatus == 'NO_RANGE'){
					$.each(t.timeRange, function(iReservedFrom, oReservationData){
						if (iReservedFrom >= iSelectedHour){
							t.latestLimit = +iReservedFrom;			// начало следующего занятого периода, на который не можем посягать
							}
						
					});
					t.endHour = (t.startHour = iSelectedHour)/*  + 1 */;
					}
				else {		// RANGE_STARTED
					t.endHour = iSelectedHour /* + 1 */;
					}

				var sNewStatus = Timeline.statuses[t._status];

				jqSelectedSegment
					.addClass(
						"b-timeline__segment_status_"+sNewStatus
						+(sNewStatus != 'RANGE_STARTED'
							? " b-timeline__segment_selected "
							: '')						
						);
					
					
				if (sNewStatus == 'RANGE_FINISHED'){
					t.fillPeriod();
					}
				}
			else {
				jqSelectedSegment
					.removeClass('b-fx_flash')
					.animate({}, 100, function(){
						$(this).addClass('b-fx_flash');
						
						})
					;
				}
			}
		else if (sCurrentStatus == 'RANGE_FINISHED'){		
			var 
				jqSelectedSegment 	= $(this)
				,iSelectedHour 		= jqSelectedSegment.data('hour')
				;
				
			if (iSelectedHour >= t.startHour 	
				&& (iSelectedHour <= t.latestLimit		
					|| !t.latestLimit				
					)
				){
				t.nextStatus();
				var jqOldFinish = jqSelectedSegment.siblings('.b-timeline__segment_status_RANGE_FINISHED');		// старая позиция окончания периода
				var jqNewFinish = null;																			// новая позиция окончания периода
				// if (jqSelectedSegment.is('.b-timeline__segment_status_RANGE_FINISHED')){
				if (iSelectedHour == t.endHour){			// если щелкнули непосредственно по последнему часу 
					t.endHour--;							// уменьшаем час окончания посещения на 1
					jqOldFinish = jqSelectedSegment
					jqNewFinish = jqSelectedSegment.prev();	// назначаем новый объект финишного сегмента таймлайна
					}
				else if (iSelectedHour >= t.startHour
					&& jqOldFinish.index() != -1
					){
					t.endHour = iSelectedHour/*  + 1 */;	// ставим новый час окончания посещения 
					jqNewFinish = jqSelectedSegment;		// назначаем новый объект финишного сегмента таймлайна
					} 
					
				jqOldFinish
					.removeClass('b-timeline__segment_status_RANGE_FINISHED')
					.removeClass("b-timeline__segment_selected")
					;
				
 				if (!jqNewFinish.hasClass('b-timeline__segment_status_RANGE_STARTED')){	// new finish is not a start		16...19
					jqNewFinish
						.addClass('b-timeline__segment_status_RANGE_FINISHED')
						.addClass("b-timeline__segment_selected ")
					}
				else {		// new finish = start			// 16..16
					// t._status = 1;	// RANGE_STARTED
					t.status('RANGE_STARTED', true);	// set status
					}
				t.fillPeriod();
				}
			}
	}
	t.fillPeriod = function(){						// подсветка промежуточных сегментов шкалы от начального выбранного часа до конечного
		if (t.startHour != t.endHour){
			$(".b-timeline__segment[data-hour="+t.startHour+"]")
				.nextUntil(".b-timeline__segment[data-hour="+t.endHour+"]")
					.addClass("b-timeline__segment_selected");
			// убрать старые выделения после перемещения конца посещения внутрь старого диапазона
			// БЫЛО 	[16-------19]
			// СТАЛО 	[16--17]--19
			// УБРАТЬ 	[16--17]XXXX
			$(".b-timeline__segment[data-hour="+t.endHour+"]")
				.nextAll()
					.removeClass("b-timeline__segment_selected");	
			}
		}
	t.load = function(iDate, timeRange){			// загрузка почасовых резерваций на определённую дату
		var oDate = new Date(iDate);
		t.find(".b-timeline__segment").removeClass("b-timeline__segment_reserved");
		t.timeRange = timeRange;
		$.each(timeRange, function(iReservedFrom, oReservationData){
			for(var iHour = iReservedFrom; iHour < oReservationData['endHour']; iHour++){
				t.find(".b-timeline__segment[data-hour="+ (+iHour + 1) + "]").addClass("b-timeline__segment_reserved");
			}
		});
		
	}
	
	t.clearReservation = function (){
		t.status('NO_RANGE', true);			
		t.startHour 	= null;
		t.endHour 		= null;	
		t.latestLimit	= null;		
		t.elem.find('.b-timeline__segment_selected, .b-timeline__segment_status_RANGE_STARTED')
			.removeClass('b-timeline__segment_selected')
			.removeClassByMask('b-timeline__segment_status_*')
			;
		}
	
	t.create();
	t.showStatus();
	t.find(".b-timeline__segment").click(t.selectBoundary);
}
Timeline.statuses = {
	 0 : 'NO_RANGE'			
	,1 : 'RANGE_STARTED'	
	,2 : 'RANGE_FINISHED'	
	};


function ReservationApp(sSelector){
	var r = this;
	
	r.init(sSelector);

	r.day			= r.find('.b-days__day');
	r.month			= r.find('.b-months__month');
	r.firstname		= r.find('.b-form__firstname');
	r.phone			= r.find('.b-form__phone');
		
	r.table			= r.find('.b-hall__table');
	r.settings		= {
						"openHour" 		: 10
						,"closeHour" 	: 23
					};
	r.timeline 		= new Timeline("#timeline1", {
					"openHour" 		: r.settings.openHour
					,"closeHour" 	: r.settings.closeHour
				});
	r.currentDate 	= new Date();
	r.currentDay 	= r.currentDate.getDate();
	r.currentMonth 	= r.currentDate.getMonth();
	r.currentYear 	= r.currentDate.getFullYear();
	r.selectedTable	= r.elem.find('.b-hall__table_selected');
		
	r.setCurrentDate 	= function(){
		r.day.eq(r.currentDay-1).attr("selected","true");
		r.month.eq(r.currentMonth).attr("selected","true");
		//console.log(day + " " + month);
		}
	
	r.selectTable 	= function(){
		r.find('.b-form__timeline').addClass('b-form__timeline_shown');;
		var jqSelectedTable = $(this);
		var date = new Date(r.currentYear, r.currentMonth, r.currentDay, 0, 0, 0, 0).getTime()
			,tableNum = jqSelectedTable.data('num')
			
			;
		r.selectedTable.removeClass('b-hall__table_selected');
		jqSelectedTable.addClass('b-hall__table_selected');
		r.selectedTable = jqSelectedTable;
		
		r.timeline.load(date, r.getReservations(/* date */'today', tableNum));
		
	}
	r.getReservations 	= function(sDate, iTableNum){
		var schedule = getObject('schedule');
		if (typeof(schedule[sDate]) 							!== 'undefined'
			&& typeof(schedule[sDate][iTableNum]) 				!== 'undefined'
			&& typeof(schedule[sDate][iTableNum]['reserved']) 	!== 'undefined'
			){
			return schedule[sDate][iTableNum]['reserved'];
			}
		else {
			return {};
			}
		}
	r.setReservation 	= function (sDate, iTableNum, startHour, oReservationData){
		var schedule = getObject('schedule');
		if (typeof(schedule[sDate]) === 'undefined') 			{ schedule[sDate] = {};								}
		if (typeof(schedule[sDate][iTableNum]) === 'undefined')	{ schedule[sDate][iTableNum] = {'reserved' : {} };	}
				
		schedule[sDate][iTableNum]["reserved"][startHour] = oReservationData;
		storeObject('schedule', schedule);
		}
	
	r.make = function(event){
		event.preventDefault();
		var tableNum = r.selectedTable.text()
			,startHour	= r.timeline.startHour 
			,endHour	= r.timeline.endHour
			;
		r.setReservation(/* date */'today', tableNum, startHour, {
			 'endHour'	 : endHour
			,'firstname' : r.firstname.val()
			,'phone'	 : r.phone.val()
			});
			
			var message = r.firstname.val()
			 '<br> Имя:' 	+ ' ' + r.firstname.val()
			+ '<br> Телефон:' 	+ ' ' + r.phone.val()
			+ '<br> Стол:' 		+ ' ' + tableNum
			+ '<br> Начало:'		+ ' ' + startHour + ':00'
			+ '<br> Окончание:' 	+ ' ' + endHour + ':00'
			+ '<br> Длительность:'+ ' ' + (endHour - startHour) + ' часа';
			
			
			$.ajax({
				url: "php/feedback.php", 
				type: "post", 
				dataType: "json", 
				data: { 
					"message": message
				},
				'complete' : function(data){
					//alert(data.responseJSON.data);
					//alert(data.responseJSON.feedbackMessage);
					alert(
						r.firstname.val()
						+ '\n Телефон:' 	+ '\t' + r.phone.val()
						+ '\n Стол:' 		+ '\t' + tableNum
						+ '\n Начало:'		+ '\t' + startHour + ':00'
						+ '\n Окончание:' 	+ '\t' + endHour + ':00'
						+ '\n Длительность:'+ '\t' + (endHour - startHour) + ' часа'
					);
				}
			});	
		}		
		
		r.setCurrentDate();
		r.table.click(r.selectTable);
		r.find('.b-form__clear').click(r.timeline.clearReservation);
		r.elem.submit(r.make);
		
}

Timeline.prototype = new Component();
ReservationApp.prototype = new Component();