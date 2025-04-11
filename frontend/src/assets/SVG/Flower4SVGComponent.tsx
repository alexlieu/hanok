const Flower4SVGComponent: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {

    const grid_y = Array.from({length: 20}, (_, i) =>  (
        <use
            key={`vg-${i}`}
            href="#vetical-guide"
            transform={ `translate(${i*10},0)` }
        />
    ));
    const grid_x = Array.from({length: 20}, (_, i) =>  (
        <use
            key={`vg-${i}`}
            href="#horizontal-guide"
            transform={ `translate(0,${i*10})` }
        />
    ));
    return (
        <svg width={200} height={200} viewBox="-100 -100 200 200" {...props}>
            <defs>
                <path
                    id="vetical-guide"
                    d="
                        M -100,-100
                        L -100,100"
                    fill="none"
                    stroke="black"
                    strokeWidth="1"
                />
                <path
                    id="horizontal-guide"
                    d="
                        M -100,-100
                        L 100,-100"
                    fill="none"
                    stroke="black"
                    strokeWidth="1"
                />
                <path
                    id="x-axis"
                    d="
                        M -100,0
                        L 100,0"
                    fill="none"
                    fillOpacity={0.5}
                    stroke="black"
                    strokeWidth="2"
                />
                <path
                    id="y-axis"
                    d="
                        M 0,-100
                        L 0,100"
                    fill="none"
                    fillOpacity={0.5}
                    stroke="black"
                    strokeWidth="2"
                />
                <path 
                    id="outer-petals"
                    // d="M -34 -65 C -40 -119 17 -137 38 -73 C 88 -102 121 -22 70 -11 C 133 26 73 100 23 47 C 21 98 -85 77 -48 6 C -101 -13 -94 -69 -34 -64 z"
                    d="M-41-47c-6-54 65-68 81-9 50-29 83 51 20 67 50 59-18 95-53 36C-17 107-103 71-61 13-112 1-94-69-41-47z"
                    fill="#F53793"
                    opacity={.5}
                />
                <path
                    id="inner"
                    // d="M -4 -5 C -3 -13 -4 -16 -4 -22 C -4 -28 0.272 -27.452 0.689 -22.352 C 1.521 -16.317 1.209 -13.091 3 -4 C 10 -7 15 -12 17 -13 C 22 -17 25 -13 20 -9 C 18 -7 11 -2 5.302 1.464 C 9 7 12 11 14 15 C 19 22 14 24 9 18 C 6 14 3 10 -1 4 C -6 11 -8 14 -12 18 C -17 24 -21 19 -17 15 C -12 10 -9 5 -6 0 C -14 -6 -19 -8 -21 -10 C -24 -12 -24 -17 -18 -14 C -13 -11 -10 -9 -4 -5 z M -2.152 -34.681 C 7.053 -35.184 7.053 -48.225 -3.501 -49.174 C -12.255 -49.58 -11.916 -34.507 -2.391 -34.681 Z M 27.848 -20.373 C 33.903 -13.587 44.694 -21.447 38.741 -29.389 C 32.971 -36.368 22.446 -27.442 27.755 -20.496 Z M 19.444 26.873 C 12.518 35.494 23.682 42.272 29.264 37.089 C 35.445 29.114 27.869 19.943 19.529 26.778 Z M -32.003 24.602 C -38.169 32.455 -25.869 40.678 -20.448 33.706 C -16.24 27.113 -26.783 19.1 -31.703 24.161 Z M -30.947 -18.664 C -28.186 -23.212 -29.299 -26.799 -34.612 -29.835 C -39.714 -32.039 -44.259 -26.612 -43.362 -21.933 C -42.237 -16.395 -34.926 -13.467 -31.037 -18.526 Z" 
                    d="M -18.378 20.679 C -7.9747 6.7423 5.441 -8.696 19.104 -24.413 C 33.133 -12.438 32.197 6.834 22.093 16.751 C 12.177 28.164 -4.663 31.345 -18.182 20.679 C -29.003 11.681 -35.161 -1.96 -25.058 -18.051 C -17.573 -29.652 -0.172 -38.633 19.16 -24.369 z"
                    fill="#FCB964"
                    transform="scale(1) translate(0,-5)"
                />
            </defs>
            {/* <use href="#x-axis" />
            <use href="#y-axis" />
            {grid_y}
            {grid_x}
            <circle r={90} fill="none" stroke="green" strokeWidth={2} /> */}
            <g id="flower" transform="scale(1)">
                <use href="#outer-petals" />
                <use href="#outer-petals" transform="scale(.92) rotate(0)" fill="#f7147e" opacity={0.9}  />
                <use href="#inner" />
            </g>
        </svg> 
    );
}

export default Flower4SVGComponent;