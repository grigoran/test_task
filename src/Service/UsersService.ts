import { db } from "../Util/db";
import { User } from "../Util/types";

/** Создать пользователя */
export async function createUser(data: Partial<User>) {
    let res: number;
    try {
        [res] = await db<User>('users').insert(data);
    } catch (e) {
        throw new Error('Unable to create user')
    }
    return res;
}

/** Получить пользователей по списку id */
export async function listUsers(aidUser?: number[]): Promise<User[]> {
    let res: User[] = [];
    try {
        const query = db<User>('users');
        if (aidUser?.length) {
            query.whereIn('id', aidUser);
        }
        res = await query.select();
    } catch (e) {
        throw new Error('Unable to get users')
    }
    return res;
}

/** Обновить пользователя */
export async function updateUser(idUser: number, data: Partial<User>) {
    let res = 0;
    try {
        res = await db<User>('users')
            .where('id', idUser)
            .update(data);
    } catch (e) {
        throw new Error('Unable to update user')
    }

    return res;
}

/** Удалить пользователя */
export async function deleteUser(idUser: number) {
    try {
        await db('users').where('id', idUser).delete();
    } catch (e) {
        throw new Error('Unable to delete user')
    }
}

/** Удалить всех пользователей */
export async function deleteAllUsers() {
    try {
        await db('users')
            .delete();
    } catch (e) {
        throw new Error('Unable to delete user')
    }
}
