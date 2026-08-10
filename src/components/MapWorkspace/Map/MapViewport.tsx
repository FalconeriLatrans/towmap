import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";

import { useEffect } from "react";
import Map from "./Map";

type Props = React.ComponentProps<typeof Map>;


function ViewportContent(props: Props) {

  const { zoomToElement } = useControls();

  useEffect(() => {

    if (!props.selectedCity) return;

    zoomToElement(
      props.selectedCity,
      1,
      600,
      "easeOut"
    );

  }, [
    props.selectedCity,
    zoomToElement,
  ]);


  return (
    <TransformComponent
      wrapperStyle={{
        width: "100%",
        height: "100%",
      }}
    >
      <Map {...props} />
    </TransformComponent>
  );
}


export default function MapViewport(
  props: Props
) {

  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.2}
      maxScale={6}
      centerOnInit
      limitToBounds={false}
      wheel={{
        step: 0.002,
      }}
    >
      <ViewportContent {...props} />
    </TransformWrapper>
  );
}