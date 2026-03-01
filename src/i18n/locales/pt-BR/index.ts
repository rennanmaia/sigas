import type { I18nResource } from "@/i18n/types";

export const ptBR: I18nResource = {
    common: {
        sidebar: {
            user: {
                title: "Usuário"
            },
            groups: {
                items: {
                    dashboard: "Painel",
                    projects: "Projetos",
                    forms: "Formulários",
                    liabilities: "Passivos",
                    chats: "Mensagens",
                    profiles: "Perfis",
                    users: "Usuários"
                },
                title: "Geral"
            },
            others: {   
                title: "Outros",
                items: {
                    settings: {
                        title: "Configurações",
                        items: {
                            account: "Conta",
                            notifications: "Notificações",
                            profile: "Perfil"
                        }
                    },
                    help: {
                        title: "Ajuda"   
                    }
                }
            }
        },
        themes: {
            light: "Claro",
            dark: "Escuro",
            system: "Sistema"
        },
        command: {
            menu: {
                input: "Digite um comando ou pesquise...",
                empty: "Nenhum comando encontrado.",
                theme: "Tema"
            }
        },
        comming: {
            title: "Em Breve!",
            description: "Esta página ainda não foi criada. Fique ligado!"
        },
        buttons: {
            download: "Baixar",
            globalSearch: "Buscar",
            continue: "Continuar",
            cancel: "Cancelar",
            back: "Voltar"
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
        },
        navigation: {
            profile: "Perfil",
            billing: "Faturamento",
            settings: "Configurações",
            newTeam: "Novo Time",
            signOut: "Sair",
            toggleTheme: "Alternar tema"
        },
        dialogs: {
            signOut: {
                title: "Sair",
                description: "Tem certeza de que deseja sair? Você precisará fazer login novamente para acessar sua conta.",
                confirmText: "Sair"
            }
        },
        dropdown: {
            upgradeToPro: "Atualizar para Pro",
            account: "Conta",
            billing: "Faturamento",
            notifications: "Notificações",
            signOut: "Sair"
        },
        team: {
            label: "Times",
            addTeam: "Adicionar time"
        },
        deleteDialog: {
            single: {
                title: "Excluir Item",
                description: "Tem certeza que deseja excluir \"{{label}}\"? Esta ação removerá permanentemente o item e não pode ser desfeita."
            },
            multi: {
                title: "Excluir {{count}} itens",
                description: "Tem certeza que deseja excluir os {{count}} itens selecionados? Esta ação não pode ser desfeita.",
                deafultConfirmWord: "EXCLUIR"
            },
            confirm: {
                label: "Confirme digitando o nome do item",
                placeholder: "Digite o nome do item \"{{label}}\" para confirmar a exclusão",
                keyword: "Confirme digitando \"{{label}}\"",
                keywordPlaceholder: "Digite \"{{label}}\" para confirmar"
            },
            warning: {
                title: "Atenção!",
                description: "Por favor, tenha cuidado. Esta operação não pode ser revertida."
            },
            confirmButton: "Excluir"
        }
    },
    dashboard: {
        title: "Painel",
        tabs: {
            overview: "Visão Geral",
            analytics: "Análises",
            notifications: "Notificações",
            reports: "Relatórios",
            nav: {
                costumers: "Clientes",
                overview: "Visão Geral",
                products: "Produtos",
                settings: "Configurações"
            }
        }
    },
    forms: {
        create: {
            form_builder: {
                form: {
                    defaultValues: {
                        title: "Título do Formulário",
                        description: "Descrição ou instruções...",
                    },
                    title: {
                        placeholder: "Título do Formulário",
                        validation: {
                            minLength: "O título deve ter pelo menos 3 caracteres",
                            maxLength: "O título não deve exceder 100 caracteres"
                        }
                    },
                    description: {
                        placeholder: "Descrição do Formulário",
                        validation: {
                            minLength: "A descrição deve ter pelo menos 5 caracteres"
                        }
                    },
                    project: {
                        title: "Projeto vinculado *",
                        empty: "Nenhum (criar como rascunho)",
                        placeholder: "Selecione um projeto",
                        preselected: "Projeto pré-selecionado e não pode ser alterado",
                    },
                    questions: {
                        label: {
                            validation: {
                                required: "O título da pergunta é obrigatório"
                            }
                        },
                        validation: {
                            minLength: "O formulário deve ter pelo menos uma pergunta"
                        },
                        alert: "Adicione pelo menos uma pergunta ao formulário antes de salvá-lo.",
                        empty: {
                            title: "Seu formulário está vazio.",
                            description: "Selecione um tipo de questão para começar."
                        },
                        options: {
                            label: {
                                validation: {
                                    required: "O texto da opção é obrigatório"
                                }
                            },
                            validation: {
                                minLength: "Deve ter pelo menos 2 opções"
                            }
                        }
                    }
                },
                dialog: {
                    confirm: {
                        title: "Salvar sem projeto vinculado?",
                        description:
                        "<0>Este formulário será criado <1>SEM projeto vinculado</1>.</0>" +
                        "<2>Isso significa que:</2>" +
                        "<3>" +
                            "<0>Ele será salvo como <1>RASCUNHO</1></0>" +
                            "<1><1>NÃO</1> poderá ser respondido</1>" +
                            "<2>Para ativá-lo, você precisará vinculá-lo a um projeto</2>" +
                        "</3>" +
                        "<4>Deseja continuar mesmo assim?</4>",
                        confirm: "Sim, salvar como rascunho",
                        cancel: "Cancelar",
                    },
                },
                validation: {
                    title: {
                        minLength: "O título deve ter pelo menos 3 caracteres",
                        maxLength: "O título não deve exceder 100 caracteres"
                    },
                    description: {
                        minLength: "A descrição deve ter pelo menos 5 caracteres"
                    },
                    questions: {
                        minArray: "O formulário deve ter pelo menos uma pergunta"
                    },
                    options: {
                        minArray: "Deve ter pelo menos 2 opções"
                    }
                }
            }
        },
        list: {
            title: "Formulários",
            description: "Gerencie e publique seus formulários"
        }
    },
    profiles: {
        view: {
            title: "Visualizar perfil",
            notFound: {
                message: "Não foi encontrado!"
            },
            buttons: {
                edit: "Editar"
            }
        },
        list: {
            buttons: {
                add: "Adicionar Novo Perfil",
            },
            title: "Lista de Perfis",
            description: "Gerencie seus perfis e suas funções aqui.",
            table: {
                columns: {
                    actions: {
                        delete: "Excluir",
                        edit: "Editar",
                        view: "Visualizar"
                    },
                },
                filters: {},
                headers: {
                    role: "Perfil",
                    description: "Descrição",
                    permissions: "Permissões"
                },
                noResults: "Nenhum perfil foi encontrado nos resultados!",
                searchPlaceholder: "Buscar por nome do perfil"
            }
        },
        create: {
            title: "Criar novo Perfil",
            description: "Crie um novo perfil para organizar seus usuários e definir suas permissões.",
            form: {
                name: {
                    label: "Nome do Perfil",
                    validation: {
                        required: "O nome do perfil é obrigatório"
                    }
                },
                description: {
                    label: "Descrição",
                    placeholder: "Descrição do perfil"
                },
                permissions: {
                    label: "Permissões",
                    validation: {
                        required: "Selecione no mínimo uma permissão"
                    },
                    search: {
                        collapse: "Fechar tudo",
                        expand: "Expandir tudo",
                        placeholder: "Buscar permissões"
                    },
                    featureGroup: {
                        selected: "Selecionado(s)"
                    }
                }
            },
            actions: {
                creationSubmitLabel: "Criar perfil",
                save: "Salvar",
                cancel: "Cancelar"
            }
        },
        logs: {
            title: "Logs de perfis",
            empty: "Nada criado",
            permissions: {
                label: "Permissões"
            }
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
    },
    projects: {
        list: {
            title: "Projetos",
            description: "Gerencie seus projetos",
            buttons: {
                new: "Criar projeto",
                logs: "Histórico"
            },
            filters: {
                all: "Todos os projetos",
                active: "Ativos",
                paused: "Pausados",
                finished: "Finalizados",
                canceled: "Cancelados",
                expired: "Expirados"
            },
            noResults: "Nenhum projeto foi encontrado!",
            searchPlaceholder: "Procurar projetos"
        },
        create: {
            title: "Criar novo Projeto",
            form: {
                title: {
                    label: "Título",
                    validation: {
                        required: "Título é obrigatório"
                    }
                },
                description: {
                    label: "Descrição",
                    validation: {
                        required: "Descrição é obrigatória"
                    }
                },
                category: {
                    label: "Categoria"
                },
                startDate: {
                    label: "Data de Início",
                    validation: {
                        required: "Data de início é obrigatória"
                    }
                },
                endDate: {
                    label: "Data de Término",
                    validation: {
                        required: "Data de término é obrigatória"
                    }
                },
                responsible: {
                    label: "Responsável",
                    validation: {
                        required: "Responsável é obrigatório"
                    }
                },
                budget: {
                    label: "Orçamento",
                    validation: {
                        positive: "O orçamento deve ser positivo"
                    }
                },
                company: {
                    label: "Empresa",
                    validation: {
                        required: "A empresa responsável é obrigatória"
                    }
                },
                customFields: {
                    label: {
                        validation: {
                            required: "O título é obrigatório"
                        }
                    },
                    value: {
                        validation: {
                            required: "O valor é obrigatório"
                        }
                    }
                }
            }
        },
        edit: {
            title: "Editar Projeto"
        },
        view: {
            title: "Visualizar Projeto"
        }
    },
    passives: {
        list: {
            title: "Passivos",
            description: "Gerencie seus passivos aqui.",
            tabs: {
                overview: "Visão Geral",
                management: "Gerenciamento",
                risks: "Riscos Críticos"
            },
            buttons: {
                new: "Novo Passivo"
            },
            table: {
                searchPlaceholder: "Buscar por passivo",
                noResults: "Nenhum passivo foi encontrado!"
            }
        }
    },
    chats: {
        title: "Mensagens",
        tabs: {
            messages: "Conversas",
            support: "Suporte"
        },
        buttons: {
            new: "Nova Conversa",
            send: "Enviar",
            call: "Chamar",
            video: "Vídeo"
        },
        search: {
            placeholder: "Buscar conversa"
        },
        messages: {
            noChat: "Selecione uma conversa para começar",
            typePlaceholder: "Digite uma mensagem..."
        }
    },
    settings: {
        title: "Configurações",
        navigation: {
            profile: "Perfil",
            account: "Conta",
            notifications: "Notificações"
        },
        profile: {
            title: "Perfil",
            description: "É assim que outros usuários irão ver seu perfil",
            form: {
                name: {
                    label: "Nome",
                    placeholder: "Seu nome completo",
                    validation: {
                        required: "Nome é obrigatório",
                        invalid: "O nome deve ter entre 2 e 30 caracteres",
                        maxLength: "O nome deve ter entre 2 e 30 caracteres"
                    }
                },
                email: {
                    label: "Email",
                    placeholder: "seu.email@exemplo.com",
                    validation: {
                        invalid: "Email inválido"
                    }
                },
                bio: {
                    label: "Bio",
                    placeholder: "Conte um pouco sobre você",
                    validation: {
                        minLength: "A bio deve ter no mínimo 4 caracteres",
                        maxLength: "A bio não deve exceder 160 caracteres"
                    }
                },
                urls: {
                    label: "URLs",
                    validation: {
                        invalid: "URL inválida"
                    }
                }
            }
        },
        account: {
            title: "Conta",
            description: "Atualize as configurações da sua conta. Defina seu idioma e fuso horário preferido.",
            form: {
                name: {
                    label: "Nome",
                    validation: {
                        required: "Nome é obrigatório",
                        minLength: "O nome deve ter no mínimo 2 caracteres",
                        maxLength: "O nome não deve exceder 30 caracteres"
                    }
                },
                dob: {
                    label: "Data de Nascimento"
                },
                language: {
                    label: "Idioma"
                },
                theme: {
                    label: "Tema"
                }
            }
        },
        display: {
            title: "Exibição",
            form: {
                items: {
                    label: "Itens",
                    validation: {
                        required: "Você deve selecionar no mínimo um item"
                    }
                }
            }
        },
        notifications: {
            title: "Notificações",
            description: "Configure como você recebe notificações.",
            form: {
                email: {
                    label: "Notificações por Email"
                },
                push: {
                    label: "Notificações Push"
                },
                sms: {
                    label: "Notificações por SMS"
                }
            }
        }
    }
}