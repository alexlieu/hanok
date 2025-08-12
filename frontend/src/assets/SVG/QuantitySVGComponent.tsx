export const PlusSVGComponent: React.FC<React.SVGProps<SVGSVGElement>> = (
  props
) => (
  <svg width={10} height={10} viewBox="-5 -5 10 10" {...props}>
    <path d="M 0 -10 L 0 10 M 10 0 L -10 0" stroke="black" strokeWidth={2} />
  </svg>
);

export const MinusSVGComponent: React.FC<React.SVGProps<SVGSVGElement>> = (
  props
) => (
  <svg width={10} height={10} viewBox="-5 -5 10 10" {...props}>
    <path d="M 10 0 L -10 0" stroke="black" strokeWidth={2} />
  </svg>
);
