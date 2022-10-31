function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  //  Deliverable 4: Make the charts responsive to mobile devices
  var config = { responsive: true };

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samples.filter((sampleObj) => sampleObj.id == sample);

    // Deliverable 3:
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var filteredMetadata = metadata.filter((sampleObject) => sampleObject.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var sampleOne = filteredSamples[0];

    // Deliverable 3:
    // 2. Create a variable that holds the first sample in the metadata array.
    var metadataOne = filteredMetadata[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = sampleOne.otu_ids;
    var otuLabels = sampleOne.otu_labels;
    var sampleValues = sampleOne.sample_values;

    // Deliverable 3:
    // 3. Create a variable that holds the washing frequency.
    var washingFreq = parseInt(metadataOne.wfreq);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();

    // Creating the x values and hover text for bar chart 
    var xticks = sampleValues.slice(0, 10).reverse();
    var barHoverText = otuLabels.slice(0, 10).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        x: xticks,
        y: yticks,
        text: barHoverText,
        type: 'bar',
        orientation: 'h'
      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {
        text: "<b>Top 10 Bacteria Cultures Found</b>",
        font: {
          family: 'Tahoma, Geneva, Verdana, sans-serif',
          size: 18
        }
      },
      paper_bgcolor: "aliceblue"
    };
    // 10. Use Plotly to plot the data with the layout. 
    // config variable passed as argument to newPlot()  to create mobile responsive chart.
    Plotly.newPlot('bar', barData, barLayout, config);

    //Deliverable 2
    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: "Portland"
        }
      }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {

      title: {
        text: "<b>Bacteria Cultures Per Sample</b>",
        font: { family: 'Tahoma, Geneva, Verdana, sans-serif', size: 18 }
      },
      xaxis: { title: "OTU ID" },
      showLegend: false,
      hovermode: "closest",
      paper_bgcolor: "aliceblue"
    };

    // 3. Use Plotly to plot the data with the layout.
    // Added onfig to create mobile responsive charts
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, config);

    // Deliverable 3:
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washingFreq,
        type: "indicator",
        mode: "gauge+number",
        title: {
          text: "<b>Belly Button Washing Frequency</b> <br> # of Scrubs per Week",
          font: { family: 'Tahoma, Geneva, Verdana, sans-serif', size: 18 }
        },
        gauge: {
          axis: {
            range: [0, 10],
            visible: true,
            tickmode: "array",
            tickvals: [0, 2, 4, 6, 8, 10],
            ticks: "outside",
            tickwidth: 2,
            tickcolor: "black"
          },
          bar: { color: "darkblue" },
          steps: [
            { range: [0, 2], color: "tomato" },
            { range: [2, 4], color: "peachpuff" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "mediumseagreen" },
            { range: [8, 10], color: "seagreen" }
          ]
        }
      }
    ];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      margin: { t: 0, b: 0 },
      paper_bgcolor: "aliceblue"
    };

    // 6. Use Plotly to plot the gauge data and layout.
    // Added config variable as argument for mobile responsiveness
    Plotly.newPlot('gauge', gaugeData, gaugeLayout, config);
  });

}
