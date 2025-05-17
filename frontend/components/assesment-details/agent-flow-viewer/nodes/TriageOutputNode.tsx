import React from 'react';
import { BaseNode, BaseNodeProps } from './BaseNode';

export function TriageOutputNode(props: BaseNodeProps) {
  return <BaseNode {...props} isSource={false} />;
} 