const express = require('express');
const FormData = require('form-data');
const axios = require('axios');

const { promisify } = require('util');
const fs = require('fs');
const unlinkAsync = promisify(fs.unlink);

const { Upload } = require('@aws-sdk/lib-storage');
const {
  S3Client,
  HeadObjectCommand
} = require('@aws-sdk/client-s3');

const { getSupabase } = require('../utils/supabase');

const genUniqueId = require('../utils/genUniqueId');
const upload = require('../utils/upload');

const {
  CLOUDFLARE_BUCKET_DOMAIN,
  CLOUDFLARE_ACCESS_KEY,
  CLOUDFLARE_SECRET_ACCESS_KEY,
  CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_BUCKET_ID,
  MUSE_API_KEY
} = process.env;

const router = express.Router();

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: CLOUDFLARE_ACCESS_KEY,
    secretAccessKey: CLOUDFLARE_SECRET_ACCESS_KEY
  }
});

const supabase = getSupabase();

// const museUploadQueue = new Queue('video', process.env.REDIS_API_KEY, {
//   redis: { tls: { rejectUnauthorized: false } },
// });

router.post('/', upload.single('videoFile'), async (req, res) => {
  // Set timeout for this request to 15 minutes
  req.setTimeout(900000);

  const {
    file,
    query: { lessonId }
  } = req;
  console.log('Upload request received:', {
    lessonId,
    fileSize: file?.size,
    fileName: file?.originalname,
    mimeType: file?.mimetype
  });

  if (!file?.fieldname) {
    return res.status(400).json({
      success: false,
      message: 'You must provide a file to upload'
    });
  }

  // File upload limit is 500MB
  const fileSizeInMegabytes = file?.size / (1024 * 1024);

  if (fileSizeInMegabytes > 500) {
    return res.status(400).json({
      success: false,
      type: 'FILE_TOO_LARGE',
      message: 'File is too large'
    });
  }

  const fileName = `${genUniqueId()}-${file.originalname.split(' ').join('-')}`;
  const fileOrigin = CLOUDFLARE_BUCKET_DOMAIN ?? `https://pub-${CLOUDFLARE_BUCKET_ID}.r2.dev`;
  const fileUrl = `${fileOrigin}/${fileName}`;
  let metadata = {
    sizeInMb: fileSizeInMegabytes
  };

  try {
    console.log('Starting upload to Cloudflare R2:', {
      fileName,
      fileSize: fileSizeInMegabytes,
      mimeType: file.mimetype
    });

    console.time('upload');
    const parallelUploads3 = new Upload({
      client: S3,
      queueSize: 5,
      partSize: 1024 * 1024 * 20, // 20MB chunks
      leavePartsOnError: false,
      params: {
        Bucket: CLOUDFLARE_BUCKET_ID,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype
      }
    });

    parallelUploads3.on('httpUploadProgress', (progress) => {
      const uploadProgress = Math.round(((progress.loaded / progress.total) * 100) / 2);
      console.log('Upload progress:', {
        progress: uploadProgress,
        loaded: progress.loaded,
        total: progress.total
      });

      const channel = supabase.channel('upload-progress');
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: lessonId,
            payload: uploadProgress
          });
        }
      });
    });

    const result = await parallelUploads3.done();
    console.log('Upload completed:', result);

    console.timeEnd('upload');

    // Verify the upload was successful
    try {
      const headObject = await S3.send(new HeadObjectCommand({
        Bucket: CLOUDFLARE_BUCKET_ID,
        Key: fileName
      }));
      console.log('File exists in R2:', headObject);
    } catch (error) {
      console.error('File verification failed:', error);
      throw new Error('File upload verification failed');
    }

    return res.status(200).json({
      success: true,
      url: fileUrl,
      metadata,
      message: 'Uploaded successfully'
    });
  } catch (error) {
    console.error('Upload failed:', {
      error: error.message,
      stack: error.stack,
      metadata: error.$$metadata
    });

    return res.status(500).json({
      success: false,
      message: 'Upload failed: ' + error.message,
      error: error.$$metadata
    });
  } finally {
    console.log('Upload process completed');
  }
});

router.get('/', (req, res) => {
  res.send('Get upload video');
});

async function uploadToMuseNow(fileData, fileName) {
  try {
    // Add file data to form
    const form = new FormData();
    form.append('file', fileData, fileName);

    // Send to muse through axios - fetch is a pain in the ass
    const response = await axios({
      method: 'POST',
      url: 'https://api.muse.ai/api/files/upload',
      data: form,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        Key: MUSE_API_KEY
      }
    });

    return {
      metadata: response.data
    };
  } catch (error) {
    console.log('Upload to Muse failed', error?.response?.data);
    return {};
  }
}

// /**
//  * Uploads video to muse.ai and store response in DB
//  *
//  * @param {Blod} s3Data AWS s3 data
//  * @param {string} fileName Name of the file
//  * @param {string} lessonId Associated lesson this video was uploaded to
//  * @param {string} fileUrl URL to the video in s3
//  * @param {string} unlinkPath Path to mutler file to delete
//  */
// async function uploadToMuse(s3Key, fileName, lessonId, fileUrl, unlinkPath) {
//   try {
//     await unlinkAsync(unlinkPath);

//     const s3Data = await S3.send(
//       new GetObjectCommand({
//         Bucket: 'videos',
//         Key: s3Key,
//       })
//     );
//     // Add file data to form
//     const form = new FormData();
//     form.append('file', s3Data.Body, fileName);

//     // Send to muse through axios - fetch is a pain in the ass
//     const response = await axios({
//       method: 'POST',
//       url: 'https://api.muse.ai/api/files/upload',
//       data: form,
//       maxContentLength: Infinity,
//       maxBodyLength: Infinity,
//       headers: {
//         Key: MUSE_API_KEY,
//       },
//     });

//     console.log('Upload to muse complete', response.data);
//     const { data: lesson } = await supabase
//       .from('lesson')
//       .select(`*`)
//       .eq('id', lessonId)
//       .single();

//     if (lesson) {
//       console.log('Found lesson');
//       // Add Muse response to metadata
//       const videos = lesson.videos.map((v) => {
//         if (v.link === fileUrl) {
//           console.log('matches');
//           v.metadata = JSON.parse(JSON.stringify(response.data));
//         }
//         return v;
//       });

//       // Save uploaded data to DB
//       const { error } = await supabase
//         .from('lesson')
//         .update({ videos })
//         .eq('id', lessonId)
//         .select();
//       if (error) {
//         console.log('Error updating lesson', error);
//       } else {
//         console.log('Update DB complete');
//       }
//     }
//   } catch (error) {
//     console.log('Upload to Muse failed', error?.response?.data);
//   }
// }

// // Queue to Upload to muse.ai
// museUploadQueue.process(async function (job, done) {
//   console.log('Initilizing Muse Request\n\n', job.data);
//   const { fileName, originalFileName, lessonId, fileUrl, unlinkPath } =
//     job.data;

//   await uploadToMuse(fileName, originalFileName, lessonId, fileUrl, unlinkPath);

//   done();
// });

// museUploadQueue.on('completed', function (job) {
//   // Job completed with output result!
//   console.log('Completed all jobs in uploading to muse', job.data);
// });

// museUploadQueue.on('error', function (error) {
//   // Job completed with output result!
//   console.log('error on queue', error);
// });

module.exports = router;
