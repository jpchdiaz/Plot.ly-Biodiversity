function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = "/metadata/" + sample;

  d3.json(url).then(function(response) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var metadata = d3.select("#sample-metadata")
    // Use `.html("") to clear any existing metadata
    metadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(([key, value]) => {
      metadata.append("p").text(`${key}: ${value}`)

    // BONUS: Build the Gauge Chart
      buildGauge(response.WFREQ);
    });
  });
};

function buildCharts(sample) {

  var url = "/samples/" + sample;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function(response) {
    console.log(response);

    // @TODO: Build a Bubble Chart using the sample data

    // calls the data
    var bubbleTrace = {
      x: response.otu_ids,
      y: response.sample_values,
      mode: "markers",
      text: response.otu_labels,
      marker: {
        size: response.sample_values,
        color: response.otu_ids,
        sizemode: "area",
        sizeref:1.*d3.max(response.sample_values/45.**2),
        sizemin:5
      }
    };

    var bubbleChart = [bubbleTrace];
    var bubbleLayout = {
      title: 'Bubble Chart',
    };

    Plotly.newPlot("bubble", bubbleChart, bubbleLayout);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pieTrace = {
      values: response.sample_values.slice(0,10),
      labels: response.otu_ids.slice(0,10),
      type: "pie",
      hovertext: response.otu_labels.slice(0,10),
      textinfo: "percent"
    }

    var pieChart = [pieTrace];

    var pieLayout = {
      title: "Pie Chart"
    };

    Plotly.newPlot("pie", pieChart, pieLayout)
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
