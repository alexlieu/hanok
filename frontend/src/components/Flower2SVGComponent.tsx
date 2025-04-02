const Flower2SVGComponent: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {

    const greenPetals = Array.from({length: 6}, (_, i) => ( 
        <use
            key={`green-${i}`}
            href="#green_petals"
            transform={`rotate(${i * 60 + 30}) translate(0, -25)`}
        />

    ));

    const pinkPetals = Array.from({length: 6}, (_, i) => ( 
        <use
            key={`pink-${i}`}
            href="#pink_petals"
            transform={`rotate(${i * 60}) translate(0, -6)`}
        />
    ));

    return (
        <svg width={200} height={200} viewBox="0 0 200 200" {...props}>
            <defs>
                <g id="pink_petals">
                    <path
                        d="M0 0 Q43 -45 0 -70 Q-43 -45 0 0z"
                        fill="#fd8a54"
                        // stroke="white"
                    />
                    <path
                        d="M0 0 Q15 -40 0 -50 Q-15 -40 0 0z"
                        stroke="white"
                        fill="#c93521"
                        transform="translate(0, -4)"
                    />
                </g>
                <g id="green_petals">
                    <path
                        d="M0 0 Q40 -30 0 -50 Q-40 -30 0 0z"
                        fill="#1abba4"
                        stroke="white"
                    />
                    <path
                        d="M0 0 Q30 -40 0 -50 Q-30 -40 0 0z"
                        fill="#226352"
                        transform="translate(0, 10)"
                    />
                </g>
            </defs>
            <g transform="translate(100,100)">
                {greenPetals}
                {pinkPetals}
                <circle r={20} stroke="black" strokeWidth={1.5} fill="#fcba03" />
            </g>
        </svg>
    )


    // <svg width={200} height={200} viewBox="0 0 200 200" {...props}>
    //     <defs>
    //     <g id="pink_petals">
    //         <path
    //         d="M0 0             Q43 -45 0 -70             Q-43 -45 0 0z"
    //         fill="#fd8a54"
    //         stroke="white"
    //         />
    //         <path
    //         d="M0 0               Q15 -40 0 -50               Q-15 -40 0 0z"
    //         fill="#c93521"
    //         transform="translate(0, -4)"
    //         />
    //     </g>
    //     <g id="green_petals">
    //         <path
    //         d="M0 0               Q40 -30 0 -50               Q-40 -30 0 0z"
    //         fill="#1abba4"
    //         stroke="white"
    //         />
    //         <path
    //         d="M0 0               Q30 -40 0 -50               Q-30 -40 0 0z"
    //         fill="#226352"
    //         transform="translate(0, 10)"
    //         />
    //     </g>
    //     </defs>
    //     <g transform="translate(100,100)">
    //     <use href="#green_petals" transform="rotate(30) translate(0, -25)" />
    //     <use href="#green_petals" transform="rotate(90) translate(0, -25)" />
    //     <use href="#green_petals" transform="rotate(150) translate(0, -25)" />
    //     <use href="#green_petals" transform="rotate(210) translate(0, -25)" />
    //     <use href="#green_petals" transform="rotate(270) translate(0, -25)" />
    //     <use href="#green_petals" transform="rotate(330) translate(0, -25)" />
    //     <use href="#pink_petals" transform="translate(0, -6.5)" />
    //     <use href="#pink_petals" transform="rotate(60) translate(0, -6.5)" />
    //     <use href="#pink_petals" transform="rotate(120) translate(0, -6.5)" />
    //     <use href="#pink_petals" transform="rotate(180) translate(0, -6.5)" />
    //     <use href="#pink_petals" transform="rotate(240) translate(0, -6.5)" />
    //     <use href="#pink_petals" transform="rotate(300) translate(0, -6.5)" />
    //     <circle r={20} stroke="black" strokeWidth={1.5} fill="#fcba03" />
    //     </g>
    // </svg>
};
export default Flower2SVGComponent;
