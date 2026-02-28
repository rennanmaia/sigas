export interface FormResponse {
  id: string;
  formId: string;
  submittedAt: string;
  submittedBy: string;
  answers: Record<string, any>;
  editedAnswers?: Record<string, boolean>;
  updatedAt?: string;
}

export const formResponses: FormResponse[] = [
  {
    id: "resp-1",
    formId: "frm-1",
    submittedAt: "2026-01-20T08:30:00Z",
    submittedBy: "João Santos",
    answers: {
      q1: "Panthera onca",
      q2: "opt1",
      q3: "123.456.789-00",
    },
  },
  {
    id: "resp-2",
    formId: "frm-1",
    submittedAt: "2026-01-20T10:15:00Z",
    submittedBy: "Maria Silva",
    answers: {
      q1: "Cerdocyon thous",
      q2: "opt3",
      q3: "987.654.321-00",
    },
  },
  {
    id: "resp-3",
    formId: "frm-1",
    submittedAt: "2026-01-20T14:45:00Z",
    submittedBy: "Pedro Costa",
    answers: {
      q1: "Tamandua tetradactyla",
      q2: "opt2",
      q3: "111.222.333-44",
    },
  },
  {
    id: "resp-4",
    formId: "frm-1",
    submittedAt: "2026-01-21T07:20:00Z",
    submittedBy: "Ana Oliveira",
    answers: {
      q1: "Panthera onca",
      q2: "opt1",
      q3: "555.666.777-88",
    },
  },
  {
    id: "resp-5",
    formId: "frm-1",
    submittedAt: "2026-01-21T09:00:00Z",
    submittedBy: "Carlos Lima",
    answers: {
      q1: "Leopardus pardalis",
      q2: "opt1",
      q3: "",
    },
  },
  {
    id: "resp-6",
    formId: "frm-1",
    submittedAt: "2026-01-21T11:30:00Z",
    submittedBy: "Beatriz Souza",
    answers: {
      q1: "Cerdocyon thous",
      q2: "opt3",
      q3: "222.333.444-55",
    },
  },
  {
    id: "resp-7",
    formId: "frm-1",
    submittedAt: "2026-01-21T13:45:00Z",
    submittedBy: "Rafael Mendes",
    answers: {
      q1: "Panthera onca",
      q2: "opt2",
      q3: "666.777.888-99",
    },
  },
  {
    id: "resp-8",
    formId: "frm-1",
    submittedAt: "2026-01-22T08:00:00Z",
    submittedBy: "Juliana Rocha",
    answers: {
      q1: "Myrmecophaga tridactyla",
      q2: "opt1",
      q3: "333.444.555-66",
    },
  },
  {
    id: "resp-9",
    formId: "frm-2",
    submittedAt: "2026-01-19T09:30:00Z",
    submittedBy: "Fernando Alves",
    answers: {
      q4: 3,
      q5: "photo_url_1.jpg",
    },
  },
  {
    id: "resp-10",
    formId: "frm-2",
    submittedAt: "2026-01-19T11:00:00Z",
    submittedBy: "Camila Dias",
    answers: {
      q4: 4,
      q5: "photo_url_2.jpg",
    },
  },
  {
    id: "resp-11",
    formId: "frm-2",
    submittedAt: "2026-01-19T14:20:00Z",
    submittedBy: "Lucas Ferreira",
    answers: {
      q4: 2,
      q5: "photo_url_3.jpg",
    },
  },
  {
    id: "resp-12",
    formId: "frm-2",
    submittedAt: "2026-01-20T08:45:00Z",
    submittedBy: "Mariana Santos",
    answers: {
      q4: 5,
      q5: "photo_url_4.jpg",
    },
  },
  {
    id: "resp-13",
    formId: "frm-2",
    submittedAt: "2026-01-20T10:30:00Z",
    submittedBy: "Roberto Silva",
    answers: {
      q4: 3,
      q5: "photo_url_5.jpg",
    },
  },
  {
    id: "resp-14",
    formId: "frm-2",
    submittedAt: "2026-01-20T15:00:00Z",
    submittedBy: "Patrícia Costa",
    answers: {
      q4: 4,
      q5: "photo_url_6.jpg",
    },
  },
  {
    id: "resp-15",
    formId: "frm-2",
    submittedAt: "2026-01-21T09:15:00Z",
    submittedBy: "Diego Oliveira",
    answers: {
      q4: 2,
      q5: "photo_url_7.jpg",
    },
  },
  {
    id: "resp-16",
    formId: "frm-2",
    submittedAt: "2026-01-21T12:40:00Z",
    submittedBy: "Amanda Lima",
    answers: {
      q4: 3,
      q5: "photo_url_8.jpg",
    },
  },
  {
    id: "resp-17",
    formId: "frm-3",
    submittedAt: "2026-01-22T09:00:00Z",
    submittedBy: "Gabriel Martins",
    answers: {
      "q-text": "Gabriel Martins da Silva",
      "q-textarea":
        "Coleta realizada em condições climáticas favoráveis. Temperatura ambiente estável.",
      "q-number": 25,
      "q-select": "sudeste",
      "q-checkbox": ["gps", "camera", "termometro"],
      "q-date": "2026-01-22",
      "q-photo": [
        "foto_coleta_001.jpg",
        "foto_coleta_002.jpg",
        "foto_coleta_003.jpg",
      ],
      "q-map": "lat:-23.5505,lng:-46.6333",
      "q-file": [
        "autorizacao_001.pdf",
        "relatorio_campo_001.pdf",
        "planilha_dados_001.xlsx",
      ],
      "q-audio": ["audio_notes_001.mp3", "entrevista_001.mp3"],
    },
  },
  {
    id: "resp-18",
    formId: "frm-3",
    submittedAt: "2026-01-23T10:30:00Z",
    submittedBy: "Isabela Costa",
    answers: {
      "q-text": "Isabela Costa Fernandes",
      "q-textarea":
        "Observadas variações significativas no pH da água. Necessário acompanhamento.",
      "q-number": 42,
      "q-select": "sul",
      "q-checkbox": ["gps", "medidor-ph"],
      "q-date": "2026-01-23",
      "q-photo": ["foto_amostra_001.jpg", "foto_amostra_002.jpg"],
      "q-map": "lat:-30.0346,lng:-51.2177",
      "q-file": "autorizacao_002.pdf",
      "q-audio": "audio_notes_002.mp3",
    },
  },
  {
    id: "resp-19",
    formId: "frm-3",
    submittedAt: "2026-01-24T14:15:00Z",
    submittedBy: "Thiago Oliveira",
    answers: {
      "q-text": "Thiago Oliveira Santos",
      "q-textarea":
        "Área de difícil acesso. Utilizado drone para mapeamento aéreo.",
      "q-number": 15,
      "q-select": "norte",
      "q-checkbox": ["gps", "camera", "drone"],
      "q-date": "2026-01-24",
      "q-map": "lat:-3.1190,lng:-60.0217",
    },
  },
  {
    id: "resp-20",
    formId: "frm-3",
    submittedAt: "2026-01-25T08:45:00Z",
    submittedBy: "Larissa Pereira",
    answers: {
      "q-text": "Larissa Pereira Alves",
      "q-textarea":
        "Coleta realizada conforme protocolo. Todas as amostras devidamente etiquetadas.",
      "q-number": 38,
      "q-select": "centro-oeste",
      "q-checkbox": ["gps", "camera", "termometro", "medidor-ph"],
      "q-date": "2026-01-25",
      "q-photo": "photo_complete_3.jpg",
      "q-map": "lat:-15.7801,lng:-47.9292",
      "q-file": "autorizacao_003.pdf",
    },
  },
  {
    id: "resp-21",
    formId: "frm-3",
    submittedAt: "2026-01-26T11:20:00Z",
    submittedBy: "Henrique Souza",
    answers: {
      "q-text": "Henrique Souza Lima",
      "q-textarea": "Presença de fauna local. Avistamento de aves aquáticas.",
      "q-number": 50,
      "q-select": "nordeste",
      "q-checkbox": ["gps", "camera"],
      "q-date": "2026-01-26",
      "q-photo": "photo_complete_4.jpg",
      "q-map": "lat:-8.0476,lng:-34.8770",
      "q-audio": "audio_notes_003.mp3",
    },
  },
];
