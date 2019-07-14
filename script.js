// Container is created
var box =
    d3.select("body")
        .append("svg")
        .attr("class", "box")
        .attr("width", "1300")
        .attr("height", "600");

var distance = function (p1, p2) {
    return Math.pow(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2), 0.5);
};

// True if the drag variables are initialized, otherwise false.
var processingDrag = false;

// True if the bottom edge is being dragged.
var draggingBottom = false;

// True if the top edge is being dragged.
var draggingTop = false;

// The starting Y position from where drag started.
var startY = 0;

// The initial height of the element being dragged. 
var startHeight = 0;

// The computed current height of the element being dragged after processing.
var newHeight = 0;

var rescale = d3.behavior.drag()
      .on('dragstart', function() {
		processingDrag = false;
	  });
	  
rescale = rescale
      .on("drag", function () {
      	var e = d3.event;
        var c = d3.selectAll(this);

        // Initialize
		if (!processingDrag) {
			draggingBottom = false;
			draggingTop = false;
		
			var x = Number(this.attributes.x.value);
			var y = Number(this.attributes.y.value);
			var w = Number(this.attributes.width.value);
			var h = Number(this.attributes.height.value);
        
			var topVal = y;
			var bottomVal = y + h;
			var dragVal = d3.event.y;

			startY = dragVal;
			newHeight = startHeight = Number(this.attributes.height.value);
			if (dragVal - topVal <= bottomVal - dragVal) {
				draggingTop = true;
			} else {
				draggingBottom = true;
			}
			processingDrag = true;
		}
		
		// Computing the new height.
		newHeight = startHeight;
		if (draggingTop) {
			newHeight = Math.max(startHeight - (e.y - startY), 10);
		} else {
			newHeight = Math.max(startHeight + (e.y - startY), 10);
		}
		
		window.console.log(newHeight);
		this.attributes.height.value = newHeight;
    });
	
rescale = rescale
      .on('dragend', function () {
      	processingDrag = false;
		this.attributes.height.value = newHeight;
    });

// Data of Rectangles
var rectData = box.selectAll().data([{"x": 5,   "y": 25,  "height": 50, "width": 50},
            {"x": 85,  "y": 105, "height": 62.5, "width": 50},
            {"x": 165, "y": 185, "height": 75, "width": 50},
            {"x": 245, "y": 265, "height": 87.5, "width": 50},
            {"x": 325, "y": 360, "height": 100, "width": 50}])
    .enter()
    .append('g');
	
// Appending Data to resizingRectangle
rectData
    .append("svg:rect")
        .attr("class", "resizingRectangle")
        .attr("width", function (d) {
            return d.width;
        })
        .attr("height", function (d) {
            return d.height;
        })
        .attr("x", function (d) {
            return d.x;
        })
        .attr("y", function (d) {
            return d.y;
        })
        .attr("rx", 6)
        .attr("ry", 6)
        .style("fill", "#000000")
        .call(rescale);