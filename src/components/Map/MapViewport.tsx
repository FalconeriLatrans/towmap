import {
    TransformWrapper,
    TransformComponent,
} from "react-zoom-pan-pinch";

import Map from "./Map";

export default function MapViewport() {
    return (
        <TransformWrapper
            initialScale={1}
            minScale={0.2}
            maxScale={6}
            centerOnInit
            limitToBounds={false}
            wheel={{
                step: 0.002,
                smoothStep: 0.005
              }}
        >
            <TransformComponent
                wrapperStyle={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <Map />
            </TransformComponent>
        </TransformWrapper>
    );
}