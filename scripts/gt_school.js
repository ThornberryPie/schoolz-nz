var School = function(i){

	/*this.change = function(i){
		var c = schoolz[i].DecileChange;
		//Add '+' to decile change if it's not minus or zero
		if(c.charAt(0) != '-' && c != '0'){
			c = 'up '+c;
		}
		c = (c.charAt(0) == '-') ? c.replace('-', 'down ') : c;
		//Return null if decile has not changed
		c = (c == '0') ? '' : c;
		return c;
	};*/

	this.decileTable = function(s){
		//console.log(kindygroupz);
		var decile2016 = s.Decile;
		var decile2015 = '';
		for(j=0; j < schoolz2015.length; j++){
			if(schoolz2015[j].Name == s.Name){
				decile2015 = schoolz2015[j].Decile;
			}
			//console.log(schoolz2015[i].Name);
		}
		var dt = '<table class=\"table\" cellspacing=\"0\" cellpadding=\"0\">';
		dt += '<tr class=\"thead\"><td rowspan=\"2\">Decile</td><td>2014</td><td>2015</td><td>2016</td></tr>';
		dt += '<tr><td></td><td>'+decile2015+'</td><td>'+decile2016+'</td></tr>';
		dt += '</table>';
		return dt;
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

	/*this.setInfowindow = function(marker, html, id, map){
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
	};*/

	this.setMarkerTitle = function(){
		return this.schoolname+
        "\n"+this.formatType(this.type)+
        "\n"+this.authority+
        ", "+this.gender+
        "\nDecile "+this.rawdecile+
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
        //html += '<strong>Decile '+this.decile+'</strong></div>';
				html += this.decile;
        html += '<div class="block address"><strong>Address:</strong><br>';
        if(this.address1 !== '') html += this.address1+'<br>';
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
	this.id = schoolz2016[i].id;
	this.schoolname = schoolz2016[i].Name;
	this.rawdecile = schoolz2016[i].Decile;
	this.decile = this.decileTable(schoolz2016[i]);
	this.type = schoolz2016[i].SchoolType;
	this.authority = schoolz2016[i].Authority;
	this.territory = schoolz2016[i].Territory;
	this.phone = schoolz2016[i].Phone;
	this.email = schoolz2016[i].Email;
	this.principal = schoolz2016[i].Principal;
	this.website = schoolz2016[i].Website;
	this.address1 = schoolz2016[i].Street;
	this.address2 = schoolz2016[i].Suburb;
	this.address3 = schoolz2016[i].City;
	this.postcode = schoolz2016[i].Postcode;
	this.gender = schoolz2016[i].Gender;
	this.lat = this.tidyLatLng(schoolz2016[i].Latitude);
	this.lng = this.tidyLatLng(schoolz2016[i].Longitude);
	this.students = schoolz2016[i].TotalStudents;
	this.pakeha = schoolz2016[i].Pakeha;
	this.maori = schoolz2016[i].Maori;
	this.pasifika = schoolz2016[i].Pasifika;
	this.asian = schoolz2016[i].Asian;
	this.melaa = schoolz2016[i].MELAA;
	this.other = schoolz2016[i].Other;
	this.international = schoolz2016[i].International;

	//Add extra text if decile has changed
	//this.decile = (this.change(i) !== '') ? this.rawdecile+" ("+this.change(i)+" since 2014)" : this.rawdecile;

	//Add a line break before some elements if they're not null
	this.suburb = (this.address2 !== "") ? "\n"+this.address2 : '';
	this.website = (this.website !== "") ? "\n"+this.website : '';

	//Set content of marker and infowindow
	this.markerTitle = this.setMarkerTitle();
	this.infowindowhtml = this.setHTML();

	this.schoolID = schoolz2016[i].Name+', '+schoolz2016[i].City;
}
