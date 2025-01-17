import { Button } from "@/components/ui/button";

interface WebpageFormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
}

export function WebpageFormActions({ onCancel, isEditing }: WebpageFormActionsProps) {
  return (
    <div className="flex justify-end space-x-4 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {isEditing ? "Update" : "Create"} Web Page
      </Button>
    </div>
  );
}