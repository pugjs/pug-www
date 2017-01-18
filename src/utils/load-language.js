import {resolve} from 'path';
import fs from 'fs';
import Promise from 'promise';
import Repository from 'github-stream';
import config from '../config';

try {
  fs.mkdirSync(resolve('.cache'));
} catch (ex) {
  if (ex.code !== 'EEXIST') {
    throw ex;
  }
}

function loadLanguage(lang) {
  const repoName = config.localizedRepoName(lang);
  const developmentPath = resolve('../' + repoName);
  if (fs.existsSync(developmentPath)) {
    return Promise.resolve(developmentPath);
  } else {
    return Promise.resolve(downloadRepo(repoName));
  }
}

function readState(filename) {
  let stateString;
  try {
    stateString = fs.readFileSync(cachePath + '/.state', 'utf8');
  } catch (ex) {
    if (ex.code !== 'ENOENT') {
      throw ex;
    }
    return undefined;
  }
  return JSON.parse(stateString);
}

function downloadRepo(repoName) {
  const cachePath = resolve('.cache/' + repoName);
  const state = readState(cachePath + '/.state');
  const repo = new Repository(config.githubOrganisation, repoName, {state});
  repo.on('state-updated', newState => {
    fs.writeFileSync(cachePath + '/.state', JSON.stringify(newState, null, '  ') + '\n');
  });
  repo.on('update', update => {
    if (update.type === 'Directory') {
      if (update.action === 'Create') {
        fs.unlinkSync(cachePath + update.path);
      }
      if (update.action === 'Delete') {
        fs.unlinkSync(cachePath + update.path);
      }
    }
    if (update.type === 'File') {
      if (update.action === 'Create' || update.action === 'Update') {
        fs.writeFileSync(cachePath + update.path, update.body);
      }
      if (update.action === 'Delete') {
        fs.unlinkSync(cachePath + update.path);
      }
    }
  });
  return repo.waitUntilReady().then(() => cachePath);;
}

export default loadLanguage;
