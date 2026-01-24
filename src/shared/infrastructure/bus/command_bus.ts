import { Command } from '#shared/application/use-cases/command'
import { ApplicationService, ContainerBindings } from '@adonisjs/core/types'
import { CommandConstructor, Handler } from './types'

export class CommandBus {
  private handlers: Map<string, Handler<any, any>> = new Map()

  constructor(private app: ApplicationService) {}

  register<TCommand extends Command, TResult = void>(
    commandName: string,
    handler: CommandConstructor<TCommand, TResult>,
    injectables?: Array<keyof ContainerBindings>
  ): void {
    this.handlers.set(commandName, { handler, deps: injectables || [] })
  }

  async execute<TCommand extends Command, TResult = void>(command: TCommand): Promise<TResult> {
    const commandName = command.constructor.name
    const handler = this.handlers.get(commandName)

    if (!handler) {
      throw new Error(`No handler registered for command: ${commandName}`)
    }

    const dependencyList = handler.deps.map((dep) => this.app.container.make(dep))

    const handlerInstance = new handler.handler(...dependencyList)

    return await handlerInstance.handle(command)
  }
}
