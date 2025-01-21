import { Button } from "@/components/ui/button";

interface WebpageFormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
  isSubmitting: boolean;
}

export function WebpageFormActions({ 
  onCancel, 
  isEditing,
  isSubmitting 
}: WebpageFormActionsProps) {
  return (
    <div className="flex justify-end space-x-4 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'} Web Page
      </Button>
    </div>
  );
}