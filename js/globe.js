d3.select(window)
    .on("mousemove", mousemove)
    .on("mouseup", mouseup);

var width = 960,
    height = 500;

var proj = d3.geo.orthographic()
    .translate([width / 2, height / 2])
    .clipAngle(90)
    .scale(220);

var sky = d3.geo.orthographic()
    .translate([width / 2, height / 2])
    .clipAngle(90)
    .scale(300);

var path = d3.geo.path().projection(proj).pointRadius(2);

var swoosh = d3.svg.line()
      .x(function(d) { return d[0] })
      .y(function(d) { return d[1] })
      .interpolate("cardinal")
      .tension(.0);

var links = [], redlinks = [], greenlinks = [],
    arcLines = [];

var svg = d3.select(".svg").append("svg")
            .attr("width", width)
            .attr("height", height)
            .on("mousedown", mousedown);

queue()
    .defer(d3.json, "world-110m.json")
    .defer(d3.json, "data/places9.json")
    .await(ready);
function ready(error, world, places) {
  var ocean_fill = svg.append("defs").append("radialGradient")
        .attr("id", "ocean_fill")
        .attr("cx", "75%")
        .attr("cy", "25%");
      ocean_fill.append("stop").attr("offset", "5%").attr("stop-color", "blue");
      ocean_fill.append("stop").attr("offset", "100%").attr("stop-color", "blue");

  var globe_highlight = svg.append("defs").append("radialGradient")
        .attr("id", "globe_highlight")
        .attr("cx", "75%")
        .attr("cy", "25%");
      globe_highlight.append("stop")
        .attr("offset", "5%").attr("stop-color", "#ffd")
        .attr("stop-opacity","0.6");
      globe_highlight.append("stop")
        .attr("offset", "100%").attr("stop-color", "#ba9")
        .attr("stop-opacity","0.2");

  var globe_shading = svg.append("defs").append("radialGradient")
        .attr("id", "globe_shading")
        .attr("cx", "55%")
        .attr("cy", "45%");
      globe_shading.append("stop")
        .attr("offset","30%").attr("stop-color", "yellow")
        .attr("stop-opacity","0")
      globe_shading.append("stop")
        .attr("offset","100%").attr("stop-color", "yellow")
        .attr("stop-opacity","0.3")

  var drop_shadow = svg.append("defs").append("radialGradient")
        .attr("id", "drop_shadow")
        .attr("cx", "50%")
        .attr("cy", "50%");
      drop_shadow.append("stop")
        .attr("offset","20%").attr("stop-color", "#000")
        .attr("stop-opacity",".5")
      drop_shadow.append("stop")
        .attr("offset","100%").attr("stop-color", "#000")
        .attr("stop-opacity","0")

  svg.append("ellipse")
    .attr("cx", 440).attr("cy", 450)
    .attr("rx", proj.scale()*.90)
    .attr("ry", proj.scale()*.25)
    .attr("class", "noclicks")
    .style("fill", "url(#drop_shadow)");

  svg.append("circle")
    .attr("cx", width / 2).attr("cy", height / 2)
    .attr("r", proj.scale())
    .attr("class", "noclicks")
    .style("fill", "url(#ocean_fill)");

  svg.append("path")
    .datum(topojson.object(world, world.objects.land))
    .attr("class", "land noclicks")
    .attr("d", path);

  svg.append("circle")
    .attr("cx", width / 2).attr("cy", height / 2)
    .attr("r", proj.scale())
    .attr("class","noclicks")
    .style("fill", "url(#globe_highlight)");

  svg.append("circle")
    .attr("cx", width / 2).attr("cy", height / 2)
    .attr("r", proj.scale())
    .attr("class","noclicks")
    .style("fill", "url(#globe_shading)");

  svg.append("g").attr("class","points")
      .selectAll("text").data(places.features)
    .enter().append("path")
      .attr("class", "point")
      .attr("d", path);

      var select;
      var x = document.getElementById("countryselectid").value;
      //contains country name string
      var y = document.getElementById("mySelectCat").value;
      //contains country name string
      //console.log(y);

      if(x=="All" && y=="All"){
      select = 1;
      }
      else if(y=="All"){
      select = 2;
      }
      else if(x=="All"){
      select = 3;
      }
      else{
      select = 4;
      }
      console.log(select);
      // spawn links between cities as source/target coord pairs
      places.features.forEach(function(a) {
        if(select==1){
          links.push({
            source: a.geometry.coordinates,
            target: a.end.geometry.coordinates,
          });
          if(a.relation>0){
            greenlinks.push({
              source: a.geometry.coordinates,
              target: a.end.geometry.coordinates,
              title: a.title,
              src: a.src,
            })
          }
          else{
            redlinks.push({
              source: a.geometry.coordinates,
              target: a.end.geometry.coordinates,
              title: a.title,
              src: a.src
            })
          }
        }

        else if(select==2){
          if(a.countries.includes(x)){
            links.push({
              source: a.geometry.coordinates,
              target: a.end.geometry.coordinates,
            });
            if(a.relation>0){
              greenlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src,
              })
            }
            else{
              redlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src
              })
            }
          }
        }

        else if(select==3){
          if(a.tags[0].includes(y)){
            links.push({
              source: a.geometry.coordinates,
              target: a.end.geometry.coordinates,
            });
            if(a.relation>0){
              greenlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src,
              })
            }
            else{
              redlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src
              })
            }
          }
        }

        else if(select==4){
          if(a.countries.includes(x) && a.tags[0].includes(y)){
            links.push({
              source: a.geometry.coordinates,
              target: a.end.geometry.coordinates,
            });
            if(a.relation>0){
              greenlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src,
              })
            }
            else{
              redlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src
              })
            }
          }
        }
      });
  // build geoJSON features from links array
  links.forEach(function(e,i,a) {
    var feature =   { "type": "Feature", "geometry": { "type": "LineString", "coordinates": [e.source,e.target] }}
    arcLines.push(feature)
  })

  d3.select("#myRange")
    .on("input", function() {

      var myValue = this.value
      console.log(myValue);
  })

  svg.append("g").attr("class","arcs")
    .selectAll("path").data(arcLines)
    .enter().append("path")
      .attr("class","arc")
      .attr("d",path)

      svg.append("g").attr("class","flyers")
        .selectAll("path").data(redlinks)
        .enter().append("path")
          .attr("class","redflyer")
          .attr("d", function(d) { return swoosh(flying_arc(d)) })
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut)
          .on("mouseenter", clicked);

      svg.append("g").attr("class","flyers")
        .selectAll("path").data(greenlinks)
        .enter().append("path")
          .attr("class","greenflyer")
          .attr("d", function(d) { return swoosh(flying_arc(d)) })
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut)
          .on("mouseenter", clicked);


function clicked(d){
  svg.append("svg:image")
  .attr("id", "myimg")
  .attr("xlink:href", d.src)
  .attr("width", 300)
  .attr("height", 300)
  .attr("x", 710)
  .attr("y",80);
}

function handleMouseOver(d){
  d3.select(this)
      .style("stroke-width", 8)
  svg.append("text").attr({
               id: "intext",  // Create an id for text so we can select it later for removing on mouseout
                x: "100",
                y: "20",
              })
            .text(function() {
              return [d.title];  // Value of the text
            });

}
function handleMouseOut(d){
  d3.select(this)
      .style("stroke-width", 3)
  d3.select("#intext").remove();
  d3.select("#myimg").remove();
}
  refresh();
}

function flying_arc(pts) {
  var source = pts.source,
      target = pts.target;

  var mid = location_along_arc(source, target, .5);
  var result = [ proj(source),
                 sky(mid),
                 proj(target) ]
  return result;
}



function refresh() {
  svg.selectAll(".land").attr("d", path);
  svg.selectAll(".point").attr("d", path);

  svg.selectAll(".arc").attr("d", path)
    .attr("opacity", function(d) {
        return fade_at_edge(d)
    })

  svg.selectAll(".greenflyer")
    .attr("d", function(d) { return swoosh(flying_arc(d)) })
    .attr("opacity", function(d) {
      return fade_at_edge(d)
    })
  svg.selectAll(".redflyer")
    .attr("d", function(d) { return swoosh(flying_arc(d)) })
    .attr("opacity", function(d) {
      return fade_at_edge(d)
  })
}

function fade_at_edge(d) {
  var centerPos = proj.invert([width/2,height/2]),
      arc = d3.geo.greatArc(),
      start, end;
  // function is called on 2 different data structures..
  if (d.source) {
    start = d.source,
    end = d.target;
  }
  else {
    start = d.geometry.coordinates[0];
    end = d.geometry.coordinates[1];
  }

  var start_dist = 1.57 - arc.distance({source: start, target: centerPos}),
      end_dist = 1.57 - arc.distance({source: end, target: centerPos});

  var fade = d3.scale.linear().domain([-.1,0]).range([0,.1])
  var dist = start_dist < end_dist ? start_dist : end_dist;

  return fade(dist)
}

function location_along_arc(start, end, loc) {
  var interpolator = d3.geo.interpolate(start,end);
  return interpolator(loc)
}

// modified from http://bl.ocks.org/1392560
var m0, o0;
function mousedown() {
  m0 = [d3.event.pageX, d3.event.pageY];
  o0 = proj.rotate();
  d3.event.preventDefault();
}
function mousemove() {
  if (m0) {
    var m1 = [d3.event.pageX, d3.event.pageY]
      , o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
    o1[1] = o1[1] > 30  ? 30  :
            o1[1] < -30 ? -30 :
            o1[1];
    proj.rotate(o1);
    sky.rotate(o1);
    refresh();
  }
}
function mouseup() {
  if (m0) {
    mousemove();
    m0 = null;
  }
}

