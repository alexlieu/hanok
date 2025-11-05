interface TokenPaymentIconProps {
  className?: string;
  colour?: string;
}
const TokenPaymentIcon = ({ className, colour }: TokenPaymentIconProps) => {
  const defaultColour = "var(--color-brand-colour-5)";
  const strokeAndFillColour = colour || defaultColour;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-270.8 371 102 52"
      className={className}
    >
      <path
        fill="none"
        stroke={strokeAndFillColour}
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M-182 404v16.8c0 .7-.4 1.2-1 1.2h-75.7c-.7 0-1.2-.6-1.2-1.2v-47.6c0-.7.6-1.2 1.2-1.2h75.7c.7 0 1 .6 1 1.2V395m-78-14h78m-17 18h27m-3.9-4.6 4.5 4.6-4.5 4.6"
      ></path>
      <circle cx="-255.5" cy="376.5" r="1.5" fill={"#FF5F57"}></circle>
      <circle cx="-250.5" cy="376.5" r="1.5" fill={"#FEBC2E"}></circle>
      <circle cx="-245.5" cy="376.5" r="1.5" fill={"#28C840"}></circle>
    </svg>
  );
};

export default TokenPaymentIcon;
