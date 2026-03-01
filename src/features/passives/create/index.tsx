import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { PassiveWizard } from '../components/passive-wizard';
import { LiabilityView } from '@/routes/_authenticated/passives';
import type { Liability } from '../data/schema';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLiabilitiesStore } from '@/stores/passives-store';

export function CreatePassive() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { addLiability } = useLiabilitiesStore();

  const handleSubmit = async (values: Liability) => {
    try {
      setIsLoading(true);

      const passive: Liability = {
        ...values,
        id: `passivo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ultimaAtualizacao: new Date().toISOString(),
        acoes: values.acoes || [],
        documentos: values.documentos || [],
      };

      addLiability(passive);

      toast.success('Passivo criado com sucesso!');

      setTimeout(() => {
        navigate({ to: '/passives', search: { tabs: LiabilityView.LIST, view: LiabilityView.OVERVIEW } });
      }, 1500);
    } catch (error) {
      toast.error('Erro ao criar passivo');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header fixed>
        <div className="flex items-center gap-2">
          <Link
            search={{tabs: LiabilityView.OVERVIEW, view: LiabilityView.OVERVIEW}}
            to="/passives"
            className="inline-flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft size={18} /> Voltar
          </Link>
        </div>
      </Header>

      <Main>
        <div className="mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Criar novo passivo</CardTitle>
            </CardHeader>
            <CardContent>
              <PassiveWizard onSubmit={handleSubmit} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  );
}

export default CreatePassive;