if (!getObject('schedule')){
	storeObject(
		'schedule', {
				// date 2015-01-12
				//1452549600000
				'today' : {
				// table
				1 : {
					'reserved' : {
						// startHour : oReservationData
						12  : {'endHour':15, 'firstname':'someone', 'phone':'111'}
						,20 : {'endHour':23, 'firstname':'anyelse', 'phone':'222'}
						}
					}
				}
			}
		);
	}

