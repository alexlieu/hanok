import { useRouteError } from "react-router-dom";
import MainNav from "../components/MainNav";

const ErrorPage: React.FC = () => {
    // const error: {data: {message: string}, status: number} = useRouteError();
    let title = 'We ran into an error!'
    let message = "Something went wrong..."
    // if (error.status === 500) message = error.data.message;
    // if (error.status === 500) { 
    //     title = 'Not found!'
    //     message = 'Could not find resource or page.'; 
    // }
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