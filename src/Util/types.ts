import { Static, TBoolean, TObject, TProperties, Type } from "@fastify/type-provider-typebox";

export const errorType = Type.Object({
    success: Type.Boolean(),
    result: Type.Object({
        error: Type.String()
    })
});


export const userType = Type.Object({
    id: Type.Integer({ exclusiveMinimum: 0 }),
    full_name: Type.String(),
    role: Type.String(),
    efficiency: Type.Integer()
});

export type User = Static<typeof userType>


export function getRespSchema<T extends TProperties>(properties: T): TObject<{
    success: TBoolean;
    result: TObject<T>;
}>{
    return Type.Object({
        success: Type.Boolean(),
        result: Type.Object(properties)
    })
}