import { useEffect, useRef, useState } from "react";

class VFillProps {
  renderer = (height: number) => (<div></div>);
}

export default function VFill(props: VFillProps) {
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setHeight(ref.current!.clientHeight);
    update();

    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div style={{
      flexGrow: 1,
    }} ref={ref}>
      {props.renderer(height)}
    </div>
  );
}
