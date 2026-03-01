export type FeatureItem = {
  id: string
  label: string
}

export type FeatureGroup = {
  id: string
  label: string
  children: FeatureItem[]
}
export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: 'profiles',
    label: 'Gerenciar perfis',
    children: [
      { id: 'profiles.register', label: 'Cadastrar perfil' },
      { id: 'profiles.change', label: 'Alterar dados do perfil' },
      { id: 'profiles.list', label: 'Listar perfis' },
      { id: 'profiles.access_view', label: 'Acessar visualização do perfil' },
      { id: 'profiles.delete', label: 'Excluir perfil' },
      { id: 'profiles.view', label: 'Visualizar perfil' },
    ],
  },
  {
    id: 'functionalities',
    label: 'Gerenciar funcionalidades',
    children: [
      { id: 'functionalities.register', label: 'Cadastrar funcionalidade' },
      { id: 'functionalities.delete', label: 'Excluir funcionalidade' },
      { id: 'functionalities.list', label: 'Listar funcionalidades' },
      { id: 'functionalities.add_to_profile', label: 'Adicionar funcionalidade ao perfil' },
      { id: 'functionalities.delete_from_profile', label: 'Remover funcionalidade do perfil' },
    ],
  },
  {
    id: 'users',
    label: 'Gerenciar usuários',
    children: [
      { id: 'users.register', label: 'Cadastrar novo usuário' },
      { id: 'users.list', label: 'Listar usuários' },
      { id: 'users.delete', label: 'Excluir usuário' },
      { id: 'users.view_profile', label: 'Visualizar perfil' },
      { id: 'users.change_data', label: 'Alterar dados do usuário' },
      { id: 'users.change_password', label: 'Alterar senha' },
      { id: 'users.remember_password', label: 'Recuperar senha' },
      { id: 'users.login', label: 'Entrar no sistema' },
      { id: 'users.logout', label: 'Sair do sistema' },
    ],
  },
  {
    id: 'projects',
    label: 'Gerenciar projetos',
    children: [
      { id: 'projects.register', label: 'Cadastrar novo projeto' },
      { id: 'projects.list', label: 'Listar projetos' },
      { id: 'projects.search', label: 'Pesquisar projetos' },
      { id: 'projects.view', label: 'Visualizar projeto' },
      { id: 'projects.change', label: 'Alterar dados do projeto' },
      { id: 'projects.delete', label: 'Excluir projeto' },
    ],
  },
  {
    id: 'questionnaires',
    label: 'Gerenciar questionários',
    children: [
      { id: 'questionnaires.register', label: 'Cadastrar questionário' },
      { id: 'questionnaires.list', label: 'Listar questionários' },
      { id: 'questionnaires.search', label: 'Pesquisar questionários' },
      { id: 'questionnaires.view', label: 'Visualizar questionário' },
      { id: 'questionnaires.change', label: 'Alterar dados do questionário' },
      { id: 'questionnaires.delete', label: 'Excluir questionário' },
    ],
  },
  {
    id: 'questions',
    label: 'Gerenciar perguntas',
    children: [
      { id: 'questions.register', label: 'Cadastrar pergunta' },
      { id: 'questions.list', label: 'Listar perguntas' },
      { id: 'questions.search', label: 'Pesquisar pergunta' },
      { id: 'questions.view', label: 'Visualizar pergunta' },
      { id: 'questions.change', label: 'Alterar pergunta' },
      { id: 'questions.delete', label: 'Excluir pergunta' },
    ],
  },
  {
    id: 'answers',
    label: 'Gerenciar respostas das perguntas',
    children: [
      { id: 'answers.register', label: 'Cadastrar resposta da pergunta' },
      { id: 'answers.list', label: 'Listar respostas das perguntas' },
      { id: 'answers.search', label: 'Pesquisar respostas das perguntas' },
      { id: 'answers.view', label: 'Visualizar resposta da pergunta' },
      { id: 'answers.change', label: 'Alterar resposta da pergunta' },
      { id: 'answers.delete', label: 'Excluir resposta da pergunta' },
    ],
  },
  {
    id: 'notifications',
    label: 'Gerenciar notificações',
    children: [
      { id: 'notifications.create', label: 'Criar nova notificação' },
      { id: 'notifications.list', label: 'Listar notificações' },
      { id: 'notifications.delete', label: 'Excluir notificação' },
      { id: 'notifications.search', label: 'Pesquisar notificação' },
      { id: 'notifications.view', label: 'Visualizar notificação' },
    ],
  },
  {
    id: 'liabilities',
    label: 'Gerenciar passivos',
    children: [
      { id: 'liabilities.create', label: 'Criar novo passivo' },
      { id: 'liabilities.change', label: 'Alterar passivo' },
      { id: 'liabilities.list', label: 'Listar passivos' },
      { id: 'liabilities.view', label: 'Visualizar passivo' },
      { id: 'liabilities.consult', label: 'Consultar passivo' },
      { id: 'liabilities.delete', label: 'Excluir passivo' },
      { id: 'liabilities.export.csv', label: 'Exportar para CSV' },
      { id: 'liabilities.export.excel', label: 'Exportar para Excel' },
      { id: 'liabilities.export.kmz', label: 'Exportar para KMZ' },
      { id: 'liabilities.export.kml', label: 'Exportar para KML' },
    ],
  },
  {
    id: 'reports',
    label: 'Relatórios',
    children: [
      { id: 'reports.data_collection_researcher', label: 'Coleta de dados por pesquisador' },
      { id: 'reports.by_questionnaire', label: 'Coleta de dados por questionário' },
      { id: 'reports.view_responses_map', label: 'Visualizar respostas no mapa' },
    ],
  },
  {
    id: 'other',
    label: 'Outros',
    children: [
      { id: 'other.draw_polygon', label: 'Desenhar polígono da resposta' },
      { id: 'other.capture_image', label: 'Capturar imagem' },
      { id: 'other.capture_audio', label: 'Capturar áudio' },
      { id: 'other.capture_video', label: 'Capturar vídeo' },
      { id: 'other.capture_location', label: 'Capturar localização' },
      { id: 'other.store_offline', label: 'Armazenar conteúdo/mídia offline' },
      { id: 'other.send_to_server', label: 'Enviar para o servidor' },
      { id: 'other.receive_from_server', label: 'Receber do servidor' },
      { id: 'other.transcribe_audio', label: 'Transcrever áudio' },
      { id: 'other.send_message', label: 'Enviar mensagem ao coletor' },
      { id: 'other.reply_message', label: 'Responder' },
      { id: 'other.list_messages', label: 'Listar mensagens' },
      { id: 'other.read_message', label: 'Ler mensagem' },
    ],
  },
]