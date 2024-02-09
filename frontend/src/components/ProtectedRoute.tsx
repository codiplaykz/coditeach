import {useUserStore} from "../store/user";
import {ReactElement} from "react";
import {ErrorPage} from "../pages/errors";

interface ProtectedRouteProps {
    roles: string[],
    children: ReactElement
}
export default function ProtectedRoute({children, roles}: ProtectedRouteProps) {
    const {user} = useUserStore()

    if (!user) {
        console.log('test')
        window.location.href = '/login'
        return
    }

    if (!roles.includes(user?.role!)) {
        return <ErrorPage errorCode={404} errorTitle={"Nothing to see here"}
                          errorDescription={"Page you are trying to open does not exist. You may have mistyped the address, or the page has been moved to another URL. If you think this is an error contact support."}
                          buttonLink={"/"} buttonText={"Go back home"}/>
    }

    return (
        <>
            {children}
        </>
    )
}