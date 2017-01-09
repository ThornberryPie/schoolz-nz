var Playcentre = function(i){

	var p = playcentrez[i];

	this.setMarkerTitle = function(){
		return this.name+
        "\n"+this.address+
        "\n"+this.phone+
				"\n"+this.email+
				"\n\nCourse Times:"+this.getHours();
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
		if(this.mon !== '') hours += "<br>Mon: "+this.mon;
		if(this.tue !== '') hours += "<br>Tue: "+this.tue;
		if(this.wed !== '') hours += "<br>Wed: "+this.wed;
		if(this.thu !== '') hours += "<br>Thu: "+this.thu;
		if(this.fri !== '') hours += "<br>Fri: "+this.fri;
		return hours;
	};

	this.setHTML = function(){
		var html = '<div class="playcentre">';
		html += '<header><h2 class="name">'+this.name+'</h2></header>';
		html += '<div class="block"><strong>Address:</strong><br>'+this.address+'</div>';
		html += '<div class="block"><strong>Phone:</strong><br>'+this.phone+'</div>';
		html += '<div class="block"><strong>Email:</strong><br>'+this.email+'</div>';
		html += '<div class="block"><strong>Course Times:</strong>'+this.getHoursHTML()+'</div>';
		html += '</div>';
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
