const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  keyFilename: 'visionai-457219-523f7a9cdedb.json', // sua chave
});

async function uploadFile() {
  const bucketName = 'bucketexemplo_2'; // 👉 seu nome de bucket aqui
  const filename = 'dualipa.mp4'; // arquivo local
  const destination = 'dualipa.mp4'; // nome no bucket

  await storage.bucket(bucketName).upload(filename, {
    destination: destination,
  });

  console.log(`${filename} enviado para o bucket ${bucketName}.`);
}

uploadFile();
