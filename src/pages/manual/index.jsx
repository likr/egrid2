import React from 'react'
import Page from '../common/page'

const Manual = () => {
  return <Page>
    <div className='ui grid'>
      <div className='row'>
        <div className='sixteen wide column'>
          <h1>E-Gridマニュアル</h1>
          <div className='ui vertical segment'>
            <h2>評価グリッド法について</h2>
            <h3>評価グリッド法とは</h3>
            <p>
              評価グリッド法は、半構造化インタビュー用いた定性評価方法です。
              半構造化インタビューとは、質問の流れがある程度決まっているインタビューで、一般的な自由形式の非構造化インタビューと、質問の流れが完全に固定された構造化インタビューとの中間にあたります。
              評価グリッド方は環境心理学の分野で讃井によって開発され、その後マーケティグ、感性工学と適応分野を広げてきました。
              評価グリッド法は、デプスインタビューとしての側面を持っており、回答者が自覚していない深層心理を引き出すことができます。
            </p>
            <p>
              評価グリッド法によって引き出された価値判断のネットワークを評価構造と呼びます。
              価値判断のネットワークとは、すなわち、人が対象物を評価する時に、どのような価値観を重視しているか、ある要因が満たされたときどのような価値観が満たされるか、ある価値観を満たすためにはどのような要因が必要であるかといった価値判断の接続関係を表します。
            </p>
            <p>
              評価グリッド法のインタビューは基本的には1人ずつで行い、個人毎の評価構造図を作成します。
              その後、回答者全体の評価構造を把握するために、個人毎の評価構造を統合し全体評価構造を作成します。
              また、評価構造中の価値判断の単位のことを評価項目と呼びます。
              評価グリッド法は、調査対象者の価値判断の全体像を把握する上で有効です。
            </p>
            <h3>評価グリッド法を用いたインタビュー手順</h3>
            <p>
              評価グリッド法のインタビューの手順は、オリジナル評価項目の抽出とラダーリングの繰り返しです。
              オリジナル評価項目とは、インタビューの起点となる評価項目です。
              また、ラダリングとは、オリジナル評価項目からより抽象的な評価項目とより具体的な評価項目を引き出すための手順です。
            </p>
            <p>
              インタビューにあたって、いくつかの調査対象物を刺激要素として準備しておきます。
              快適なオフィスに関する調査であれば、いくつかのオフィスの写真を用意するといった方法が取られます。
              オリジナル評価項目の抽出では、刺激要素の中から2つを回答者に提示し、どちらの方が好ましいか尋ねます。
              そして、何故それを好ましいと思ったのか理由を尋ね、回答された理由をオリジナル評価項目として記録します。
              理由が複数ある場合は、それらを全て記録します。
              刺激要素の数が多い場合には、インタビューの時間が長引き回答者の負担になる場合があるので、刺激要素をグループ化することで時間短縮を行う場合があります。
            </p>
            <p>
              ラダリングでは、オリジナル評価項目からより抽象的な上位概念を引き出すラダーアップと、より具体的な下位概念を引き出すラダーダウンを行います。
              ラダーアップでは、オリジナル評価項目として挙げられた理由「○○」について、「○○だと何故良いのですか」と尋ね。 回答された理由を上位項目として記録します。
              さらに、回答された上位項目についてラダーアップを行い、それ以上の上位項目が引き出せなくなるまで続けます。
              ラダーダウンでは、オリジナル評価項目としてあげられた理由「○○」について。 「具体的にどういうところが○○なのですか」と尋ね、回答された理由を下位項目として記録します。
              ラダーアップと同様に、引き出された項目についてさらにラダーダウンを行い、それ以上の下位項目が引き出せなくなるまで続けます。
              途中で理由が複数挙げられた場合は、上位項目または下位項目を枝分かれさせつつ上述の手順を繰り返します。
              刺激要素の全てのペアに対してオリジナル評価項目の抽出とラダーリングを行えばインタビューを終了とします。
            </p>
            <h2>E-Gridの使い方</h2>
            <h3>インタビューの準備</h3>
            <p>
              E-Gridにアクセスすると以下のようなトップ画面が表示されます。
            </p>
            <a className='ui big image' href='/images/manual/2-1-1.png'>
              <img src='/images/manual/2-1-1.png' />
            </a>
            <p>
              トップ画面から「Start」ボタンを押すことでプロジェクト一覧ページへ移動します。
              E-Gridでは1つの調査単位を1つのプロジェクトとして管理します。
              まずは「Add」ボタンからプロジェクトを追加しましょう。
            </p>
            <a className='ui big image' href='/images/manual/2-1-2.png'>
              <img src='/images/manual/2-1-2.png' />
            </a>
            <p>
              プロジェクト名とその概要を入力し、「Create」ボタンを押すことでプロジェクトを作ることができます。
            </p>
            <a className='ui big image' href='/images/manual/2-1-3.png'>
              <img src='/images/manual/2-1-3.png' />
            </a>
            <p>
              作成されたプロジェクトは以下のようにリスト表示されます。
              ボタンは左から順に、詳細画面への移動、プロジェクト情報の編集、プロジェクトの削除を行います。
            </p>
            <a className='ui big image' href='/images/manual/2-1-4.png'>
              <img src='/images/manual/2-1-4.png' />
            </a>
            <p>
              プロジェクトの詳細画面は以下の通りです。
              次に、「Add」ボタンを押し、被験者(Participants)の登録を行いましょう。
            </p>
            <a className='ui big image' href='/images/manual/2-1-5.png'>
              <img src='/images/manual/2-1-5.png' />
            </a>
            <p>
              被験者名とその説明を記入し、「Create」ボタンを押すことで被験者が登録されます。
            </p>
            <a className='ui big image' href='/images/manual/2-1-6.png'>
              <img src='/images/manual/2-1-6.png' />
            </a>
            <p>
              登録された被験者は以下のようにリスト表示されます。
            </p>
            <a className='ui big image' href='/images/manual/2-1-7.png'>
              <img src='/images/manual/2-1-7.png' />
            </a>
            <h3>インタビューの実施</h3>
            <p>
              被験者リストの「Interview」ボタンを押すと、以下のようなインタビュー画面に移動します。
            </p>
            <a className='ui big image' href='/images/manual/2-2-1.png'>
              <img src='/images/manual/2-2-1.png' />
            </a>
            <p>
              画面右下のプラスマークのボタンからオリジナル評価項目の追加を行います。
            </p>
            <a className='ui big image' href='/images/manual/2-2-2.png'>
              <img src='/images/manual/2-2-2.png' />
            </a>
            <p>
              ダイアログで評価項目の文章を入力し、「OK」ボタンを押すと、下図のように記入した評価項目が表示されます。
            </p>
            <a className='ui big image' href='/images/manual/2-2-3.png'>
              <img src='/images/manual/2-2-3.png' />
            </a>
            <p>
              下図のように、複数のオリジナル評価項目を記入することができます。
            </p>
            <a className='ui big image' href='/images/manual/2-2-4.png'>
              <img src='/images/manual/2-2-4.png' />
            </a>
            <p>
              次にラダリングを行います。
              ラダーアップは、評価項目の下部の左矢印ボタンを押します。
            </p>
            <a className='ui big image' href='/images/manual/2-2-5.png'>
              <img src='/images/manual/2-2-5.png' />
            </a>
            <p>
              評価項目の文章を入力し、「OK」ボタンを押すと、元の評価項目の左側に接続された新たな評価項目が表示されます。
            </p>
            <a className='ui big image' href='/images/manual/2-2-6.png'>
              <img src='/images/manual/2-2-6.png' />
            </a>
            <p>
              ラダーアップと同様に、評価項目の下部の右矢印ボタンを押すことでラダーダウンができます。
            </p>
            <a className='ui big image' href='/images/manual/2-2-7.png'>
              <img src='/images/manual/2-2-7.png' />
            </a>
            <p>
              ラダーダウンで入力された評価項目は、元の評価項目の右側に接続されて表示されます。
            </p>
            <a className='ui big image' href='/images/manual/2-2-8.png'>
              <img src='/images/manual/2-2-8.png' />
            </a>
            <p>
              下図のように、一つの評価項目に対して複数の下位項目あるいは上位項目を入力することができます。
            </p>
            <a className='ui big image' href='/images/manual/2-2-9.png'>
              <img src='/images/manual/2-2-9.png' />
            </a>
            <p>
              一通りのインタビューを終えたら、左上の左から二番目の保存ボタンを押してインタビューを終了します。
            </p>
            <a className='ui big image' href='/images/manual/2-2-10.png'>
              <img src='/images/manual/2-2-10.png' />
            </a>
            <h3>類似項目・表記揺れの統一</h3>
            <p>
              インタビューでは、同じ内容を違う言葉で言い換えた内容や、誤字・変換などによる表記揺れが発生します。
              Analysisセクションの「Words」ボタンをクリックすると以下のような類似項目・表記揺れの統一画面に遷移します。
            </p>
            <a className='ui big image' href='/images/manual/2-3-1.png'>
              <img src='/images/manual/2-3-1.png' />
            </a>
            <p>
              はじめに、右側の「Add」ボタンを押して新しい項目グループを作成します。
              次に、まとめたい評価項目を左側から右側のグループへドラッグアンドドロップします。
              新しく作成した項目グループには、それらをまとめた名前をつけることができます。
            </p>
            <a className='ui big image' href='/images/manual/2-3-2.png'>
              <img src='/images/manual/2-3-2.png' />
            </a>
            <h3>インタビュー結果の分析</h3>
            <p>
              E-Gridはインタビューを支援するだけでなく、その結果の分析にも効果を発揮します。
              E-Grid上で、各被験者のインタビュー結果を統合することができるだけでなく、評価項目を重要度に基づいてフィルタリングすることができます。
              ここでは3人分の調査結果を例に挙げます。
            </p>
            <a className='ui big image' href='/images/manual/2-4-1.png'>
              <img src='/images/manual/2-4-1.png' />
            </a>
            <p>
              インタビュー後、Analysisセクションの「Open」ボタンをクリックすると以下のような分析ビューが表示されます。
              右のメニューでは、被験者のフィルタリングや、スライダーによる評価項目のフィルタリングができ、簡潔に評価構造を抽出することができます。
              また、右下のワードクラウドでは、回答に用いられた単語を俯瞰することができます。
              このワードクラウドを用いることで全体の回答からどのような単語が用いられているか知ることができます。
            </p>
            <a className='ui big image' href='/images/manual/2-4-2.png'>
              <img src='/images/manual/2-4-2.png' />
            </a>
            <h3>アンケートの作成</h3>
            <p>
              E-Gridでは、Google Formと連携したアンケート作成が可能です。
              Analysisセクションの「Questionnaire」ボタンからアンケート作成画面へ遷移します。
            </p>
            <a className='ui big image' href='/images/manual/2-5-1.png'>
              <img src='/images/manual/2-5-1.png' />
            </a>
            <p>
              「New」ボタンを押すと、アンケート作成ダイアログが開きます。
              「タイトル」と「概要」を入力し、アンケートに用いる項目をチェックボックスで選択し、「Create」ボタンを押すとアンケートが作成されます。
              項目の候補は、類似項目・表記揺れをグループ化した後の項目がリストされます。
            </p>
            <a className='ui big image' href='/images/manual/2-5-2.png'>
              <img src='/images/manual/2-5-2.png' />
            </a>
          </div>
        </div>
      </div>
    </div>
  </Page>
}

export default Manual
