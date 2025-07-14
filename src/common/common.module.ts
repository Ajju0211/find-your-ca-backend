// src/common/common.module.ts
import { Module } from '@nestjs/common';
import { PasswordService } from './service/password.service';

@Module({
  providers: [PasswordService],
  exports: [PasswordService], // export so other modules can use it
})
export class CommonModule {}
