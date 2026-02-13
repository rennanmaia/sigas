import type { Control, UseFormSetValue } from 'react-hook-form';
import { useState } from 'react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Trash2, File, FileText } from 'lucide-react';
import type { Liability } from '../../data/schema';

interface DocumentationStepProps {
  control: Control<Liability>;
  setValue?: UseFormSetValue<Liability>;
}


export function DocumentationStep({ control, setValue }: DocumentationStepProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<Array<{
    id: string;
    nome: string;
    tipo: 'evidencia' | 'plano' | 'auditoria' | 'outro';
    size: number;
  }>>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFiles = (files: FileList) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg', 'image/png', 'image/gif'];

    Array.from(files).forEach((file) => {
      if (file.size > maxSize) {
        console.warn(`File ${file.name} exceeds 10MB limit`);
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        console.warn(`File type ${file.type} not allowed`);
        return;
      }

      const newDoc = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        nome: file.name,
        tipo: 'outro' as const,
        size: file.size,
      };

      setUploadedDocs((prev) => [...prev, newDoc]);

      // Update form value
      if (setValue) {
        setValue('documentos', [...uploadedDocs, newDoc]);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const removeDocument = (docId: string) => {
    const updated = uploadedDocs.filter((doc) => doc.id !== docId);
    setUploadedDocs(updated);
    if (setValue) {
      setValue('documentos', updated);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'evidencia':
        return <File className="h-4 w-4 text-blue-500" />;
      case 'plano':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'auditoria':
        return <FileText className="h-4 w-4 text-purple-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Auditoria */}
      <FormField
        control={control}
        name="auditado"
        render={({ field }) => (
          <FormItem className="p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                Este passivo foi submetido a auditoria
              </FormLabel>
            </div>
            <FormDescription>
              Marque se já existe relatório de auditoria para este passivo
            </FormDescription>
          </FormItem>
        )}
      />

      {/* Documentos */}
      <div className="space-y-4">
        <div>
          <FormLabel>Documentos Anexados</FormLabel>
          <FormDescription>
            Anexe evidências, planos de ação, relatórios de auditoria e outros documentos relevantes
          </FormDescription>
        </div>

        {/* Upload Area */}
        <Card
          className={`p-8 border-2 border-dashed rounded-lg transition-colors cursor-pointer
            ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <label className="flex flex-col items-center justify-center text-center cursor-pointer">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="font-medium">Arraste arquivos aqui ou clique para selecionar</p>
            <p className="text-sm text-muted-foreground mt-1">
              Aceita PDF, DOC, DOCX, XLS, XLSX e imagens (max 10MB por arquivo)
            </p>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInput}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
            />
          </label>
        </Card>

        {/* Document Types Info */}
        <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
          <h4 className="font-medium text-sm mb-3">Tipos de documentos suportados:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span><strong>Evidência:</strong> Fotos, vídeos, dados que comprovam o passivo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span><strong>Plano:</strong> Documentos de planejamento e ação corretiva</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span><strong>Auditoria:</strong> Relatórios de auditoria e conformidade</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gray-500" />
              <span><strong>Outro:</strong> Documentos complementares</span>
            </div>
          </div>
        </Card>

        <div className="space-y-2">
          <p className="text-sm font-medium">Documentos anexados ({uploadedDocs.length})</p>
          <div className="space-y-2">
            {uploadedDocs.length > 0 ? (
              uploadedDocs.map((doc) => (
                <Card key={doc.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center">
                        {getFileIcon(doc.tipo)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{doc.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.tipo} • {(doc.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => removeDocument(doc.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">
                Nenhum documento anexado ainda. Adicione arquivos para registrar evidências do passivo.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
