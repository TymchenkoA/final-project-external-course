
// Put the object into storage
var storeObject = function(sName, oData){
	localStorage.setItem(sName, JSON.stringify(oData));
	}

// Retrieve the object from storage
var getObject = function(sName){
	return JSON.parse(localStorage.getItem(sName));
	}

	
	
function Component()
{
this.elem = null;		// ссылка на HTML-элемент интерфейса с которым работает JS-компонент
this.init = function (sSelector){
	this.elem = $(sSelector);
	if (!this.elem.length){
		alert('Can`t access element by selector: ' + this.selector);
		}
	}
	
this.find = function (sSelector){
	var find_result = this.elem.find(sSelector);
	if (find_result.length){
		return find_result;
		}
	else{
		alert('Could not find element by selector ' + sSelector);
		}
	}

this.copyData = function(oSource, oDestination, aFieldNames){
	$.each(aFieldNames, function(i, fieldName){
		var oSourceElement 		= oSource		.find(fieldName);
		var oDestinationElement = oDestination	.find(fieldName);
		var tagName 			= oSourceElement.prop('tagName');
		
		if (tagName=='IMG'){			// oSource.is('img')	// если источник - изображение
			oDestinationElement.attr('src'
				,oSourceElement.attr('src')
				);
			}
		else if (tagName == 'INPUT' 
			  || tagName == 'TEXTAREA'){						// если это - поле ввода
			oDestinationElement.val(
				 oSourceElement.val()
				);
			}
		else {													// иначе - парный содержательный тег
			oDestinationElement.html(
				 oSourceElement.html()
				 );
			}		
		});

	}

}
