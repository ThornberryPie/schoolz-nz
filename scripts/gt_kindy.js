var Kindy = function(i){

	var obj = kindyz[i];

	this.setMarkerTitle = function(){
		return this.name+
        "\n"+this.address+
        "\n"+this.phone+
				"\n"+this.email+
				"\n"+this.group;
	};

	this.getGroupInfo = function(){
		var grouprow = '';
		if(this.group !== ''){
			for(var i=0; i < kindygroupz.length; i++){
				if(this.group == kindygroupz[i].name){
					var groupLink = this.group;
					if(kindygroupz[i].website !== ''){
						groupLink = '<a href="//'+kindygroupz[i].website+'" target="_blank">'+this.group+'</a>';
					}
					grouprow = '<div class="block"><strong>Group:</strong><br>'+groupLink+'</div>';
				}
			}
		}
		return grouprow;
	};

	this.setHTML = function(){
		var html = '<article class="window window--kindy">';
		html += '<header><h2 class="name">'+this.name+'</h2></header>';
		html += '<div class="block"><strong>Address:</strong><br>'+this.address+'</div>';
		if(this.phone !== ''){
			html += '<div class="block"><strong>Phone:</strong><br>'+this.phone+'</div>';
		}
		if(this.email !== ''){
			html += '<div class="block"><strong>Email:</strong><br>'+this.email+'</div>';
		}
		html += this.getGroupInfo();
		html += '</article>';
		return html;
	};

	this.id = obj.id;
	this.name = obj.name;
	this.address = obj.address;
	this.phone = obj.phone;
  this.email = obj.email;
	this.group = obj.group;
	this.lat = obj.lat;
	this.lng = obj.lng;
	this.markerTitle = this.setMarkerTitle();
	this.infowindowhtml = this.setHTML();
}
