import { Button } from "@/components/ui/button";

interface ArticleFormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
}

export function ArticleFormActions({ onCancel, isEditing }: ArticleFormActionsProps) {
  return (
    <div className="flex justify-end space-x-4 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {isEditing ? "Update" : "Create"} Article
      </Button>
    </div>
  );
}