import { NavLink } from "react-router-dom";
import { useState } from "react";
import LogoWithTextSVG from "../../assets/SVG/LogoWithTextSVG";
import NavMenu from "./NavMenu";

const navContent = [
  { title: "Home", link: "" },
  { title: "Products", link: "products" },
  { title: "Basket", link: "basket" },
];

const MainNav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getNavContent = (className: string, center: boolean) => {
    const styling = "underline underline-offset-5";
    return (
      <ul className={`${className}`}>
        {navContent.map(({ title, link }) => (
          <li className={`${center && "m-auto"}`}>
            <NavLink
              to={link}
              className={({ isActive }) =>
                isActive ? `${styling}` : `hover:${styling}`
              }
              end
              onClick={() => setIsMenuOpen(false)}
            >
              {title}
            </NavLink>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <header>
      <nav className={`w-screen border-b-1 hidden md:block`}>
        {getNavContent(
          "flex flex-row w-fit m-auto gap-10 text-[22px] font-dm-sans font-medium h-[110px]",
          true
        )}
      </nav>
      <div className="hidden md:block md:absolute md:left-auto md:right-[20px] md:top-[15px]">
        <LogoWithTextSVG className="w-full max-w-[150px]" />
      </div>
      <nav className="w-full flex flex-row border-b-1 justify-center min-[360px]:justify-end h-[100px] md:hidden">
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="cursor-pointer w-fit h-fit min-[360px]:mr-[20px] mt-[15px]"
        >
          <LogoWithTextSVG className=" w-full h-fit max-w-[125px]" />
        </button>
      </nav>
      <NavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        {getNavContent("flex flex-col gap-3", false)}
      </NavMenu>
    </header>
  );
};

export default MainNav;
