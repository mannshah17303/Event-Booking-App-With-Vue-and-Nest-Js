import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../models/user.entity';
import * as userSchema from '../pipes/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import type { CookieOptions, Response, Request } from 'express';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { Roles } from '../guards/roles.decorator.guard';
import { RolesGuard } from '../guards/roles.guard';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';

@Controller('users')
@UseInterceptors(LoggingInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @Roles(['admin'])
  @UseGuards(RolesGuard)
  @UsePipes(new ZodValidationPipe(userSchema.createUserSchema))
  async create(@Body() createUserDto: userSchema.CreateUserDto): Promise<User> {
    try {
      const { name, email, role, password } = createUserDto;
      return await this.userService.createUser(name, email, role, password);
    } catch (err) {
      console.error(err);
      throw new BadRequestException('failed to create user');
    }
  }

  @Post('/login')
  @UsePipes(new ZodValidationPipe(userSchema.loginUserSchema))
  async login(
    @Body() loginUserDto: userSchema.LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    try {
      const { email, password } = loginUserDto;

      const findUserByEmail = await this.userService.getUserByEmail(email);

      if (!findUserByEmail) {
        throw new UnauthorizedException('please provide valid credentials');
      }
      const isMatchPassword = await bcrypt.compare(
        password,
        findUserByEmail.password,
      );
      if (!isMatchPassword) {
        throw new UnauthorizedException('please provide valid credentials');
      }
      const payload = {
        user_id: findUserByEmail.user_id,
        name: findUserByEmail.name,
        email: findUserByEmail.email,
        role: findUserByEmail.role,
      };
      const token = jwt.sign(payload, 'mann17303', {
        expiresIn: '1h',
      });
      const cookieOptions: CookieOptions = {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      };
      res.cookie('token', token, cookieOptions);
      return { message: 'logged in successful', data: findUserByEmail };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('something went wrong!');
    }
  }

  @Get('/')
  async getUser(): Promise<User[]> {
    try {
      return await this.userService.getUsers();
    } catch (err) {
      console.error(err);
      throw new NotFoundException('cannot find users');
    }
  }

  @Put('/update/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: userSchema.UpdateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    try {
      const payload = {
        user_id: id,
        name: updateUserDto.name,
        email: updateUserDto.email,
        role: updateUserDto.role,
      };
      const token = jwt.sign(payload, 'mann17303', { expiresIn: '1h' });
      const cookieOptions: CookieOptions = {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      };
      res.cookie('token', token, cookieOptions);
      const updateUser = await this.userService.updateUser(id, updateUserDto);
      return { message: 'user updated successful', data: updateUser };
    } catch (err) {
      console.error(err);
      throw new BadRequestException('please provide valid credentials');
    }
  }

  @Delete('/delete/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      return await this.userService.deleteUser(id);
    } catch (err) {
      console.error(err);
      throw new NotFoundException(`user with id ${id} not found`);
    }
  }

  @Post('/logout')
  logoutUser(@Res({ passthrough: true }) res: Response): any {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      expires: new Date(0),
    });
    return { message: 'logout successful', data: [] };
  }

  @Get('/current-user')
  currentUser(@Req() req: Request) {
    try {
      const token = req.cookies?.token as string | undefined;
      if (!token) {
        throw new UnauthorizedException('No token found');
      }
      const payload = jwt.verify(token, 'mann17303');
      return { user: payload };
    } catch (err: any) {
      console.error(err);
      throw new UnauthorizedException('invalid token');
    }
  }
}