function updateData1(){
  svg.selectAll("*").remove();
  links.length = 0;
  redlinks.length = 0;
  greenlinks.length = 0;
  arcLines.length = 0;

  queue()
      .defer(d3.json, "world-110m.json")
      .defer(d3.json, "data/places1.json")
      .await(ready);
  function ready(error, world, places) {
    var ocean_fill = svg.append("defs").append("radialGradient")
          .attr("id", "ocean_fill")
          .attr("cx", "75%")
          .attr("cy", "25%");
        ocean_fill.append("stop").attr("offset", "5%").attr("stop-color", "blue");
        ocean_fill.append("stop").attr("offset", "100%").attr("stop-color", "blue");

    var globe_highlight = svg.append("defs").append("radialGradient")
          .attr("id", "globe_highlight")
          .attr("cx", "75%")
          .attr("cy", "25%");
        globe_highlight.append("stop")
          .attr("offset", "5%").attr("stop-color", "#ffd")
          .attr("stop-opacity","0.6");
        globe_highlight.append("stop")
          .attr("offset", "100%").attr("stop-color", "#ba9")
          .attr("stop-opacity","0.2");

    var globe_shading = svg.append("defs").append("radialGradient")
          .attr("id", "globe_shading")
          .attr("cx", "55%")
          .attr("cy", "45%");
        globe_shading.append("stop")
          .attr("offset","30%").attr("stop-color", "yellow")
          .attr("stop-opacity","0")
        globe_shading.append("stop")
          .attr("offset","100%").attr("stop-color", "yellow")
          .attr("stop-opacity","0.3")

    var drop_shadow = svg.append("defs").append("radialGradient")
          .attr("id", "drop_shadow")
          .attr("cx", "50%")
          .attr("cy", "50%");
        drop_shadow.append("stop")
          .attr("offset","20%").attr("stop-color", "#000")
          .attr("stop-opacity",".5")
        drop_shadow.append("stop")
          .attr("offset","100%").attr("stop-color", "#000")
          .attr("stop-opacity","0")

    svg.append("ellipse")
      .attr("cx", 440).attr("cy", 450)
      .attr("rx", proj.scale()*.90)
      .attr("ry", proj.scale()*.25)
      .attr("class", "noclicks")
      .style("fill", "url(#drop_shadow)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class", "noclicks")
      .style("fill", "url(#ocean_fill)");

    svg.append("path")
      .datum(topojson.object(world, world.objects.land))
      .attr("class", "land noclicks")
      .attr("d", path);

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_highlight)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_shading)");

    svg.append("g").attr("class","points")
        .selectAll("text").data(places.features)
      .enter().append("path")
        .attr("class", "point")
        .attr("d", path);

        var select;
        var x = document.getElementById("countryselectid").value;
        //contains country name string
        var y = document.getElementById("mySelectCat").value;
        //contains country name string
        //console.log(y);

        if(x=="All" && y=="All"){
        select = 1;
        }
        else if(y=="All"){
        select = 2;
        }
        else if(x=="All"){
        select = 3;
        }
        else{
        select = 4;
        }
        console.log(select);
        // spawn links between cities as source/target coord pairs
        places.features.forEach(function(a) {
          if(select==1){
            links.push({
              source: a.geometry.coordinates,
              target: a.end.geometry.coordinates,
            });
            if(a.relation>0){
              greenlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src,
              })
            }
            else{
              redlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src
              })
            }
          }

          else if(select==2){
            if(a.countries.includes(x)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==3){
            if(a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==4){
            if(a.countries.includes(x) && a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }
        });

    // build geoJSON features from links array
    links.forEach(function(e,i,a) {
      var feature =   { "type": "Feature", "geometry": { "type": "LineString", "coordinates": [e.source,e.target] }}
      arcLines.push(feature)
    })

    d3.select("#myRange")
      .on("input", function() {

        var myValue = this.value
        console.log(myValue);
    })

    svg.append("g").attr("class","arcs")
      .selectAll("path").data(arcLines)
      .enter().append("path")
        .attr("class","arc")
        .attr("d",path)

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(redlinks)
          .enter().append("path")
            .attr("class","redflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(greenlinks)
          .enter().append("path")
            .attr("class","greenflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);


  function clicked(d){
    svg.append("svg:image")
    .attr("id", "myimg")
    .attr("xlink:href", d.src)
    .attr("width", 300)
    .attr("height", 300)
    .attr("x", 580)
    .attr("y",80);
  }

  function handleMouseOver(d){
    d3.select(this)
        .style("stroke-width", 8)
    svg.append("text").attr({
                 id: "intext",  // Create an id for text so we can select it later for removing on mouseout
                  x: "100",
                  y: "20",
                })
              .text(function() {
                return [d.title];  // Value of the text
              });

  }
  function handleMouseOut(d){
    d3.select(this)
        .style("stroke-width", 3)
    d3.select("#intext").remove();
    d3.select("#myimg").remove();
  }
    refresh();
  }

  function flying_arc(pts) {
    var source = pts.source,
        target = pts.target;

    var mid = location_along_arc(source, target, .5);
    var result = [ proj(source),
                   sky(mid),
                   proj(target) ]
    return result;
  }



  function refresh() {
    svg.selectAll(".land").attr("d", path);
    svg.selectAll(".point").attr("d", path);

    svg.selectAll(".arc").attr("d", path)
      .attr("opacity", function(d) {
          return fade_at_edge(d)
      })

    svg.selectAll(".greenflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
      })
    svg.selectAll(".redflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
    })
  }

  function fade_at_edge(d) {
    var centerPos = proj.invert([width/2,height/2]),
        arc = d3.geo.greatArc(),
        start, end;
    // function is called on 2 different data structures..
    if (d.source) {
      start = d.source,
      end = d.target;
    }
    else {
      start = d.geometry.coordinates[0];
      end = d.geometry.coordinates[1];
    }

    var start_dist = 1.57 - arc.distance({source: start, target: centerPos}),
        end_dist = 1.57 - arc.distance({source: end, target: centerPos});

    var fade = d3.scale.linear().domain([-.1,0]).range([0,.1])
    var dist = start_dist < end_dist ? start_dist : end_dist;

    return fade(dist)
  }

  function location_along_arc(start, end, loc) {
    var interpolator = d3.geo.interpolate(start,end);
    return interpolator(loc)
  }

  // modified from http://bl.ocks.org/1392560
  var m0, o0;
  function mousedown() {
    m0 = [d3.event.pageX, d3.event.pageY];
    o0 = proj.rotate();
    d3.event.preventDefault();
  }
  function mousemove() {
    if (m0) {
      var m1 = [d3.event.pageX, d3.event.pageY]
        , o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
      o1[1] = o1[1] > 30  ? 30  :
              o1[1] < -30 ? -30 :
              o1[1];
      proj.rotate(o1);
      sky.rotate(o1);
      refresh();
    }
  }
  function mouseup() {
    if (m0) {
      mousemove();
      m0 = null;
    }
  }
}

function updateData2(){
  svg.selectAll("*").remove();
  links.length = 0;
  redlinks.length = 0;
  greenlinks.length = 0;
  arcLines.length = 0;

  queue()
      .defer(d3.json, "world-110m.json")
      .defer(d3.json, "data/places2.json")
      .await(ready);
  function ready(error, world, places) {
    var ocean_fill = svg.append("defs").append("radialGradient")
          .attr("id", "ocean_fill")
          .attr("cx", "75%")
          .attr("cy", "25%");
        ocean_fill.append("stop").attr("offset", "5%").attr("stop-color", "blue");
        ocean_fill.append("stop").attr("offset", "100%").attr("stop-color", "blue");

    var globe_highlight = svg.append("defs").append("radialGradient")
          .attr("id", "globe_highlight")
          .attr("cx", "75%")
          .attr("cy", "25%");
        globe_highlight.append("stop")
          .attr("offset", "5%").attr("stop-color", "#ffd")
          .attr("stop-opacity","0.6");
        globe_highlight.append("stop")
          .attr("offset", "100%").attr("stop-color", "#ba9")
          .attr("stop-opacity","0.2");

    var globe_shading = svg.append("defs").append("radialGradient")
          .attr("id", "globe_shading")
          .attr("cx", "55%")
          .attr("cy", "45%");
        globe_shading.append("stop")
          .attr("offset","30%").attr("stop-color", "yellow")
          .attr("stop-opacity","0")
        globe_shading.append("stop")
          .attr("offset","100%").attr("stop-color", "yellow")
          .attr("stop-opacity","0.3")

    var drop_shadow = svg.append("defs").append("radialGradient")
          .attr("id", "drop_shadow")
          .attr("cx", "50%")
          .attr("cy", "50%");
        drop_shadow.append("stop")
          .attr("offset","20%").attr("stop-color", "#000")
          .attr("stop-opacity",".5")
        drop_shadow.append("stop")
          .attr("offset","100%").attr("stop-color", "#000")
          .attr("stop-opacity","0")

    svg.append("ellipse")
      .attr("cx", 440).attr("cy", 450)
      .attr("rx", proj.scale()*.90)
      .attr("ry", proj.scale()*.25)
      .attr("class", "noclicks")
      .style("fill", "url(#drop_shadow)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class", "noclicks")
      .style("fill", "url(#ocean_fill)");

    svg.append("path")
      .datum(topojson.object(world, world.objects.land))
      .attr("class", "land noclicks")
      .attr("d", path);

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_highlight)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_shading)");

    svg.append("g").attr("class","points")
        .selectAll("text").data(places.features)
      .enter().append("path")
        .attr("class", "point")
        .attr("d", path);

        var select;
        var x = document.getElementById("countryselectid").value;
        //contains country name string
        var y = document.getElementById("mySelectCat").value;
        //contains country name string
        //console.log(y);

        if(x=="All" && y=="All"){
        select = 1;
        }
        else if(y=="All"){
        select = 2;
        }
        else if(x=="All"){
        select = 3;
        }
        else{
        select = 4;
        }
        console.log(select);
        // spawn links between cities as source/target coord pairs
        places.features.forEach(function(a) {
          if(select==1){
            links.push({
              source: a.geometry.coordinates,
              target: a.end.geometry.coordinates,
            });
            if(a.relation>0){
              greenlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src,
              })
            }
            else{
              redlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src
              })
            }
          }

          else if(select==2){
            if(a.countries.includes(x)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==3){
            if(a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==4){
            if(a.countries.includes(x) && a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }
        });

    // build geoJSON features from links array
    links.forEach(function(e,i,a) {
      var feature =   { "type": "Feature", "geometry": { "type": "LineString", "coordinates": [e.source,e.target] }}
      arcLines.push(feature)
    })

    d3.select("#myRange")
      .on("input", function() {

        var myValue = this.value
        console.log(myValue);
    })

    svg.append("g").attr("class","arcs")
      .selectAll("path").data(arcLines)
      .enter().append("path")
        .attr("class","arc")
        .attr("d",path)

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(redlinks)
          .enter().append("path")
            .attr("class","redflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(greenlinks)
          .enter().append("path")
            .attr("class","greenflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);


  function clicked(d){
    svg.append("svg:image")
    .attr("id", "myimg")
    .attr("xlink:href", d.src)
    .attr("width", 300)
    .attr("height", 300)
    .attr("x", 580)
    .attr("y",80);
  }

  function handleMouseOver(d){
    d3.select(this)
        .style("stroke-width", 8)
    svg.append("text").attr({
                 id: "intext",  // Create an id for text so we can select it later for removing on mouseout
                  x: "100",
                  y: "20",
                })
              .text(function() {
                return [d.title];  // Value of the text
              });

  }
  function handleMouseOut(d){
    d3.select(this)
        .style("stroke-width", 3)
    d3.select("#intext").remove();
    d3.select("#myimg").remove();
  }
    refresh();
  }

  function flying_arc(pts) {
    var source = pts.source,
        target = pts.target;

    var mid = location_along_arc(source, target, .5);
    var result = [ proj(source),
                   sky(mid),
                   proj(target) ]
    return result;
  }



  function refresh() {
    svg.selectAll(".land").attr("d", path);
    svg.selectAll(".point").attr("d", path);

    svg.selectAll(".arc").attr("d", path)
      .attr("opacity", function(d) {
          return fade_at_edge(d)
      })

    svg.selectAll(".greenflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
      })
    svg.selectAll(".redflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
    })
  }

  function fade_at_edge(d) {
    var centerPos = proj.invert([width/2,height/2]),
        arc = d3.geo.greatArc(),
        start, end;
    // function is called on 2 different data structures..
    if (d.source) {
      start = d.source,
      end = d.target;
    }
    else {
      start = d.geometry.coordinates[0];
      end = d.geometry.coordinates[1];
    }

    var start_dist = 1.57 - arc.distance({source: start, target: centerPos}),
        end_dist = 1.57 - arc.distance({source: end, target: centerPos});

    var fade = d3.scale.linear().domain([-.1,0]).range([0,.1])
    var dist = start_dist < end_dist ? start_dist : end_dist;

    return fade(dist)
  }

  function location_along_arc(start, end, loc) {
    var interpolator = d3.geo.interpolate(start,end);
    return interpolator(loc)
  }

  // modified from http://bl.ocks.org/1392560
  var m0, o0;
  function mousedown() {
    m0 = [d3.event.pageX, d3.event.pageY];
    o0 = proj.rotate();
    d3.event.preventDefault();
  }
  function mousemove() {
    if (m0) {
      var m1 = [d3.event.pageX, d3.event.pageY]
        , o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
      o1[1] = o1[1] > 30  ? 30  :
              o1[1] < -30 ? -30 :
              o1[1];
      proj.rotate(o1);
      sky.rotate(o1);
      refresh();
    }
  }
  function mouseup() {
    if (m0) {
      mousemove();
      m0 = null;
    }
  }
}

