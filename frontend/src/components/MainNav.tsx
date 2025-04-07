import { NavLink } from "react-router-dom";

const MainNav: React.FC = () => {
    return (
        <header>
            <nav className={`flex justify-between items-center mx-auto`}>
                <ul className={`flex gap-8`}>
                    <li className="text-xl">
                        <NavLink
                            to=''
                            className={({isActive}) => 
                                isActive ? `underline` : undefined
                            }
                            end
                        >
                            Home
                        </NavLink>
                    </li>
                    <li className="text-xl">
                        <NavLink
                            to='products/all'
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