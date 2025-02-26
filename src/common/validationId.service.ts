import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { HandleErrorsService } from './handleErrors.service';

@Injectable()
export class ValidationIdService {

    constructor(private handleErrorsService: HandleErrorsService) { }

    async validateId(id: string, model: any, entityName: string) {

        try {
            const entity = mongoose.Types.ObjectId.isValid(id) && await model.findById(id)
    
            if (!entity) {
                this.handleErrorsService.throwNotFoundError(`${entityName} not found`)
            }

            return
        } 
        
        catch (error) {
            throw error
        }
    }
}
