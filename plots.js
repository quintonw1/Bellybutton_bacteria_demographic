function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
  
init();
optionChanged(940);

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h6").text("ID"+": "+ result.id);
      PANEL.append("h6").text("ETHNICITY"+ ": "+ result.ethnicity);
      PANEL.append("h6").text("GENDER"+ ": "+ result.gender);
      PANEL.append("h6").text("AGE"+ ": "+ result.age);
      PANEL.append("h6").text("LOCATION"+ ": "+ result.location);
      PANEL.append("h6").text("BBTYPE"+ ": "+ result.bbtype);
      PANEL.append("h6").text("WFREQ"+ ": "+ result.wfreq);
    });
};

function buildCharts(personID) {
  d3.json("samples.json").then((data) => {
    var sample = data.samples;
    var metadata = data.metadata;    
    var arrayMeta = metadata.filter(row => row.id == personID);
    var person = sample.filter(row => row.id == personID);
    personObj = person[0];
    metaArray = arrayMeta[0];

    values = personObj.sample_values.slice(0,10);

    otuIds = personObj.otu_ids.slice(0,10).map(function(id){
      var text = "OTU "+ id;
      return text;
    });

    otuLabels = personObj.otu_labels.slice(0,10);
    console.log(otuLabels);

    var traceBar = {
      x: values,
      y: otuIds,
      type: "bar",
      orientation: 'h',
      text: otuLabels
    };

    var layoutBar = {
    yaxis:{
        autorange:'reversed'
      }
    }
   Plotly.newPlot("bar", [traceBar], layoutBar);

   wfreq = metaArray.wfreq;

   var dataGauge = [
    {
      title: {text: "Belly Button Washing Frequency<br>Scrubs per Week"},
      domain: { x: [0, 1], y: [0, 1] },
      value: wfreq,
      type: "indicator",
      mode: "gauge+number",
      gauge: { axis: { range: [null, 9] }}
    }
    ];

    var layoutGauge = { autosize : "True"};

    Plotly.newPlot('gauge', dataGauge, layoutGauge);

    var trace1 = {
      x: personObj.otu_ids,
      y: personObj.sample_values,
      text: personObj.otu_labels,
      mode: 'markers',
      marker: {
        size: personObj.sample_values,
        color: personObj.otu_ids
      }
    };
    var dataScatter = [trace1];

    var layoutScatter = {
      xaxis : { title: { text: "OTU ID"}}
    };

    Plotly.newPlot('bubble', dataScatter, layoutScatter);
  });
}