import connect from './context/connect';

const MenuGroup = connect(({menuPath, strings}) => {
  return pug`
    div
      a.nav-link= strings.menu[menuPath.substr(1)]
      ul.nav.nav-pills.nav-stacked
        = this.props.children
  `;
});

const MenuItem = connect(({menuPath, path, strings, getUrl}) => {
  const className = path === menuPath ? 'active' : '';
  return pug`
    a.nav-link(href=getUrl(menuPath), className=className)= strings.menu[menuPath.substr(1)]
  `;
});

function Menu() {
  return pug`
    nav.nav.nav-pills.nav-stacked
      MenuGroup(menuPath='api')
        MenuItem(menuPath='api/getting-started')
        MenuItem(menuPath='api/express')
        MenuItem(menuPath='api/reference')
        MenuItem(menuPath='api/migration-v2')

      MenuGroup(menuPath='language')
        MenuItem(menuPath='language/attributes')
        MenuItem(menuPath='language/case')
        MenuItem(menuPath='language/code')
        MenuItem(menuPath='language/comments')
        MenuItem(menuPath='language/conditionals')
        MenuItem(menuPath='language/doctype')
        MenuItem(menuPath='language/extends')
        MenuItem(menuPath='language/filters')
        MenuItem(menuPath='language/includes')
        MenuItem(menuPath='language/inheritance')
        MenuItem(menuPath='language/interpolation')
        MenuItem(menuPath='language/iteration')
        MenuItem(menuPath='language/mixins')
        MenuItem(menuPath='language/plain-text')
        MenuItem(menuPath='language/tags')
  `;
}

export default Menu;
