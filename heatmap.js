d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', function (data) {

var month = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    margin = { //margins from svg to actual graph
        top: 100,
        right: 50,
        bottom: 60,
        left: 90 },
    svgwidth = 1100, //used in next calculations and to define svg width when it's appended
    svgheight = 600, //used in next calculations and to define svg height when it's appended
    width = svgwidth - margin.left - margin.right, //used in scale .range 
    height = svgheight - margin.top - margin.bottom, //used in scale .range
    xaxisy = svgheight - margin.bottom; //used to position xaxis 
    
    var yscale = d3.scaleOrdinal()
        .domain(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])
        .range([0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440]);
    
    var xscale = d3.scaleLinear()
        .domain([1753, 2020])
        .range([0, width]);
    
    var colorscale = d3.scaleLinear()
        .domain([-7, -2, -.4, 0, 2])
        .range(['blue', 'green', 'yellow', 'orange', 'red']);
    
    //create axes
    var yaxis = d3.axisLeft(yscale)
        //.tickSizeInner(0)
        //.tickSizeOuter(0);
    var xaxis = d3.axisBottom(xscale)
        .ticks(27)
        .tickFormat(d3.format(""));
    
    //create svg canvas
    var svg = d3.select('body')
        .append('svg')
        .attr('width', svgwidth)
        .attr('height', svgheight)
        .style('background-color', '#fff')
        .style('box-shadow', '2px 2px 8px 4px #555');
    
    //call axes to svg
    var yaxisy = margin.top - 20;
    svg.append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + xaxisy + ')')
        .call(xaxis);
    svg.append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + yaxisy + ' )')
        .call(yaxis);
    
    //paint rectangles
    var w = margin.left, h = margin.top;
    var rect = svg.selectAll('rect')
        .data(data.monthlyVariance)
        .enter().append('rect')
        .attr('width', 4)
        .attr('height', 40)
        .attr('x', function (d) { return xscale(d.year) + margin.left; })
        .attr('y', function (d) { return yscale(d.month) + margin.top - 40; })
        .style('fill', function (d) { return colorscale(d.variance); })
        .style('opacity', 0.8);
    
    var details = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('box-shadow', '1px 1px 2px 1px #111')
        .style('padding', '2px 4px')
        .style('display', 'none')
        .style('font-family', 'Verdana')
        .style('font-size', '14px');
    
    //hover effect
    rect.on('mouseover', function (d) {
        d3.select(this)
            .attr('opacity', 1.5)
            .attr('stroke', 'black')
            .attr('stroke-width', .6);
        
        var celsius = (8.66 + d.variance).toFixed(3), fahrenheit = ((8.66 + d.variance) * 1.8 + 32).toFixed(3);
        details.html(month[d.month] + ' ' + d.year + '<br>' + celsius + '°C average<br>' + fahrenheit + '°F average')
            .style('display', 'block')
            .style('left', (d3.event.pageX - 50)+'px')
            .style('top', (d3.event.pageY - 65)+'px')
            .style('background-color', colorscale(d.variance));
    }).on('mouseout', function (d) {
        d3.select(this)
            .attr('opactiy', 0.8)
            .attr('stroke-width', 0);
        details
            .style('display', 'none');
    });
    
    //Y axis label 'MONTHS'
    var titlex = svgwidth / 2, titley = margin.top / 2;
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + titlex + ', ' + titley + ')')
        .attr('font-family', 'Verdana')
        .attr('font-size', '20px')
        .attr('font-weight', 'bold')
        .text('MONTHLY AVERAGE GLOBAL SURFACE TEMPERATURES');
    
    //X axis label 'YEARS'
    var yearsx = width / 2 + margin.left, yearsy = svgheight - margin.bottom / 3;
    svg.append('text')
        .attr('x', yearsx)
        .attr('y', yearsy)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Verdana')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text('YEARS');
    
    //Y axis label 'MONTHS'
    var monthsx = margin.left / 3, monthsy = height / 2 + margin.top;
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + monthsx + ', ' + monthsy + ') rotate(-90)')
        .attr('font-family', 'Verdana')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text('MONTHS');
    
    //this is all for the key/legend //////////////////////////
    var svgDefs = svg.append('defs');

    var mainGradient = svgDefs.append('linearGradient')
        .attr('id', 'mainGradient');

    //Create gradients //////////////////////////////////////////////
    mainGradient.append('stop')
        .attr('class', 'stop-top')
        .attr('offset', '0%')
        .attr('stop-color', 'red');
    mainGradient.append('stop')
        .attr('class', 'stop-top')
        .attr('offset', '25%')
        .attr('stop-color', 'orange');
    mainGradient.append('stop')
        .attr('class', 'stop-top')
        .attr('offset', '50%')
        .attr('stop-color', 'yellow');
    mainGradient.append('stop')
        .attr('class', 'stop-top')
        .attr('offset', '75%')
        .attr('stop-color', 'green');
    mainGradient.append('stop')
        .attr('class', 'stop-bottom')
        .attr('offset', '100%')
        .attr('stop-color', 'blue');
        
    //key /////////////////////////////
    var keyx = svgwidth - margin.right / 2 + 5, keyy = svgheight / 2 - 100;
    svg.append('rect')
        .attr('width', 200)
        .attr('height', 20)
        .attr('fill', 'url(#mainGradient)')
        .attr('stroke', 'black')    
        .attr('stroke-width', 1.2)
        .attr('transform', 'translate(' + keyx + ', ' + keyy + ') rotate(90)');
    
    //key label top/red////////////////////////////////////////////////////////
    var redx = svgwidth - margin.right / 2 - 5, redy =  svgheight / 2 - 116;
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', redx)
        .attr('y', redy)
        .attr('font-family', 'Verdana')
        .attr('font-size', '10px')
        .text('14°C');
    
    redx = svgwidth - margin.right / 2 - 5; redy =  svgheight / 2 - 104;
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', redx)
        .attr('y', redy)
        .attr('font-family', 'Verdana')
        .attr('font-size', '10px')
        .text('57°F');
    
    //key lable bottom/blue//////////////////////////////////////
    var bluex = svgwidth - margin.right / 2 - 5, bluey = svgheight / 2 + 112;
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', bluex)
        .attr('y', bluey)
        .attr('font-family', 'Verdana')
        .attr('font-size', '10px')
        .text('0°C');
    
    bluex = svgwidth - margin.right / 2 - 5; bluey = svgheight / 2 + 124;
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', bluex)
        .attr('y', bluey)
        .attr('font-family', 'Verdana')
        .attr('font-size', '10px')
        .text('32°F');
    
}); //end d3.json