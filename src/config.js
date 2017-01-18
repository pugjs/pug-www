const config = {
  defaultLanguage: 'en',
  supportedLanguages: [
    'en',
    'zh-cn',
  ],
  githubOrganisation: 'pugjs',
  localizedRepoName: lang => `pug-${lang}`,
  scssPath: __dirname + '/../scss/docs.scss'
}
export default config;
