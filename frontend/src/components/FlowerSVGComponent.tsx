const FlowerSVGComponent: React.FC<React.SVGProps<SVGSVGElement>> = (props) => { 
  const p = Array.from({length: 8}, (_, i) => (
    <use
      key={`p-${i}`}
      href="#p"
      transform={`rotate(${i*45})`}
    />
  ));
  const p1 = Array.from({length: 8}, (_, i) => (
    <use
      key={`p1-${i}`}
      href="#p1"
      transform={`rotate(${i*45})`}
    />
  ));
  const p2 = Array.from({length: 8}, (_, i) => (
    <use
      key={`p2-${i}`}
      href="#p2"
      transform={`rotate(${i*45})`}
    />
  ));
  return (
    <svg width={200} height={200} viewBox="0 0 200 200" {...props}>
      <defs>
        <ellipse 
          id="p" 
          ry={26} 
          rx={25}
          fill="#e7697a"
          transform="translate(0, -50)"
        />
        <ellipse
          id="p1"
          ry={25}
          rx={20}
          fill="#faa6b3"
          transform="translate(0, -32)"
        />
        <path
          id="p2"
          d="M0 0 Q5 20 5 25 A3 5 0 0 1 -5 25 Q-5 20 0 0z"
          stroke="white"
          fill="#7e122a"
          transform="translate(0,10)"
        />
      </defs>
      <g transform="translate(100,100)">
        {p}
        {p1}
        {p2}
        <circle r={18} stroke="#7e122a" stroke-width="2" fill="#fcba03" />
      </g>
    </svg>
  )

  // <svg width={200} height={200} viewBox="0 0 200 200" {...props}>
  //   <defs>
  //     <ellipse id="p" ry={26} rx={25} fill="#e7697a" />
  //     <ellipse id="p1" ry={25} rx={20} fill="#faa6b3" />
  //     <path
  //       id="p2"
  //       d="M0 0 Q5 20 5 25 A3 5 0 0 1 -5 25 Q-5 20 0 0z"
  //       fill="#7e122a"
  //     />
  //   </defs>
  //   <g transform="translate(100,100)">
  //     <use href="#p" transform="translate(0, -50)" />
  //     <use href="#p" transform="translate(35, -35) rotate(45)" />
  //     <use href="#p" transform="translate(50, 0) rotate(90)" />
  //     <use href="#p" transform="translate(35, 35) rotate(135)" />
  //     <use href="#p" transform="translate(-50, 0) rotate(180)" />
  //     <use href="#p" transform="translate(-35, 35) rotate(225)" />
  //     <use href="#p" transform="translate(0, 50) rotate(270)" />
  //     <use href="#p" transform="translate(-35, -35) rotate(315)" />
      
  //     <use href="#p1" transform="translate(0, -32)" />
  //     <use href="#p1" transform="translate(23, -23) rotate(45)" />
  //     <use href="#p1" transform="translate(32, 0) rotate(90)" />
  //     <use href="#p1" transform="translate(23, 23) rotate(135)" />
  //     <use href="#p1" transform="translate(0, 33)" />
  //     <use href="#p1" transform="translate(-23, 23) rotate(225)" />
  //     <use href="#p1" transform="translate(-33, 0) rotate(270)" />
  //     <use href="#p1" transform="translate(-23, -23) rotate(315)" />
      
  //     <circle r={18} fill="#c0970b" />
  //     <use href="#p2" transform="translate(0, 20)" />
  //     <use href="#p2" transform="rotate(45) translate(0, 20)" />
  //     <use href="#p2" transform="rotate(90) translate(0, 20)" />
  //     <use href="#p2" transform="rotate(135) translate(0, 20)" />
  //     <use href="#p2" transform="rotate(180) translate(0, 20)" />
  //     <use href="#p2" transform="rotate(225) translate(0, 20)" />
  //     <use href="#p2" transform="rotate(270) translate(0, 20)" />
  //     <use href="#p2" transform="rotate(315) translate(0, 20)" />
  //   </g>
  // </svg>
};

export default FlowerSVGComponent;
