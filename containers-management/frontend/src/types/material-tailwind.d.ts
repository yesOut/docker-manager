declare module "@material-tailwind/react" {
    import { ComponentType } from "react";

    interface TypographyProps {
        as?: keyof JSX.IntrinsicElements | ComponentType<any>;
        color?: string;
        className?: string;
        children?: React.ReactNode;
    }

    export const Typography: ComponentType<TypographyProps>;
}