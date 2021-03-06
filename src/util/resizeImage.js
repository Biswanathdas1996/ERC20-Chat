import Compress from "compress.js";

const compress = new Compress();

const reSizeImg = (file) => {
  return compress.compress([file], {
    size: 4, // the max size in MB, defaults to 2MB
    quality: 0.75, // the quality of the image, max is 1,
    maxWidth: 350, // the max width of the output image, defaults to 1920px
    maxHeight: 350, // the max height of the output image, defaults to 1920px
    resize: true, // defaults to true, set false if you do not want to resize the image width and height
    rotate: false, // See the rotation section below
  });
};

export const getResizedFile = async (file) => {
  const reSizedFile = await reSizeImg(file);
  const immageFile = reSizedFile[0];
  const base64str = immageFile.data;
  const imgExt = immageFile.ext;
  const immageFileData = Compress.convertBase64ToFile(base64str, imgExt);
  return immageFileData;
};
