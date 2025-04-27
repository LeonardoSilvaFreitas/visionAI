const { Storage } = require('@google-cloud/storage');
const { VideoIntelligenceServiceClient } = require('@google-cloud/video-intelligence');
const storage = new Storage({ keyFilename: 'visionai-457219-bb85d0595e00.json' });
const videoClient = new VideoIntelligenceServiceClient();

async function analyzeVideo(videoFilename) {
  const bucketName = 'bucketexemplo_2'; // Nome do seu bucket
  const gcsUri = `gs://${bucketName}/${videoFilename}`; // Caminho do vídeo no bucket

  const features = ['LABEL_DETECTION', 'SHOT_CHANGE_DETECTION', 'EXPLICIT_CONTENT_DETECTION'];

  const request = {
    inputUri: gcsUri,
    features: features,
  };

  console.log(`Iniciando análise do vídeo ${videoFilename} no bucket ${bucketName}...`);

  try {
    // Iniciar análise do vídeo
    const [operation] = await videoClient.annotateVideo(request);

    console.log('Analisando o vídeo...');
    const [operationResult] = await operation.promise();

    // Exibindo os resultados da análise
    console.log('Resultado da análise:');

    let isMusical = false;
    let hasExplicitContent = false;
    let hasViolence = false;

    if (operationResult.annotationResults) {
      operationResult.annotationResults.forEach(result => {
        // Verificação de conteúdo explícito (violência ou pornografia)
        if (result.explicitAnnotation) {
          const explicit = result.explicitAnnotation;
          if (explicit.pornographyLikelihood >= 3) { // Considera conteúdo explícito se a probabilidade for >= 3 (provável)
            hasExplicitContent = true;
            console.log('O vídeo contém conteúdo explícito (pornografia).');
          }
          if (explicit.violenceLikelihood >= 3) { // Considera violência se a probabilidade for >= 3 (provável)
            hasViolence = true;
            console.log('O vídeo contém conteúdo de violência.');
          }
        }

        // Verificação de rótulos musicais
        if (result.segmentLabelAnnotations) {
          result.segmentLabelAnnotations.forEach(label => {
            console.log(`Rótulo detectado: ${label.entity.description}`);
            // Verifique se o vídeo contém termos relacionados à música
            const musicKeywords = ['music', 'musical', 'song', 'performance', 'performance art'];
            if (musicKeywords.some(keyword => label.entity.description.toLowerCase().includes(keyword))) {
              if (!isMusical) {
                isMusical = true;
                console.log('Este vídeo contém conteúdo musical.');
              }
            }
          });
        }
      });
    }

    // Resultado final
    if (!isMusical) {
      console.log('Este vídeo NÃO contém conteúdo musical.');
    }
    if (!hasExplicitContent) {
      console.log('Este vídeo NÃO contém conteúdo explícito (pornografia).');
    }
    if (!hasViolence) {
      console.log('Este vídeo NÃO contém conteúdo de violência.');
    }

  } catch (error) {
    console.error('Erro ao analisar o vídeo:', error);
  }
}

analyzeVideo('dualipa.mp4'); // Substitua pelo nome do vídeo que você quer analisar
