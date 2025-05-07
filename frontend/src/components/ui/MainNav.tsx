import { NavLink } from "react-router-dom";
import { useState } from "react";
import LogoWithTextSVG from "../../assets/SVG/LogoWithTextSVG";
import NavMenu from "./NavMenu";
import useWindowDimensions from "../../utils/hooks/useWindowDimensions";

const navContent = [
  { title: "Home", link: "" },
  { title: "Products", link: "products" },
  { title: "Basket", link: "basket" },
];

const MainNav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { width } = useWindowDimensions();

  const getNavContent = (className: string, center: boolean) => {
    return (
      <ul className={`${className}`}>
        {navContent.map(({ title, link }) => (
          <li className={`${center && "m-auto"}`}>
            <NavLink
              to={link}
              className={({ isActive }) =>
                isActive
                  ? "underline underline-offset-5"
                  : `hover:underline underline-offset-5`
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
      {width < 768 ? (
        <nav className="w-screen border-b-1 flex flex-row justify-center min-[360px]:justify-end h-[100px]">
          <button
            onClick={() => setIsMenuOpen((prevState) => !prevState)}
            className="w-fit h-fit min-[360px]:mr-[20px] mt-[15px] cursor-pointer"
          >
            <LogoWithTextSVG
              instanceId="mobile"
              className="w-full max-w-[125px]"
            />
          </button>
        </nav>
      ) : (
        <>
          <nav className={`w-screen border-b-1`}>
            {getNavContent(
              "flex flex-row w-fit m-auto gap-10 text-[22px] font-dm-sans font-medium h-[110px]",
              true
            )}
          </nav>
          <span className="block absolute left-auto right-[20px] top-[15px]">
            <LogoWithTextSVG
              instanceId="desktop"
              className="w-full max-w-[150px]"
            />
          </span>
        </>
      )}
      <NavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        {getNavContent("flex flex-col gap-3", false)}
      </NavMenu>
    </header>
  );
};

export default MainNav;
