export const getRandomBGColour = () => {
    const colours = ['bg-orange-100', 'bg-lime-100', 'bg-rose-100', 'bg-cyan-100', 'bg-fuchsia-100', 'bg-amber-100'];
    return colours[Math.floor(Math.random() * colours.length)];
};