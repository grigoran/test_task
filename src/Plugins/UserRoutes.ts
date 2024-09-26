import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { errorType, getRespSchema, userType } from "../Util/types";
import * as userService from '../Service/UsersService'

const routesPlugin: FastifyPluginAsyncTypebox = async function (server) {

    /** Создание пользователя */
    server.post('/create', {
        schema: {
            body: Type.Object({
                full_name: Type.String(),
                role: Type.String(),
                efficiency: Type.Integer()
            }),
            response: {
                '2xx': getRespSchema({
                    id: Type.Integer({ exclusiveMinimum: 0 })
                }),
                '4xx': errorType
            }
        }
    }, async (req, _res) => {

        // Создаем пользователя
        const idUser = await userService.createUser(req.body);

        return {
            success: true,
            result: {
                id: idUser
            }
        }
    });

    /** Получить всех пользователей */
    server.get('/get', {
        schema: {
            querystring: Type.Object({
                full_name: Type.Optional(Type.String()),
                role: Type.Optional(Type.String()),
                efficiency: Type.Optional(Type.Integer())
            }),
            response: {
                '2xx': getRespSchema({
                    users: Type.Array(userType)
                }),
                '4xx': errorType
            }
        }
    }, async (req, res) => {

        const avUsers = await userService.listUsers([], req.query);

        return {
            success: true,
            result: {
                users: avUsers
            }
        }
    });

    /** Получить одного пользователя */
    server.get('/get/:userId', {
        schema: {
            params: Type.Object({
                userId: Type.Integer({ exclusiveMinimum: 0 })
            }),
            querystring: Type.Object({
                full_name: Type.Optional(Type.String()),
                role: Type.Optional(Type.String()),
                efficiency: Type.Optional(Type.Integer())
            }),
            response: {
                '2xx': getRespSchema({
                    users: Type.Array(userType)
                }),
                '4xx': errorType
            }
        }
    }, async (req, rep) => {

        const avUser = await userService.listUsers([req.params.userId], req.query);

        return {
            success: true,
            result: {
                users: avUser
            }
        }
    });

    /** Обновить пользователя */
    server.patch('/update/:userId', {
        schema: {
            params: Type.Object({
                userId: Type.Integer({ exclusiveMinimum: 0 })
            }),
            body: Type.Object({
                full_name: Type.Optional(Type.String()),
                role: Type.Optional(Type.String()),
                efficiency: Type.Optional(Type.Integer())
            }),
            response: {
                '2xx': getRespSchema(
                    userType.properties
                ),
                '4xx': errorType
            }
        }
    }, async (req, rep) => {

        const iUpdateCount = await userService.updateUser(req.params.userId, req.body);

        if (iUpdateCount === 0) {
            throw new Error('Пользователь не найден');
        }

        const [vUser] = await userService.listUsers([req.params.userId]);

        return {
            success: true,
            result: vUser
        }
    });

    /** Удалить пользователя */
    server.delete('/delete/:userId', {
        schema: {
            params: Type.Object({
                userId: Type.Integer({ exclusiveMinimum: 0 })
            }),
            response: {
                '2xx': getRespSchema(
                    userType.properties
                ),
                '4xx': errorType
            }
        }
    }, async (req, rep) => {

        const [vUserForDelete] = await userService.listUsers([req.params.userId]);

        if (!vUserForDelete) {
            throw new Error('Пользователь не найден');
        };

        await userService.deleteUser(req.params.userId);

        return {
            success: true,
            result: vUserForDelete
        }
    });

    /** Удалить всех пользователей */
    server.delete('/delete', {
        schema: {
            response: {
                '2xx': Type.Object({
                    success: Type.Boolean()
                }),
                '4xx': errorType
            }
        }
    }, async (req, rep) => {
        await userService.deleteAllUsers();
        return {
            success: true
        }
    });
}

export default routesPlugin;