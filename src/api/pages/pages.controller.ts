import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto, UpdatePageDto } from './dto/pages.dto';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}


  @Post('create')
  createPages(@Body() createPageDto: CreatePageDto) {
    return this.pagesService.createPages(createPageDto);
  }


  @Get(':projectId')
  getPages(@Param('projectId') projectId: string){
    return this.pagesService.getPages(projectId);
  }


  @Post('update')
  updatePages(@Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.updatePages(updatePageDto);
  }


  @Delete(':pageId')
  deletePages(@Param('pageId') pageId: string) {
    return this.pagesService.deletePages(pageId)
  }

  @Get('/info/:pageId')
  getPageInfo(@Param('pageId') pageId: string) {
    return this.pagesService.getPageInfo(pageId)
  }
}