function updateData3(){
  svg.selectAll("*").remove();
  links.length = 0;
  redlinks.length = 0;
  greenlinks.length = 0;
  arcLines.length = 0;

  queue()
      .defer(d3.json, "world-110m.json")
      .defer(d3.json, "data/places3.json")
      .await(ready);
  function ready(error, world, places) {
    var ocean_fill = svg.append("defs").append("radialGradient")
          .attr("id", "ocean_fill")
          .attr("cx", "75%")
          .attr("cy", "25%");
        ocean_fill.append("stop").attr("offset", "5%").attr("stop-color", "blue");
        ocean_fill.append("stop").attr("offset", "100%").attr("stop-color", "blue");

    var globe_highlight = svg.append("defs").append("radialGradient")
          .attr("id", "globe_highlight")
          .attr("cx", "75%")
          .attr("cy", "25%");
        globe_highlight.append("stop")
          .attr("offset", "5%").attr("stop-color", "#ffd")
          .attr("stop-opacity","0.6");
        globe_highlight.append("stop")
          .attr("offset", "100%").attr("stop-color", "#ba9")
          .attr("stop-opacity","0.2");

    var globe_shading = svg.append("defs").append("radialGradient")
          .attr("id", "globe_shading")
          .attr("cx", "55%")
          .attr("cy", "45%");
        globe_shading.append("stop")
          .attr("offset","30%").attr("stop-color", "yellow")
          .attr("stop-opacity","0")
        globe_shading.append("stop")
          .attr("offset","100%").attr("stop-color", "yellow")
          .attr("stop-opacity","0.3")

    var drop_shadow = svg.append("defs").append("radialGradient")
          .attr("id", "drop_shadow")
          .attr("cx", "50%")
          .attr("cy", "50%");
        drop_shadow.append("stop")
          .attr("offset","20%").attr("stop-color", "#000")
          .attr("stop-opacity",".5")
        drop_shadow.append("stop")
          .attr("offset","100%").attr("stop-color", "#000")
          .attr("stop-opacity","0")

    svg.append("ellipse")
      .attr("cx", 440).attr("cy", 450)
      .attr("rx", proj.scale()*.90)
      .attr("ry", proj.scale()*.25)
      .attr("class", "noclicks")
      .style("fill", "url(#drop_shadow)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class", "noclicks")
      .style("fill", "url(#ocean_fill)");

    svg.append("path")
      .datum(topojson.object(world, world.objects.land))
      .attr("class", "land noclicks")
      .attr("d", path);

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_highlight)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_shading)");

    svg.append("g").attr("class","points")
        .selectAll("text").data(places.features)
      .enter().append("path")
        .attr("class", "point")
        .attr("d", path);

        var select;
        var x = document.getElementById("countryselectid").value;
        //contains country name string
        var y = document.getElementById("mySelectCat").value;
        //contains country name string
        //console.log(y);

        if(x=="All" && y=="All"){
        select = 1;
        }
        else if(y=="All"){
        select = 2;
        }
        else if(x=="All"){
        select = 3;
        }
        else{
        select = 4;
        }
        console.log(select);
        // spawn links between cities as source/target coord pairs
        places.features.forEach(function(a) {
          if(select==1){
            links.push({
              source: a.geometry.coordinates,
              target: a.end.geometry.coordinates,
            });
            if(a.relation>0){
              greenlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src,
              })
            }
            else{
              redlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src
              })
            }
          }

          else if(select==2){
            if(a.countries.includes(x)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==3){
            if(a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==4){
            if(a.countries.includes(x) && a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }
        });

    // build geoJSON features from links array
    links.forEach(function(e,i,a) {
      var feature =   { "type": "Feature", "geometry": { "type": "LineString", "coordinates": [e.source,e.target] }}
      arcLines.push(feature)
    })

    d3.select("#myRange")
      .on("input", function() {

        var myValue = this.value
        console.log(myValue);
    })

    svg.append("g").attr("class","arcs")
      .selectAll("path").data(arcLines)
      .enter().append("path")
        .attr("class","arc")
        .attr("d",path)

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(redlinks)
          .enter().append("path")
            .attr("class","redflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(greenlinks)
          .enter().append("path")
            .attr("class","greenflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);


  function clicked(d){
    svg.append("svg:image")
    .attr("id", "myimg")
    .attr("xlink:href", d.src)
    .attr("width", 300)
    .attr("height", 300)
    .attr("x", 580)
    .attr("y",80);
  }

  function handleMouseOver(d){
    d3.select(this)
        .style("stroke-width", 8)
    svg.append("text").attr({
                 id: "intext",  // Create an id for text so we can select it later for removing on mouseout
                  x: "100",
                  y: "20",
                })
              .text(function() {
                return [d.title];  // Value of the text
              });

  }
  function handleMouseOut(d){
    d3.select(this)
        .style("stroke-width", 3)
    d3.select("#intext").remove();
    d3.select("#myimg").remove();
  }
    refresh();
  }

  function flying_arc(pts) {
    var source = pts.source,
        target = pts.target;

    var mid = location_along_arc(source, target, .5);
    var result = [ proj(source),
                   sky(mid),
                   proj(target) ]
    return result;
  }



  function refresh() {
    svg.selectAll(".land").attr("d", path);
    svg.selectAll(".point").attr("d", path);

    svg.selectAll(".arc").attr("d", path)
      .attr("opacity", function(d) {
          return fade_at_edge(d)
      })

    svg.selectAll(".greenflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
      })
    svg.selectAll(".redflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
    })
  }

  function fade_at_edge(d) {
    var centerPos = proj.invert([width/2,height/2]),
        arc = d3.geo.greatArc(),
        start, end;
    // function is called on 2 different data structures..
    if (d.source) {
      start = d.source,
      end = d.target;
    }
    else {
      start = d.geometry.coordinates[0];
      end = d.geometry.coordinates[1];
    }

    var start_dist = 1.57 - arc.distance({source: start, target: centerPos}),
        end_dist = 1.57 - arc.distance({source: end, target: centerPos});

    var fade = d3.scale.linear().domain([-.1,0]).range([0,.1])
    var dist = start_dist < end_dist ? start_dist : end_dist;

    return fade(dist)
  }

  function location_along_arc(start, end, loc) {
    var interpolator = d3.geo.interpolate(start,end);
    return interpolator(loc)
  }

  // modified from http://bl.ocks.org/1392560
  var m0, o0;
  function mousedown() {
    m0 = [d3.event.pageX, d3.event.pageY];
    o0 = proj.rotate();
    d3.event.preventDefault();
  }
  function mousemove() {
    if (m0) {
      var m1 = [d3.event.pageX, d3.event.pageY]
        , o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
      o1[1] = o1[1] > 30  ? 30  :
              o1[1] < -30 ? -30 :
              o1[1];
      proj.rotate(o1);
      sky.rotate(o1);
      refresh();
    }
  }
  function mouseup() {
    if (m0) {
      mousemove();
      m0 = null;
    }
  }
}

function updateData4(){
  svg.selectAll("*").remove();
  links.length = 0;
  redlinks.length = 0;
  greenlinks.length = 0;
  arcLines.length = 0;

  queue()
      .defer(d3.json, "world-110m.json")
      .defer(d3.json, "data/places4.json")
      .await(ready);
  function ready(error, world, places) {
    var ocean_fill = svg.append("defs").append("radialGradient")
          .attr("id", "ocean_fill")
          .attr("cx", "75%")
          .attr("cy", "25%");
        ocean_fill.append("stop").attr("offset", "5%").attr("stop-color", "blue");
        ocean_fill.append("stop").attr("offset", "100%").attr("stop-color", "blue");

    var globe_highlight = svg.append("defs").append("radialGradient")
          .attr("id", "globe_highlight")
          .attr("cx", "75%")
          .attr("cy", "25%");
        globe_highlight.append("stop")
          .attr("offset", "5%").attr("stop-color", "#ffd")
          .attr("stop-opacity","0.6");
        globe_highlight.append("stop")
          .attr("offset", "100%").attr("stop-color", "#ba9")
          .attr("stop-opacity","0.2");

    var globe_shading = svg.append("defs").append("radialGradient")
          .attr("id", "globe_shading")
          .attr("cx", "55%")
          .attr("cy", "45%");
        globe_shading.append("stop")
          .attr("offset","30%").attr("stop-color", "yellow")
          .attr("stop-opacity","0")
        globe_shading.append("stop")
          .attr("offset","100%").attr("stop-color", "yellow")
          .attr("stop-opacity","0.3")

    var drop_shadow = svg.append("defs").append("radialGradient")
          .attr("id", "drop_shadow")
          .attr("cx", "50%")
          .attr("cy", "50%");
        drop_shadow.append("stop")
          .attr("offset","20%").attr("stop-color", "#000")
          .attr("stop-opacity",".5")
        drop_shadow.append("stop")
          .attr("offset","100%").attr("stop-color", "#000")
          .attr("stop-opacity","0")

    svg.append("ellipse")
      .attr("cx", 440).attr("cy", 450)
      .attr("rx", proj.scale()*.90)
      .attr("ry", proj.scale()*.25)
      .attr("class", "noclicks")
      .style("fill", "url(#drop_shadow)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class", "noclicks")
      .style("fill", "url(#ocean_fill)");

    svg.append("path")
      .datum(topojson.object(world, world.objects.land))
      .attr("class", "land noclicks")
      .attr("d", path);

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_highlight)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_shading)");

    svg.append("g").attr("class","points")
        .selectAll("text").data(places.features)
      .enter().append("path")
        .attr("class", "point")
        .attr("d", path);

        var select;
        var x = document.getElementById("countryselectid").value;
        //contains country name string
        var y = document.getElementById("mySelectCat").value;
        //contains country name string
        //console.log(y);

        if(x=="All" && y=="All"){
        select = 1;
        }
        else if(y=="All"){
        select = 2;
        }
        else if(x=="All"){
        select = 3;
        }
        else{
        select = 4;
        }
        console.log(select);
        // spawn links between cities as source/target coord pairs
        places.features.forEach(function(a) {
          if(select==1){
            links.push({
              source: a.geometry.coordinates,
              target: a.end.geometry.coordinates,
            });
            if(a.relation>0){
              greenlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src,
              })
            }
            else{
              redlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src
              })
            }
          }

          else if(select==2){
            if(a.countries.includes(x)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==3){
            if(a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==4){
            if(a.countries.includes(x) && a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }
        });

    // build geoJSON features from links array
    links.forEach(function(e,i,a) {
      var feature =   { "type": "Feature", "geometry": { "type": "LineString", "coordinates": [e.source,e.target] }}
      arcLines.push(feature)
    })

    d3.select("#myRange")
      .on("input", function() {

        var myValue = this.value
        console.log(myValue);
    })

    svg.append("g").attr("class","arcs")
      .selectAll("path").data(arcLines)
      .enter().append("path")
        .attr("class","arc")
        .attr("d",path)

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(redlinks)
          .enter().append("path")
            .attr("class","redflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(greenlinks)
          .enter().append("path")
            .attr("class","greenflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);


  function clicked(d){
    svg.append("svg:image")
    .attr("id", "myimg")
    .attr("xlink:href", d.src)
    .attr("width", 300)
    .attr("height", 300)
    .attr("x", 580)
    .attr("y",80);
  }

  function handleMouseOver(d){
    d3.select(this)
        .style("stroke-width", 8)
    svg.append("text").attr({
                 id: "intext",  // Create an id for text so we can select it later for removing on mouseout
                  x: "100",
                  y: "20",
                })
              .text(function() {
                return [d.title];  // Value of the text
              });

  }
  function handleMouseOut(d){
    d3.select(this)
        .style("stroke-width", 3)
    d3.select("#intext").remove();
    d3.select("#myimg").remove();
  }
    refresh();
  }

  function flying_arc(pts) {
    var source = pts.source,
        target = pts.target;

    var mid = location_along_arc(source, target, .5);
    var result = [ proj(source),
                   sky(mid),
                   proj(target) ]
    return result;
  }



  function refresh() {
    svg.selectAll(".land").attr("d", path);
    svg.selectAll(".point").attr("d", path);

    svg.selectAll(".arc").attr("d", path)
      .attr("opacity", function(d) {
          return fade_at_edge(d)
      })

    svg.selectAll(".greenflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
      })
    svg.selectAll(".redflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
    })
  }

  function fade_at_edge(d) {
    var centerPos = proj.invert([width/2,height/2]),
        arc = d3.geo.greatArc(),
        start, end;
    // function is called on 2 different data structures..
    if (d.source) {
      start = d.source,
      end = d.target;
    }
    else {
      start = d.geometry.coordinates[0];
      end = d.geometry.coordinates[1];
    }

    var start_dist = 1.57 - arc.distance({source: start, target: centerPos}),
        end_dist = 1.57 - arc.distance({source: end, target: centerPos});

    var fade = d3.scale.linear().domain([-.1,0]).range([0,.1])
    var dist = start_dist < end_dist ? start_dist : end_dist;

    return fade(dist)
  }

  function location_along_arc(start, end, loc) {
    var interpolator = d3.geo.interpolate(start,end);
    return interpolator(loc)
  }

  // modified from http://bl.ocks.org/1392560
  var m0, o0;
  function mousedown() {
    m0 = [d3.event.pageX, d3.event.pageY];
    o0 = proj.rotate();
    d3.event.preventDefault();
  }
  function mousemove() {
    if (m0) {
      var m1 = [d3.event.pageX, d3.event.pageY]
        , o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
      o1[1] = o1[1] > 30  ? 30  :
              o1[1] < -30 ? -30 :
              o1[1];
      proj.rotate(o1);
      sky.rotate(o1);
      refresh();
    }
  }
  function mouseup() {
    if (m0) {
      mousemove();
      m0 = null;
    }
  }
}

