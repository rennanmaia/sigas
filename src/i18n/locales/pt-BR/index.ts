import type { I18nResource } from "@/i18n/types";

export const ptBR: I18nResource = {
    common: {
        buttons: {
            download: "Baixar",
            globalSearch: "Buscar"
        },
        pagination: {
            pageOf: "Página {{current}} de {{total}}",
            rowsPer: "Linhas por página"
        },
        table: {
            viewOptions: {
                title: "Visualização",
                menuTitle: "Mostrar Colunas"
            }
        }
    },
    dashboard: {
        title: "Painel",
        tabs: {
            overview: "Visão Geral",
            analytics: "Análises",
            notifications: "Notificações",
            reports: "Relatórios"
        }
    },
    users: {
        list: {
            title: "Lista de Usuários",
            description: "Gerencie seus usuários e suas funções aqui.",
            buttons: {
                add: "Adicionar Novo Usuário"
            },
            table: {
                searchPlaceholder: "Buscar por nome",
                noResults: "Nenhum usuário foi encontrado nos resultados!",
                filters: {
                    name: "Nome",
                    roles: "Perfil",
                    status: "Status"
                },
                headers: {
                    fullName: "Nome",
                    username: "Usuário",
                    cpf: "CPF",
                    email: "Email",
                    roles: "Perfis",
                    status: "Status",
                },
                columns: {
                    actions: {
                        delete: "Excluir",
                        view: "Visulizar"
                    }
                },
            }
        },
        create: {
            title: "Criar novo Usuário",
            description: "Crie um novo usuário para participar da sua equipe enviando um convite por e-mail e atribua uma função para definir o nível de acesso dele.",
            submit: {
                message: "Convite enviado. Um e-mail com os próximos passos foi enviado."
            },
            form: {
                cpf: {
                    label: "CPF",
                    placeholder: "xxx.xxx.xxx-xx",
                    validation: {
                        invalid: "Formato do CPF inválido",
                        required: "Adicione um CPF!"
                    }
                },
                fullname: {
                    label: "Nome Completo",
                    placeholder: "ex: João Carvalho",
                    validation: {
                        required: "O nome é obrigatório!"
                    }
                },
                email: {
                    label: "Email",
                    placeholder: "ex: joaocarvalho@gmail.com",
                    validation: {
                        invalid: "Email inválido!"
                    }
                },
                roles: {
                    label: "Perfis",
                    placeholder: "Buscar perfis",
                    selectionPlaceholder: "Selecione os Perfis",
                    notFound: "Perfil não encontrado!",
                    validation: {
                        required: "Escolha pelo menos 1 perfil"
                    }
                },
                description: {
                    label: "Descrição (Opcional)",
                    placeholder: "Adicione uma mensagem pessoal para enviar a este usuário no seu convite (opcional)"
                },
            },
            actions: {
                cancel: "Cancelar",
                create: "Criar"
            }
        }
    }
}