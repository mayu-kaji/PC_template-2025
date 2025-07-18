# 開発環境セットアップ

## Gulp環境セットアップ手順

# 必要パッケージのインストール
npm i
npx gulp

で実行

## よくあるエラーと対処

Error: Cannot find module '○○'
→ npm install --save-dev ○○ で解決

## パッケージクリーンインストール

rm -rf node_modules  
rm package-lock.json  
npm i  

## ブレイクポイント設定（scss例）

$breakpoints: (
  sm: 600,
  md: 767,
  lg: 1024,
  xl: 1440,
);

$mediaquerys: (
  sm: "screen and (max-width: #{map.get($breakpoints, 'sm')}px)",
  md: "screen and (max-width: #{map.get($breakpoints, 'md')}px)",
  lg: "screen and (max-width: #{map.get($breakpoints, 'lg')}px)",
  xl: "screen and (max-width: #{map.get($breakpoints, 'xl')}px)",
);

## Sass運用ルール

@use/@forwardを使い、@importは使わない  

## よくある警告

Deprecation Warning [legacy-js-api]  
→ gulp経由のSass利用では現状は消せない。気にしなくてOK。

## コーディングの考え方

案件の要件に合わせて今回はPCファースト

## パッケージ例（package.json抜粋）

"devDependencies": {
  "gulp": "^4.0.2",
  "gulp-dart-sass": "^1.1.0",
  "gulp-sass-glob-use-forward": "^0.1.3",
  // …他省略
}

