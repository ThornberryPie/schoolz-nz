function createPylon(poly, html, label, point, length) {
    $scope.pylons.push(poly);
    var poly_num = gpolys.length - 1;
    if (!html) {html = "";}
    else { html += "<br>";}
    length = length * 0.000621371192; // convert meters to miles
    html += "length="+length.toFixed(2)+" miles";
    // html += poly.getLength().toFixed(2)+" m; "+(poly.getLength()*3.2808399).toFixed(2)+" ft; ";
    // html += (poly.getLength()*0.000621371192).toFixed(2)+" miles";
    var contentString = html;
    google.maps.event.addListener(poly,'click', function(event) {
      infowindow.setContent(contentString);
      if (event) {
         point = event.latLng;
      }
      infowindow.setPosition(point);
      infowindow.open(map);
      // map.openInfoWindowHtml(point,html);
    });
    if (!label) {
      label = "polyline #"+poly_num;
    }
    label = "<a href='javascript:google.maps.event.trigger(gpolys["+poly_num+"],\"click\");'>"+label+"</a>";
    // add a line to the sidebar html
    side_bar_html += '<input type="checkbox" id="poly'+poly_num+'" checked="checked" onclick="togglePoly('+poly_num+');">' + label + '<br />';

  }





function togglePoly(poly_num) {
  if (document.getElementById('poly'+poly_num)) {
     if (document.getElementById('poly'+poly_num).checked) {
        gpolys[poly_num].setMap(map);
     } else {
        gpolys[poly_num].setMap(null);
     }
  }
}





for (var a = 0; a < lines.length; a++) {
    // get any line attributes
    var label = lines[a].getAttribute("label");
    if (!label) { label = "polyline #"+a; }
    var geodesic = lines[a].getAttribute("geodesic");
    if (!geodesic) { geodesic=false; }
    var opacity = lines[a].getAttribute("opacity");
    if (!opacity) { opacity = 0.45; }
    var colour = lines[a].getAttribute("colour");
    var width  = parseFloat(lines[a].getAttribute("width"));
    var html = lines[a].getAttribute("html");
    // read each point on that line
    var points = lines[a].getElementsByTagName("point");
    var pts = [];
    var length = 0;
    var point = null;
    for (var i = 0; i < points.length; i++) {
       pts[i] = new g.LatLng(parseFloat(points[i].getAttribute("lat")),
                            parseFloat(points[i].getAttribute("lng")));
       if (i > 0) {
         length += pts[i-1].distanceFrom(pts[i]);
         if (isNaN(length)) { alert("["+i+"] length="+length+" segment="+pts[i-1].distanceFrom(pts[i])) };
       }
       bounds.extend(pts[i]);
       point = pts[parseInt(i/2)];
    }
    // length *= 0.000621371192; // miles/meter
    // alert("poly:"+label+" point="+point+" i="+i+" (i/2)%2="+parseInt(i/2)+" length="+length);
    var poly = new g.Polyline({
      map:map,
      path:pts,
      strokeColor:colour,
      strokeOpacity:opacity,
      strokeWeight:width,
      geodesic: geodesic,
      clickable: true
    });
    createClickablePolyline(poly, html, label, point, length);
    // map.addOverlay(poly);
}
