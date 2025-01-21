import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<string>('edit');

  return (
    <Card className="min-h-[500px] p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="mt-4">
          <MDEditor
            value={value}
            onChange={onChange}
            preview='edit'
            height={450}
            className="rounded-md border"
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-4">
          <div className="prose max-w-none dark:prose-invert" data-color-mode="light">
            <MDEditor.Markdown source={value} />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
