import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {JwtPayload} from "./dto/jwt-payload.interface";
import {ManagerRepository} from "./manager/manager.repository";
import {Manager} from "./manager/manager.entity";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(ManagerRepository)
        private managerRepository: ManagerRepository,
        private configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload: JwtPayload): Promise<Manager> {
        const { email } = payload
        // @ts-ignore
        const manager: Manager = await this.managerRepository.findOne({email})

        if (!manager) {
            throw new UnauthorizedException()
        }

        return manager
    }
}
