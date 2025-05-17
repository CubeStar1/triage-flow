"use client";

import React, { useState, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  Position,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './styles.css';
import { Card } from '@/components/ui/card';
import { ProcessNode } from './nodes/ProcessNode';

const nodeTypes = {
  process: ProcessNode,
};

type NodeType = 'upload' | 'preprocessing' | 'classification' | 'embedding' | 
                'agent1-query' | 'agent1-summarize' | 'agent2-analyze' | 
                'agent2-diagnose' | 'final';

// Color map for edges based on source node type
const edgeColorMap: Record<NodeType, string> = {
  'upload': 'rgb(59, 130, 246)', // blue-500
  'preprocessing': 'rgb(168, 85, 247)', // purple-500
  'classification': 'rgb(34, 197, 94)', // green-500
  'embedding': 'rgb(234, 179, 8)', // yellow-500
  'agent1-query': 'rgb(236, 72, 153)', // pink-500
  'agent1-summarize': 'rgb(249, 115, 22)', // orange-500
  'agent2-analyze': 'rgb(20, 184, 166)', // teal-500
  'agent2-diagnose': 'rgb(99, 102, 241)', // indigo-500
  'final': 'rgb(244, 63, 94)', // rose-500
};

interface AgentFlowViewerProps {
  triageData: any;
}

export function AgentFlowViewer({ triageData }: AgentFlowViewerProps) {
  // Calculate positions for an alternating layout
  const VERTICAL_SPACING = 100;
  const HORIZONTAL_OFFSET = 300;
  const CENTER_X = 400;
  const START_Y = 20;

  const getNodePosition = (index: number) => ({
    x: CENTER_X + (index % 2 === 0 ? -HORIZONTAL_OFFSET/2 : HORIZONTAL_OFFSET/2),
    y: START_Y + (index * VERTICAL_SPACING),
  });

  const initialNodes: Node[] = [
    {
      id: 'upload',
      type: 'process',
      position: getNodePosition(0),
      data: { label: 'Image Upload', status: 'waiting', type: 'upload' },
    },
    {
      id: 'preprocessing',
      type: 'process',
      position: getNodePosition(1),
      data: { label: 'Image Preprocessing', status: 'waiting', type: 'preprocessing' },
    },
    {
      id: 'classification',
      type: 'process',
      position: getNodePosition(2),
      data: { label: 'ResNet18 Classification', status: 'waiting', type: 'classification' },
    },
    {
      id: 'embedding',
      type: 'process',
      position: getNodePosition(3),
      data: { label: 'Vector Embedding', status: 'waiting', type: 'embedding' },
    },
    {
      id: 'agent1-query',
      type: 'process',
      position: getNodePosition(4),
      data: { label: 'Agent 1: Query KB', status: 'waiting', type: 'agent1-query' },
    },
    {
      id: 'agent1-summarize',
      type: 'process',
      position: getNodePosition(5),
      data: { label: 'Agent 1: Summarize', status: 'waiting', type: 'agent1-summarize' },
    },
    {
      id: 'agent2-analyze',
      type: 'process',
      position: getNodePosition(6),
      data: { label: 'Agent 2: Severity Analysis', status: 'waiting', type: 'agent2-analyze' },
    },
    {
      id: 'agent2-diagnose',
      type: 'process',
      position: getNodePosition(7),
      data: { label: 'Agent 2: Generate Diagnoses', status: 'waiting', type: 'agent2-diagnose' },
    },
    {
      id: 'final',
      type: 'process',
      position: getNodePosition(8),
      data: { label: 'Generate Final Report', status: 'waiting', type: 'final' },
    },
  ];

  const getEdgeStyle = (sourceNodeId: NodeType, isAnimated: boolean) => ({
    stroke: edgeColorMap[sourceNodeId],
    strokeWidth: isAnimated ? 3 : 2,
    filter: isAnimated ? `drop-shadow(0 0 8px ${edgeColorMap[sourceNodeId]})` : undefined,
  });

  const initialEdges: Edge[] = [
    { 
      id: 'e1', 
      source: 'upload', 
      target: 'preprocessing', 
      animated: false,
      style: getEdgeStyle('upload', false),
      type: 'smoothstep',
    },
    { 
      id: 'e2', 
      source: 'preprocessing', 
      target: 'classification', 
      animated: false,
      style: getEdgeStyle('preprocessing', false),
      type: 'smoothstep',
    },
    { 
      id: 'e3', 
      source: 'classification', 
      target: 'embedding', 
      animated: false,
      style: getEdgeStyle('classification', false),
      type: 'smoothstep',
    },
    { 
      id: 'e4', 
      source: 'embedding', 
      target: 'agent1-query', 
      animated: false,
      style: getEdgeStyle('embedding', false),
      type: 'smoothstep',
    },
    { 
      id: 'e5', 
      source: 'agent1-query', 
      target: 'agent1-summarize', 
      animated: false,
      style: getEdgeStyle('agent1-query', false),
      type: 'smoothstep',
    },
    { 
      id: 'e6', 
      source: 'agent1-summarize', 
      target: 'agent2-analyze', 
      animated: false,
      style: getEdgeStyle('agent1-summarize', false),
      type: 'smoothstep',
    },
    { 
      id: 'e7', 
      source: 'agent2-analyze', 
      target: 'agent2-diagnose', 
      animated: false,
      style: getEdgeStyle('agent2-analyze', false),
      type: 'smoothstep',
    },
    { 
      id: 'e8', 
      source: 'agent2-diagnose', 
      target: 'final', 
      animated: false,
      style: getEdgeStyle('agent2-diagnose', false),
      type: 'smoothstep',
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Simulate the processing pipeline
  useEffect(() => {
    const steps: NodeType[] = [
      'upload',
      'preprocessing',
      'classification',
      'embedding',
      'agent1-query',
      'agent1-summarize',
      'agent2-analyze',
      'agent2-diagnose',
      'final'
    ];

    const processStep = async (stepIndex: number) => {
      if (stepIndex >= steps.length) return;

      // Update current node status
      setNodes(nodes => nodes.map(node => {
        if (node.id === steps[stepIndex]) {
          return {
            ...node,
            data: { ...node.data, status: 'processing' }
          };
        }
        return node;
      }));

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update node status to completed and animate next edge
      setNodes(nodes => nodes.map(node => {
        if (node.id === steps[stepIndex]) {
          return {
            ...node,
            data: { ...node.data, status: 'completed' }
          };
        }
        return node;
      }));

      setEdges(edges => edges.map(edge => {
        if (edge.source === steps[stepIndex]) {
          return { 
            ...edge, 
            animated: true,
            style: getEdgeStyle(steps[stepIndex], true),
          };
        }
        return edge;
      }));

      // Process next step
      setTimeout(() => processStep(stepIndex + 1), 1000);
    };

    // Start the process
    processStep(0);
  }, [setNodes, setEdges]);

  return (
    <Card className="w-full h-[calc(100vh-19rem)] ">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ 
          padding: 0.2,
          minZoom: 0.5,
          maxZoom: 1.5,
        }}
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background color="#666" gap={18} />
        <Controls />
      </ReactFlow>
    </Card>
  );
}