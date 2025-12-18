import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { StrapiService } from './strapi.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  providers: [StrapiService],
  exports: [StrapiService],
})
export class StrapiModule {}
