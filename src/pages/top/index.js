import m from 'mithril'
import Page from '../common/page'

const view = () => {
  return <Page>
    <div className="ui grid">
      <div className="row">
        <div className="sixteen wide mobile eight wide computer column">
          <div style={{margin: '20px 0'}}>
            <h1 className="ui header" style={{'margin-top': 0, 'margin-bottom': 0}}>E-Grid</h1>
            <h2 className="ui header" style={{'margin-top': 0, 'margin-bottom': '20px'}}>—認知構造のビジュアル分析システム—</h2>
            <p>E-GridはラダリングンタビューをサポートするWebアプリケーションです。作業負担の軽減された効率的なインタビューと、先進技術による効果的な分析を可能とします。</p>
            <div className="ui center aligned container">
              <a className="ui primary large button" href="/projects" config={m.route}>My Parge</a>
            </div>
          </div>
        </div>
        <div className="sixteen wide mobile eight wide computer column">
          <img className="ui fluid rounded image" src="images/photo.jpg"/>
        </div>
      </div>
      <div className="row">
        <div className="sixteen wide column">
          <div className="ui vertical segment">
            <h3 className="ui header">News</h3>
          </div>
          <div className="ui vertical segment">
            <h3 className="ui header">Features</h3>
          </div>
          <div className="ui vertical segment">
            <h3 className="ui header">Citation</h3>
          </div>
          <div className="ui vertical segment">
            <h3 className="ui header">Contact</h3>
          </div>
        </div>
      </div>
    </div>
  </Page>
};

export default {view}
