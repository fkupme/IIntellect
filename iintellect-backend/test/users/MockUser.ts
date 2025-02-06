export class MockUser {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  provider: string;
  provider_id: string;
  role: string;
  created_at: Date;
  updated_at: Date;
  phone: string;
  first_name: string;
  last_name: string;
  second_name: string;

  constructor(
    id = 1,
    username = 'testuser',
    email = 'test@example.com',
    password_hash = 'hashed_password',
    provider = 'local',
    provider_id = '12345',
    role = 'user',
    created_at = new Date(),
    updated_at = new Date(),
    phone = '+1234567890',
    first_name = 'John',
    last_name = 'Doe',
    second_name = 'Michael',
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password_hash = password_hash;
    this.provider = provider;
    this.provider_id = provider_id;
    this.role = role;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.phone = phone;
    this.first_name = first_name;
    this.last_name = last_name;
    this.second_name = second_name;
  }

  static create(partialUser?: Partial<MockUser>): MockUser {
    const defaultUser = new MockUser();
    return { ...defaultUser, ...partialUser };
  }
}