import MainNav from "../components/MainNav";

const ErrorPage: React.FC = () => {
    return (
        <>
            <MainNav />
            <main>
                <h1>There's been an error!</h1>
                <p>Could not find this page...</p>
            </main>
        </>
    )
}

export default ErrorPage;