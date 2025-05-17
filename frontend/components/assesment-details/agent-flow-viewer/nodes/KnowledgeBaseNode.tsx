import React from 'react';
import { BaseNode, BaseNodeProps } from './BaseNode';

export function KnowledgeBaseNode(props: BaseNodeProps) {
  return <BaseNode {...props} isTarget={false} />;
} 