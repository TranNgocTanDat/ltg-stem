import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CreateProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string) => void;
};

export default function CreateProjectDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateProjectDialogProps) {
  const [name, setName] = useState("");

  const handleCreate = () => {
    const projectName =
      name.trim() || "Untitled";

    onCreate(projectName);

    setName("");
    onOpenChange(false);
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setName("");
    }

    onOpenChange(value);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Tạo project mới
          </DialogTitle>

          <DialogDescription>
            Đặt tên cho project của bạn.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <Input
            autoFocus
            placeholder="Ví dụ: Xe tránh vật cản"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreate();
              }
            }}
          />

          <p className="mt-2 text-xs text-muted-foreground">
            Nếu để trống, project sẽ có tên
            <span className="font-medium">
              {" "}Untitled
            </span>.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              handleOpenChange(false)
            }
          >
            Hủy
          </Button>

          <Button
            onClick={handleCreate}
          >
            Tạo project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}