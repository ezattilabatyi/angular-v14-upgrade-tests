import { ExportCommandDto } from '@etrm/api';

export class ExportUtil {

  public static create(exportBeanName: string, parameters: object): ExportCommandDto {
    return {
      exportBeanName: exportBeanName,
      parameters: parameters
    };
  }
}
