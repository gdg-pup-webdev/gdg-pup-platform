import { RequestHandler } from "express";
import { UnauthorizedError } from "../errors/HttpError";



export const requirePermissions = (requiredPermissions: Record<string, string[] >) : RequestHandler => {
    return async (req , res , next )    => {
        const user = req.decodedToken;
        if (!user) {
            throw new UnauthorizedError("Authentication required. No authenticated user found in request context.");
        }

        const userPermissions = user.permissions || [];

        const missingPermissions : { resource: string; action: string }[] = [];

        for (const [resource, actions] of Object.entries(requiredPermissions)) {
            for (const action of actions) {
                if (
                    !userPermissions.some(
                        (userPermission) =>
                            (userPermission.action === "EVERYTHING" || userPermission.action === action) &&
                            (userPermission.resource === "EVERYTHING" || userPermission.resource === resource),
                    )
                ) {
                    missingPermissions.push({ resource, action });
                }
            }
        }
 


        // const missingPermissions = Object.entries(requiredPermissions).flatMap(
        //     ([resource, actions]) =>
        //         actions.some((action) =>
        //             userPermissions.some((userPermission) =>
        //                 (userPermission.action === "EVERYTHING" || userPermission.action === action) &&
        //                (userPermission.resource === "EVERYTHING" || userPermission.resource === resource),
        //             )
        //         ) ? [] : [{ resource, action }],
        // );


        if (missingPermissions.length > 0) {
            throw new UnauthorizedError(`Insufficient permissions to perform this action. Missing required permission(s): [${missingPermissions
                .map((permission) => `${permission.resource}:${permission.action}`)
                .join(", ")}]. User permissions: [${userPermissions
                .map((perm) => `${perm.resource}:${perm.action}`)
                .join(", ")}].`);
        }

        return next();
    }


}