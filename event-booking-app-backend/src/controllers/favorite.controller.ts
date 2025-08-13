import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { Favorite } from 'src/models/favorites.entity';
import * as favoriteSchema from 'src/pipes/schemas/favorite.schema';
import { FavoriteService } from 'src/services/favorite.service';

@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post('/addFavorite')
  async addFavorite(
    @Body() createFavoriteDto: favoriteSchema.CreateFavoriteDto,
  ): Promise<Favorite> {
    try {
      const { event_id, currentUserId } = createFavoriteDto;
      return await this.favoriteService.createFavorites(
        event_id,
        currentUserId,
      );
    } catch (err) {
      console.error(err);
      throw new BadRequestException('failed to create user');
    }
  }

  @Get('/showRedColorInFavoriteEvents')
  async showRedColorInFavoriteEvents(
    @Query('userId') user_id: string,
  ): Promise<any> {
    const favoriteEvents =
      await this.favoriteService.showRedColorInFavoriteEvents(Number(user_id));
    return { message: 'event fetched successful', data: favoriteEvents };
  }

  @Get('/getAllFavoriteEvents')
  async getAllFavoriteEvents(@Query('userId') user_id: string): Promise<any> {
    const favoriteEvents = await this.favoriteService.getAllFavoriteEvents(
      Number(user_id),
    );
    return { message: 'event fetched successful', data: favoriteEvents };
  }

  @Post('/removeFavorite')
  async removeFavorite(
    @Body('event_id') event_id: string,
    @Body('currentUserId') user_id: string,
  ): Promise<any> {
    return this.favoriteService.removeFavorite(
      Number(event_id),
      Number(user_id),
    );
  }
}
