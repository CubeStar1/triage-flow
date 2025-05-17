"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export function NotesSection() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string>("");

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("healthcareNotes");
    const savedTimestamp = localStorage.getItem("healthcareLastSaved");

    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedTimestamp) setLastSaved(savedTimestamp);
  }, []);

  const addNote = () => {
    if (!newNoteTitle.trim()) return;
    
    const note: Note = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: newNoteContent,
      createdAt: new Date().toLocaleString(),
    };

    const updatedNotes = [note, ...notes];
    setNotes(updatedNotes);
    setNewNoteTitle("");
    setNewNoteContent("");
    saveToLocalStorage(updatedNotes);
  };

  const removeNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    saveToLocalStorage(updatedNotes);
  };

  const saveToLocalStorage = (updatedNotes: Note[]) => {
    const timestamp = new Date().toLocaleString();
    localStorage.setItem("healthcareNotes", JSON.stringify(updatedNotes));
    localStorage.setItem("healthcareLastSaved", timestamp);
    setLastSaved(timestamp);
  };

  const toggleNote = (id: string) => {
    setExpandedNoteId(expandedNoteId === id ? null : id);
  };

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="pb-3 pt-4 px-4 md:px-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200">
          Notes
        </CardTitle>
        <CardDescription className="text-sm text-slate-600 dark:text-slate-400">Keep your important thoughts and reminders here.</CardDescription>
      </CardHeader>
      <CardContent className="p-3 md:p-4 space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Note title..."
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="flex-1"
            />
            <Textarea
              placeholder="Note content..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <Button
              onClick={addNote}
              className="w-full gap-2 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white"
            >
              <Plus className="h-4 w-4 text-purple-100" />
              Add Note
            </Button>
          </div>
          <div className="space-y-2">
            {notes.map((note) => (
              <div
                key={note.id}
                className="rounded-lg border transition-all hover:bg-accent/5"
              >
                <div
                  className="flex items-center gap-2 p-3 cursor-pointer"
                  onClick={() => toggleNote(note.id)}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                  >
                    {expandedNoteId === note.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{note.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      Created: {note.createdAt}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNote(note.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {expandedNoteId === note.id && (
                  <div className="px-3 pb-3 pt-0">
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
        <span className="text-xs text-muted-foreground">
          {lastSaved ? `Last saved: ${lastSaved}` : "Not saved yet"}
        </span>
      </CardFooter>
    </Card>
  );
}