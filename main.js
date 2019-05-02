
var width = 1000,
height = 550;

fetch("https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json")
     .then((res)=>{
         return res.json();
     })
     .then((data)=>{
         chart(data);
     }).catch((error)=>{
         console.log(error);
     })




     var chart = (data) =>{
         var color = d3.scaleOrdinal(d3.schemeCategory10);
         var format = d3.format(",d");

         var tooltip=d3.select('body')
                       .append('div')
                       .attr('class',"tooltip")
                       .attr('id','tooltip')
                       .style('opacity',0)

         var treemap =d3.treemap()
                        .tile(d3.treemapResquarify)
                        .size([width-200, height])
                        .padding(1)
                        .round(true)

         const root = d3.hierarchy(data)
                        .eachBefore((d)=>{d.data.id = (d.parent ? d.parent.data.id + '.':" ") + d.data.name})
                        .sum(d => d.value)
                        .sort((a, b) => b.value - a.value);

        treemap(root);
        var category=root.leaves().map((d)=>d.data.category);
        category=category.filter((c,index,self)=>{
            
            return self.indexOf(c)===index;
        });
                 
        var svg = d3.select('.chart')
                     .attr('width',width)
                     .attr('height',height)

         var leaf = svg.selectAll('g')
                       .data(root.leaves())
                       .join('g')
                       .attr("transform",(d)=>`translate(${d.x0},${d.y0})`)

        //  leaf.append("title")
        //      .text(d => `${d.ancestors().reverse().map(d => d.data.name).join("-")}\n${format(d.value)}`);

         leaf.append("rect")
             .attr("id", d => (d.leafUid = d.data.id))
             .attr("class",'tile')
             .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
             .attr("fill-opacity", 0.6)
             .attr('data-name',(d)=>{
                 return d.data.name
             })
             .attr('data-category',(d)=>d.data.category)
             .attr('data-value',(d)=>d.data.value)
             .attr("width", d => d.x1 - d.x0)
             .attr("height", d => d.y1 - d.y0)
            

         leaf.append("clipPath")
             .attr("id", d => (d.clipUid = "clip-"+ d.data.id))
             .append("use")
             .attr("xlink:href", d => "#"+d.data.href);

         leaf.append("text")    
             .attr("clip-path", d => d.clipUid)
             .selectAll("tspan")
             .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
             .join("tspan")
             .attr("x", 3)
             .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
             .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
             .text(d => {
                 return d;
             });

             leaf.on('mouseover',(d)=>{
                 tooltip.style('opacity',0.8);
                //  console.log(d)
                tooltip.attr('data-value',()=>{
                    return d.data.value;
                })
                 tooltip.html("Genre : " +d.data.category +" <br> " + "Name : " + d.data.name + "<br>"+"Value : " + d.data.value);
                 tooltip.style("left",(d3.event.pageX) + 5+ 'px')
                        .style('top',(d3.event.pageY)+"px")

             })
             .on('mouseout',(d)=>{
                 tooltip.style('opacity',0);
             })

             var legend=svg.append('g')
                           .attr('id','legend')
                           .selectAll('g')
                           .data(category)
                           .enter()
                           .append('g')
                           .attr('class','category')

                     legend.append('rect')
                           .attr("class",'legend-item')
                           .attr('x',850)
                           .attr('y',(d,i)=>{
                               return 187+i*30;
                           })
                           .attr('width',20)
                           .attr('height',20)
                           .attr('fill',(d)=>{
                               return color(d);
                           })

                           
                           
                           legend.append('text')
                                 .attr('x',880)
                                 .attr('y',(d,i)=>{
                                    return 200 + i*30;
                                  })
                                 .text(d=>d)
                                 .attr('fill',(d)=>color(d));


        
                        
     }