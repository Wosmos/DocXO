declare module 'html-docx-js/dist/html-docx' {
  const htmlDocx: {
    asBlob: (html: string) => Blob;
  };
  export default htmlDocx;
}
