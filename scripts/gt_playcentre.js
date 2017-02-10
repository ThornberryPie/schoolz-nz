var Playcentre = function(i){

	var obj = playcentrez[i];

	this.setMarkerTitle = function(){
		return this.name+
        "\n"+this.address+
        "\n"+this.phone+
				"\n"+this.email+
				"\n\nHours:"+this.getHours();
	};

	this.getHours = function(){
		var hours = '';
		if(this.mon !== '') hours += "\nMon: "+this.mon;
		if(this.tue !== '') hours += "\nTue: "+this.tue;
		if(this.wed !== '') hours += "\nWed: "+this.wed;
		if(this.thu !== '') hours += "\nThu: "+this.thu;
		if(this.fri !== '') hours += "\nFri: "+this.fri;
		return hours;
	};

	this.getHoursHTML = function(){
		var hours = '';
		if(this.mon !== '') hours += '<br><span class="day">Mon: </span>'+this.mon;
		if(this.tue !== '') hours += '<br><span class="day">Tue: </span>'+this.tue;
		if(this.wed !== '') hours += '<br><span class="day">Wed: </span>'+this.wed;
		if(this.thu !== '') hours += '<br><span class="day">Thu: </span>'+this.thu;
		if(this.fri !== '') hours += '<br><span class="day">Fri: </span>'+this.fri;
		return hours;
	};

	this.setHTML = function(){
		var hours = this.getHoursHTML();
		var html = '<article class="window window--playcentre">';
		html += '<header><h2 class="name">'+this.name+'</h2></header>';
		html += '<div class="block"><strong>Address:</strong><br>'+this.address+'</div>';
		if(this.phone){
			html += '<div class="block"><strong>Phone:</strong><br>'+this.phone+'</div>';
		}
		if(this.email){
			html += '<div class="block"><strong>Email:</strong><br>'+this.email+'</div>';
		}
		if(hours !== ''){
			html += '<div class="block"><strong>Hours:</strong>'+hours+'</div>';
		}
		html += '</article>';
		return html;
	};

	this.id = obj.id;
	this.name = obj.name;
	this.address = obj.address;
	this.phone = obj.phone;
  this.email = obj.email;
  this.mon = obj.mon;
  this.tue = obj.tue;
  this.wed = obj.wed;
  this.thu = obj.thu;
  this.fri = obj.fri;
	this.lat = obj.lat;
	this.lng = obj.lng;
	this.markerTitle = this.setMarkerTitle();
	this.infowindowhtml = this.setHTML();
}
