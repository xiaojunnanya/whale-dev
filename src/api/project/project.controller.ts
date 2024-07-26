import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { AuthGuard } from '@/common/auth/auth.guard';
import { ProjectDto, SearchProjectDto } from './dto/project.dto';


@UseGuards(AuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  createProject(@Req() req, @Body() projectDto: ProjectDto){
    return this.projectService.createProject(req.userId, projectDto);
  }

  @Post('search')
  searchProject(@Req() req, @Body() searchProjectDto: SearchProjectDto){
    return this.projectService.searchProject(req.userId, searchProjectDto)
  }


  @Delete('delete/:id')
  deleteProject(@Param('id') id: string){
    return this.projectService.deleteProject(Number(id));
  }


  @Post('update')
  updateProject(@Body() projectDto: ProjectDto){
    return this.projectService.updateProject(projectDto);
  }


  @Get('type')
  getProjectType(){
    return this.projectService.getProjectType();
  }

  @Get('state')
  getProjectState(){
    return this.projectService.getProjectState();
  }

  @Get('stateColor')
  getProjectStateColor(){
    return this.projectService.getProjectStateColor();
  }
}
