import { NavLink } from "react-router-dom";

const MainNav: React.FC = () => {
    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <NavLink
                            to={"/"}
                            className={({isActive}) => 
                                isActive ? `underline` : undefined
                            }
                            end
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={"/products"}
                            className={({isActive}) => 
                                isActive ? `underline` : undefined
                            }
                        >
                        Products
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default MainNav;