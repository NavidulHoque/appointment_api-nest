import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserDto } from "src/user/dto";


@Injectable()
export class FetchUserService {
    constructor(private prisma: PrismaService) { }

    async fetchUser(email?: string): Promise<UserDto | null> {

        const user = await this.prisma.user.findUnique({ where: { email } });

        return user
    }
}