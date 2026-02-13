import { getRouteApi, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { PassiveWizard } from '../components/passive-wizard';
import { useLiabilitiesStore } from '@/stores/passives-store';
import type { Liability } from '../data/schema';
import { LiabilityView } from '@/routes/_authenticated/passives';

const LiabilityRoute = getRouteApi('/_authenticated/passives/');
export function EditLiability() {
  const { passiveId } = useParams({ from: '/_authenticated/passives/$passiveId/edit' });
  const { liabilities, updateLiability } = useLiabilitiesStore();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<Liability | null>(null);
  const nagateBack = LiabilityRoute.useNavigate();

  const liability = liabilities.find((l) => l.id === passiveId);

  useEffect(() => {
    if (liability) {
      setInitialData(liability);
    }
  }, [liability]);

  if (!initialData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Passivo não encontrado</h2>
            <p className="text-muted-foreground mb-4">
              O passivo que você está tentando editar não existe ou foi removido.
            </p>
            <Button onClick={() => {
                nagateBack({
                    to: '/passives',
                    search: {
                        view: LiabilityView.OVERVIEW,
                        tabs: LiabilityView.OVERVIEW,
                    }
                });
            }}>
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (values: Liability) => {
    try {
      setIsLoading(true);
      // Add a small delay to simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      updateLiability(passiveId, {
        ...values,
        ultimaAtualizacao: new Date().toISOString(),
      });
      
      toast.success('Passivo atualizado com sucesso!');
      window.history.back();
    } catch (error) {
      toast.error('Erro ao atualizar passivo');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header fixed>
        <Button variant="ghost" size="icon" asChild onClick={() => {
            nagateBack({
                to: '/passives',
                search: {
                    view: LiabilityView.OVERVIEW,
                    tabs: LiabilityView.LIST,
                }
            });
        }}>
            <div>
                <ArrowLeft size={18} />
            </div>
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Editar Passivo</h1>
          <p className="text-sm text-muted-foreground">{initialData.nome}</p>
        </div>
      </Header>

      <Main>
        <PassiveWizard 
          onSubmit={handleSubmit} 
          isLoading={isLoading}
          initialData={initialData}
        />
      </Main>
    </>
  );
}

export default EditLiability;