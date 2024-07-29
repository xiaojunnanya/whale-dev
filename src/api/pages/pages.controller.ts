import { Body, Controller, Post } from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/pages.dto';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}


  @Post('create')
  createPages(@Body() createPageDto: CreatePageDto) {
    return this.pagesService.createPages(createPageDto);
  }
}
