export const mockTests = [
  {
    id: 1,
    title: 'Тест по математике',
    description: 'Основы алгебры',
    private: false,
    categoryId: 1,
    themeId: 2,
    subthemeId: 3,
    tags: ['математика', 'алгебра'],
    user_id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    groupId: null,
    category: {
      id: 1,
      name: 'Математика',
      description: 'Категория математики',
    },
    theme: {
      id: 2,
      name: 'Алгебра',
      description: 'Тема алгебры',
      categoryId: 1,
    },
    subtheme: {
      id: 3,
      name: 'Линейные уравнения',
      themeId: 2,
    },
  },
];

export const mockTestWithQuestions = {
  id: 1,
  title: 'Тест по математике',
  description: 'Основы алгебры',
  private: false,
  categoryId: 1,
  themeId: 2,
  subthemeId: 3,
  tags: ['математика', 'алгебра'],
  user_id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  groupId: null, // Добавлено поле groupId
  category: {
    id: 1,
    name: 'Математика',
    description: 'Категория математики',
  },
  theme: {
    id: 2,
    name: 'Алгебра',
    description: 'Тема алгебры',
    categoryId: 1,
  },
  subtheme: {
    id: 3,
    name: 'Линейные уравнения',
    themeId: 2,
  },
  questions: [
    {
      id: 1,
      title: 'Вопрос 1',
      text: 'Как решить уравнение x + 2 = 5?',
      has_variants: true,
      variants: ['x = 3', 'x = 7'],
      created_at: new Date(),
      updated_at: new Date(),
      test_id: 1,
      answers: [
        {
          id: 1,
          answer: 'x = 3',
          comment: 'Правильный ответ',
          created_at: new Date(),
          updated_at: new Date(),
          question_id: 1,
        },
        {
          id: 2,
          answer: 'x = 7',
          comment: 'Неправильный ответ',
          created_at: new Date(),
          updated_at: new Date(),
          question_id: 1,
        },
      ],
    },
  ],
};

export const mockTest = {
  id: 1,
  title: 'Тест по математике',
  description: 'Основы алгебры',
  private: false,
  categoryId: 1,
  themeId: 2,
  subthemeId: 3,
  tags: ['математика', 'алгебра'],
  user_id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  groupId: null,
};