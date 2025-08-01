declare module 'html-docx-js/dist/html-docx.ts' {
  const htmlDocx: {
    asBlob: (html: string) => Blob;
  };
  export default htmlDocx;
}
