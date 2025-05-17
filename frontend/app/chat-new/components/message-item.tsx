'use client';

import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const tabularData = message.tabular_data;

  return (
    <div className="mb-4">
      <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[100%] p-3 rounded-lg sm:max-w-[75%] md:max-w-[75%] lg:max-w-[50%] ${
          message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
        }`}>
          {message.role === 'assistant' ? (
            <div className="overflow-hidden">
              <ReactMarkdown 
                className="prose prose-sm max-w-none break-words overflow-wrap-anywhere dark:prose-invert"
                components={{
                  p: ({node, ...props}) => <p className="mb-2" {...props} />,
                  pre: ({node, ...props}) => <pre className="overflow-x-auto" {...props} />,
                  code: ({node, ...props}) => <code className="text-xs" {...props} />
                }}
              >
                {message.content.split('[SQL_QUERY]')[0].trim()}
              </ReactMarkdown>
              
              {tabularData && tabularData.length > 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="mt-2 w-full"
                    >
                      Show Results
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[80vw] max-h-[80vh] overflow-auto">
                    <DialogHeader>
                      <DialogTitle>Query Results</DialogTitle>
                    </DialogHeader>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {Object.keys(tabularData[0]).map((key) => (
                            <TableHead key={key}>{key}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tabularData.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {Object.values(row).map((value, cellIndex) => (
                              <TableCell key={cellIndex}>{value as string}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </DialogContent>
                </Dialog>
              )}
              
              {message.content.includes('[SQL_QUERY]') && (
                <div className="mt-2 p-2 bg-background rounded-md">
                  <strong>Executed Query:</strong>
                  <pre className="mt-1 p-2 bg-muted rounded-md overflow-x-auto text-sm">
                    <code>{message.content.split('[SQL_QUERY]')[1].split('[/SQL_QUERY]')[0].trim()}</code>
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="break-words overflow-wrap-anywhere">{message.content}</div>
          )}
        </div>
      </div>
    </div>
  );
} 