function updateData5(){
  svg.selectAll("*").remove();
  links.length = 0;
  redlinks.length = 0;
  greenlinks.length = 0;
  arcLines.length = 0;

  queue()
      .defer(d3.json, "world-110m.json")
      .defer(d3.json, "data/places5.json")
      .await(ready);
  function ready(error, world, places) {
    var ocean_fill = svg.append("defs").append("radialGradient")
          .attr("id", "ocean_fill")
          .attr("cx", "75%")
          .attr("cy", "25%");
        ocean_fill.append("stop").attr("offset", "5%").attr("stop-color", "blue");
        ocean_fill.append("stop").attr("offset", "100%").attr("stop-color", "blue");

    var globe_highlight = svg.append("defs").append("radialGradient")
          .attr("id", "globe_highlight")
          .attr("cx", "75%")
          .attr("cy", "25%");
        globe_highlight.append("stop")
          .attr("offset", "5%").attr("stop-color", "#ffd")
          .attr("stop-opacity","0.6");
        globe_highlight.append("stop")
          .attr("offset", "100%").attr("stop-color", "#ba9")
          .attr("stop-opacity","0.2");

    var globe_shading = svg.append("defs").append("radialGradient")
          .attr("id", "globe_shading")
          .attr("cx", "55%")
          .attr("cy", "45%");
        globe_shading.append("stop")
          .attr("offset","30%").attr("stop-color", "yellow")
          .attr("stop-opacity","0")
        globe_shading.append("stop")
          .attr("offset","100%").attr("stop-color", "yellow")
          .attr("stop-opacity","0.3")

    var drop_shadow = svg.append("defs").append("radialGradient")
          .attr("id", "drop_shadow")
          .attr("cx", "50%")
          .attr("cy", "50%");
        drop_shadow.append("stop")
          .attr("offset","20%").attr("stop-color", "#000")
          .attr("stop-opacity",".5")
        drop_shadow.append("stop")
          .attr("offset","100%").attr("stop-color", "#000")
          .attr("stop-opacity","0")

    svg.append("ellipse")
      .attr("cx", 440).attr("cy", 450)
      .attr("rx", proj.scale()*.90)
      .attr("ry", proj.scale()*.25)
      .attr("class", "noclicks")
      .style("fill", "url(#drop_shadow)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class", "noclicks")
      .style("fill", "url(#ocean_fill)");

    svg.append("path")
      .datum(topojson.object(world, world.objects.land))
      .attr("class", "land noclicks")
      .attr("d", path);

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_highlight)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_shading)");

    svg.append("g").attr("class","points")
        .selectAll("text").data(places.features)
      .enter().append("path")
        .attr("class", "point")
        .attr("d", path);

        var select;
        var x = document.getElementById("countryselectid").value;
        //contains country name string
        var y = document.getElementById("mySelectCat").value;
        //contains country name string
        //console.log(y);

        if(x=="All" && y=="All"){
        select = 1;
        }
        else if(y=="All"){
        select = 2;
        }
        else if(x=="All"){
        select = 3;
        }
        else{
        select = 4;
        }
        console.log(select);
        // spawn links between cities as source/target coord pairs
        places.features.forEach(function(a) {
          if(select==1){
            links.push({
              source: a.geometry.coordinates,
              target: a.end.geometry.coordinates,
            });
            if(a.relation>0){
              greenlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src,
              })
            }
            else{
              redlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src
              })
            }
          }

          else if(select==2){
            if(a.countries.includes(x)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==3){
            if(a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==4){
            if(a.countries.includes(x) && a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }
        });

    // build geoJSON features from links array
    links.forEach(function(e,i,a) {
      var feature =   { "type": "Feature", "geometry": { "type": "LineString", "coordinates": [e.source,e.target] }}
      arcLines.push(feature)
    })

    d3.select("#myRange")
      .on("input", function() {

        var myValue = this.value
        console.log(myValue);
    })

    svg.append("g").attr("class","arcs")
      .selectAll("path").data(arcLines)
      .enter().append("path")
        .attr("class","arc")
        .attr("d",path)

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(redlinks)
          .enter().append("path")
            .attr("class","redflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(greenlinks)
          .enter().append("path")
            .attr("class","greenflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);


  function clicked(d){
    svg.append("svg:image")
    .attr("id", "myimg")
    .attr("xlink:href", d.src)
    .attr("width", 300)
    .attr("height", 300)
    .attr("x", 580)
    .attr("y",80);
  }

  function handleMouseOver(d){
    d3.select(this)
        .style("stroke-width", 8)
    svg.append("text").attr({
                 id: "intext",  // Create an id for text so we can select it later for removing on mouseout
                  x: "100",
                  y: "20",
                })
              .text(function() {
                return [d.title];  // Value of the text
              });

  }
  function handleMouseOut(d){
    d3.select(this)
        .style("stroke-width", 3)
    d3.select("#intext").remove();
    d3.select("#myimg").remove();
  }
    refresh();
  }

  function flying_arc(pts) {
    var source = pts.source,
        target = pts.target;

    var mid = location_along_arc(source, target, .5);
    var result = [ proj(source),
                   sky(mid),
                   proj(target) ]
    return result;
  }



  function refresh() {
    svg.selectAll(".land").attr("d", path);
    svg.selectAll(".point").attr("d", path);

    svg.selectAll(".arc").attr("d", path)
      .attr("opacity", function(d) {
          return fade_at_edge(d)
      })

    svg.selectAll(".greenflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
      })
    svg.selectAll(".redflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
    })
  }

  function fade_at_edge(d) {
    var centerPos = proj.invert([width/2,height/2]),
        arc = d3.geo.greatArc(),
        start, end;
    // function is called on 2 different data structures..
    if (d.source) {
      start = d.source,
      end = d.target;
    }
    else {
      start = d.geometry.coordinates[0];
      end = d.geometry.coordinates[1];
    }

    var start_dist = 1.57 - arc.distance({source: start, target: centerPos}),
        end_dist = 1.57 - arc.distance({source: end, target: centerPos});

    var fade = d3.scale.linear().domain([-.1,0]).range([0,.1])
    var dist = start_dist < end_dist ? start_dist : end_dist;

    return fade(dist)
  }

  function location_along_arc(start, end, loc) {
    var interpolator = d3.geo.interpolate(start,end);
    return interpolator(loc)
  }

  // modified from http://bl.ocks.org/1392560
  var m0, o0;
  function mousedown() {
    m0 = [d3.event.pageX, d3.event.pageY];
    o0 = proj.rotate();
    d3.event.preventDefault();
  }
  function mousemove() {
    if (m0) {
      var m1 = [d3.event.pageX, d3.event.pageY]
        , o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
      o1[1] = o1[1] > 30  ? 30  :
              o1[1] < -30 ? -30 :
              o1[1];
      proj.rotate(o1);
      sky.rotate(o1);
      refresh();
    }
  }
  function mouseup() {
    if (m0) {
      mousemove();
      m0 = null;
    }
  }
}

