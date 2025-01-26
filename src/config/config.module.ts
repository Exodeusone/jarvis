import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigOptionsInterface } from './interface/config-options.interface';
import { CONFIG_OPTIONS } from './contants';
@Global()
@Module({})
export class ConfigModule {
  static forRoot(options: ConfigOptionsInterface): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
