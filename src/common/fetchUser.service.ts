import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Role, UserDto } from "src/user/dto";


@Injectable()
export class FetchUserService {
    constructor(private prisma: PrismaService) { }

    async fetchUser(email?: string): Promise<UserDto | null> {

        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) return null;

        const userDto: UserDto = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role as Role,
            password: user.password,
        };

        return userDto;
    }
}