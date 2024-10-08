import { Controller } from '../../interfaces/controller';
import { TsoaRoute } from '../tsoa-route';
import { ValidationService } from '../templateHelpers';
import { AdditionalProps } from '../additionalProps';

export abstract class TemplateService<ApiHandlerParameters, ValidationArgsParameters, ReturnHandlerParameters> {
  protected validationService: ValidationService;

  constructor(
    protected readonly models: TsoaRoute.Models,
    protected readonly config: AdditionalProps,
  ) {
    this.validationService = new ValidationService(models, config);
  }

  abstract apiHandler(params: ApiHandlerParameters): Promise<any>;

  abstract getValidatedArgs(params: ValidationArgsParameters): any[];

  protected abstract returnHandler(params: ReturnHandlerParameters): any;

  protected isController(object: Controller | object): object is Controller {
    return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
  }

  protected buildPromise(methodName: string, controller: Controller | object, validatedArgs: any) {
    const prototype = Object.getPrototypeOf(controller);
    const descriptor = Object.getOwnPropertyDescriptor(prototype, methodName);
    return descriptor!.value.apply(controller, validatedArgs);
  }
}
