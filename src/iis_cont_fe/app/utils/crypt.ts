import bcrypt from "bcryptjs";

export const PasswordProcessor = {
    async hashPassword(plain_password: string) {
        const saltRounds = 10;
        console.log(plain_password)
        let hashedPassword = "null"
        hashedPassword = await bcrypt.hash(plain_password, saltRounds);
        return hashedPassword;
    },

    async verifyPassword(hashedPassword: string, plain_password: string) {
        const Match = await bcrypt.compare(plain_password, hashedPassword);
        return Match;
    }

}