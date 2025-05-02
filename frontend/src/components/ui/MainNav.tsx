import { NavLink } from "react-router-dom";
import LogoWithTextSVG from "../../assets/SVG/LogoWithTextSVG";
import NavMenu from "./NavMenu";

const MainNav: React.FC = () => {
  return (
    <header>
      <nav className={`w-screen border-b-1 hidden md:block`}>
        <ul
          className={`flex flex-row w-fit m-auto gap-10 text-[22px] font-dm-sans font-medium h-[110px]`}
        >
          <li className="m-auto">
            <NavLink
              to=""
              className={({ isActive }) =>
                isActive ? `underline underline-offset-5` : undefined
              }
              end
            >
              Home
            </NavLink>
          </li>
          <li className="m-auto">
            <NavLink
              to="products"
              className={({ isActive }) =>
                isActive ? `underline underline-offset-5` : undefined
              }
            >
              Products
            </NavLink>
          </li>
          <li className="m-auto">
            <NavLink
              to="basket"
              className={({ isActive }) =>
                isActive ? `underline underline-offset-5` : undefined
              }
            >
              Basket
            </NavLink>
          </li>
        </ul>
      </nav>
      <NavLink
        to=""
        className="hidden md:block md:absolute md:left-auto md:right-[20px] md:top-[15px]"
      >
        <LogoWithTextSVG className="w-full max-w-[150px]" />
      </NavLink>
      <nav className="w-full flex flex-row border-b-1 justify-end h-[100px] md:hidden">
        <button className="cursor-pointer w-fit h-fit mr-[20px] mt-[15px]">
          <LogoWithTextSVG className=" w-full h-fit max-w-[125px]" />
        </button>
      </nav>
    </header>
  );
};

export default MainNav;
