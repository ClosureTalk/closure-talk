import { useEffect, useRef, useState } from "react";

class VFillProps {
  renderer = (height: number) => (<div></div>);
}

export default function VFill(props: VFillProps) {
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver(() => setHeight(ref.current!.clientHeight));
    observer.observe(ref.current!);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div style={{
      flexGrow: 1,
      minHeight: 0,  // prevents overflow, https://stackoverflow.com/a/66689926
    }} ref={ref}>
      {props.renderer(height)}
    </div>
  );
}
