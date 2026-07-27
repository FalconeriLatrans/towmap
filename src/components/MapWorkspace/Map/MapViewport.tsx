import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Map from "./Map";

type Props = React.ComponentProps<typeof Map>;

export default function MapViewport(props: Props) {
    return (
        <TransformWrapper
            initialScale={1}
            minScale={0.2}
            maxScale={6}
            centerOnInit
            limitToBounds={false}
            wheel={{
                step: 0.002
            }}
        >
            <TransformComponent
                wrapperStyle={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <Map  {...props} />
            </TransformComponent>
        </TransformWrapper>
    );
}