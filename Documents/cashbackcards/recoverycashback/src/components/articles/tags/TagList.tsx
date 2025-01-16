import { Tables } from "@/integrations/supabase/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TagCheckbox } from "./TagCheckbox";

interface TagListProps {
  tags: Tables<"tags">[] | undefined;
  selectedTags: Tables<"tags">[];
  onTagToggle: (tag: Tables<"tags">) => void;
}

export function TagList({ tags, selectedTags, onTagToggle }: TagListProps) {
  return (
    <ScrollArea className="h-[200px] border rounded-md p-4">
      <div className="space-y-4">
        {tags?.map((tag) => (
          <TagCheckbox
            key={tag.id}
            tag={tag}
            isSelected={selectedTags.some(t => t.id === tag.id)}
            onToggle={() => onTagToggle(tag)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}