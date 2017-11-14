import React from 'react'
import {Link} from 'react-router-dom'
import {ShareButtons, generateShareIcon} from 'react-share'
import Page from '../common/page'

const {FacebookShareButton, TwitterShareButton} = ShareButtons
const FacebookIcon = generateShareIcon('facebook')
const TwitterIcon = generateShareIcon('twitter')

class Top extends React.Component {
  render () {
    return <Page>
      <div className='ui grid'>
        <div className='row'>
          <div className='sixteen wide mobile eight wide computer column'>
            <div style={{margin: '20px 0'}}>
              <div style={{marginBottom: '10px'}}>
                <FacebookShareButton
                  url='https://egrid.jp/'
                  quote='E-Grid - 評価グリッド法ビジュアル分析システム'
                  className='share-button'>
                  <FacebookIcon size={32} round className='cursor-pointer' />
                </FacebookShareButton>
                <TwitterShareButton
                  url='https://egrid.jp/'
                  title='E-Grid - 評価グリッド法ビジュアル分析システム'
                  className='share-button'>
                  <TwitterIcon size={32} round className='cursor-pointer' />
                </TwitterShareButton>
              </div>
              <h1 className='ui header' style={{marginTop: 0, marginBottom: 0}}>E-Grid</h1>
              <h2 className='ui header' style={{marginTop: 0, marginBottom: '20px'}}>—評価グリッド法ビジュアル分析システム—</h2>
              <p>
                E-Gridは評価グリッド法やラダリングンタビューをサポートするWebベースのソフトウェアです。
                インタビュー支援機能によって効率的に評価構造図を描くことができます。
                また、ビジュアル分析機能によって評価構造図を多面的に分析することができます。
                E-Gridは人々の知構造の効果的な可視化を手助けします。
              </p>
              <div className='ui center aligned container'>
                <Link className='ui primary large button' to='/projects'>Start</Link>
                <a className='ui large button' href='https://collaboegm.appspot.com/'>旧版</a>
              </div>
            </div>
          </div>
          <div className='sixteen wide mobile eight wide computer column'>
            <img className='ui fluid rounded image' src='images/photo.jpg' />
          </div>
        </div>
        <div className='row'>
          <div className='sixteen wide column'>
            <div className='ui vertical segment'>
              <h3 className='ui header'>News</h3>
              <ul>
                <li>
                  <a href='https://egrid.jp'>Web版を公開しました。</a>Chrome Web Store版は2018年初頭にChromeOSのみのサポートとなりますので移行をお願いします。(2016/12/06)
                </li>
                <li>
                  <a href='https://chrome.google.com/webstore/detail/e-grid/pehikclbemopiakglepnklhedocajidk?hl=ja'>Chrome Web Storeでの公開を開始しました。</a> (2016/04/05)
                </li>
              </ul>
            </div>
            <div className='ui vertical segment'>
              <h3 className='ui header'>Requirements</h3>
              <p>E-Gridの推奨動作環境は<a href='https://www.google.co.jp/chrome/browser/'>Google Chrome</a>の最新安定版です。インストール及び最新版への更新をお願いします。</p>
            </div>
            <div className='ui vertical segment'>
              <h3 className='ui header'>Documents</h3>
              <ul>
                <li>
                  <Link to='/manual'>E-Gridマニュアル</Link>
                </li>
                <li>
                  <Link to='/about'>E-Gridとは</Link>
                </li>
              </ul>
            </div>
            <div className='ui vertical segment'>
              <h3 className='ui header'>Contact</h3>
              <ul>
                <li>
                  <a href='https://groups.google.com/forum/#!forum/egrid-user-group'>E-Grid User Group (メーリングリスト)</a>
                </li>
              </ul>
            </div>
            <div className='ui vertical segment'>
              <h3 className='ui header'>Publications</h3>
              <p>E-Gridを用いた研究成果を発表される際には、以下の文献を参照していただけると幸いです。</p>
              <ul>
                <li>
                  Onoue, Y., Kukimoto, N., Sakamoto, N., &amp; Koyamada, K. (2016).
                  E-Grid: a visual analytics system for evaluation structures. Journal of Visualization, 19(4), 753–768.
                  <a href='http://doi.org/10.1007/s12650-015-0342-6'>http://doi.org/10.1007/s12650-015-0342-6</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Page>
  }
}

export default Top
