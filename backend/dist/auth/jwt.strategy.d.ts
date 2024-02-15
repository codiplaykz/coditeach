import { Strategy } from "passport-jwt";
import { JwtPayload } from "./dto/jwt-payload.interface";
import { ManagerRepository } from "./manager/manager.repository";
import { Manager } from "./manager/manager.entity";
import { ConfigService } from "@nestjs/config";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private managerRepository;
    private configService;
    constructor(managerRepository: ManagerRepository, configService: ConfigService);
    validate(payload: JwtPayload): Promise<Manager>;
}
export {};
