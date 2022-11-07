import { useContext } from "react";

import { AuthContext, AuthContextDataProps } from "../contexts/AuthContext";

export function userAuth(): AuthContextDataProps {
    const context = useContext(AuthContext);

    return context;
}