function updateData6(){
  svg.selectAll("*").remove();
  links.length = 0;
  redlinks.length = 0;
  greenlinks.length = 0;
  arcLines.length = 0;

  queue()
      .defer(d3.json, "world-110m.json")
      .defer(d3.json, "data/places6.json")
      .await(ready);
  function ready(error, world, places) {
    var ocean_fill = svg.append("defs").append("radialGradient")
          .attr("id", "ocean_fill")
          .attr("cx", "75%")
          .attr("cy", "25%");
        ocean_fill.append("stop").attr("offset", "5%").attr("stop-color", "blue");
        ocean_fill.append("stop").attr("offset", "100%").attr("stop-color", "blue");

    var globe_highlight = svg.append("defs").append("radialGradient")
          .attr("id", "globe_highlight")
          .attr("cx", "75%")
          .attr("cy", "25%");
        globe_highlight.append("stop")
          .attr("offset", "5%").attr("stop-color", "#ffd")
          .attr("stop-opacity","0.6");
        globe_highlight.append("stop")
          .attr("offset", "100%").attr("stop-color", "#ba9")
          .attr("stop-opacity","0.2");

    var globe_shading = svg.append("defs").append("radialGradient")
          .attr("id", "globe_shading")
          .attr("cx", "55%")
          .attr("cy", "45%");
        globe_shading.append("stop")
          .attr("offset","30%").attr("stop-color", "yellow")
          .attr("stop-opacity","0")
        globe_shading.append("stop")
          .attr("offset","100%").attr("stop-color", "yellow")
          .attr("stop-opacity","0.3")

    var drop_shadow = svg.append("defs").append("radialGradient")
          .attr("id", "drop_shadow")
          .attr("cx", "50%")
          .attr("cy", "50%");
        drop_shadow.append("stop")
          .attr("offset","20%").attr("stop-color", "#000")
          .attr("stop-opacity",".5")
        drop_shadow.append("stop")
          .attr("offset","100%").attr("stop-color", "#000")
          .attr("stop-opacity","0")

    svg.append("ellipse")
      .attr("cx", 440).attr("cy", 450)
      .attr("rx", proj.scale()*.90)
      .attr("ry", proj.scale()*.25)
      .attr("class", "noclicks")
      .style("fill", "url(#drop_shadow)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class", "noclicks")
      .style("fill", "url(#ocean_fill)");

    svg.append("path")
      .datum(topojson.object(world, world.objects.land))
      .attr("class", "land noclicks")
      .attr("d", path);

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_highlight)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_shading)");

    svg.append("g").attr("class","points")
        .selectAll("text").data(places.features)
      .enter().append("path")
        .attr("class", "point")
        .attr("d", path);

        var select;
        var x = document.getElementById("countryselectid").value;
        //contains country name string
        var y = document.getElementById("mySelectCat").value;
        //contains country name string
        //console.log(y);

        if(x=="All" && y=="All"){
        select = 1;
        }
        else if(y=="All"){
        select = 2;
        }
        else if(x=="All"){
        select = 3;
        }
        else{
        select = 4;
        }
        console.log(select);
        // spawn links between cities as source/target coord pairs
        places.features.forEach(function(a) {
          if(select==1){
            links.push({
              source: a.geometry.coordinates,
              target: a.end.geometry.coordinates,
            });
            if(a.relation>0){
              greenlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src,
              })
            }
            else{
              redlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src
              })
            }
          }

          else if(select==2){
            if(a.countries.includes(x)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==3){
            if(a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==4){
            if(a.countries.includes(x) && a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }
        });

    // build geoJSON features from links array
    links.forEach(function(e,i,a) {
      var feature =   { "type": "Feature", "geometry": { "type": "LineString", "coordinates": [e.source,e.target] }}
      arcLines.push(feature)
    })

    d3.select("#myRange")
      .on("input", function() {

        var myValue = this.value
        console.log(myValue);
    })

    svg.append("g").attr("class","arcs")
      .selectAll("path").data(arcLines)
      .enter().append("path")
        .attr("class","arc")
        .attr("d",path)

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(redlinks)
          .enter().append("path")
            .attr("class","redflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(greenlinks)
          .enter().append("path")
            .attr("class","greenflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);


  function clicked(d){
    svg.append("svg:image")
    .attr("id", "myimg")
    .attr("xlink:href", d.src)
    .attr("width", 300)
    .attr("height", 300)
    .attr("x", 580)
    .attr("y",80);
  }

  function handleMouseOver(d){
    d3.select(this)
        .style("stroke-width", 8)
    svg.append("text").attr({
                 id: "intext",  // Create an id for text so we can select it later for removing on mouseout
                  x: "100",
                  y: "20",
                })
              .text(function() {
                return [d.title];  // Value of the text
              });

  }
  function handleMouseOut(d){
    ////console.log("Bye");
    d3.select(this)
        .style("stroke-width", 3)
    d3.select("#intext").remove();
    d3.select("#myimg").remove();
  }
    refresh();
  }

  function flying_arc(pts) {
    var source = pts.source,
        target = pts.target;

    var mid = location_along_arc(source, target, .5);
    var result = [ proj(source),
                   sky(mid),
                   proj(target) ]
    return result;
  }



  function refresh() {
    svg.selectAll(".land").attr("d", path);
    svg.selectAll(".point").attr("d", path);

    svg.selectAll(".arc").attr("d", path)
      .attr("opacity", function(d) {
          return fade_at_edge(d)
      })

    svg.selectAll(".greenflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
      })
    svg.selectAll(".redflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
    })
  }

  function fade_at_edge(d) {
    var centerPos = proj.invert([width/2,height/2]),
        arc = d3.geo.greatArc(),
        start, end;
    // function is called on 2 different data structures..
    if (d.source) {
      start = d.source,
      end = d.target;
    }
    else {
      start = d.geometry.coordinates[0];
      end = d.geometry.coordinates[1];
    }

    var start_dist = 1.57 - arc.distance({source: start, target: centerPos}),
        end_dist = 1.57 - arc.distance({source: end, target: centerPos});

    var fade = d3.scale.linear().domain([-.1,0]).range([0,.1])
    var dist = start_dist < end_dist ? start_dist : end_dist;

    return fade(dist)
  }

  function location_along_arc(start, end, loc) {
    var interpolator = d3.geo.interpolate(start,end);
    return interpolator(loc)
  }

  // modified from http://bl.ocks.org/1392560
  var m0, o0;
  function mousedown() {
    m0 = [d3.event.pageX, d3.event.pageY];
    o0 = proj.rotate();
    d3.event.preventDefault();
  }
  function mousemove() {
    if (m0) {
      var m1 = [d3.event.pageX, d3.event.pageY]
        , o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
      o1[1] = o1[1] > 30  ? 30  :
              o1[1] < -30 ? -30 :
              o1[1];
      proj.rotate(o1);
      sky.rotate(o1);
      refresh();
    }
  }
  function mouseup() {
    if (m0) {
      mousemove();
      m0 = null;
    }
  }
}

function updateData7(){
  svg.selectAll("*").remove();
  links.length = 0;
  redlinks.length = 0;
  greenlinks.length = 0;
  arcLines.length = 0;

  queue()
      .defer(d3.json, "world-110m.json")
      .defer(d3.json, "data/places7.json")
      .await(ready);
  function ready(error, world, places) {
    var ocean_fill = svg.append("defs").append("radialGradient")
          .attr("id", "ocean_fill")
          .attr("cx", "75%")
          .attr("cy", "25%");
        ocean_fill.append("stop").attr("offset", "5%").attr("stop-color", "blue");
        ocean_fill.append("stop").attr("offset", "100%").attr("stop-color", "blue");

    var globe_highlight = svg.append("defs").append("radialGradient")
          .attr("id", "globe_highlight")
          .attr("cx", "75%")
          .attr("cy", "25%");
        globe_highlight.append("stop")
          .attr("offset", "5%").attr("stop-color", "#ffd")
          .attr("stop-opacity","0.6");
        globe_highlight.append("stop")
          .attr("offset", "100%").attr("stop-color", "#ba9")
          .attr("stop-opacity","0.2");

    var globe_shading = svg.append("defs").append("radialGradient")
          .attr("id", "globe_shading")
          .attr("cx", "55%")
          .attr("cy", "45%");
        globe_shading.append("stop")
          .attr("offset","30%").attr("stop-color", "yellow")
          .attr("stop-opacity","0")
        globe_shading.append("stop")
          .attr("offset","100%").attr("stop-color", "yellow")
          .attr("stop-opacity","0.3")

    var drop_shadow = svg.append("defs").append("radialGradient")
          .attr("id", "drop_shadow")
          .attr("cx", "50%")
          .attr("cy", "50%");
        drop_shadow.append("stop")
          .attr("offset","20%").attr("stop-color", "#000")
          .attr("stop-opacity",".5")
        drop_shadow.append("stop")
          .attr("offset","100%").attr("stop-color", "#000")
          .attr("stop-opacity","0")

    svg.append("ellipse")
      .attr("cx", 440).attr("cy", 450)
      .attr("rx", proj.scale()*.90)
      .attr("ry", proj.scale()*.25)
      .attr("class", "noclicks")
      .style("fill", "url(#drop_shadow)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class", "noclicks")
      .style("fill", "url(#ocean_fill)");

    svg.append("path")
      .datum(topojson.object(world, world.objects.land))
      .attr("class", "land noclicks")
      .attr("d", path);

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_highlight)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_shading)");

    svg.append("g").attr("class","points")
        .selectAll("text").data(places.features)
      .enter().append("path")
        .attr("class", "point")
        .attr("d", path);

        var select;
        var x = document.getElementById("countryselectid").value;
        //contains country name string
        var y = document.getElementById("mySelectCat").value;
        //contains country name string
        //console.log(y);

        if(x=="All" && y=="All"){
        select = 1;
        }
        else if(y=="All"){
        select = 2;
        }
        else if(x=="All"){
        select = 3;
        }
        else{
        select = 4;
        }
        console.log(select);
        // spawn links between cities as source/target coord pairs
        places.features.forEach(function(a) {
          if(select==1){
            links.push({
              source: a.geometry.coordinates,
              target: a.end.geometry.coordinates,
            });
            if(a.relation>0){
              greenlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src,
              })
            }
            else{
              redlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src
              })
            }
          }

          else if(select==2){
            if(a.countries.includes(x)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==3){
            if(a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==4){
            if(a.countries.includes(x) && a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }
        });

    // build geoJSON features from links array
    links.forEach(function(e,i,a) {
      var feature =   { "type": "Feature", "geometry": { "type": "LineString", "coordinates": [e.source,e.target] }}
      arcLines.push(feature)
    })

    d3.select("#myRange")
      .on("input", function() {

        var myValue = this.value
        console.log(myValue);
    })

    svg.append("g").attr("class","arcs")
      .selectAll("path").data(arcLines)
      .enter().append("path")
        .attr("class","arc")
        .attr("d",path)

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(redlinks)
          .enter().append("path")
            .attr("class","redflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(greenlinks)
          .enter().append("path")
            .attr("class","greenflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);


  function clicked(d){
    svg.append("svg:image")
    .attr("id", "myimg")
    .attr("xlink:href", d.src)
    .attr("width", 300)
    .attr("height", 300)
    .attr("x", 580)
    .attr("y",80);
  }

  function handleMouseOver(d){
    d3.select(this)
        .style("stroke-width", 8)
    svg.append("text").attr({
                 id: "intext",  // Create an id for text so we can select it later for removing on mouseout
                  x: "100",
                  y: "20",
                })
              .text(function() {
                return [d.title];  // Value of the text
              });

    document.getElementById('textspace').innerHTML = d.title;

  }
  function handleMouseOut(d){
    //console.log("Bye");
    d3.select(this)
        .style("stroke-width", 3)
    d3.select("#intext").remove();
    d3.select("#myimg").remove();
    document.getElementById('textspace').innerHTML = "";
  }
    refresh();
  }

  function flying_arc(pts) {
    var source = pts.source,
        target = pts.target;

    var mid = location_along_arc(source, target, .5);
    var result = [ proj(source),
                   sky(mid),
                   proj(target) ]
    return result;
  }



  function refresh() {
    svg.selectAll(".land").attr("d", path);
    svg.selectAll(".point").attr("d", path);

    svg.selectAll(".arc").attr("d", path)
      .attr("opacity", function(d) {
          return fade_at_edge(d)
      })

    svg.selectAll(".greenflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
      })
    svg.selectAll(".redflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
    })
  }

  function fade_at_edge(d) {
    var centerPos = proj.invert([width/2,height/2]),
        arc = d3.geo.greatArc(),
        start, end;
    // function is called on 2 different data structures..
    if (d.source) {
      start = d.source,
      end = d.target;
    }
    else {
      start = d.geometry.coordinates[0];
      end = d.geometry.coordinates[1];
    }

    var start_dist = 1.57 - arc.distance({source: start, target: centerPos}),
        end_dist = 1.57 - arc.distance({source: end, target: centerPos});

    var fade = d3.scale.linear().domain([-.1,0]).range([0,.1])
    var dist = start_dist < end_dist ? start_dist : end_dist;

    return fade(dist)
  }

  function location_along_arc(start, end, loc) {
    var interpolator = d3.geo.interpolate(start,end);
    return interpolator(loc)
  }

  // modified from http://bl.ocks.org/1392560
  var m0, o0;
  function mousedown() {
    m0 = [d3.event.pageX, d3.event.pageY];
    o0 = proj.rotate();
    d3.event.preventDefault();
  }
  function mousemove() {
    if (m0) {
      var m1 = [d3.event.pageX, d3.event.pageY]
        , o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
      o1[1] = o1[1] > 30  ? 30  :
              o1[1] < -30 ? -30 :
              o1[1];
      proj.rotate(o1);
      sky.rotate(o1);
      refresh();
    }
  }
  function mouseup() {
    if (m0) {
      mousemove();
      m0 = null;
    }
  }
}

