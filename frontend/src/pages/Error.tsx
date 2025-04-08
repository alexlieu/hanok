import MainNav from "../components/ui/MainNav";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage: React.FC = () => {

    const error = useRouteError();

    let title = 'An error occurred!';
    let message = 'Something went wrong...';

    if (isRouteErrorResponse(error)) {
        if (error.status === 500) message = error.data.message || "Internal server error.";
    
        if (error.status === 404) {
            title = 'Not found!';
            message = 'Could not find page or resource...';
        }
    }
    
    if (error instanceof Error) message = error.message;
    

    return (
        <>
            <MainNav />
            <main>
                <h1>{title}</h1>
                <p>{message}</p>
            </main>
        </>
    )
}

export default ErrorPage;