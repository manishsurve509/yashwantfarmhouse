import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';

const projectDir = 'C:/Users/Manish/.gemini/antigravity/scratch/yashwant-farm';

async function commitAll() {
  console.log('Initializing Git repo in:', projectDir);
  await git.init({ fs, dir: projectDir, defaultBranch: 'main' });

  // Read .gitignore patterns
  const gitignoreContent = fs.existsSync(path.join(projectDir, '.gitignore'))
    ? fs.readFileSync(path.join(projectDir, '.gitignore'), 'utf8')
    : '';
  
  const ignored = ['node_modules', 'dist', '.env', '.git', '.DS_Store', 'test_all.js'];

  function getAllFiles(dir, base = '') {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
      if (ignored.includes(file)) continue;
      const fullPath = path.join(dir, file);
      const relPath = base ? `${base}/${file}` : file;
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        results = results.concat(getAllFiles(fullPath, relPath));
      } else {
        results.push(relPath);
      }
    }
    return results;
  }

  const files = getAllFiles(projectDir);
  console.log(`Staging ${files.length} files...`);

  for (const file of files) {
    await git.add({ fs, dir: projectDir, filepath: file });
  }

  console.log('Committing files...');
  const sha = await git.commit({
    fs,
    dir: projectDir,
    message: 'Initial commit: Complete Yashwant Farmhouse website + Admin Management System rebuilt from scratch',
    author: {
      name: 'NextStep Digital',
      email: 'nextstepdigital14@gmail.com'
    }
  });

  console.log('Committed successfully with SHA:', sha);

  // Set remote
  const remoteUrl = 'https://github.com/nextstepdigital14-ai/Yashwant-Farmhouse-.git';
  await git.addRemote({
    fs,
    dir: projectDir,
    remote: 'origin',
    url: remoteUrl,
    force: true
  });
  console.log('Remote origin set to:', remoteUrl);

  const branches = await git.listBranches({ fs, dir: projectDir });
  console.log('Branches:', branches);
}

commitAll().catch(err => {
  console.error('Error during git commit:', err);
});
