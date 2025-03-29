import { Injectable } from "@nestjs/common";
import { HandleErrorsService } from "./handleErrors.service";

@Injectable()
export class CheckRoleService {

    constructor(
        private handleErrorService: HandleErrorsService
    ) { }

    checkIsUser(role: string) {
        if (role !== "user") {
            this.handleErrorService.throwUnauthorizedError("Unauthorized, only users can access this route")
        }

        return
    }

    checkIsAdmin(role: string) {
        if (role !== "admin") {
            this.handleErrorService.throwUnauthorizedError("Unauthorized, only admins can access this route")
        }

        return
    }
}