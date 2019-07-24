export function loadImage(src: string) {
  return new Promise(resolve => {
    const image = new Image();

    image.onload = function() {
      resolve(image);
    };

    image.src = src;
  });
}
