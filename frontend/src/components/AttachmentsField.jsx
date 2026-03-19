import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Paperclip } from "lucide-react";

export default function AttachmentsField({
  existingAttachments = [],
  onRemoveExisting,
  onFilesChange,
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="attachments">Pièces jointes</Label>
      <div className="flex items-center gap-3 rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2">
        <Paperclip className="h-4 w-4 text-slate-400" />
        <input
          id="attachments"
          type="file"
          multiple
          onChange={onFilesChange}
          className="w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-orange-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-orange-700"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Images, vidéo, pdf, docx, xlsx, pptx. Taille max 100MB.
      </p>
      {existingAttachments.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Fichiers déjà joints</div>
          {existingAttachments.map((file, index) => (
            <div
              key={`${file.path || file.name}-${index}`}
              className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
            >
              <span className="text-muted-foreground">{file.name}</span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onRemoveExisting(index)}
              >
                Retirer
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
