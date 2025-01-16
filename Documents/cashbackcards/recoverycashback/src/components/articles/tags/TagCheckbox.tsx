import { Tables } from "@/integrations/supabase/types";
import { Checkbox } from "@/components/ui/checkbox";

interface TagCheckboxProps {
  tag: Tables<"tags">;
  isSelected: boolean;
  onToggle: () => void;
}

export function TagCheckbox({ tag, isSelected, onToggle }: TagCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={tag.id}
        checked={isSelected}
        onCheckedChange={onToggle}
      />
      <label
        htmlFor={tag.id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {tag.name}
      </label>
    </div>
  );
}