function updateData8(){
  svg.selectAll("*").remove();
  links.length = 0;
  redlinks.length = 0;
  greenlinks.length = 0;
  arcLines.length = 0;

  queue()
      .defer(d3.json, "world-110m.json")
      .defer(d3.json, "data/places8.json")
      .await(ready);
  function ready(error, world, places) {
    var ocean_fill = svg.append("defs").append("radialGradient")
          .attr("id", "ocean_fill")
          .attr("cx", "75%")
          .attr("cy", "25%");
        ocean_fill.append("stop").attr("offset", "5%").attr("stop-color", "blue");
        ocean_fill.append("stop").attr("offset", "100%").attr("stop-color", "blue");

    var globe_highlight = svg.append("defs").append("radialGradient")
          .attr("id", "globe_highlight")
          .attr("cx", "75%")
          .attr("cy", "25%");
        globe_highlight.append("stop")
          .attr("offset", "5%").attr("stop-color", "#ffd")
          .attr("stop-opacity","0.6");
        globe_highlight.append("stop")
          .attr("offset", "100%").attr("stop-color", "#ba9")
          .attr("stop-opacity","0.2");

    var globe_shading = svg.append("defs").append("radialGradient")
          .attr("id", "globe_shading")
          .attr("cx", "55%")
          .attr("cy", "45%");
        globe_shading.append("stop")
          .attr("offset","30%").attr("stop-color", "yellow")
          .attr("stop-opacity","0")
        globe_shading.append("stop")
          .attr("offset","100%").attr("stop-color", "yellow")
          .attr("stop-opacity","0.3")

    var drop_shadow = svg.append("defs").append("radialGradient")
          .attr("id", "drop_shadow")
          .attr("cx", "50%")
          .attr("cy", "50%");
        drop_shadow.append("stop")
          .attr("offset","20%").attr("stop-color", "#000")
          .attr("stop-opacity",".5")
        drop_shadow.append("stop")
          .attr("offset","100%").attr("stop-color", "#000")
          .attr("stop-opacity","0")

    svg.append("ellipse")
      .attr("cx", 440).attr("cy", 450)
      .attr("rx", proj.scale()*.90)
      .attr("ry", proj.scale()*.25)
      .attr("class", "noclicks")
      .style("fill", "url(#drop_shadow)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class", "noclicks")
      .style("fill", "url(#ocean_fill)");

    svg.append("path")
      .datum(topojson.object(world, world.objects.land))
      .attr("class", "land noclicks")
      .attr("d", path);

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_highlight)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_shading)");

    svg.append("g").attr("class","points")
        .selectAll("text").data(places.features)
      .enter().append("path")
        .attr("class", "point")
        .attr("d", path);

        var select ;
        //decides what will be displayed
        var x = document.getElementById("countryselectid").value;
        //contains country name string
        var y = document.getElementById("mySelectCat").value;
        //contains country name string

if(x=="All" && y=="All"){
  select = 1;
}
else if(y=="All"){
  select = 2;
}
else if(x=="All"){
  select = 3;
}
else{
  select = 4;
}



        // spawn links between cities as source/target coord pairs
        places.features.forEach(function(a) {
          if(select==1){
            links.push({
              source: a.geometry.coordinates,
              target: a.end.geometry.coordinates,
            });
            if(a.relation>0){
              greenlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src,
              })
            }
            else{
              redlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src
              })
            }
          }

          else if(select==2){
            if(a.countries.includes(x)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==3){
            if(a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==4){
            if(a.countries.includes(x) && a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }
        });


    // build geoJSON features from links array
    links.forEach(function(e,i,a) {
      var feature =   { "type": "Feature", "geometry": { "type": "LineString", "coordinates": [e.source,e.target] }}
      arcLines.push(feature)
    })

    d3.select("#myRange")
      .on("input", function() {

        var myValue = this.value
        console.log(myValue);
    })

    svg.append("g").attr("class","arcs")
      .selectAll("path").data(arcLines)
      .enter().append("path")
        .attr("class","arc")
        .attr("d",path)

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(redlinks)
          .enter().append("path")
            .attr("class","redflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(greenlinks)
          .enter().append("path")
            .attr("class","greenflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);


  function clicked(d){
    svg.append("svg:image")
    .attr("id", "myimg")
    .attr("xlink:href", d.src)
    .attr("width", 300)
    .attr("height", 300)
    .attr("x", 580)
    .attr("y",80);
  }

  function handleMouseOver(d){
    d3.select(this)
        .style("stroke-width", 8)
    svg.append("text").attr({
                 id: "intext",  // Create an id for text so we can select it later for removing on mouseout
                  x: "100",
                  y: "20",
                })
              .text(function() {
                return [d.title];  // Value of the text
              });

  }
  function handleMouseOut(d){
    //console.log("Bye");
    d3.select(this)
        .style("stroke-width", 3)
    d3.select("#intext").remove();
    d3.select("#myimg").remove();
  }
    refresh();
  }

  function flying_arc(pts) {
    var source = pts.source,
        target = pts.target;

    var mid = location_along_arc(source, target, .5);
    var result = [ proj(source),
                   sky(mid),
                   proj(target) ]
    return result;
  }



  function refresh() {
    svg.selectAll(".land").attr("d", path);
    svg.selectAll(".point").attr("d", path);

    svg.selectAll(".arc").attr("d", path)
      .attr("opacity", function(d) {
          return fade_at_edge(d)
      })

    svg.selectAll(".greenflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
      })
    svg.selectAll(".redflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
    })
  }

  function fade_at_edge(d) {
    var centerPos = proj.invert([width/2,height/2]),
        arc = d3.geo.greatArc(),
        start, end;
    // function is called on 2 different data structures..
    if (d.source) {
      start = d.source,
      end = d.target;
    }
    else {
      start = d.geometry.coordinates[0];
      end = d.geometry.coordinates[1];
    }

    var start_dist = 1.57 - arc.distance({source: start, target: centerPos}),
        end_dist = 1.57 - arc.distance({source: end, target: centerPos});

    var fade = d3.scale.linear().domain([-.1,0]).range([0,.1])
    var dist = start_dist < end_dist ? start_dist : end_dist;

    return fade(dist)
  }

  function location_along_arc(start, end, loc) {
    var interpolator = d3.geo.interpolate(start,end);
    return interpolator(loc)
  }

  // modified from http://bl.ocks.org/1392560
  var m0, o0;
  function mousedown() {
    m0 = [d3.event.pageX, d3.event.pageY];
    o0 = proj.rotate();
    d3.event.preventDefault();
  }
  function mousemove() {
    if (m0) {
      var m1 = [d3.event.pageX, d3.event.pageY]
        , o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
      o1[1] = o1[1] > 30  ? 30  :
              o1[1] < -30 ? -30 :
              o1[1];
      proj.rotate(o1);
      sky.rotate(o1);
      refresh();
    }
  }
  function mouseup() {
    if (m0) {
      mousemove();
      m0 = null;
    }
  }
}

function updateData9(){
  svg.selectAll("*").remove();
  links.length = 0;
  redlinks.length = 0;
  greenlinks.length = 0;
  arcLines.length = 0;

  queue()
      .defer(d3.json, "world-110m.json")
      .defer(d3.json, "data/places9.json")
      .await(ready);
  function ready(error, world, places) {
    var ocean_fill = svg.append("defs").append("radialGradient")
          .attr("id", "ocean_fill")
          .attr("cx", "75%")
          .attr("cy", "25%");
        ocean_fill.append("stop").attr("offset", "5%").attr("stop-color", "blue");
        ocean_fill.append("stop").attr("offset", "100%").attr("stop-color", "blue");

    var globe_highlight = svg.append("defs").append("radialGradient")
          .attr("id", "globe_highlight")
          .attr("cx", "75%")
          .attr("cy", "25%");
        globe_highlight.append("stop")
          .attr("offset", "5%").attr("stop-color", "#ffd")
          .attr("stop-opacity","0.6");
        globe_highlight.append("stop")
          .attr("offset", "100%").attr("stop-color", "#ba9")
          .attr("stop-opacity","0.2");

    var globe_shading = svg.append("defs").append("radialGradient")
          .attr("id", "globe_shading")
          .attr("cx", "55%")
          .attr("cy", "45%");
        globe_shading.append("stop")
          .attr("offset","30%").attr("stop-color", "yellow")
          .attr("stop-opacity","0")
        globe_shading.append("stop")
          .attr("offset","100%").attr("stop-color", "yellow")
          .attr("stop-opacity","0.3")

    var drop_shadow = svg.append("defs").append("radialGradient")
          .attr("id", "drop_shadow")
          .attr("cx", "50%")
          .attr("cy", "50%");
        drop_shadow.append("stop")
          .attr("offset","20%").attr("stop-color", "#000")
          .attr("stop-opacity",".5")
        drop_shadow.append("stop")
          .attr("offset","100%").attr("stop-color", "#000")
          .attr("stop-opacity","0")

    svg.append("ellipse")
      .attr("cx", 440).attr("cy", 450)
      .attr("rx", proj.scale()*.90)
      .attr("ry", proj.scale()*.25)
      .attr("class", "noclicks")
      .style("fill", "url(#drop_shadow)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class", "noclicks")
      .style("fill", "url(#ocean_fill)");

    svg.append("path")
      .datum(topojson.object(world, world.objects.land))
      .attr("class", "land noclicks")
      .attr("d", path);

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_highlight)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_shading)");

    svg.append("g").attr("class","points")
        .selectAll("text").data(places.features)
      .enter().append("path")
        .attr("class", "point")
        .attr("d", path);

        var select;
        var x = document.getElementById("countryselectid").value;
        //contains country name string
        var y = document.getElementById("mySelectCat").value;
        //contains country name string
        //console.log(y);

        if(x=="All" && y=="All"){
        select = 1;
        }
        else if(y=="All"){
        select = 2;
        }
        else if(x=="All"){
        select = 3;
        }
        else{
        select = 4;
        }
        console.log(select);
        // spawn links between cities as source/target coord pairs
        places.features.forEach(function(a) {
          if(select==1){
            links.push({
              source: a.geometry.coordinates,
              target: a.end.geometry.coordinates,
            });
            if(a.relation>0){
              greenlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src,
              })
            }
            else{
              redlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src
              })
            }
          }

          else if(select==2){
            if(a.countries.includes(x)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==3){
            if(a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==4){
            if(a.countries.includes(x) && a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }
        });


    // build geoJSON features from links array
    links.forEach(function(e,i,a) {
      var feature =   { "type": "Feature", "geometry": { "type": "LineString", "coordinates": [e.source,e.target] }}
      arcLines.push(feature)
    })

    d3.select("#myRange")
      .on("input", function() {

        var myValue = this.value
        console.log(myValue);
    })

    svg.append("g").attr("class","arcs")
      .selectAll("path").data(arcLines)
      .enter().append("path")
        .attr("class","arc")
        .attr("d",path)

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(redlinks)
          .enter().append("path")
            .attr("class","redflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked)
            .on("click", summary);

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(greenlinks)
          .enter().append("path")
            .attr("class","greenflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
           .on("mouseenter", clicked)
            .on("click", summary);

   function summary(d){
    /* var box = document.createElement("BOX");
      box.type="text";
      box.value = "Hi";
      d3.select(this)
          .style("stroke-width", 10)
      svg.appendChild(box);
   }*/

   // d3.select(this)
   //     .style("stroke-width", 10)
   // svg.append("text").attr({
   //              id: "itext",  // Create an id for text so we can select it later for removing on mouseout
   //               x: "100",
   //               y: "20",
   //             })
   //           .text("HI");

      var overlay = document.getElementById("overlay");
      //Set a variable to contain the DOM element of the popup
      var popup = document.getElementById("popup");
      popup.innerHTML = d.title;

      //Changing the display css style from none to block will make it visible
      overlay.style.display = "block";
      //Same goes for the popup
      popup.style.display = "block";
      document.getElementById("Cancel").style.display = "block";
  }



  function clicked(d){
    svg.append("svg:image")
    .attr("id", "myimg")
    .attr("xlink:href", d.src)
    .attr("width", 300)
    .attr("height", 300)
    .attr("x", 580)
    .attr("y",80);
  }

  function handleMouseOver(d){
    d3.select(this)
        .style("stroke-width", 8)
    svg.append("text").attr({
                 id: "intext",  // Create an id for text so we can select it later for removing on mouseout
                  x: "100",
                  y: "20",
                })
              .text(function() {
                return [d.title];  // Value of the text
              });

      document.getElementById('textspace').innerHTML = d.text;

  }
  function handleMouseOut(d){
    d3.select(this)
        .style("stroke-width", 3)
    d3.select("#intext").remove();
    d3.select("#myimg").remove();
      document.getElementById('textspace').innerHTML = "";
  }
    refresh();
  }

  function flying_arc(pts) {
    var source = pts.source,
        target = pts.target;

    var mid = location_along_arc(source, target, .5);
    var result = [ proj(source),
                   sky(mid),
                   proj(target) ]
    return result;
  }



  function refresh() {
    svg.selectAll(".land").attr("d", path);
    svg.selectAll(".point").attr("d", path);

    svg.selectAll(".arc").attr("d", path)
      .attr("opacity", function(d) {
          return fade_at_edge(d)
      })

    svg.selectAll(".greenflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
      })
    svg.selectAll(".redflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
    })
  }

  function fade_at_edge(d) {
    var centerPos = proj.invert([width/2,height/2]),
        arc = d3.geo.greatArc(),
        start, end;
    // function is called on 2 different data structures..
    if (d.source) {
      start = d.source,
      end = d.target;
    }
    else {
      start = d.geometry.coordinates[0];
      end = d.geometry.coordinates[1];
    }

    var start_dist = 1.57 - arc.distance({source: start, target: centerPos}),
        end_dist = 1.57 - arc.distance({source: end, target: centerPos});

    var fade = d3.scale.linear().domain([-.1,0]).range([0,.1])
    var dist = start_dist < end_dist ? start_dist : end_dist;

    return fade(dist)
  }

  function location_along_arc(start, end, loc) {
    var interpolator = d3.geo.interpolate(start,end);
    return interpolator(loc)
  }

  // modified from http://bl.ocks.org/1392560
  var m0, o0;
  function mousedown() {
    m0 = [d3.event.pageX, d3.event.pageY];
    o0 = proj.rotate();
    d3.event.preventDefault();
  }
  function mousemove() {
    if (m0) {
      var m1 = [d3.event.pageX, d3.event.pageY]
        , o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
      o1[1] = o1[1] > 30  ? 30  :
              o1[1] < -30 ? -30 :
              o1[1];
      proj.rotate(o1);
      sky.rotate(o1);
      refresh();
    }
  }
  function mouseup() {
    if (m0) {
      mousemove();
      m0 = null;
    }
  }
}

