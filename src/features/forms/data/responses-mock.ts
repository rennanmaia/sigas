export interface FormResponse {
  id: string;
  formId: string;
  submittedAt: string;
  submittedBy: string;
  answers: Record<string, any>;
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
];
