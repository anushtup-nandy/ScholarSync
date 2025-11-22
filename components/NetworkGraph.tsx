import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { User } from '../types';

interface NetworkGraphProps {
  centerUser: User;
  connections: User[];
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ centerUser, connections }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 300;
    const height = 200;
    
    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g");

    const nodes = [
      { id: centerUser.id, name: centerUser.name, group: 1 },
      ...connections.map(c => ({ id: c.id, name: c.name, group: 2 }))
    ];

    const links = connections.map(c => ({ source: centerUser.id, target: c.id }));

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#E0E0E0")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2);

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => d.group === 1 ? 12 : 8)
      .attr("fill", (d) => d.group === 1 ? "#37352F" : "#9B9A97");

    // Add simple tooltips or labels if needed, kept simple for aesthetics
    node.append("title")
      .text((d: any) => d.name);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [centerUser, connections]);

  return (
    <div className="border border-notion-border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-sm font-semibold text-notion-gray mb-2 uppercase tracking-wider">Collaboration Network</h3>
      <div className="flex justify-center">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default NetworkGraph;