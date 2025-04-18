const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient({
  keyFilename: 'visionai-457219-9925dee5928f.json',
});

async function isImageViolent(imagePath) {
  try {
    const [result] = await client.safeSearchDetection(imagePath);
    const detections = result.safeSearchAnnotation;

    const violenceLevel = detections.violence;

    console.log('Nível de violência:', violenceLevel);

    // Pode ajustar o critério conforme necessário
    const levels = ['VERY_UNLIKELY', 'UNLIKELY'];
    const isViolent = !levels.includes(violenceLevel);

    return isViolent;
  } catch (error) {
    console.error('Erro ao analisar a imagem:', error);
    return false;
  }
}

// Exemplo de uso:
isImageViolent('violencia.jpg').then(isViolent => {
  if (isViolent) {
    console.log('A imagem pode conter violência.');
  } else {
    console.log('A imagem não aparenta conter violência.');
  }
});

isImageViolent('brinquedos.jpg').then(isViolent => {
    if (isViolent) {
      console.log('A imagem pode conter violência.');
    } else {
      console.log('A imagem não aparenta conter violência.');
    }
  });
