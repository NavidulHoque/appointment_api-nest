import { Injectable } from "@nestjs/common";
import { HandleErrorsService } from "./handleErrors.service";

@Injectable()
export class CheckRoleService {

    constructor(
        private handleErrorService: HandleErrorsService
    ) { }

    checkIsPatient(role: string) {
        if (role !== "PATIENT") {
            this.handleErrorService.throwUnauthorizedError("Unauthorized, only patients can access this route")
        }

        return
    }

    checkIsDoctor(role: string) {
        if (role !== "DOCTOR") {
            this.handleErrorService.throwUnauthorizedError("Unauthorized, only doctor can access this route")
        }

        return
    }

    checkIsAdmin(role: string) {
        if (role !== "ADMIN") {
            this.handleErrorService.throwUnauthorizedError("Unauthorized, only admins can access this route")
        }

        return
    }
}