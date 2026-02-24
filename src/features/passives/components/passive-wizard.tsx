import { useState, type MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import {
  BasicInfoStep,
  AssessmentStep,
  ActionPlanStep,
  DocumentationStep,
} from './wizard-steps';
import { LiabilitySchema, type Liability } from '../data/schema';

interface LiabilityWizardProps {
  onSubmit: (values: Liability) => Promise<void>;
  isLoading?: boolean;
  initialData?: Liability;
}

const steps = [
  { id: 1, title: 'Informações Básicas', description: 'Dados principais do passivo' },
  { id: 2, title: 'Avaliação de Risco', description: 'Impactos e tendências' },
  { id: 3, title: 'Plano de Ação', description: 'Ações corretivas planejadas' },
  { id: 4, title: 'Documentação', description: 'Evidências e auditorias' },
];

export function PassiveWizard({ onSubmit, isLoading = false, initialData }: LiabilityWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<Liability>({
    resolver: zodResolver(LiabilitySchema),
    mode: 'onChange',
    defaultValues: initialData || {
        nome: '',
        tipo: "Ambiental",
        categoria: '',
        dataIdentificacao: new Date().toISOString(),
        responsavel: '',
        risco: "Médio",
        impactoAmbiental: "Moderado",
        impactoSocial: "Moderado",
        recorrente: false,
        naoConformidade: false,
        tendencia: "estavel",
        recorrenciaContagem: 0,
        proximaAcao: "",
        statusPlano: "Não Definido",
        acoes: [],
        auditado: false,
        documentos: [],
        ultimaAtualizacao: new Date().toISOString(),
    },
  });

  const handleNext = async (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    event.preventDefault();
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
    event.stopPropagation();
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSubmit = (values: Liability) => {
    if (currentStep === steps.length) {
      onSubmit(values);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">{steps[currentStep - 1].title}</h2>
          <span className="text-sm text-muted-foreground">
            Passo {currentStep} de {steps.length}
          </span>
        </div>
        <div className="flex gap-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex-1 h-2 rounded-full transition-colors ${
                step.id <= currentStep
                  ? 'bg-primary'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          {steps[currentStep - 1].description}
        </p>
      </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit, (errors) => {
            console.log("form errors", errors)
          })} className="space-y-6">
            {currentStep === 1 && <BasicInfoStep control={form.control} />}
            {currentStep === 2 && <AssessmentStep control={form.control} />}
            {currentStep === 3 && <ActionPlanStep control={form.control} watch={form.watch} />}
            {currentStep === 4 && <DocumentationStep control={form.control} setValue={form.setValue} />}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              {currentStep === steps.length ? (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? 'Atualizando...' : initialData ? 'Atualizar Passivo' : 'Criar Passivo'}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={(e) => handleNext(e)}
                  className="gap-2"
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
    </div>
  );
}