function updateData10(){
  svg.selectAll("*").remove();
  links.length = 0;
  redlinks.length = 0;
  greenlinks.length = 0;
  arcLines.length = 0;

  queue()
      .defer(d3.json, "world-110m.json")
      .defer(d3.json, "data/places10.json")
      .await(ready);
  function ready(error, world, places) {
    var ocean_fill = svg.append("defs").append("radialGradient")
          .attr("id", "ocean_fill")
          .attr("cx", "75%")
          .attr("cy", "25%");
        ocean_fill.append("stop").attr("offset", "5%").attr("stop-color", "blue");
        ocean_fill.append("stop").attr("offset", "100%").attr("stop-color", "blue");

    var globe_highlight = svg.append("defs").append("radialGradient")
          .attr("id", "globe_highlight")
          .attr("cx", "75%")
          .attr("cy", "25%");
        globe_highlight.append("stop")
          .attr("offset", "5%").attr("stop-color", "#ffd")
          .attr("stop-opacity","0.6");
        globe_highlight.append("stop")
          .attr("offset", "100%").attr("stop-color", "#ba9")
          .attr("stop-opacity","0.2");

    var globe_shading = svg.append("defs").append("radialGradient")
          .attr("id", "globe_shading")
          .attr("cx", "55%")
          .attr("cy", "45%");
        globe_shading.append("stop")
          .attr("offset","30%").attr("stop-color", "yellow")
          .attr("stop-opacity","0")
        globe_shading.append("stop")
          .attr("offset","100%").attr("stop-color", "yellow")
          .attr("stop-opacity","0.3")

    var drop_shadow = svg.append("defs").append("radialGradient")
          .attr("id", "drop_shadow")
          .attr("cx", "50%")
          .attr("cy", "50%");
        drop_shadow.append("stop")
          .attr("offset","20%").attr("stop-color", "#000")
          .attr("stop-opacity",".5")
        drop_shadow.append("stop")
          .attr("offset","100%").attr("stop-color", "#000")
          .attr("stop-opacity","0")

    svg.append("ellipse")
      .attr("cx", 440).attr("cy", 450)
      .attr("rx", proj.scale()*.90)
      .attr("ry", proj.scale()*.25)
      .attr("class", "noclicks")
      .style("fill", "url(#drop_shadow)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class", "noclicks")
      .style("fill", "url(#ocean_fill)");

    svg.append("path")
      .datum(topojson.object(world, world.objects.land))
      .attr("class", "land noclicks")
      .attr("d", path);

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_highlight)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_shading)");

    svg.append("g").attr("class","points")
        .selectAll("text").data(places.features)
      .enter().append("path")
        .attr("class", "point")
        .attr("d", path);

        var select ;
        //decides what will be displayed
        var x = document.getElementById("countryselectid").value;
        //contains country name string
        var y = document.getElementById("mySelectCat").value;
        //contains country name string

if(x=="All" && y=="All"){
  select = 1;
}
else if(y=="All"){
  select = 2;
}
else if(x=="All"){
  select = 3;
}
else{
  select = 4;
}



        // spawn links between cities as source/target coord pairs
        places.features.forEach(function(a) {
          if(select==1){
            links.push({
              source: a.geometry.coordinates,
              target: a.end.geometry.coordinates,
            });
            if(a.relation>0){
              greenlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src,
              })
            }
            else{
              redlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src
              })
            }
          }

          else if(select==2){
            if(a.countries.includes(x)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==3){
            if(a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==4){
            if(a.countries.includes(x) && a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }
        });


    // build geoJSON features from links array
    links.forEach(function(e,i,a) {
      var feature =   { "type": "Feature", "geometry": { "type": "LineString", "coordinates": [e.source,e.target] }}
      arcLines.push(feature)
    })

    d3.select("#myRange")
      .on("input", function() {

        var myValue = this.value
        console.log(myValue);
    })

    svg.append("g").attr("class","arcs")
      .selectAll("path").data(arcLines)
      .enter().append("path")
        .attr("class","arc")
        .attr("d",path)

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(redlinks)
          .enter().append("path")
            .attr("class","redflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(greenlinks)
          .enter().append("path")
            .attr("class","greenflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);


  function clicked(d){
    svg.append("svg:image")
    .attr("id", "myimg")
    .attr("xlink:href", d.src)
    .attr("width", 300)
    .attr("height", 300)
    .attr("x", 580)
    .attr("y",80);
  }

  function handleMouseOver(d){
    d3.select(this)
        .style("stroke-width", 8)
    svg.append("text").attr({
                 id: "intext",  // Create an id for text so we can select it later for removing on mouseout
                  x: "100",
                  y: "20",
                })
              .text(function() {
                return [d.title];  // Value of the text
              });

  }
  function handleMouseOut(d){
    //console.log("Bye");
    d3.select(this)
        .style("stroke-width", 3)
    d3.select("#intext").remove();
    d3.select("#myimg").remove();
  }
    refresh();
  }

  function flying_arc(pts) {
    var source = pts.source,
        target = pts.target;

    var mid = location_along_arc(source, target, .5);
    var result = [ proj(source),
                   sky(mid),
                   proj(target) ]
    return result;
  }



  function refresh() {
    svg.selectAll(".land").attr("d", path);
    svg.selectAll(".point").attr("d", path);

    svg.selectAll(".arc").attr("d", path)
      .attr("opacity", function(d) {
          return fade_at_edge(d)
      })

    svg.selectAll(".greenflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
      })
    svg.selectAll(".redflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
    })
  }

  function fade_at_edge(d) {
    var centerPos = proj.invert([width/2,height/2]),
        arc = d3.geo.greatArc(),
        start, end;
    // function is called on 2 different data structures..
    if (d.source) {
      start = d.source,
      end = d.target;
    }
    else {
      start = d.geometry.coordinates[0];
      end = d.geometry.coordinates[1];
    }

    var start_dist = 1.57 - arc.distance({source: start, target: centerPos}),
        end_dist = 1.57 - arc.distance({source: end, target: centerPos});

    var fade = d3.scale.linear().domain([-.1,0]).range([0,.1])
    var dist = start_dist < end_dist ? start_dist : end_dist;

    return fade(dist)
  }

  function location_along_arc(start, end, loc) {
    var interpolator = d3.geo.interpolate(start,end);
    return interpolator(loc)
  }

  // modified from http://bl.ocks.org/1392560
  var m0, o0;
  function mousedown() {
    m0 = [d3.event.pageX, d3.event.pageY];
    o0 = proj.rotate();
    d3.event.preventDefault();
  }
  function mousemove() {
    if (m0) {
      var m1 = [d3.event.pageX, d3.event.pageY]
        , o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
      o1[1] = o1[1] > 30  ? 30  :
              o1[1] < -30 ? -30 :
              o1[1];
      proj.rotate(o1);
      sky.rotate(o1);
      refresh();
    }
  }
  function mouseup() {
    if (m0) {
      mousemove();
      m0 = null;
    }
  }
}

function updateData11(){
  svg.selectAll("*").remove();
  links.length = 0;
  redlinks.length = 0;
  greenlinks.length = 0;
  arcLines.length = 0;

  queue()
      .defer(d3.json, "world-110m.json")
      .defer(d3.json, "data/places11.json")
      .await(ready);
  function ready(error, world, places) {
    var ocean_fill = svg.append("defs").append("radialGradient")
          .attr("id", "ocean_fill")
          .attr("cx", "75%")
          .attr("cy", "25%");
        ocean_fill.append("stop").attr("offset", "5%").attr("stop-color", "blue");
        ocean_fill.append("stop").attr("offset", "100%").attr("stop-color", "blue");

    var globe_highlight = svg.append("defs").append("radialGradient")
          .attr("id", "globe_highlight")
          .attr("cx", "75%")
          .attr("cy", "25%");
        globe_highlight.append("stop")
          .attr("offset", "5%").attr("stop-color", "#ffd")
          .attr("stop-opacity","0.6");
        globe_highlight.append("stop")
          .attr("offset", "100%").attr("stop-color", "#ba9")
          .attr("stop-opacity","0.2");

    var globe_shading = svg.append("defs").append("radialGradient")
          .attr("id", "globe_shading")
          .attr("cx", "55%")
          .attr("cy", "45%");
        globe_shading.append("stop")
          .attr("offset","30%").attr("stop-color", "yellow")
          .attr("stop-opacity","0")
        globe_shading.append("stop")
          .attr("offset","100%").attr("stop-color", "yellow")
          .attr("stop-opacity","0.3")

    var drop_shadow = svg.append("defs").append("radialGradient")
          .attr("id", "drop_shadow")
          .attr("cx", "50%")
          .attr("cy", "50%");
        drop_shadow.append("stop")
          .attr("offset","20%").attr("stop-color", "#000")
          .attr("stop-opacity",".5")
        drop_shadow.append("stop")
          .attr("offset","100%").attr("stop-color", "#000")
          .attr("stop-opacity","0")

    svg.append("ellipse")
      .attr("cx", 440).attr("cy", 450)
      .attr("rx", proj.scale()*.90)
      .attr("ry", proj.scale()*.25)
      .attr("class", "noclicks")
      .style("fill", "url(#drop_shadow)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class", "noclicks")
      .style("fill", "url(#ocean_fill)");

    svg.append("path")
      .datum(topojson.object(world, world.objects.land))
      .attr("class", "land noclicks")
      .attr("d", path);

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_highlight)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_shading)");

    svg.append("g").attr("class","points")
        .selectAll("text").data(places.features)
      .enter().append("path")
        .attr("class", "point")
        .attr("d", path);

        var select ;
        //decides what will be displayed
        var x = document.getElementById("countryselectid").value;
        //contains country name string
        var y = document.getElementById("mySelectCat").value;
        //contains country name string

