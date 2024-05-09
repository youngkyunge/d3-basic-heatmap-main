import * as d3 from "d3";
import "./viz.css";
import colors from "../colors.js";
import ramp from "../ramp.js";
function ramp(range) {
  var n = range.length;
  return function(t) {
    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
}
export var inferno = ramp(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));
////////////////////////////////////////////////////////////////////
////////////////////////////  Init  ///////////////////////////////
// svg
const svg = d3.select("#svg-container").append("svg").attr("id","svg")
let width = parseInt(d3.select("#svg-container").style("width"));
let height = parseInt(d3.select("#svg-container").style("height"));

const margin = { top: 20, right: 10, bottom: 100, left:10 };
// scale
const xScale = d3
.scaleBand()
.domain(data.map((d) => d.year))
.range([margin.left, width - margin.right])
.paddingInner(0.1);

const colorScale = d3
.scaleSequential()
.domain([-0.8, 0.8])
.interpolator(d3.interpolateRdYlGn);

const xLegendScale = d3
.scaleBand()
.range([width/2 - 140, width / 2 + 140])
.paddingInner(0,1);

// svg elements

////////////////////////////////////////////////////////////////////
////////////////////////////  Load CSV  ////////////////////////////
// data

let rects;
let data = [];
let xAxis;
let legendData;
let legendRects, legnedLabels;


d3.csv("data/temperature-anomaly-data.csv").then((raw_data) => {
    data = raw_data
   .filter((d)=>d.Entity == "Global")
   .map((d) =>d)
   .map((d) =>{
    const obj = {};
    obj.year = parseInt(d.Year);
    obj.avg = +d["Global average temperature anomaly relative to 1961-1990"];
    return obj;
   });

   legendData = d3.range(
    d3.min(data, (d)=>d.avg),
    d3.max(data, (d)=>d.avg),
    0.2
   );

   //.console.log(data);

   xScale.domain(data.map((d)=>d.year));
   xLegendScale.domain(legendData.map((d, i) => i));

   XAxis = d3
   .axisBottom(xScale)
   .tickValues(xScale.domain().filter((d)=> !(d % 10)));
   // .tickValues(xScale.domain().filter((d)=> !(d % 10)));
   // .tickValues(xScale.domain().filter((d, i)=> !(i % 10)));

   rects=svg
   .selectAll("rects")
   .data(data)
   .enter()
   .append("rect")
   .attr("x", (d)=>xScale(d.year))
   .attr("y", margin.top+60)
   .attr("width",xScale.bandwidth())
   .attr("height", height - margin.top - margin.bottom)
   .attr("fill", (d) => colorScale(d.avg))
   .attr("class", "rects");

   svg
   .append("g")
   .attr("transform", 'translate(0,${height - marign.bottom})')
   .attr("class", "x-axis")
   .call(xAxis);

   xLegendScale.domain(legendData.map((d,i)=>i));

   legendRects = svg
   .selectAll("legend-labels")
   .data(legendData)
   .enter()
   .append("rect")
   .attr('x',(d,i)=> xLegendScale(i))
   .attr('y', height - margin.bottom + 50)
   .attr("width", xLegendScale.bandwidth())
   .attr("height", 20)
   .attr("fill", (d)=> colorScale(d))
  

   legnedLabels = svg
   .selectAll("legend-labels")
   .data(legendData)
   .enter()
   .append("text")
   .attr("x", (d,i) => xLegendScale(i)+ xLegendScale.bandwidth()/2)
   .attr("y", height - margin.bottom + 20)
   .text((d) =>d3.format("0.1f")(d))
   .attr("class", "legend-labels")
   .style("fill", (d)=> (d>=0.5 ? "#fff" : "#111"));

});
