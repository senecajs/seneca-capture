type CaptureOptions = {
    ignore?: string[];
    modify: (capent: any, args: any[] | IArguments, actdef: any) => any;
};
declare function capture(this: any, options: CaptureOptions): void;
export default capture;
