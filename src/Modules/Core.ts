import * as express from 'express'
import {Express} from 'express'
import {ConfigModule} from './Config'
import * as bodyParser from 'body-parser'
import {RouterModule} from './Router'
import * as cors from 'cors'
import {ILogObj, Logger} from 'tslog'

module CoreModule {

    import environment = ConfigModule.environment;
    import Controller = RouterModule.Controller;

    class Core {
        private readonly serverInstance: Express

        constructor(controllers: Controller[]) {
            this.serverInstance = express()

            this.initializeMiddlewares()
            this.initializeControllers(controllers)
            this.serverInstance.listen(environment.PORT)
        }

        private initializeMiddlewares(): void {
            this.serverInstance.use(bodyParser.json())
            this.serverInstance.use(cors({
                origin: 'http://localhost:5173',
                allowedHeaders: '*',
                methods: '*',
            }))
        }

        private initializeControllers(controllers: Controller[]): void {
            controllers.forEach((controller: Controller): void => {
                this.serverInstance.use('/', controller.getRouter())
            })
        }
    }

    export const logger: Logger<ILogObj> = new Logger<ILogObj>({
        type: 'pretty',
        name: 'Application',
    })

    export const bootstrap = (controllers: Controller[]) => new Core(controllers)

}


export {CoreModule}
