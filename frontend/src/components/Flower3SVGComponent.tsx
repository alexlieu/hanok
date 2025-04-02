const Flower3SVGComponent: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {

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
    const heartPetals = Array.from({length:6} , (_, i) => (
        <use
            key={`hp-${i}`}
            href="#heart-petal"
            transform={`rotate(${i*60})`}
        />
    ));
    const innerPetals = Array.from({length:6} , (_, i) => (
        <use
            key={`ip-${i}`}
            href="#inner-petal"
            transform={`rotate(${30+i*60})`}
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
                    stroke-width="1"
                />
                <path
                    id="horizontal-guide"
                    d="
                        M -100,-100
                        L 100,-100"
                    fill="none"
                    stroke="black"
                    stroke-width="1"
                />
                <path
                    id="x-axis"
                    d="
                        M -100,0
                        L 100,0"
                    fill="none"
                    fill-opacity={0.5}
                    stroke="black"
                    stroke-width="2"
                />
                <path
                    id="y-axis"
                    d="
                        M 0,-100
                        L 0,100"
                    fill="none"
                    fill-opacity={0.5}
                    stroke="black"
                    stroke-width="2"
                />
                <g id="heart-petal">
                    <path 
                        // d="M 0 -75 A 1 1 0 0 1 33 -58 L 0 -1 L -33 -58 A 1 1 0 0 1 0 -75 z"
                        d="
                            M 0 -80
                            C 16 -97 48 -87 33 -58 
                            L 0 -1 
                            L -33 -58 
                            C -48 -87 -16 -97 0 -80 z"
                        fill="#F15331"
                        stroke="white"
                        stroke-width={3}
                    />
                    <path
                        d="
                            M 0 -60
                            C 3 -70 25 -69 18 -52 
                            L 0 -10 
                            L -18 -52 
                            C -25 -69 -3 -70 0 -60 z"
                        fill="#CD232C"
                    />
                </g>
                <g id="inner-petal">
                    <path
                        d="
                            M -7 -39 
                            C -4 -46 4 -46 7 -39
                            C 13 -44 22 -37 18 -31
                            L 0 0
                            L -18 -31
                            C -22 -37 -13 -44 -7 -39 z"
                        fill="#96ADD6"
                        stroke="white"
                        stroke-width={3}
                    />
                    <path 
                        d="
                            M -5 -18
                            C -13 -38 13 -38 5 -18
                            C 1 -9 -1 -9 -5 -18 z"
                        fill="#00408C"
                    />
                </g>
                <g id="pistil">
                    <circle r={14} fill="none" stroke="white" stroke-width={9}/>
                    <circle r={14} fill="#FDB52A" stroke="#00408C" stroke-width={4}/>
                </g>
            </defs>
            {/* <use href="#x-axis" />
            <use href="#y-axis" />
            {grid_y}
            {grid_x} */}
            {/* <circle r={90} fill="none" stroke="green" stroke-width={2} /> */}
            {heartPetals}
            {/* <circle r={45} fill="none" stroke="green" stroke-width={2} /> */}
            {innerPetals}
            <use href="#pistil"/>
        </svg> 
    );
}

export default Flower3SVGComponent;