async function drawLineChart() {
await d3.json("https://api.covidtracking.com/v1/states/ca/daily.json").then((data) => {


    // A Y axis (vertical) on the left comprised of number of reported deaths.
    const yAccessor = d => d.death;

    // A X axis (horizontal) on the bottom comprised of dates.
    const dateParser = d3.timeParse("%-m/%-d/%Y %-I:%M");
    const xAccessor = d => dateParser(d.lastUpdateEt);

    // Most Recent Data
    //console.log(yAccessor(data[0]));
    //console.log(xAccessor(data[0]));

    // dimensions object will contain the size of the wrapper and the margins.
    let dimensions = {
      width: window.innerWidth * 0.9,
      height: 600,
      margin: {
        top: 15,
        right: 15, 
        bottom: 40,
        left: 60,
      },
    }

    // computing the size of our bounds and adding that to our dimensions object.
    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom


    const wrapper = d3.select("#wrapper")
      .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    const bounds = wrapper.append("g")
      .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)



    // Scale for Y axis  
    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, yAccessor))
      .range([dimensions.boundedHeight, 0])

    //console.log(yScale(46435)) 
    // 47924
    // 46435
    
    const deathPlacement = yScale(48000)
    const deathCounts = bounds.append("rect")
      .attr("x", 0)
      .attr("width", dimensions.boundedWidth)
      .attr("y", deathPlacement)
      .attr("height", dimensions.boundedHeight - deathPlacement)
      .attr("fill", "#e0f3f3")



    // Scale for X axis
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, xAccessor))
      .range([0, dimensions.boundedWidth])

    // Create a line
    const lineGenerator = d3.line()
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)))

    const line = bounds.append("path")
      .attr("d", lineGenerator(data))  
      .attr("fill", "none")
      .attr("stroke", "#af9358")
      .attr("stroke-width", 2)


    const yAxisGenerator = d3.axisLeft()
      .scale(yScale)  
    const yAxis = bounds.append("g")
      .call(yAxisGenerator)


    const xAxisGenerator = d3.axisBottom()
      .scale(xScale) 
    const xAxis = bounds.append("g")
      .call(xAxisGenerator)
        .style("transform", `translateY(${
          dimensions.boundedHeight
        }px)`) 

  });

}

drawLineChart();