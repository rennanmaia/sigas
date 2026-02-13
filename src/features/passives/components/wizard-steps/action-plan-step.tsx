import type { Control, UseFormWatch } from 'react-hook-form';
import { useState } from 'react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SelectDropdown } from '@/components/select-dropdown';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Calendar, User, Flag } from 'lucide-react';
import type { Liability } from '../../data/schema';

interface ActionPlanStepProps {
  control: Control<Liability>;
  watch: UseFormWatch<Liability>;
}

export function ActionPlanStep({ control, watch }: ActionPlanStepProps) {
  const [newAction, setNewAction] = useState({
    descricao: '',
    responsavel: '',
    dataPrevista: '',
    prioridade: 'alta' as const,
  });
  const acoes = watch('acoes');

  const handleAddAction = () => {
    if (newAction.descricao && newAction.responsavel && newAction.dataPrevista) {
      const action = {
        id: `acao-${Date.now()}`,
        ...newAction,
      };
      control._formValues.acoes = [...(acoes || []), action];
      setNewAction({
        descricao: '',
        responsavel: '',
        dataPrevista: '',
        prioridade: 'alta',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Status do Plano */}
      <FormField
        control={control}
        name="statusPlano"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status do Plano de Ação *</FormLabel>
            <div className="w-fit">
              <SelectDropdown
                defaultValue={field.value}
                onValueChange={field.onChange}
                items={[
                  { label: 'Não Definido', value: 'Não Definido' },
                  { label: 'Em Planejamento', value: 'Em Planejamento' },
                  { label: 'Em Execução', value: 'Em Execução' },
                  { label: 'Atrasado', value: 'Atrasado' },
                  { label: 'Concluído', value: 'Concluído' },
                ]}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Próxima Ação */}
      <FormField
        control={control}
        name="proximaAcao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Próxima Ação Prevista *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descreva qual será a próxima ação para corrigir este passivo"
                className="resize-none h-24"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Ação imediata que será tomada
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Ações Planejadas */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-3">Ações Corretivas Planejadas</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Adicione um cronograma de ações para resolver o passivo
          </p>
        </div>

        {/* Listagem de Ações */}
        {acoes && acoes.length > 0 && (
          <div className="space-y-2">
            {acoes.map((acao) => (
              <Card key={acao.id} className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-sm">{acao.descricao}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {acao.responsavel}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(acao.dataPrevista).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Flag className={`h-3 w-3 ${
                          acao.prioridade === 'crítica' ? 'text-red-500' :
                          acao.prioridade === 'alta' ? 'text-orange-500' :
                          acao.prioridade === 'média' ? 'text-yellow-500' :
                          'text-green-500'
                        }`} />
                        {acao.prioridade}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      control._formValues.acoes = acoes.filter(a => a.id !== acao.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Formulário para Nova Ação */}
        <Card className="p-4 bg-muted/50">
          <div className="space-y-3">
            <FormItem>
              <FormLabel className="text-sm">Descrição da Ação</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="O que precisa ser feito"
                  className="resize-none h-16"
                  value={newAction.descricao}
                  onChange={(e) =>
                    setNewAction({ ...newAction, descricao: e.target.value })
                  }
                />
              </FormControl>
            </FormItem>

            <div className="grid grid-cols-2 gap-3">
              <FormItem>
                <FormLabel className="text-sm">Responsável</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome do responsável"
                    value={newAction.responsavel}
                    onChange={(e) =>
                      setNewAction({
                        ...newAction,
                        responsavel: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel className="text-sm">Data Prevista</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={newAction.dataPrevista}
                    onChange={(e) =>
                      setNewAction({
                        ...newAction,
                        dataPrevista: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </FormItem>
            </div>

            <FormItem>
              <FormLabel className="text-sm">Prioridade</FormLabel>
              <div className="w-fit">
                <SelectDropdown
                  defaultValue={newAction.prioridade}
                  onValueChange={(value) =>
                    setNewAction({
                      ...newAction,
                      prioridade: value as any,
                    })
                  }
                  items={[
                    { label: 'Baixa', value: 'baixa' },
                    { label: 'Média', value: 'média' },
                    { label: 'Alta', value: 'alta' },
                    { label: 'Crítica', value: 'crítica' },
                  ]}
                />
              </div>
            </FormItem>

            <Button
              type="button"
              onClick={handleAddAction}
              className="w-full gap-2"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              Adicionar Ação
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
