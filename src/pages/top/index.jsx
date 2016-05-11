import React from 'react'
import { Link } from 'react-router'
import Page from '../common/page'

class Top extends React.Component {
  render () {
    return (
    <Page>
      <div className="ui grid">
        <div className="row">
          <div className="sixteen wide mobile eight wide computer column">
            <div style={{margin: '20px 0'}}>
              <h1 className="ui header" style={{marginTop: 0, marginBottom: 0}}>E-Grid</h1>
              <h2 className="ui header" style={{marginTop: 0, marginBottom: '20px'}}>—認知構造のビジュアル分析システム—</h2>
              <p>
                E-GridはラダリングンタビューをサポートするWebアプリケーションです。作業負担の軽減された効率的なインタビューと、先進技術による効果的な分析を可能とします。
              </p>
              <div className="ui center aligned container">
                <Link className="ui primary large button" to="/projects"> My Page
                </Link>
              </div>
            </div>
          </div>
          <div className="sixteen wide mobile eight wide computer column">
            <img className="ui fluid rounded image" src="images/photo.jpg" />
          </div>
        </div>
        <div className="row">
          <div className="sixteen wide column">
            <div className="ui vertical segment">
              <h3 className="ui header">News</h3>
              <ul>
                <li>
                  Chrome Web Storeでの公開を開始しました。 (2016/04/05)
                </li>
              </ul>
            </div>
            <div className="ui vertical segment">
              <h3 className="ui header">Contact</h3>
              <ul>
                <li>
                  <a href="https://groups.google.com/forum/#!forum/egrid-user-group">E-Grid User Group (メーリングリスト)</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Page>
    )
  }
}

export default Top
