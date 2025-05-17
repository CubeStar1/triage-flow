import React from 'react';
import { BaseNode, BaseNodeProps } from './BaseNode';

export function MLPipelineNode(props: BaseNodeProps) {
  return <BaseNode {...props} isTarget={false} />;
} 