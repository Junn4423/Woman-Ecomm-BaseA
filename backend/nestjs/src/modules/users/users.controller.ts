import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get current user profile
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return this.usersService.findOne(req.user.userId);
  }

  // Update current user profile
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.userId, updateUserDto);
  }

  // Change password
  @UseGuards(JwtAuthGuard)
  @Post('me/change-password')
  async changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const user = await this.usersService.findByEmail(req.user.email);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const isValid = await this.usersService.validatePassword(
      user,
      changePasswordDto.currentPassword,
    );
    if (!isValid) {
      return { success: false, message: 'Current password is incorrect' };
    }

    await this.usersService.updatePassword(
      req.user.userId,
      changePasswordDto.newPassword,
    );
    return { success: true, message: 'Password changed successfully' };
  }

  // Get user addresses
  @UseGuards(JwtAuthGuard)
  @Get('me/addresses')
  async getAddresses(@Request() req: any) {
    const user = await this.usersService.findOne(req.user.userId);
    return user.addresses;
  }

  // Add new address
  @UseGuards(JwtAuthGuard)
  @Post('me/addresses')
  addAddress(@Request() req: any, @Body() addressDto: UpdateAddressDto) {
    return this.usersService.addAddress(req.user.userId, addressDto);
  }

  // Update address
  @UseGuards(JwtAuthGuard)
  @Patch('me/addresses/:addressId')
  updateAddress(
    @Request() req: any,
    @Param('addressId') addressId: string,
    @Body() addressDto: UpdateAddressDto,
  ) {
    return this.usersService.updateAddress(req.user.userId, addressId, addressDto);
  }

  // Delete address
  @UseGuards(JwtAuthGuard)
  @Delete('me/addresses/:addressId')
  removeAddress(@Request() req: any, @Param('addressId') addressId: string) {
    return this.usersService.removeAddress(req.user.userId, addressId);
  }

  // Admin routes
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
