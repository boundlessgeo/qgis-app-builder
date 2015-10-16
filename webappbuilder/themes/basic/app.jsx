@IMPORTS@

var defaultFill = new ol.style.Fill({
   color: 'rgba(255,255,255,0.4)'
 });
 var defaultStroke = new ol.style.Stroke({
   color: '#3399CC',
   width: 1.25
 });
 var defaultSelectionFill = new ol.style.Fill({
   color: 'rgba(255,255,0,0.4)'
 });
 var defaultSelectionStroke = new ol.style.Stroke({
   color: '#FFFF00',
   width: 1.25
 });


@VARIABLES@

var map = new ol.Map({
  layers: layersList,
  view: view,
  controls: [@OL3CONTROLS@]
});



class BasicApp extends React.Component {
  componentDidMount() {
    map.setTarget(document.getElementById('map'));
    map.getView().fit(originalExtent, map.getSize());
    @POSTTARGETSET@
  }
  _toggle(el) {
    if (el.style.display === 'block') {
      el.style.display = 'none';
    } else {
      el.style.display = 'block';
    }
  }
  _toggleTable() {
    this._toggle(document.getElementById('table-panel'));
  }
  _toggleQuery() {
    this._toggle(document.getElementById('query-panel'));
  }
  _toggleEdit() {
    this._toggle(document.getElementById('edit-tool-panel'));
  }
  _toggleAboutPanel() {
    this._toggle(document.getElementById('about-panel'));
  }
  _toggleChartPanel() {
    this._toggle(document.getElementById('chart-panel'));
  }
  _navigationFunc() {
    LayerActions.activateTool(null, 'navigation');
  }
  render() {
    return (
      <article>
        <nav role='navigation'>
          <div className='toolbar'>
            @LOGO@
            <a className="navbar-brand" href="#">@TITLE@</a>
            @TOOLBAR@
           </div>
        </nav>
        <div id='content'>
          <div id='map'>
              @MAPPANELS@
              <div id='popup' className='ol-popup'><InfoPopup map={map} hover={@POPUPEVENT@}/></div>
          </div>
          @PANELS@
        </div>
      </article>
    );
  }
}



React.render(<IntlProvider locale='en' >{() => (<BasicApp />)}</IntlProvider>, document.body);



