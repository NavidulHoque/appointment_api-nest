import { Injectable } from "@nestjs/common";
import { HandleErrorsService } from "./handleErrors.service";

@Injectable()
export class CheckRoleService {

    constructor(
        private handleErrorService: HandleErrorsService
    ) { }

    checkIsPatient(role: string) {
        if (role !== "patient") {
            this.handleErrorService.throwUnauthorizedError("Unauthorized, only patients can access this route")
        }

        return
    }

    checkIsDoctor(role: string) {
        if (role !== "doctor") {
            this.handleErrorService.throwUnauthorizedError("Unauthorized, only doctor can access this route")
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