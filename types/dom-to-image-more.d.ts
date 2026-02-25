declare module "dom-to-image-more" {
  interface DomToImageOptions {
    width?: number;
    height?: number;
    quality?: number;
    bgcolor?: string;
    cacheBust?: boolean;
    copyDefaultStyles?: boolean;
    style?: Record<string, string>;
    filter?: (node: Node) => boolean;
    filterStyles?: (node: Node, propertyName: string) => boolean;
  }

  interface DomToImage {
    toPng(node: Node, options?: DomToImageOptions): Promise<string>;
    toJpeg(node: Node, options?: DomToImageOptions): Promise<string>;
    toBlob(node: Node, options?: DomToImageOptions): Promise<Blob | null>;
    toSvg(node: Node, options?: DomToImageOptions): Promise<string>;
  }

  const domtoimage: DomToImage;
  export default domtoimage;
}
