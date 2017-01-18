var School = function(i){

	this.change = function(i){
		var c = schoolz[i].FIELD5;
		//Add '+' to decile change if it's not minus or zero
		if(c.charAt(0) != '-' && c != '0'){
			c = 'up '+c;
		}
		c = (c.charAt(0) == '-') ? c.replace('-', 'down ') : c;
		//Return null if decile has not changed
		c = (c == '0') ? '' : c;
		return c;
	};

	this.formatType = function(type){
		type = (type == 'Contributing') ? type+' Primary (Year 1-6)' : type;
		type = (type == 'Full Primary') ? type+' (Year 1-8)' : type;
		return type;
	};

	this.tidyLatLng = function(l){
	//Remove second dot if it exists
		//Replace first dot with pipe
		l = l.replace('.', '|');
		//Replace second dot with nothing
		l = l.replace('.', '');
		//Replace pipe with dot
		l = l.replace('|', '.');
		return parseFloat(l);
	};

	this.setInfowindow = function(marker, html, id, map){
		var infowindow = new google.maps.InfoWindow({
			//position: latLng,
			content: html
		});

		this.infowindow = infowindow;

		//this.windows.push(infowindow);

		//Pan to marker and show infowindow when marker is clicked
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map, this);
			map.panTo(this.position);
		});
	};

	this.setMarkerTitle = function(){
		return this.schoolname+
        "\n"+this.formatType(this.type)+
        "\n"+this.authority+
        ", "+this.gender+
        "\nDecile "+this.decile+
        "\n\n"+this.address1+
        this.suburb+
        "\n"+this.address3+
        " "+this.postcode+
        "\n\nEuropean/ Pakeha: "+this.pakeha+
        "\nMaori: "+this.maori+
        "\nPasifika: "+this.pasifika+
        "\nAsian: "+this.asian+
        "\nMELAA: "+this.melaa+
        "\nOther: "+this.other+
        "\nInternational: "+this.international+
        "\nTOTAL STUDENTS: "+this.students+
        "\n\nPrincipal: "+this.principal+
        "\nEmail: "+this.email+
        "\nPhone: "+this.phone+
        this.website;
	};

	this.setHTML = function(){
		var html = '<article class="window window--school decile'+this.rawdecile+'">';
		html += '<header><h2 class="name">'+this.schoolname+'</h2>';
		if(this.website != '0'){
			html += '<div class="block website"><a href="'+this.website+'" target="_blank">'+this.website+'</a></div>';
		}
		html += '</header><div class="block type">'+this.formatType(this.type)+'</br>';
        html += this.authority+', '+this.gender+'</br>';
        html += '<strong>Decile '+this.decile+'</strong></div>';
        html += '<div class="block address"><strong>Address:</strong><br>';
        if(this.address1 != '0') html += this.address1+'<br>';
        if(this.suburb !== '') html += this.suburb+'<br>';
        html += this.address3+' '+this.postcode+'</div>';
        html += '<div class="block demog"><strong>Student Demographics:</strong><br>';
        html += '<span>European/ Pakeha: </span>'+this.pakeha+'<br>';
        html += '<span>Maori: </span>'+this.maori+'<br>';
        html += '<span>Pasifika: </span>'+this.pasifika+'<br>';
        html += '<span>Asian: </span>'+this.asian+'<br>';
        html += '<span>MELAA: </span>'+this.melaa+'<br>';
        html += '<span>Other: </span>'+this.other+'<br>';
        html += '<span>International: </span>'+this.international+'<br>';
        html += '<strong>Total Students: '+this.students+'</strong></div>';
        html += '<div class="block contact"><span>Principal: </span>'+this.principal+'<br>';
        html += '<span>Phone: </span>'+this.phone+'</div>';
        if(this.email != '0'){
        	html += '<span>Email: </span><a href="mailto:'+this.email+'">'+this.email+'</a><br>';
		}
		html += '</article>';
		return html;
	};

	//Gather this school's properties from schoolz obj and format data
	this.id = schoolz[i].FIELD1;
	this.schoolname = schoolz[i].FIELD2;
	this.rawdecile = schoolz[i].FIELD3;
	this.type = schoolz[i].FIELD9;
	this.authority = schoolz[i].FIELD10;
	this.territory = schoolz[i].FIELD11;
	this.phone = schoolz[i].FIELD16;
	this.email = schoolz[i].FIELD18;
	this.principal = schoolz[i].FIELD19;
	this.website = schoolz[i].FIELD20;
	this.address1 = schoolz[i].FIELD21;
	this.address2 = schoolz[i].FIELD22;
	this.address3 = schoolz[i].FIELD23;
	this.postcode = schoolz[i].FIELD27;
	this.gender = schoolz[i].FIELD32;
	this.lat = this.tidyLatLng(schoolz[i].FIELD36);
	this.lng = this.tidyLatLng(schoolz[i].FIELD37);
	this.students = schoolz[i].FIELD38;
	this.pakeha = schoolz[i].FIELD39;
	this.maori = schoolz[i].FIELD40;
	this.pasifika = schoolz[i].FIELD41;
	this.asian = schoolz[i].FIELD42;
	this.melaa = schoolz[i].FIELD43;
	this.other = schoolz[i].FIELD44;
	this.international = schoolz[i].FIELD45;

	//Add extra text if decile has changed
	this.decile = (this.change(i) !== '') ? this.rawdecile+" ("+this.change(i)+" since 2014)" : this.rawdecile;
	//Add a line break before some elements if they're not null
	this.suburb = (this.address2 != "0") ? "\n"+this.address2 : '';
	this.website = (this.website != "0") ? "\n"+this.website : '';

	//Set content of marker and infowindow
	this.markerTitle = this.setMarkerTitle();
	this.schoolhtml = this.setHTML();

	this.schoolID = schoolz[i].FIELD2+', '+schoolz[i].FIELD23;
}
