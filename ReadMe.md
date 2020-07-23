# 各フォルダの説明
MindBemding
- dist:最終的にweb上に適用されるcss、js、画像
- src:このファイル内のもろもろをgulpで処理して、distファイルに送る
	- js:javaScriptの入るフォルダ
	- images:画像の入るフォルダ
	- scss:各種scssの入るフォルダ
		- base:リセットcss、各種ライブラリ、ページ全体の設定、変数用scssの入るフォルダ
		- components:BEMにおける各blockに適用するスタイル用
			- common:汎用的なcomponentファイル
			- parts:BEMのelementを持たないblock(ボタンやレイアウトなど)
		- pages:ページ特有のデザインを入れるフォルダ
		- utils:上書きによって微調整するための、ミニマルなscssファイル
- 各種htmlファイル
- package.jsonなどの設定ファイル