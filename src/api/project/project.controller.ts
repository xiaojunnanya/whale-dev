import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { AuthGuard } from '@/common/auth/auth.guard';
import { ProjectDto } from './dto/project.dto';


@UseGuards(AuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  createProject(@Req() req, @Body() projectDto: ProjectDto){
    return this.projectService.createProject(req.userId, projectDto);
  }


  @Get('get')
  getProject(@Req() req){
    return this.projectService.getProject(req.userId);
  }


  @Delete('delete/:id')
  deleteProject(@Param('id') id: string){
    return this.projectService.deleteProject(Number(id));
  }


  @Post('update')
  updateProject(@Body() projectDto: ProjectDto){
    return this.projectService.updateProject(projectDto);
}
}
