const colours = [
  "bg-orange-100",
  "bg-lime-100",
  "bg-rose-100",
  "bg-cyan-100",
  "bg-fuchsia-100",
  "bg-amber-100",
];

export const getRandomBGColour = () => {
  return colours[Math.floor(Math.random() * colours.length)];
};

export const getStableBGColor = (id: number) => {
  //   const hue = Math.floor((id * 137.508) % 360);
  //   return `bg-[hsl(${hue},80%,85%)]`;
  return colours[id % colours.length];
};
