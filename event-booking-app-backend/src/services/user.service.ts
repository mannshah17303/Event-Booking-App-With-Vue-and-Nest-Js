import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/pipes/schemas/user.schema';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(
    name: string,
    email: string,
    role: string,
    password: string,
  ): Promise<User> {
    const hashedPassword: string = await bcrypt.hash(password, 10);
    password = hashedPassword;
    const user = this.userRepository.create({ name, email, role, password });
    return this.userRepository.save(user);
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return user ?? null;
  }

  async updateUser(
    id: number,
    updateData: Partial<CreateUserDto>,
  ): Promise<User | null> {
    await this.userRepository.update({ user_id: id }, updateData);
    return this.userRepository.findOne({ where: { user_id: Number(id) } });
  }

  async deleteUser(id: number): Promise<any> {
    return this.userRepository.delete({ user_id: id });
  }
}