if(x=="All" && y=="All"){
  select = 1;
}
else if(y=="All"){
  select = 2;
}
else if(x=="All"){
  select = 3;
}
else{
  select = 4;
}



        // spawn links between cities as source/target coord pairs
        places.features.forEach(function(a) {
          if(select==1){
            links.push({
              source: a.geometry.coordinates,
              target: a.end.geometry.coordinates,
            });
            if(a.relation>0){
              greenlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src,
              })
            }
            else{
              redlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src
              })
            }
          }

          else if(select==2){
            if(a.countries.includes(x)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==3){
            if(a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==4){
            if(a.countries.includes(x) && a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }
        });


    // build geoJSON features from links array
    links.forEach(function(e,i,a) {
      var feature =   { "type": "Feature", "geometry": { "type": "LineString", "coordinates": [e.source,e.target] }}
      arcLines.push(feature)
    })

    d3.select("#myRange")
      .on("input", function() {

        var myValue = this.value
        console.log(myValue);
    })

    svg.append("g").attr("class","arcs")
      .selectAll("path").data(arcLines)
      .enter().append("path")
        .attr("class","arc")
        .attr("d",path)

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(redlinks)
          .enter().append("path")
            .attr("class","redflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(greenlinks)
          .enter().append("path")
            .attr("class","greenflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);


  function clicked(d){
    svg.append("svg:image")
    .attr("id", "myimg")
    .attr("xlink:href", d.src)
    .attr("width", 300)
    .attr("height", 300)
    .attr("x", 580)
    .attr("y",80);
  }

  function handleMouseOver(d){
    d3.select(this)
        .style("stroke-width", 8)
    svg.append("text").attr({
                 id: "intext",  // Create an id for text so we can select it later for removing on mouseout
                  x: "100",
                  y: "20",
                })
              .text(function() {
                return [d.title];  // Value of the text
              });

  }
  function handleMouseOut(d){
    //console.log("Bye");
    d3.select(this)
        .style("stroke-width", 3)
    d3.select("#intext").remove();
    d3.select("#myimg").remove();
  }
    refresh();
  }

  function flying_arc(pts) {
    var source = pts.source,
        target = pts.target;

    var mid = location_along_arc(source, target, .5);
    var result = [ proj(source),
                   sky(mid),
                   proj(target) ]
    return result;
  }



  function refresh() {
    svg.selectAll(".land").attr("d", path);
    svg.selectAll(".point").attr("d", path);

    svg.selectAll(".arc").attr("d", path)
      .attr("opacity", function(d) {
          return fade_at_edge(d)
      })

    svg.selectAll(".greenflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
      })
    svg.selectAll(".redflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
    })
  }

  function fade_at_edge(d) {
    var centerPos = proj.invert([width/2,height/2]),
        arc = d3.geo.greatArc(),
        start, end;
    // function is called on 2 different data structures..
    if (d.source) {
      start = d.source,
      end = d.target;
    }
    else {
      start = d.geometry.coordinates[0];
      end = d.geometry.coordinates[1];
    }

    var start_dist = 1.57 - arc.distance({source: start, target: centerPos}),
        end_dist = 1.57 - arc.distance({source: end, target: centerPos});

    var fade = d3.scale.linear().domain([-.1,0]).range([0,.1])
    var dist = start_dist < end_dist ? start_dist : end_dist;

    return fade(dist)
  }

  function location_along_arc(start, end, loc) {
    var interpolator = d3.geo.interpolate(start,end);
    return interpolator(loc)
  }

  // modified from http://bl.ocks.org/1392560
  var m0, o0;
  function mousedown() {
    m0 = [d3.event.pageX, d3.event.pageY];
    o0 = proj.rotate();
    d3.event.preventDefault();
  }
  function mousemove() {
    if (m0) {
      var m1 = [d3.event.pageX, d3.event.pageY]
        , o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
      o1[1] = o1[1] > 30  ? 30  :
              o1[1] < -30 ? -30 :
              o1[1];
      proj.rotate(o1);
      sky.rotate(o1);
      refresh();
    }
  }
  function mouseup() {
    if (m0) {
      mousemove();
      m0 = null;
    }
  }
}

function updateData12(){
  svg.selectAll("*").remove();
  links.length = 0;
  redlinks.length = 0;
  greenlinks.length = 0;
  arcLines.length = 0;

  queue()
      .defer(d3.json, "world-110m.json")
      .defer(d3.json, "data/places12.json")
      .await(ready);
  function ready(error, world, places) {
    var ocean_fill = svg.append("defs").append("radialGradient")
          .attr("id", "ocean_fill")
          .attr("cx", "75%")
          .attr("cy", "25%");
        ocean_fill.append("stop").attr("offset", "5%").attr("stop-color", "blue");
        ocean_fill.append("stop").attr("offset", "100%").attr("stop-color", "blue");

    var globe_highlight = svg.append("defs").append("radialGradient")
          .attr("id", "globe_highlight")
          .attr("cx", "75%")
          .attr("cy", "25%");
        globe_highlight.append("stop")
          .attr("offset", "5%").attr("stop-color", "#ffd")
          .attr("stop-opacity","0.6");
        globe_highlight.append("stop")
          .attr("offset", "100%").attr("stop-color", "#ba9")
          .attr("stop-opacity","0.2");

    var globe_shading = svg.append("defs").append("radialGradient")
          .attr("id", "globe_shading")
          .attr("cx", "55%")
          .attr("cy", "45%");
        globe_shading.append("stop")
          .attr("offset","30%").attr("stop-color", "yellow")
          .attr("stop-opacity","0")
        globe_shading.append("stop")
          .attr("offset","100%").attr("stop-color", "yellow")
          .attr("stop-opacity","0.3")

    var drop_shadow = svg.append("defs").append("radialGradient")
          .attr("id", "drop_shadow")
          .attr("cx", "50%")
          .attr("cy", "50%");
        drop_shadow.append("stop")
          .attr("offset","20%").attr("stop-color", "#000")
          .attr("stop-opacity",".5")
        drop_shadow.append("stop")
          .attr("offset","100%").attr("stop-color", "#000")
          .attr("stop-opacity","0")

    svg.append("ellipse")
      .attr("cx", 440).attr("cy", 450)
      .attr("rx", proj.scale()*.90)
      .attr("ry", proj.scale()*.25)
      .attr("class", "noclicks")
      .style("fill", "url(#drop_shadow)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class", "noclicks")
      .style("fill", "url(#ocean_fill)");

    svg.append("path")
      .datum(topojson.object(world, world.objects.land))
      .attr("class", "land noclicks")
      .attr("d", path);

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_highlight)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_shading)");

    svg.append("g").attr("class","points")
        .selectAll("text").data(places.features)
      .enter().append("path")
        .attr("class", "point")
        .attr("d", path);

        var select ;
        //decides what will be displayed
        var x = document.getElementById("countryselectid").value;
        //contains country name string
        var y = document.getElementById("mySelectCat").value;
        //contains country name string

if(x=="All" && y=="All"){
  select = 1;
}
else if(y=="All"){
  select = 2;
}
else if(x=="All"){
  select = 3;
}
else{
  select = 4;
}



        // spawn links between cities as source/target coord pairs
        places.features.forEach(function(a) {
          if(select==1){
            links.push({
              source: a.geometry.coordinates,
              target: a.end.geometry.coordinates,
            });
            if(a.relation>0){
              greenlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src,
              })
            }
            else{
              redlinks.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
                title: a.title,
                src: a.src
              })
            }
          }

          else if(select==2){
            if(a.countries.includes(x)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==3){
            if(a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }

          else if(select==4){
            if(a.countries.includes(x) && a.tags[0].includes(y)){
              links.push({
                source: a.geometry.coordinates,
                target: a.end.geometry.coordinates,
              });
              if(a.relation>0){
                greenlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src,
                })
              }
              else{
                redlinks.push({
                  source: a.geometry.coordinates,
                  target: a.end.geometry.coordinates,
                  title: a.title,
                  src: a.src
                })
              }
            }
          }
        });


    // build geoJSON features from links array
    links.forEach(function(e,i,a) {
      var feature =   { "type": "Feature", "geometry": { "type": "LineString", "coordinates": [e.source,e.target] }}
      arcLines.push(feature)
    })

    d3.select("#myRange")
      .on("input", function() {

        var myValue = this.value
        console.log(myValue);
    })

    svg.append("g").attr("class","arcs")
      .selectAll("path").data(arcLines)
      .enter().append("path")
        .attr("class","arc")
        .attr("d",path)

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(redlinks)
          .enter().append("path")
            .attr("class","redflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);

        svg.append("g").attr("class","flyers")
          .selectAll("path").data(greenlinks)
          .enter().append("path")
            .attr("class","greenflyer")
            .attr("d", function(d) { return swoosh(flying_arc(d)) })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mouseenter", clicked);


  function clicked(d){
    svg.append("svg:image")
    .attr("id", "myimg")
    .attr("xlink:href", d.src)
    .attr("width", 300)
    .attr("height", 300)
    .attr("x", 580)
    .attr("y",80);
  }

  function handleMouseOver(d){
    d3.select(this)
        .style("stroke-width", 8)
    svg.append("text").attr({
                 id: "intext",  // Create an id for text so we can select it later for removing on mouseout
                  x: "100",
                  y: "20",
                })
              .text(function() {
                return [d.title];  // Value of the text
              });

  }
  function handleMouseOut(d){
    //console.log("Bye");
    d3.select(this)
        .style("stroke-width", 3)
    d3.select("#intext").remove();
    d3.select("#myimg").remove();
  }
    refresh();
  }

  function flying_arc(pts) {
    var source = pts.source,
        target = pts.target;

    var mid = location_along_arc(source, target, .5);
    var result = [ proj(source),
                   sky(mid),
                   proj(target) ]
    return result;
  }



  function refresh() {
    svg.selectAll(".land").attr("d", path);
    svg.selectAll(".point").attr("d", path);

    svg.selectAll(".arc").attr("d", path)
      .attr("opacity", function(d) {
          return fade_at_edge(d)
      })

    svg.selectAll(".greenflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
      })
    svg.selectAll(".redflyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
    })
  }

  function fade_at_edge(d) {
    var centerPos = proj.invert([width/2,height/2]),
        arc = d3.geo.greatArc(),
        start, end;
    // function is called on 2 different data structures..
    if (d.source) {
      start = d.source,
      end = d.target;
    }
    else {
      start = d.geometry.coordinates[0];
      end = d.geometry.coordinates[1];
    }

    var start_dist = 1.57 - arc.distance({source: start, target: centerPos}),
        end_dist = 1.57 - arc.distance({source: end, target: centerPos});

    var fade = d3.scale.linear().domain([-.1,0]).range([0,.1])
    var dist = start_dist < end_dist ? start_dist : end_dist;

    return fade(dist)
  }

  function location_along_arc(start, end, loc) {
    var interpolator = d3.geo.interpolate(start,end);
    return interpolator(loc)
  }

  // modified from http://bl.ocks.org/1392560
  var m0, o0;
  function mousedown() {
    m0 = [d3.event.pageX, d3.event.pageY];
    o0 = proj.rotate();
    d3.event.preventDefault();
  }
  function mousemove() {
    if (m0) {
      var m1 = [d3.event.pageX, d3.event.pageY]
        , o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
      o1[1] = o1[1] > 30  ? 30  :
              o1[1] < -30 ? -30 :
              o1[1];
      proj.rotate(o1);
      sky.rotate(o1);
      refresh();
    }
  }
  function mouseup() {
    if (m0) {
      mousemove();
      m0 = null;
    }
  }
}
