var Playcentre = function(i){

	var p = playcentrez[i];

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
		if(this.phone !== ''){
			html += '<div class="block"><strong>Phone:</strong><br>'+this.phone+'</div>';
		}
		html += '<div class="block"><strong>Email:</strong><br>'+this.email+'</div>';
		if(hours !== ''){
			html += '<div class="block"><strong>Hours:</strong>'+hours+'</div>';
		}
		html += '</article>';
		return html;
	};

	this.name = p.name;
	this.address = p.address;
	this.phone = p.phone;
  this.email = p.email;
  this.mon = p.mon;
  this.tue = p.tue;
  this.wed = p.wed;
  this.thu = p.thu;
  this.fri = p.fri;
	this.lat = p.lat;
	this.lng = p.lng;
	this.markerTitle = this.setMarkerTitle();
	this.playcentrehtml = this.setHTML();
}
