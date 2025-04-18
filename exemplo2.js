const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient({
  keyFilename: 'visionai-457219-9925dee5928f.json',
});

function riskLevel(pagesCount) {
  if (pagesCount === 0) return 'Risco baixo ✅';
  if (pagesCount <= 2) return 'Risco moderado ⚠️';
  return 'Risco alto 🚨';
}

async function checkImageForCopyrightRisk(imagePath) {
  try {
    const [result] = await client.webDetection(imagePath);
    const webDetection = result.webDetection;

    const pages = webDetection.pagesWithMatchingImages || [];
    const entities = webDetection.webEntities || [];

    // 1. Mostrar total de páginas
    console.log(`📄 Total de páginas com a imagem: ${pages.length}`);

    // 2. Mostrar a marca ou entidade com score mais alto
    const topEntity = entities.sort((a, b) => b.score - a.score)[0];
    const entityName = topEntity?.description || 'Nenhuma marca detectada';
    console.log(`🏷️ Marca ou entidade identificada: ${entityName}`);

    // 3. Mostrar risco de uso
    console.log(`⚠️ Nível de risco ao usar esta imagem: ${riskLevel(pages.length)}`);

    // Extra: mostrar os sites onde a imagem pode estar (até 5)
    if (pages.length > 0) {
      console.log('\n🌐 Sites que podem conter a imagem:');
      pages.slice(0, 5).forEach(page => console.log(`- ${page.url}`));
    }

    return pages.length > 0;

  } catch (error) {
    console.error('Erro ao analisar a imagem:', error);
    return false;
  }
}

// Exemplo de uso
checkImageForCopyrightRisk('violencia.jpg');
