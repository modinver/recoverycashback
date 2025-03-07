import { Button } from "@/components/ui/button";

interface PageFormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
}

export function PageFormActions({ onCancel, isEditing }: PageFormActionsProps) {
  return (
    <div className="flex justify-end space-x-4 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {isEditing ? "Update" : "Create"} Page
      </Button>
    </div>
  );
}