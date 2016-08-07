var settings = {};

settings.data = {};

settings.init = function(oSettingsData){
	settings.data = oSettingsData;
	}
	
settings.get = function(sSettingName){
	return settings.data[sSettingName];
	}
