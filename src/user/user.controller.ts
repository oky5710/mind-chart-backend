import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { CurrentUser } from '../auth/current-user.decorator'
import type { CurrentUserPayload } from '../auth/current-user.decorator'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import { UpdateUserRoleDto } from './dto/update-user-role.dto'
import { UserService } from './user.service'

@Controller('users')
@UseGuards(RolesGuard)
@Roles(UserRole.admin)
export class UserController {
  constructor(private readonly users: UserService) {}

  @Get()
  findAll() {
    return this.users.findAll()
  }

  @Patch(':id/role')
  updateRole(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.users.updateRole(user.id, id, dto.role)
  }
}
