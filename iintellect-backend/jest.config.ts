import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'], // Расширения файлов, которые Jest будет обрабатывать
  rootDir: './', // Корневая директория для тестов (если тесты находятся в папке src)
  testRegex: '.*\\.spec\\.ts$', // Шаблон для поиска тестовых файлов (например, *.spec.ts)
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest', // Трансформация TypeScript в JavaScript
  },
  collectCoverageFrom: ['**/*.(t|j)s'], // Файлы, для которых собирается покрытие тестами
  coverageDirectory: '../coverage', // Папка для отчетов о покрытии
  testEnvironment: 'node', // Среда выполнения тестов (Node.js)
  roots: ['<rootDir>'], // Корневая директория для поиска тестов
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Поддержка алиасов (если используются)
  },
};

export default config;