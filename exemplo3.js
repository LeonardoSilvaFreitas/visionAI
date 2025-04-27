const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient({
  keyFilename: 'visionai-457219-bb85d0595e00.json',
});

async function whereAmI(imagePath) {
  try {
    const [result] = await client.landmarkDetection(imagePath);
    const landmarks = result.landmarkAnnotations;
    console.log("Landmarks:");
    landmarks.forEach(landmark => {
      console.log(landmark);
      console.log(landmark.locations[0].latLng);
      console.log("Você está em: https://maps.google.com/?q=" + landmark.locations[0].latLng.latitude + "," + landmark.locations[0].latLng.longitude);
    });
  } catch (error) {
    console.error('Erro ao analisar a imagem:', error);
  }
}

// Exemplo de uso:
whereAmI("redencao.jpg");
whereAmI("estatua.png");