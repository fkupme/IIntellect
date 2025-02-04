import { PrismaClient } from '@prisma/client';

// Инициализация Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('Тестирование CRUD-операций...');

  try {
    // 1. Create (Создание записи)
    const newUser = await prisma.user.create({
      data: {
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashedpassword',
        role: 'user',
        phone: '1234567890',
        first_name: 'TestUser',
        last_name: 'LastName',
        second_name: 'SecondName',
      },
    });
    console.log('Создан пользователь:', newUser);

    // 2. Read (Чтение записей)
    const users = await prisma.user.findMany();
    console.log('Все пользователи:', users);

    // 3. Update (Обновление записи)
    const updatedUser = await prisma.user.update({
      where: { id: newUser.id },
      data: { username: 'updateduser' },
    });
    console.log('Обновленный пользователь:', updatedUser);

    // 4. Delete (Удаление записи)
    const deletedUser = await prisma.user.delete({
      where: { id: newUser.id },
    });
    console.log('Удален пользователь:', deletedUser);
  } catch (error) {
    console.error('Ошибка при выполнении операций:', error);
  } finally {
    // Отключение Prisma Client
    await prisma.$disconnect();
  }
}

main();