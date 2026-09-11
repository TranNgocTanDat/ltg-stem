import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

type DeleteProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  onConfirm: () => void;
};

export default function DeleteProjectDialog({
  open,
  onOpenChange,
  projectName,
  onConfirm,
}: DeleteProjectDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Xóa project?
          </DialogTitle>

          <DialogDescription>
            Bạn có chắc muốn xóa project{" "}
            <span className="font-medium text-foreground">
              "{projectName}"
            </span>
            ?
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm">
          <span className="font-medium">
            ⚠️ Lưu ý:
          </span>{" "}
          Hành động này không thể hoàn tác.
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Hủy
          </Button>

          <Button
            variant="destructive"
            onClick={handleConfirm}
          >
            Xóa project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}