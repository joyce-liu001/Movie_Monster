import { Box, Typography } from '@mui/material';
import React from 'react';

const AboutPage = () => {
  const backendUrl = 'https://movie-monster-backend.herokuapp.com';
  const frontendUrl = 'https://unsw-cse-comp3900-9900-22t2.github.io/capstone-project-3900-f16a-impregnable';
  const mongodbAtlas = 'mongodb+srv://username:password@movie-monster-backend.p9imp.mongodb.net';
  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' p={2}>
      <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' width='100%' maxWidth='lg'>
        <Typography variant='h3' align='center'>
          Movie Monster Contributors
        </Typography>
        <Box mt={2} width='100%'>
          <table
            style={{
              width: '100%',
            }}
          >
            <tr>
              <th>Name</th>
              <th>zID</th>
              <th>Role</th>
              <th>Email</th>
            </tr>
            <tr>
              <td>Damon (Shengyue Guan)</td>
              <td>z5285984</td>
              <td>Scrum Master</td>
              <td>z5285984@ad.unsw.edu.au</td>
            </tr>
            <tr>
              <td>Tam (Khiet Tam Nguyen)</td>
              <td>z5313514</td>
              <td>Frontend Developer</td>
              <td>z5285984@ad.unsw.edu.au</td>
            </tr>
            <tr>
              <td>Owen (Xunbo Su)</td>
              <td>z5285996</td>
              <td>Frontend Developeraster</td>
              <td>z5285996@ad.unsw.edu.au</td>
            </tr>
            <tr>
              <td>Joyce (Zhaoyan Liu)</td>
              <td>z5271698</td>
              <td>Backend Developer</td>
              <td>z5271698@ad.unsw.edu.au</td>
            </tr>
            <tr>
              <td>Matt (Feng Ji)</td>
              <td>z5290365</td>
              <td>Backend Developer</td>
              <td>z5290365@ad.unsw.edu.au</td>
            </tr>
          </table>
        </Box>
        <Box display='flex' mt={4} flexDirection='column' alignItems='center' justifyContent='center'>
          <Typography mb={2} align='center' variant='h3'>Deployment + Cloud Hosting</Typography>
          <ul>
            <li>Frontend: <a href={frontendUrl}>{frontendUrl}</a></li>
            <li>Backend: <a href={backendUrl}>{backendUrl}</a></li>
            <li>MongoDB: <a href={mongodbAtlas}>{mongodbAtlas}</a></li>
          </ul>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutPage;
